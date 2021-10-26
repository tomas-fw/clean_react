import { HttpStatusCode } from '@/data/protocols/http';
import { RemoteLoadSurveyList } from '@/data/usecases';
import { UnexpectedError } from '@/domain/errors';
import { SurveyModel } from '@/domain/models';
import faker from 'faker';
import { mockSurveyListModel } from '../../domain/mocks';
import { HttpGetClientSpy } from '../mocks';

type SutTypes = {
  sut: RemoteLoadSurveyList;
  httpGetClientSpy: HttpGetClientSpy<SurveyModel[]>;
};

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<SurveyModel[]>();
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy);

  return {
    sut,
    httpGetClientSpy,
  };
};

describe('RemoteLoadSurveyList', () => {
  test('should call HttpGetClient with correct URL', async () => {
    const url = faker.internet.url();
    const { sut, httpGetClientSpy } = makeSut(url);
    await sut.loadAll();
    expect(httpGetClientSpy.url).toBe(url);
  });

  test('Should throw UnexcpectedError if HttpPostClient returns 403', async () => {
    const { httpGetClientSpy, sut } = makeSut();

    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden,
    };
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexcpectedError if HttpPostClient returns 404', async () => {
    const { httpGetClientSpy, sut } = makeSut();

    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.notFound,
    };
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should throw UnexcpectedError if HttpPostClient returns 500', async () => {
    const { httpGetClientSpy, sut } = makeSut();

    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.serverError,
    };
    const promise = sut.loadAll();
    await expect(promise).rejects.toThrow(new UnexpectedError());
  });

  test('Should a list of SurveyModel if HttpGetClient return 200', async () => {
    const { httpGetClientSpy, sut } = makeSut();
    const httpResult = mockSurveyListModel();

    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult,
    };
    const survey = await sut.loadAll();
    expect(survey).toEqual(httpResult);
  });

  test('Should an empty list if HttpGetClient return 204', async () => {
    const { httpGetClientSpy, sut } = makeSut();

    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.noContent,
    };
    const survey = await sut.loadAll();
    expect(survey).toEqual([]);
  });
});