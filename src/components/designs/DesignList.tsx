import { useState } from 'react';
import type { Design } from '../../types';
import { getThumbnailUrl } from '../../api/designs.api';

interface DesignListProps {
  designs: Design[];
  onSelect: (design: Design) => void;
  onDelete: (id: string) => void;
}

export function DesignList({ designs, onSelect, onDelete }: DesignListProps) {
  const [failedThumbnails, setFailedThumbnails] = useState<Set<string>>(new Set());

  if (designs.length === 0) {
    return <p className="design-list__empty">No designs yet. Create your first design to get started.</p>;
  }

  function handleImageError(designId: string) {
    setFailedThumbnails((prev) => new Set(prev).add(designId));
  }

  function renderThumbnail(design: Design) {
    if (design.thumbnailFileId && !failedThumbnails.has(design._id)) {
      return (
        <img
          className="design-list__thumbnail"
          src={getThumbnailUrl(design._id)}
          alt={`Thumbnail for ${design.name}`}
          onError={() => handleImageError(design._id)}
        />
      );
    }

    return (
      <span className="design-list__thumbnail-placeholder" aria-hidden="true">
        🖼
      </span>
    );
  }

  return (
    <ul className="design-list" role="list">
      {designs.map((design) => (
        <li key={design._id} className="design-list__item">
          {renderThumbnail(design)}
          <button
            type="button"
            className="design-list__button"
            onClick={() => onSelect(design)}
            aria-label={`Edit design: ${design.name}`}
          >
            <span className="design-list__name">{design.name}</span>
            <span className="design-list__summary">
              {design.description
                ? design.description.slice(0, 80) + (design.description.length > 80 ? '…' : '')
                : 'No description'}
            </span>
            {design.tags && design.tags.length > 0 && (
              <span className="design-list__tags">
                {design.tags.map((tag) => (
                  <span key={tag} className="design-list__tag">{tag}</span>
                ))}
              </span>
            )}
          </button>
          <button
            type="button"
            className="design-list__delete"
            onClick={() => onDelete(design._id)}
            aria-label={`Delete design: ${design.name}`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
