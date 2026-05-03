import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
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
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'Arquivo enviado com sucesso',
      filename: file.filename,
    };
  }
  @Get('download/:filename')
  downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    //aqui pegamos o caminho absoluto para baixar o arquivo
    const filepath = this.filesService.getFilePath(filename);
    res.download(filepath);
  }
}
