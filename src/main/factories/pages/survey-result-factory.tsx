import React from 'react';
import { useParams } from 'react-router-dom';
import {
  makeRemoteLoadSurveyResult,
  makeRemoteSaveSurveyResult,
} from '../useCases';
import { SurveyResult } from '@/presentation/pages';

type Params = {
  id: string;
};

export const makeSurveyResult: React.FC = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { id } = useParams<Params>();
  return (
    <SurveyResult
      saveSurveyResult={makeRemoteSaveSurveyResult(id)}
      loadSurveyResult={makeRemoteLoadSurveyResult(id)}
    />
  );
};
