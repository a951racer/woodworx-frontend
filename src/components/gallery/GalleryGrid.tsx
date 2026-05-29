import { useState, useRef, useCallback } from 'react';
import type { GalleryItem } from '../../types';
import { getGalleryFileUrl } from '../../api/gallery.api';

interface GalleryGridProps {
  items: GalleryItem[];
  onSelect: (item: GalleryItem) => void;
  onDelete: (id: string) => void;
}

/**
 * Normalize tags that may be stored as a JSON string array, a single-element
 * array containing a JSON string, or individual strings with leftover
 * quotes/brackets from bad parsing.
 */
function normalizeTags(tags: string[]): string[] {
  if (tags.length === 0) return [];
  if (tags.length === 1 && tags[0].startsWith('[')) {
    try {
      const parsed = JSON.parse(tags[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fall through
    }
  }
  return tags.map((tag) => tag.replace(/[\[\]"]/g, '').trim()).filter((t) => t.length > 0);
}

export function GalleryGrid({ items, onSelect, onDelete }: GalleryGridProps) {
  const [hoveredItem, setHoveredItem] = useState<GalleryItem | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = useCallback((item: GalleryItem, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    hoverTimeout.current = setTimeout(() => {
      // Position popup above the item, centered horizontally
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const popupWidth = 640;
      const popupHeight = 640;

      let left = rect.left + rect.width / 2 - popupWidth / 2;
      let top = rect.top - popupHeight - 8;

      // Keep within viewport bounds
      if (left < 8) left = 8;
      if (left + popupWidth > viewportWidth - 8) left = viewportWidth - popupWidth - 8;
      if (top < 8) top = rect.bottom + 8; // Show below if no room above

      // Ensure it doesn't go off bottom either
      if (top + popupHeight > viewportHeight - 8) {
        top = viewportHeight - popupHeight - 8;
      }

      setPopupPos({ top, left });
      setHoveredItem(item);
    }, 250);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setHoveredItem(null);
    setPopupPos(null);
  }, []);

  if (items.length === 0) {
    return <p className="gallery-grid__empty">No gallery items yet. Upload your first image!</p>;
  }

  return (
    <div className="gallery-grid">
      {items.map((item) => (
        <div
          key={item._id}
          className="gallery-grid__item"
          onMouseEnter={(e) => handleMouseEnter(item, e)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            type="button"
            className="gallery-grid__select"
            onClick={() => onSelect(item)}
            aria-label={`Edit ${item.title}`}
          >
            <div className="gallery-grid__thumbnail">
              <img src={getGalleryFileUrl(item._id)} alt={item.title} className="gallery-grid__image" />
            </div>
            <div className="gallery-grid__info">
              <span className="gallery-grid__title">{item.title}</span>
              {item.tags.length > 0 && (
                <div className="gallery-grid__tags">
                  {normalizeTags(item.tags).map((tag) => (
                    <span key={tag} className="gallery-grid__tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </button>
          <button
            type="button"
            className="gallery-grid__delete"
            onClick={(e) => { e.stopPropagation(); onDelete(item._id); }}
            aria-label={`Delete ${item.title}`}
          >
            ✕
          </button>
        </div>
      ))}

      {hoveredItem && popupPos && (
        <div
          className="gallery-grid__preview-popup"
          style={{ top: popupPos.top, left: popupPos.left }}
        >
          <img
            src={getGalleryFileUrl(hoveredItem._id)}
            alt={hoveredItem.title}
            className="gallery-grid__preview-img"
          />
        </div>
      )}
    </div>
  );
}
