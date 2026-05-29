import type { Project } from '../../types';
import { useCustomerStore } from '../../stores/customerStore';
import { useEffect } from 'react';

interface ProjectListProps {
  projects: Project[];
  onSelect: (project: Project) => void;
  onDelete: (id: string) => void;
}

const statusLabels: Record<Project['status'], string> = {
  planning: 'Planning',
  'in-progress': 'In Progress',
  completed: 'Completed',
  'on-hold': 'On Hold',
};

export function ProjectList({ projects, onSelect, onDelete }: ProjectListProps) {
  const customers = useCustomerStore((s) => s.customers);
  const fetchCustomers = useCustomerStore((s) => s.fetchCustomers);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  function getCustomerName(customerId: string): string {
    const customer = customers.find((c) => c._id === customerId);
    return customer ? customer.name : customerId;
  }
  if (projects.length === 0) {
    return <p className="project-list__empty">No projects yet. Create your first project to get started.</p>;
  }

  return (
    <ul className="project-list" role="list">
      {projects.map((project) => (
        <li key={project._id} className="project-list__item">
          <button
            type="button"
            className="project-list__button"
            onClick={() => onSelect(project)}
            aria-label={`Edit project: ${project.name}`}
          >
            <span className="project-list__name">{project.name}</span>
            <span className="project-list__meta">
              <span className={`project-list__status project-list__status--${project.status}`}>
                {statusLabels[project.status]}
              </span>
              <span className="project-list__customer">
                Customer: {getCustomerName(project.customerId)}
              </span>
            </span>
          </button>
          <button
            type="button"
            className="project-list__delete"
            onClick={() => onDelete(project._id)}
            aria-label={`Delete project: ${project.name}`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
