import React, { memo } from 'react';
import { useRoutes } from 'react-router-dom';
import { routes } from '../../routes/routes';
import { useScrollToTop } from '../../hooks/useScrollToTop';

interface AppRoutesProps {
  className?: string;
}

const AppRoutes: React.FC<AppRoutesProps> = memo(({ className }) => {
  useScrollToTop();
  const element = useRoutes(routes);
  return <div className={className}>{element}</div>;
});

AppRoutes.displayName = 'AppRoutes';

export default AppRoutes;
