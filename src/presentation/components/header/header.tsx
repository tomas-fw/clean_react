/* eslint-disable jsx-a11y/anchor-is-valid */
import { ApiContext } from '@/presentation/contexts';
import { useLogout } from '@/presentation/hooks';
import React, { useContext } from 'react';
import { Logo } from '..';
import Styles from './header-styles.scss';

const Header: React.FC = () => {
  const { getCurrentAccount } = useContext(ApiContext);
  const logout = useLogout();

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    logout();
  };
  return (
    <header className={Styles.headerWrap}>
      <div className={Styles.headerContent}>
        <Logo />
        <div className={Styles.logoutWrap}>
          <span data-testid="username">{getCurrentAccount().name}</span>
          <a data-testid="logout" href="#" onClick={handleLogout}>
            Logout
          </a>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
