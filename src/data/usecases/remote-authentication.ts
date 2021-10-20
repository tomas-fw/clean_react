import { HttpPostClient } from '@/data/protocols/http/http-post-client';
import { InvalidCredentialsError } from '@/domain/errors/invalid-credentials-error';
import { UnexpectedError } from '@/domain/errors/unexpected-credentials-error';
import { AccountModel } from '@/domain/models/account-model';
import { AuthenticationParams } from '@/domain/usecases/authentication';
import { HttpStatusCode } from '../protocols/http/http-response';

class RemoteAuthentication {
  constructor(
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient<
      AuthenticationParams,
      AccountModel
    >
  ) {}

  async auth(params: AuthenticationParams): Promise<void> {
    const httpResponse = await this.httpPostClient.post({
      url: this.url,
      body: params,
    });

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: {
        return;
      }

      case HttpStatusCode.unauthorized: {
        throw new InvalidCredentialsError();
      }

      default:
        throw new UnexpectedError();
    }
  }
}

export default RemoteAuthentication;
