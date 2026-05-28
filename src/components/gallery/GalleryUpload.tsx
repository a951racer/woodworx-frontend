import { useState } from 'react';
import type { GalleryItem } from '../../types';
import { getGalleryFileUrl } from '../../api/gallery.api';

interface GalleryUploadProps {
  item?: GalleryItem | null;
  onUpload: (file: File | null, title: string, description: string, tags: string[]) => Promise<void>;
  onCancel: () => void;
}

export function GalleryUpload({ item, onUpload, onCancel }: GalleryUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [tagsInput, setTagsInput] = useState(item?.tags?.join(', ') || '');
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!item;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && !file) return;
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setSubmitting(true);
    await onUpload(file, title.trim(), description.trim(), tags);
    setSubmitting(false);
  };

  return (
    <form className="gallery-upload" onSubmit={handleSubmit}>
      <h2 className="gallery-upload__title">{isEditing ? 'Edit Image' : 'Upload Image'}</h2>

      {isEditing && item?.fileKey && (
        <div className="gallery-upload__preview">
          <img
            src={getGalleryFileUrl(item._id)}
            alt={item.title}
            className="gallery-upload__preview-img"
          />
        </div>
      )}

      <div className="gallery-upload__field">
        <label htmlFor="gallery-file">{isEditing ? 'Replace File (optional)' : 'File'}</label>
        <input
          id="gallery-file"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required={!isEditing}
        />
      </div>

      <div className="gallery-upload__field">
        <label htmlFor="gallery-title">Title</label>
        <input
          id="gallery-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Image title"
          required
        />
      </div>

      <div className="gallery-upload__field">
        <label htmlFor="gallery-description">Description</label>
        <textarea
          id="gallery-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={3}
        />
      </div>

      <div className="gallery-upload__field">
        <label htmlFor="gallery-tags">Tags (comma-separated)</label>
        <input
          id="gallery-tags"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="e.g. walnut, table, commission"
        />
      </div>

      <div className="gallery-upload__actions">
        <button
          type="submit"
          className="gallery-upload__submit"
          disabled={submitting || (!isEditing && !file) || !title.trim()}
        >
          {submitting ? 'Saving…' : isEditing ? 'Save' : 'Upload'}
        </button>
        <button
          type="button"
          className="gallery-upload__cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
