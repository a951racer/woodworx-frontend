import { useState, useEffect } from 'react';
import type { Project, CreateProjectDTO } from '../../types';
import { useDesignStore } from '../../stores/designStore';
import { useCustomerStore } from '../../stores/customerStore';

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: CreateProjectDTO) => void;
  onCancel: () => void;
}

const statusOptions: { value: Project['status']; label: string }[] = [
  { value: 'planning', label: 'Planning' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' },
];

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState('');
  const [designId, setDesignId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [status, setStatus] = useState<Project['status']>('planning');
  const [startDate, setStartDate] = useState('');
  const [completedDate, setCompletedDate] = useState('');
  const [notes, setNotes] = useState('');

  const designs = useDesignStore((s) => s.designs);
  const fetchDesigns = useDesignStore((s) => s.fetchDesigns);
  const customers = useCustomerStore((s) => s.customers);
  const fetchCustomers = useCustomerStore((s) => s.fetchCustomers);

  useEffect(() => {
    fetchDesigns();
    fetchCustomers();
  }, [fetchDesigns, fetchCustomers]);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDesignId(project.designId);
      setCustomerId(project.customerId);
      setStatus(project.status);
      setStartDate(project.startDate ? project.startDate.slice(0, 10) : '');
      setCompletedDate(project.completedDate ? project.completedDate.slice(0, 10) : '');
      setNotes(project.notes);
    } else {
      setName('');
      setDesignId('');
      setCustomerId('');
      setStatus('planning');
      setStartDate('');
      setCompletedDate('');
      setNotes('');
    }
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: CreateProjectDTO = {
      name,
      designId,
      customerId,
      status,
      startDate,
      notes,
    };
    if (completedDate) {
      data.completedDate = completedDate;
    }
    onSubmit(data);
  };

  return (
    <form className="project-form" onSubmit={handleSubmit} aria-label={project ? 'Edit project' : 'Create project'}>
      <h2 className="project-form__title">{project ? 'Edit Project' : 'New Project'}</h2>

      <div className="project-form__field">
        <label htmlFor="project-name">Name</label>
        <input
          id="project-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="project-form__field">
        <label htmlFor="project-design">Design</label>
        <select
          id="project-design"
          value={designId}
          onChange={(e) => setDesignId(e.target.value)}
          required
        >
          <option value="">Select a design...</option>
          {designs.map((d) => (
            <option key={d._id} value={d._id}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="project-form__field">
        <label htmlFor="project-customer">Customer</label>
        <select
          id="project-customer"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
        >
          <option value="">Select a customer...</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="project-form__field">
        <label htmlFor="project-status">Status</label>
        <select
          id="project-status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Project['status'])}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="project-form__field">
        <label htmlFor="project-startDate">Start Date</label>
        <input
          id="project-startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>

      <div className="project-form__field">
        <label htmlFor="project-completedDate">Completed Date (optional)</label>
        <input
          id="project-completedDate"
          type="date"
          value={completedDate}
          onChange={(e) => setCompletedDate(e.target.value)}
        />
      </div>

      <div className="project-form__field">
        <label htmlFor="project-notes">Notes</label>
        <textarea
          id="project-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
      </div>

      <div className="project-form__actions">
        <button type="submit" className="project-form__submit">
          {project ? 'Update' : 'Create'}
        </button>
        <button type="button" className="project-form__cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
