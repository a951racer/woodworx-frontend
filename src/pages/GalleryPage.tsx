import { useEffect, useState } from 'react';
import { useGalleryStore } from '../stores/galleryStore';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
import { GalleryUpload } from '../components/gallery/GalleryUpload';
import type { GalleryItem } from '../types';
import '../components/gallery/gallery.css';

export function GalleryPage() {
  const { items, loading, error, fetchItems, uploadItem, updateItem, deleteItem } = useGalleryStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleUpload = async (file: File | null, title: string, description: string, tags: string[]) => {
    if (editing) {
      await updateItem(editing._id, file, title, description, tags);
    } else if (file) {
      await uploadItem(file, title, description, tags);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleSelect = (item: GalleryItem) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleDeleteRequest = (id: string) => {
    setConfirmDelete(id);
  };

  const handleDeleteConfirm = async () => {
    if (confirmDelete) {
      await deleteItem(confirmDelete);
      setConfirmDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setConfirmDelete(null);
  };

  return (
    <div className="gallery-page">
      <div className="gallery-page__header">
        <h1 className="content-area__title">Gallery</h1>
        {!showForm && (
          <button
            type="button"
            className="gallery-page__upload-btn"
            onClick={() => { setEditing(null); setShowForm(true); }}
          >
            + Upload
          </button>
        )}
      </div>

      {error && <p className="gallery-page__error" role="alert">{error}</p>}
      {loading && <p className="gallery-page__loading">Loading gallery…</p>}

      {showForm ? (
        <GalleryUpload item={editing} onUpload={handleUpload} onCancel={handleCancel} />
      ) : (
        <GalleryGrid items={items} onSelect={handleSelect} onDelete={handleDeleteRequest} />
      )}

      {confirmDelete && (
        <div className="gallery-page__confirm-overlay">
          <div className="gallery-page__confirm-dialog">
            <p>Are you sure you want to delete this gallery item?</p>
            <div className="gallery-page__confirm-actions">
              <button type="button" className="gallery-page__confirm-delete" onClick={handleDeleteConfirm}>
                Delete
              </button>
              <button type="button" className="gallery-page__confirm-cancel" onClick={handleDeleteCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
