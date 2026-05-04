import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { EvidenciaService } from './evidencia.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Evidências')
@Controller('evidencia')
export class EvidenciaController {
  constructor(private readonly evidenciaService: EvidenciaService) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Enviar um arquivo de evidência para uma ocorrência',
  })
  @ApiQuery({
    name: 'ocorrencia',
    required: true,
    description: 'ID da ocorrência à qual a evidência está vinculada',
  })
  @ApiQuery({
    name: 'evidencia',
    required: true,
    description: 'Arquivo de evidência a ser enviado (form-data)',
  })
  @ApiResponse({
    status: 201,
    description: 'Arquivo enviado com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição inválida. Verifique os parâmetros e o arquivo.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor durante o upload do arquivo.',
  })
  @UseInterceptors(
    FileInterceptor('evidencia', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          //customização do nome para evitar sobrescrita de arquivos
          const fileName = `${Date.now()}-${file.originalname}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('ocorrencia') ocorrenciaId: string,
  ) {
    const novaEvidencia = await this.evidenciaService.create({
      path: file.filename,
      ocorrencia: { id: Number(ocorrenciaId) } as any,
    });
    return {
      message: 'Arquivo enviado com sucesso',
      evidencia: novaEvidencia,
    };
  }

  @Get('download/:filename')
  @ApiOperation({ summary: 'Baixar um arquivo de evidência' })
  @ApiQuery({
    name: 'filename',
    required: true,
    description: 'Nome do arquivo de evidência a ser baixado',
  })
  @ApiResponse({
    status: 200,
    description: 'Arquivo baixado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Arquivo não encontrado.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno do servidor durante o download do arquivo.',
  })
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    //aqui pegamos o caminho absoluto para baixar o arquivo
    const filepath = this.evidenciaService.getFilePath(filename);
    res.download(filepath);
  }
}
