import { FormContext } from '@/presentation/contexts';
import React, { useContext } from 'react';
import { Spinner } from '..';
import Styles from './form-status.scss';

const FormStatus: React.FC = () => {
  const { state } = useContext(FormContext);
  const { isLoading, mainError } = state;

  return (
    <div data-testid="error-wrap" className={Styles.errorWrap}>
      {isLoading && <Spinner className={Styles.spinner} />}
      {mainError && (
        <span data-testid="main-error" className={Styles.error}>
          {mainError}
        </span>
      )}
    </div>
  );
};

export default FormStatus;
