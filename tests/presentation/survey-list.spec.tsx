import { UnexpectedError } from '@/domain/errors';
import { SurveyModel } from '@/domain/models';
import { LoadSurveyList } from '@/domain/usecases';
import { SurveyList } from '@/presentation/pages';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { mockSurveyListModel } from '../domain/mocks';

class LoadSurveyListSpy implements LoadSurveyList {
  public callsCount = 0;

  surveys = mockSurveyListModel();

  async loadAll(): Promise<SurveyModel[]> {
    this.callsCount++;
    return this.surveys;
  }
}

type SutType = {
  loadSurveyListSpy: LoadSurveyListSpy;
};

const makeSut = (loadSurveyListSpy = new LoadSurveyListSpy()): SutType => {
  render(<SurveyList loadSurveyList={loadSurveyListSpy} />);

  return {
    loadSurveyListSpy,
  };
};

describe('SurveyList Component', () => {
  test('should present 4 empty list items on start', async () => {
    makeSut();
    const surveyList = await screen.findAllByTestId('empty-list-item');
    expect(surveyList.length).toBe(4);

    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    await waitFor(() => surveyList);
  });

  test('should call LoadSurveyList', async () => {
    const { loadSurveyListSpy } = makeSut();
    expect(loadSurveyListSpy.callsCount).toBe(1);
    await screen.findByRole('heading');
  });

  test('should render SurveyItems on success', async () => {
    makeSut();

    const surveyItems = await screen.findAllByTestId('list-item');
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    expect(surveyItems).toHaveLength(3);
  });

  test('should render error on failure', async () => {
    const loadServerListSpy = new LoadSurveyListSpy();
    const error = new UnexpectedError();

    jest.spyOn(loadServerListSpy, 'loadAll').mockRejectedValueOnce(error);

    makeSut(loadServerListSpy);
    await waitFor(() => screen.findByRole('heading'));

    expect(screen.queryByTestId('survey-list')).not.toBeInTheDocument();
    expect(screen.getByTestId('error')).toHaveTextContent(error.message);
  });
});