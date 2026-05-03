import { Injectable, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  //aqui montamos o caminho absoluto até a pasta uploads
  getFilePath(filename: string): string {
    const filePath = join(process.cwd(), 'uploads', filename);
    //verifica se o arquivo existe na pasta
    if (!existsSync(filePath)) {
      throw new NotFoundException(
        //tratamento de erro
        `O arquivo: ${filename} não foi encontrado no sistema`,
      );
    }
    return filePath;
  }
}
