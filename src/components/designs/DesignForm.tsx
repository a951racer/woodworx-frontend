import { useState, useEffect } from 'react';
import type { Design, CreateDesignDTO, MaterialItem } from '../../types';
import { getThumbnailUrl } from '../../api/designs.api';
import { useDesignStore } from '../../stores/designStore';
import { useGalleryStore } from '../../stores/galleryStore';
import { TagChipInput } from '../shared/TagChipInput';
import '../shared/shared.css';

interface DesignFormProps {
  design?: Design | null;
  onSubmit: (data: CreateDesignDTO) => Promise<string | undefined>;
  onCancel: () => void;
}

const emptyMaterial: MaterialItem = { name: '', quantity: 1, unit: 'pieces' };

export function DesignForm({ design, onSubmit, onCancel }: DesignFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [length, setLength] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [unit, setUnit] = useState<'imperial' | 'metric'>('imperial');
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryItemId, setGalleryItemId] = useState<string>('');

  const uploadThumbnail = useDesignStore((state) => state.uploadThumbnail);
  const galleryItems = useGalleryStore((state) => state.items);
  const fetchGalleryItems = useGalleryStore((state) => state.fetchItems);

  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  useEffect(() => {
    if (design) {
      setName(design.name);
      setDescription(design.description);
      setLength(design.dimensions.length);
      setWidth(design.dimensions.width);
      setHeight(design.dimensions.height);
      setUnit(design.dimensions.unit);
      setMaterials(design.materials.length > 0 ? design.materials : []);
      setNotes(design.notes);
      setTags(design.tags || []);
      setGalleryItemId(design.galleryItemId || '');
      setThumbnailPreviewUrl(
        design.thumbnailFileId ? getThumbnailUrl(design._id) : null
      );
    } else {
      setName('');
      setDescription('');
      setLength(0);
      setWidth(0);
      setHeight(0);
      setUnit('imperial');
      setMaterials([]);
      setNotes('');
      setTags([]);
      setGalleryItemId('');
      setThumbnailPreviewUrl(null);
    }
    setThumbnailFile(null);
    setThumbnailError(null);
  }, [design]);

  const handleAddMaterial = () => {
    setMaterials([...materials, { ...emptyMaterial }]);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleMaterialChange = (index: number, field: keyof MaterialItem, value: string | number) => {
    setMaterials(
      materials.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setThumbnailFile(file);
    setThumbnailError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: CreateDesignDTO = {
      name,
      description,
      dimensions: { length, width, height, unit },
      materials,
      boards: design?.boards ?? [],
      notes,
      tags,
      galleryItemId: galleryItemId || undefined,
    };

    const designId = await onSubmit(data);
    if (!designId) return;

    if (thumbnailFile) {
      setIsUploading(true);
      setThumbnailError(null);
      try {
        await uploadThumbnail(designId, thumbnailFile);
        setThumbnailPreviewUrl(getThumbnailUrl(designId));
        setThumbnailFile(null);
        setIsUploading(false);
        onCancel();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to upload thumbnail';
        setThumbnailError(message);
        setIsUploading(false);
      }
    } else {
      onCancel();
    }
  };

  return (
    <form className="design-form" onSubmit={handleSubmit} aria-label={design ? 'Edit design' : 'Create design'}>
      <h2 className="design-form__title">{design ? 'Edit Design' : 'New Design'}</h2>

      <div className="design-form__field">
        <label htmlFor="design-name">Name</label>
        <input
          id="design-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="design-form__field">
        <label htmlFor="design-description">Description</label>
        <textarea
          id="design-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      <fieldset className="design-form__fieldset">
        <legend>Dimensions</legend>
        <div className="design-form__dimensions">
          <div className="design-form__field">
            <label htmlFor="design-length">Length</label>
            <input
              id="design-length"
              type="number"
              min={0}
              step="any"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            />
          </div>
          <div className="design-form__field">
            <label htmlFor="design-width">Width</label>
            <input
              id="design-width"
              type="number"
              min={0}
              step="any"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
            />
          </div>
          <div className="design-form__field">
            <label htmlFor="design-height">Height</label>
            <input
              id="design-height"
              type="number"
              min={0}
              step="any"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
            />
          </div>
          <div className="design-form__field">
            <label htmlFor="design-unit">Unit</label>
            <select
              id="design-unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value as 'imperial' | 'metric')}
            >
              <option value="imperial">Imperial</option>
              <option value="metric">Metric</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className="design-form__fieldset">
        <legend>Materials</legend>
        {materials.map((material, index) => (
          <div key={index} className="design-form__material-row">
            <input
              type="text"
              placeholder="Material name"
              value={material.name}
              onChange={(e) => handleMaterialChange(index, 'name', e.target.value)}
              aria-label={`Material ${index + 1} name`}
            />
            <input
              type="number"
              min={0}
              step="any"
              placeholder="Qty"
              value={material.quantity}
              onChange={(e) => handleMaterialChange(index, 'quantity', Number(e.target.value))}
              aria-label={`Material ${index + 1} quantity`}
            />
            <input
              type="text"
              placeholder="Unit"
              value={material.unit}
              onChange={(e) => handleMaterialChange(index, 'unit', e.target.value)}
              aria-label={`Material ${index + 1} unit`}
            />
            <button
              type="button"
              className="design-form__remove-material"
              onClick={() => handleRemoveMaterial(index)}
              aria-label={`Remove material ${index + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
        <button type="button" className="design-form__add-material" onClick={handleAddMaterial}>
          + Add Material
        </button>
      </fieldset>

      <div className="design-form__field">
        <label htmlFor="design-notes">Notes</label>
        <textarea
          id="design-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
      </div>

      <div className="design-form__field">
        <label>Tags</label>
        <TagChipInput tags={tags} onChange={setTags} placeholder="Add a tag and press Enter…" />
      </div>

      <div className="design-form__field">
        <label htmlFor="design-gallery-item">Gallery Item</label>
        <select
          id="design-gallery-item"
          value={galleryItemId}
          onChange={(e) => setGalleryItemId(e.target.value)}
        >
          <option value="">None</option>
          {galleryItems.map((item) => (
            <option key={item._id} value={item._id}>{item.title}</option>
          ))}
        </select>
      </div>

      <div className="design-form__field">
        <label htmlFor="design-thumbnail">Thumbnail</label>
        {thumbnailPreviewUrl && (
          <img
            src={thumbnailPreviewUrl}
            alt="Design thumbnail"
            className="design-form__thumbnail-preview"
          />
        )}
        <input
          id="design-thumbnail"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          disabled={isUploading}
        />
        {thumbnailError && (
          <p className="design-form__thumbnail-error" role="alert">
            {thumbnailError}
          </p>
        )}
        {isUploading && <p className="design-form__thumbnail-uploading">Uploading…</p>}
      </div>

      <div className="design-form__actions">
        <button type="submit" className="design-form__submit">
          {design ? 'Update' : 'Create'}
        </button>
        <button type="button" className="design-form__cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
