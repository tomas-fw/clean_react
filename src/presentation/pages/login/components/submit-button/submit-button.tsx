import React from 'react';
import { useRecoilValue } from 'recoil';
import { loginState } from '../atom/atoms';
import { SubmitButtonBase } from '@/presentation/components';

type Props = {
  text: string;
};

const LoginSubmitButton: React.FC<Props> = ({ text }: Props) => {
  const state = useRecoilValue(loginState);
  return <SubmitButtonBase text={text} state={state} />;
};

export default LoginSubmitButton;
