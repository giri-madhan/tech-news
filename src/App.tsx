import React, { Suspense, memo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { LoadingSpinner } from './components/common/LoadingSpinner/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary/ErrorBoundary';
import AppRoutes from './components/app/AppRoutes';
import ErrorFallback from './components/app/ErrorFallback';
import './App.css';

const App: React.FC = memo(() => {
  return (
    <Provider store={store}>
      <ErrorBoundary fallback={<ErrorFallback className="app__error" />}>
        <div className="app">
          <Router>
            <div className="app__content">
              <Suspense
                fallback={
                  <div className="app__loading" role="status" aria-label="Loading content">
                    <LoadingSpinner />
                  </div>
                }
              >
                <AppRoutes className="app__routes" />
              </Suspense>
            </div>
          </Router>
        </div>
      </ErrorBoundary>
    </Provider>
  );
});

App.displayName = 'App';

export default App;
