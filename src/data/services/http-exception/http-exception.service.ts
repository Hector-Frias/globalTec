import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GlobalTexts } from 'src/data/constants/texts';

@Injectable()
export class HttpExceptionService {
  constructor(public globalTexts: GlobalTexts) {}
  httpException(message: string, httpStatus: HttpStatus) {
    throw new HttpException(
      {
        status: this.globalTexts.error,
        statusCode: httpStatus,
        message: message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
