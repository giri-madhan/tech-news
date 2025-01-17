import React from 'react';
import { LoadingSpinner } from '../common/LoadingSpinner/LoadingSpinner';
import ArticleItem, { ArticleItemProps } from './ArticleItem';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import useArticles from '../../hooks/useArticles';
import ErrorMessage from '../common/ErrorMessage/ErrorMessage';
import { ItemGrid } from '../common/ItemGrid/ItemGrid';
import './ArticleList.css';

interface Article {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: {
    thumbnail?: string;
    trailText?: string;
  };
}

const transformArticleToProps = (article: Article): ArticleItemProps => ({
  id: article.id,
  title: article.webTitle,
  description: article.fields?.trailText || '',
  url: article.webUrl,
  urlToImage: article.fields?.thumbnail || '',
  publishedAt: article.webPublicationDate,
});

const ArticleList: React.FC = () => {
  const { articles, status, error, hasMore, loadMore } = useArticles();

  const lastArticleRef = useIntersectionObserver({
    onIntersect: loadMore,
    enabled: status === 'succeeded' && hasMore,
    rootMargin: '200px',
  });

  const renderContent = () => {
    if (status === 'loading' && articles.length === 0) {
      return (
        <div
          className="loading-container"
          role="status"
          aria-label="Loading articles"
          aria-live="polite"
        >
          <LoadingSpinner message="Loading articles..." />
        </div>
      );
    }

    if (status === 'failed') {
      return (
        <div role="alert" aria-live="assertive">
          <ErrorMessage
            title="Error Loading Articles"
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }

    return (
      <ItemGrid<Article>
        items={articles}
        renderItem={article => <ArticleItem {...transformArticleToProps(article)} />}
        lastItemRef={lastArticleRef}
        className="articles-grid"
        ariaLabel="Articles list"
      />
    );
  };

  return (
    <main className="article-list-container" aria-busy={status === 'loading'}>
      <header className="article-list-header">
        <h1 className="article-list-title" tabIndex={-1}>
          Latest Tech News
        </h1>
        <p className="article-list-subtitle" aria-label="Page description">
          Stay updated with the latest technology news and insights
        </p>
      </header>

      {renderContent()}

      {status === 'loading' && articles.length > 0 && (
        <div
          className="loading-container"
          role="status"
          aria-label="Loading more articles"
          aria-live="polite"
        >
          <LoadingSpinner message="Loading more articles..." />
        </div>
      )}

      {hasMore && (
        <div className="articles-end-message" role="status" aria-live="polite">
          Scroll for more articles
        </div>
      )}
    </main>
  );
};

export default React.memo(ArticleList);
