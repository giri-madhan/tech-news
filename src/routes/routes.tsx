import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ErrorFallback } from '../components/app/ErrorFallback';

export const ROUTES = {
  HOME: '/',
  ARTICLE_DETAIL: '/article/:id',
} as const;

const ArticleList = React.lazy(() => import('../components/articles/ArticleList'));
const ArticleDetail = React.lazy(() => import('../features/articles/ArticleDetail'));

export const routes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: (
      <React.Suspense fallback={<ErrorFallback message="Loading article list..." />}>
        <ArticleList />
      </React.Suspense>
    ),
  },
  {
    path: ROUTES.ARTICLE_DETAIL,
    element: (
      <React.Suspense fallback={<ErrorFallback message="Loading article details..." />}>
        <ArticleDetail />
      </React.Suspense>
    ),
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.HOME} replace />,
  },
];
