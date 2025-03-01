import { lazy } from 'react';

const ReplaceLink = lazy(() => import('../pages/ReplaceLink'));

export const routes = [
  {
    path: '/',
    component: ReplaceLink,
    exact: true
  }
]; 