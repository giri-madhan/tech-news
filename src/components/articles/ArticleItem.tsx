import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/store';
import { setCurrentArticle } from '../../features/detail/articleDetailSlice';
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
          handleArticleClick();
        }
      }}
    >
      <div className="article-content">
        <h2 className="article-title">{title}</h2>
        <p className="article-description">{description}</p>
        <div className="article-meta">
          <time className="article-date" dateTime={publishedAt}>
            {formatDate(publishedAt)}
          </time>
          <span className="article-read-more" aria-label="Read full article">
            Read full article →
          </span>
        </div>
      </div>
      <div className="article-image-container">
        <img
          src={urlToImage || placeholderImage}
          alt={`Thumbnail for article: ${title}`}
          className="article-image"
          loading="lazy"
        />
      </div>
    </article>
  );
};

export default React.memo(ArticleItem);
