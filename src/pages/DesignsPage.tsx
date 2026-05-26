import { useEffect, useState } from 'react';
import { useDesignStore } from '../stores/designStore';
import { DesignList } from '../components/designs/DesignList';
import { DesignForm } from '../components/designs/DesignForm';
import type { Design, CreateDesignDTO } from '../types';
import '../components/designs/designs.css';

export function DesignsPage() {
  const { designs, loading, error, fetchDesigns, createDesign, updateDesign, deleteDesign } =
    useDesignStore();

  const [editing, setEditing] = useState<Design | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleSelect = (design: Design) => {
    setEditing(design);
    setShowForm(true);
  };

  const handleSubmit = async (data: CreateDesignDTO): Promise<string | undefined> => {
    let designId: string | undefined;
    if (editing) {
      designId = await updateDesign(editing._id, data);
    } else {
      designId = await createDesign(data);
    }
    return designId;
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await deleteDesign(id);
    if (editing?._id === id) {
      setShowForm(false);
      setEditing(null);
    }
  };

  return (
    <div className="designs-page">
      <div className="designs-page__header">
        <h1 className="content-area__title">Designs</h1>
        {!showForm && (
          <button
            type="button"
            className="designs-page__new-btn"
            onClick={handleCreate}
          >
            + New Design
          </button>
        )}
      </div>

      {error && <p className="designs-page__error" role="alert">{error}</p>}
      {loading && <p className="designs-page__loading">Loading designs…</p>}

      {showForm ? (
        <DesignForm design={editing} onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <DesignList designs={designs} onSelect={handleSelect} onDelete={handleDelete} />
      )}
    </div>
  );
}
