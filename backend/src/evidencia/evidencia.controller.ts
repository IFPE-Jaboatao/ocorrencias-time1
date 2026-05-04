import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { EvidenciaService } from './evidencia.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OcorrenciaService } from 'src/ocorrencia/ocorrencia.service';

@ApiTags('Evidências')
@Controller('evidencia')
export class EvidenciaController {
  constructor(
    private readonly evidenciaService: EvidenciaService,
    private readonly ocorrenciaService: OcorrenciaService,
  ) {}

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
    if (!file) {
      throw new BadRequestException('Arquivo de evidência é obrigatório');
    }
    if (!Number(ocorrenciaId) || isNaN(Number(ocorrenciaId))) {
      throw new BadRequestException('ocorrenciaId inválido');
    }
    const existOcorrencia = await this.ocorrenciaService.findOne(
      Number(ocorrenciaId),
    );
    if (!existOcorrencia) {
      throw new BadRequestException(
        'Ocorrência não encontrada para o ID fornecido',
      );
    }

    const novaEvidencia = await this.evidenciaService.create({
      path: file.filename,
      ocorrencia: { id: Number(ocorrenciaId) } as any,
    });
    return {
      message: 'Arquivo enviado com sucesso',
      evidencia: novaEvidencia,
    };
  }

  @Get('download/:evidenciaId')
  @ApiOperation({ summary: 'Baixar um arquivo de evidência' })
  @ApiQuery({
    name: 'evidenciaId',
    required: true,
    description: 'ID da evidência a ser baixada',
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
  async downloadFile(
    @Param('evidenciaId') evidenciaId: string,
    @Res() res: Response,
  ) {
    if (!Number(evidenciaId) || isNaN(Number(evidenciaId))) {
      throw new BadRequestException('id da evidência é inválido');
    }
    //aqui pegamos o caminho absoluto para baixar o arquivo
    const evidencia = await this.evidenciaService.findOneById(
      Number(evidenciaId),
    );

    if (!evidencia) {
      throw new BadRequestException(
        'Evidência não encontrada para o ID fornecido',
      );
    }
    const filepath = this.evidenciaService.getFilePath(evidencia.path);

    res.download(filepath);
  }
}
