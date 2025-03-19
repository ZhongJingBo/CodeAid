import { lazy } from 'react';

const ReplaceLink = lazy(() => import('../pages/ReplaceLink'));
const RequestForward = lazy(() => import('../pages/RequestForward'));

export const routes = [
  {
    path: '/',
    component: ReplaceLink,
    exact: true
  },
  {
    path: "/request-forward",
    component: RequestForward,
  },
]; 