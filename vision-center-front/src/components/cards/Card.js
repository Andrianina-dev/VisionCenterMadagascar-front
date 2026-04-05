import React from 'react';
import '../../styles/components/cards/Card.css';

const Card = ({ 
  children,
  size = 'medium', 
  theme = 'default',
  isSelected = false,
  disabled = false,
  onClick,
  className = '',
  style = {}
}) => {
  const cardClasses = [
    'card',
    size,
    theme,
    isSelected ? 'selected' : '',
    disabled ? 'disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClasses}
      onClick={disabled ? undefined : onClick}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={onClick && !disabled ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      } : undefined}
    >
      {children}
    </div>
  );
};

// Sous-composants pour une utilisation facile
const CardImage = ({ src, alt, children, className = '' }) => (
  <div className={`card-image ${className}`}>
    {src && <img src={src} alt={alt} />}
    {children}
  </div>
);

const CardStatus = ({ children, variant = 'default', className = '' }) => (
  <span className={`card-status ${variant} ${className}`}>
    {children}
  </span>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`card-content ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, as = 'h3', href, onClick, className = '' }) => {
  const Tag = as;
  if (href) {
    return (
      <Tag className={`card-title ${className}`}>
        <a href={href} onClick={onClick}>
          {children}
        </a>
      </Tag>
    );
  }
  return <Tag className={`card-title ${className}`}>{children}</Tag>;
};

const CardDescription = ({ children, className = '' }) => (
  <p className={`card-description ${className}`}>
    {children}
  </p>
);

const CardDetails = ({ children, className = '' }) => (
  <div className={`card-details ${className}`}>
    {children}
  </div>
);

const CardDetailItem = ({ icon, children, className = '' }) => (
  <div className={`detail-item ${className}`}>
    <span className="detail-icon">{icon}</span>
    <span>{children}</span>
  </div>
);

const CardTags = ({ children, title, className = '' }) => (
  <div className={`card-tags ${className}`}>
    {title && <h4>{title}</h4>}
    <div className="tags-list">
      {children}
    </div>
  </div>
);

const CardTag = ({ children, className = '' }) => (
  <span className={`tag ${className}`}>
    {children}
  </span>
);

const CardMeta = ({ children, className = '' }) => (
  <div className={`card-meta ${className}`}>
    {children}
  </div>
);

const CardMetaItem = ({ icon, children, className = '' }) => (
  <span className={`meta-item ${className}`}>
    <span className="detail-icon">{icon}</span>
    {children}
  </span>
);

const CardMetaLink = ({ children, href, onClick, className = '' }) => (
  <a href={href} onClick={onClick} className={`meta-link ${className}`}>
    {children}
  </a>
);

const CardAction = ({ children, disabled = false, onClick, type = 'button', className = '' }) => (
  <button 
    className={`card-action ${className}`}
    disabled={disabled}
    onClick={onClick}
    type={type}
  >
    {children}
  </button>
);

// Export du composant principal et des sous-composants
Card.Image = CardImage;
Card.Status = CardStatus;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Details = CardDetails;
Card.DetailItem = CardDetailItem;
Card.Tags = CardTags;
Card.Tag = CardTag;
Card.Meta = CardMeta;
Card.MetaItem = CardMetaItem;
Card.MetaLink = CardMetaLink;
Card.Action = CardAction;

export default Card;
