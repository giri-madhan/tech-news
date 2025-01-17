import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/store';
import { setCurrentArticle } from '../../features/articles/articleDetailSlice';
import placeholderImage from '../../assets/images/placeholder.svg';
import './ArticleItem.css';

export interface ArticleItemProps {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  id: string;
}

const transformToDetailArticle = (props: ArticleItemProps) => ({
  id: props.id,
  webTitle: props.title,
  webUrl: props.url,
  webPublicationDate: props.publishedAt,
  sectionName: 'Technology',
  fields: {
    thumbnail: props.urlToImage,
    trailText: props.description,
  },
});

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ArticleItem: React.FC<ArticleItemProps> = ({
  title,
  description,
  url,
  urlToImage,
  publishedAt,
  id,
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleArticleClick = () => {
    const article = transformToDetailArticle({
      title,
      description,
      url,
      urlToImage,
      publishedAt,
      id,
    });
    dispatch(setCurrentArticle(article));
    navigate(`/article/${encodeURIComponent(id)}`);
  };

  return (
    <article
      className="article-item"
      onClick={handleArticleClick}
      role="article"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleArticleClick();
        }
      }}
      aria-label={`Article: ${title}`}
    >
      <div className="article-content">
        <h2 className="article-title" id={`article-title-${id}`}>
          {title}
        </h2>
        <p
          className="article-description"
          id={`article-desc-${id}`}
          aria-labelledby={`article-title-${id}`}
        >
          {description}
        </p>
        <div className="article-meta" aria-label="Article metadata">
          <time
            className="article-date"
            dateTime={publishedAt}
            aria-label={`Published on ${formatDate(publishedAt)}`}
          >
            {formatDate(publishedAt)}
          </time>
          <span className="article-read-more" aria-hidden="true">
            Read full article →
          </span>
        </div>
      </div>
      <div className="article-image-container" aria-hidden={!urlToImage}>
        <img
          src={urlToImage || placeholderImage}
          alt={urlToImage ? `Thumbnail for article: ${title}` : ''}
          className="article-image"
          loading="lazy"
          aria-labelledby={`article-title-${id}`}
        />
      </div>
    </article>
  );
};

export default React.memo(ArticleItem);
