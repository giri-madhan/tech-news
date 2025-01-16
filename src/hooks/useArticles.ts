import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux/store';
import { fetchArticles } from '../features/articles/articlesSlice';

export const useArticles = () => {
  const dispatch = useAppDispatch();
  const { items, status, error, hasMore } = useSelector((state: RootState) => state.articles);

  useEffect(() => {
    if (items.length === 0 && status === 'idle') {
      dispatch(fetchArticles(1));
    }
  }, [dispatch, items.length, status]);

  const loadMore = async () => {
    if (status !== 'loading' && hasMore) {
      const nextPage = Math.ceil(items.length / 10) + 1;
      await dispatch(fetchArticles(nextPage));
    }
  };

  return {
    articles: items,
    status,
    error,
    hasMore,
    loadMore,
  };
};

export default useArticles;
