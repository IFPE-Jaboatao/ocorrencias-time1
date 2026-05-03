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

@Controller('evidencia')
export class EvidenciaController {
  constructor(private readonly evidenciaService: EvidenciaService) {}

  @Post('upload')
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
  //transformado em async pra guardar no banco de dados
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('ocorrencia') ocorrenciaId: string, //recebe o id do formData
  ) {
    //chama o serviço pra salvar o registro no banco de dados
    const novaEvidencia = await this.evidenciaService.create({
      path: file.filename,
      ocorrencia: { id: Number(ocorrenciaId) } as any,
    });
    return {
      message: 'Arquivo enviado com sucesso',
      evidencia: novaEvidencia, //retorna os dados que foram pro banco
    };
  }
  @Get('download/:filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    //aqui pegamos o caminho absoluto para baixar o arquivo
    const filepath = this.evidenciaService.getFilePath(filename);
    res.download(filepath);
  }
}
