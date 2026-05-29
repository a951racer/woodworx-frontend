import { useState, useRef, useCallback } from 'react';
import type { Design } from '../../types';
import { getThumbnailUrl } from '../../api/designs.api';

interface DesignListProps {
  designs: Design[];
  onSelect: (design: Design) => void;
  onDelete: (id: string) => void;
}

export function DesignList({ designs, onSelect, onDelete }: DesignListProps) {
  const [failedThumbnails, setFailedThumbnails] = useState<Set<string>>(new Set());
  const [hoveredDesign, setHoveredDesign] = useState<Design | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((design: Design, e: React.MouseEvent<HTMLElement>) => {
    if (!design.thumbnailFileId || failedThumbnails.has(design._id)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    hoverTimeout.current = setTimeout(() => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const popupWidth = 640;
      const popupHeight = 640;

      // Position centered in the content area
      let left = rect.left + (rect.width / 2) - (popupWidth / 2);
      let top = rect.bottom + 16;

      // Keep within viewport bounds
      if (left < 240) left = 240; // Don't overlap nav bar
      if (left + popupWidth > viewportWidth - 8) left = viewportWidth - popupWidth - 8;
      if (top + popupHeight > viewportHeight - 8) top = rect.top - popupHeight - 16;
      if (top < 8) top = 8;

      setPopupPos({ top, left });
      setHoveredDesign(design);
    }, 250);
  }, [failedThumbnails]);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setHoveredDesign(null);
    setPopupPos(null);
  }, []);

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
        <li
          key={design._id}
          className="design-list__item"
          onMouseEnter={(e) => handleMouseEnter(design, e)}
          onMouseLeave={handleMouseLeave}
        >
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

      {hoveredDesign && popupPos && (
        <div
          className="design-list__preview-popup"
          style={{ top: popupPos.top, left: popupPos.left }}
        >
          <img
            src={getThumbnailUrl(hoveredDesign._id)}
            alt={hoveredDesign.name}
            className="design-list__preview-img"
          />
        </div>
      )}
    </ul>
  );
}
