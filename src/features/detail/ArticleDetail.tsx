import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../redux/store';
import { clearArticle, fetchArticleById } from './articleDetailSlice';
import { LoadingSpinner } from '../../components/common/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage/ErrorMessage';
import { useScrollToTop } from '../../hooks/useScrollToTop';
import type { Article } from '../../types/guardian';
import './ArticleDetail.css';

interface ArticleHeaderProps {
  sectionName: string;
  publicationDate: string;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ sectionName, publicationDate }) => (
  <div className="article-detail-header">
    <span className="article-section">{sectionName}</span>
    <span className="article-date">
      {new Date(publicationDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </span>
  </div>
);

interface ArticleContentProps {
  article: Article;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
  if (article.fields?.body) {
    return (
      <div className="article-body" dangerouslySetInnerHTML={{ __html: article.fields.body }} />
    );
  }

  return (
    <>
      <p className="article-detail-description">{article.fields?.trailText}</p>
      <div className="article-detail-cta">
        <p className="article-note">
          Full article content is not available. Please visit The Guardian website to read more:
        </p>
        <a
          href={article.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="article-detail-link"
          aria-label={`Read full article: ${article.webTitle}`}
        >
          Read Full Article on The Guardian →
        </a>
      </div>
    </>
  );
};

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
  <button className="back-button" onClick={onClick} aria-label="Go back to articles list">
    ← Back to Articles
  </button>
);

const ArticleDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { article, status, error } = useSelector((state: RootState) => state.articleDetail);

  useScrollToTop();

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    dispatch(fetchArticleById(id));
    return () => {
      dispatch(clearArticle());
    };
  }, [id, dispatch, navigate]);

  if (status === 'loading') {
    return (
      <div className="article-detail-loading" role="main" aria-busy="true">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-error" role="main">
        <ErrorMessage
          message={error || 'Article not found'}
          onRetry={() => navigate('/')}
          retryButtonText="Go Back to Articles"
        />
      </div>
    );
  }

  return (
    <article className="article-detail" role="main">
      <BackButton onClick={() => navigate('/')} />

      <ArticleHeader
        sectionName={article.sectionName}
        publicationDate={article.webPublicationDate}
      />

      <h1 className="article-detail-title">{article.webTitle}</h1>

      {article.fields?.thumbnail && (
        <img
          src={article.fields.thumbnail}
          alt={article.webTitle}
          className="article-detail-image"
          loading="lazy"
        />
      )}

      <div className="article-detail-content">
        <ArticleContent article={article} />
      </div>
    </article>
  );
};

export default ArticleDetail;
