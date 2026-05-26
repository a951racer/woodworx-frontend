import { useEffect, useState } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { ProjectList } from '../components/projects/ProjectList';
import { ProjectForm } from '../components/projects/ProjectForm';
import type { Project, CreateProjectDTO } from '../types';
import '../components/projects/projects.css';

export function ProjectsPage() {
  const { projects, loading, error, fetchProjects, createProject, updateProject, deleteProject } =
    useProjectStore();

  const [editing, setEditing] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleSelect = (project: Project) => {
    setEditing(project);
    setShowForm(true);
  };

  const handleSubmit = async (data: CreateProjectDTO) => {
    if (editing) {
      await updateProject(editing._id, data);
    } else {
      await createProject(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    if (editing?._id === id) {
      setShowForm(false);
      setEditing(null);
    }
  };

  return (
    <div className="projects-page">
      <div className="projects-page__header">
        <h1 className="content-area__title">Projects</h1>
        {!showForm && (
          <button
            type="button"
            className="projects-page__new-btn"
            onClick={handleCreate}
          >
            + New Project
          </button>
        )}
      </div>

      {error && <p className="projects-page__error" role="alert">{error}</p>}
      {loading && <p className="projects-page__loading">Loading projects…</p>}

      {showForm ? (
        <ProjectForm project={editing} onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <ProjectList projects={projects} onSelect={handleSelect} onDelete={handleDelete} />
      )}
    </div>
  );
}
