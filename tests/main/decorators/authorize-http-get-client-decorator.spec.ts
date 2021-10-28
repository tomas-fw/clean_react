import { HttpGetParams } from '@/data/protocols/http';
import { AuthorizeHttpGetClientDecorator } from '@/main/decorators';
import faker from 'faker';
import {
  GetStorageSpy,
  HttpGetClientSpy,
  mockGetRequest,
} from '../../data/mocks';
import { mockAccountModel } from '../../domain/mocks';

type SutType = {
  getStorageSpy: GetStorageSpy;
  sut: AuthorizeHttpGetClientDecorator;
  httpGetClientSpy: HttpGetClientSpy;
};

const makeSut = (): SutType => {
  const getStorageSpy = new GetStorageSpy();
  const httpGetClientSpy = new HttpGetClientSpy();

  const sut = new AuthorizeHttpGetClientDecorator(
    getStorageSpy,
    httpGetClientSpy
  );
  return {
    getStorageSpy,
    sut,
    httpGetClientSpy,
  };
};

describe('AuthorizeHttpGetClientDecorator', () => {
  test('should call GetStorage with correct value', async () => {
    const { sut, getStorageSpy } = makeSut();
    await sut.get(mockGetRequest());
    expect(getStorageSpy.key).toBe('account');
  });

  test('should not add headers if GetStorage is invalid', async () => {
    const { sut, httpGetClientSpy } = makeSut();
    const httpRequest: HttpGetParams = {
      url: faker.internet.url(),
      headers: {
        field: faker.random.words(),
      },
    };
    await sut.get(httpRequest);
    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.headers).toEqual(httpRequest.headers);
  });

  test('should add headers to HttpGetClient', async () => {
    const { sut, httpGetClientSpy, getStorageSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();

    const httpRequest: HttpGetParams = {
      url: faker.internet.url(),
    };
    await sut.get(httpRequest);
    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.headers).toEqual({
      'x-access-token': getStorageSpy.value.accessToken,
    });
  });

  test('should merge headers to HttpGetClient', async () => {
    const { sut, httpGetClientSpy, getStorageSpy } = makeSut();
    getStorageSpy.value = mockAccountModel();

    const field = faker.random.words();
    const httpRequest: HttpGetParams = {
      url: faker.internet.url(),
      headers: {
        field,
      },
    };
    await sut.get(httpRequest);
    expect(httpGetClientSpy.url).toBe(httpRequest.url);
    expect(httpGetClientSpy.headers).toEqual({
      field,
      'x-access-token': getStorageSpy.value.accessToken,
    });
  });
});
