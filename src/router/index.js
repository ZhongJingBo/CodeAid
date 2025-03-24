import { lazy } from 'react';

const ReplaceLink = lazy(() => import('../pages/ReplaceLink'));
const RequestForward = lazy(() => import('../pages/RequestForward'));
const Test = lazy(() => import('../pages/test'));

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
  {
    path: "/test",
    component: Test,
  },
]; 