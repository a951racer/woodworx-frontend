import type { GalleryItem } from '../../types';
import { getGalleryFileUrl } from '../../api/gallery.api';

interface GalleryGridProps {
  items: GalleryItem[];
  onDelete: (id: string) => void;
}

/**
 * Normalize tags that may be stored as a JSON string array, a single-element
 * array containing a JSON string, or individual strings with leftover
 * quotes/brackets from bad parsing.
 */
function normalizeTags(tags: string[]): string[] {
  if (tags.length === 0) return [];
  // If the first element looks like a JSON array, parse it
  if (tags.length === 1 && tags[0].startsWith('[')) {
    try {
      const parsed = JSON.parse(tags[0]);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fall through
    }
  }
  // Strip any leftover brackets and quotes from each tag
  return tags.map((tag) => tag.replace(/[\[\]"]/g, '').trim()).filter((t) => t.length > 0);
}

export function GalleryGrid({ items, onDelete }: GalleryGridProps) {
  if (items.length === 0) {
    return <p className="gallery-grid__empty">No gallery items yet. Upload your first image!</p>;
  }

  return (
    <div className="gallery-grid">
      {items.map((item) => (
        <div key={item._id} className="gallery-grid__item">
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
          <button
            type="button"
            className="gallery-grid__delete"
            onClick={() => onDelete(item._id)}
            aria-label={`Delete ${item.title}`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
