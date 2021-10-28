import { GetStorage } from '@/data/protocols/cache';
import {
  HttpGetClient,
  HttpGetParams,
  HttpResponse,
} from '@/data/protocols/http';

export class AuthorizeHttpGetClientDecorator implements HttpGetClient {
  constructor(private readonly getStorage: GetStorage) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  get(params: HttpGetParams): Promise<HttpResponse> {
    this.getStorage.get('account');
    return null;
  }
}
