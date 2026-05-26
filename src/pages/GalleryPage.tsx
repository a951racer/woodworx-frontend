import { useEffect, useState } from 'react';
import { useGalleryStore } from '../stores/galleryStore';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { GalleryUpload } from '../components/gallery/GalleryUpload';
import '../components/gallery/gallery.css';

export function GalleryPage() {
  const { items, loading, error, fetchItems, uploadItem, deleteItem } = useGalleryStore();
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleUpload = async (file: File, title: string, description: string, tags: string[]) => {
    await uploadItem(file, title, description, tags);
    setShowUpload(false);
  };

  const handleCancel = () => {
    setShowUpload(false);
  };

  return (
    <div className="gallery-page">
      <div className="gallery-page__header">
        <h1 className="content-area__title">Gallery</h1>
        {!showUpload && (
          <button
            type="button"
            className="gallery-page__upload-btn"
            onClick={() => setShowUpload(true)}
          >
            + Upload
          </button>
        )}
      </div>

      {error && <p className="gallery-page__error" role="alert">{error}</p>}
      {loading && <p className="gallery-page__loading">Loading gallery…</p>}

      {showUpload ? (
        <GalleryUpload onUpload={handleUpload} onCancel={handleCancel} />
      ) : (
        <GalleryGrid items={items} onDelete={deleteItem} />
      )}
    </div>
  );
}
