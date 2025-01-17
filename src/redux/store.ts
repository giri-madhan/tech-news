import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import articlesReducer from '../features/articles/articlesSlice';
import articleDetailReducer from '../features/articles/articleDetailSlice';

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    articleDetail: articleDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
