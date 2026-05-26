import { useEffect, useState } from 'react';
import { useCustomerStore } from '../stores/customerStore';
import { CustomerList } from '../components/customers/CustomerList';
import { CustomerForm } from '../components/customers/CustomerForm';
import type { Customer, CreateCustomerDTO } from '../types';
import '../components/customers/customers.css';

export function CustomersPage() {
  const { customers, loading, error, fetchCustomers, createCustomer, updateCustomer, deleteCustomer } =
    useCustomerStore();

  const [editing, setEditing] = useState<Customer | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleSelect = (customer: Customer) => {
    setEditing(customer);
    setShowForm(true);
  };

  const handleSubmit = async (data: CreateCustomerDTO) => {
    if (editing) {
      await updateCustomer(editing._id, data);
    } else {
      await createCustomer(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    await deleteCustomer(id);
    if (editing?._id === id) {
      setShowForm(false);
      setEditing(null);
    }
  };

  return (
    <div className="customers-page">
      <div className="customers-page__header">
        <h1 className="content-area__title">Customers</h1>
        {!showForm && (
          <button
            type="button"
            className="customers-page__new-btn"
            onClick={handleCreate}
          >
            + New Customer
          </button>
        )}
      </div>

      {error && <p className="customers-page__error" role="alert">{error}</p>}
      {loading && <p className="customers-page__loading">Loading customers…</p>}

      {showForm ? (
        <CustomerForm customer={editing} onSubmit={handleSubmit} onCancel={handleCancel} />
      ) : (
        <CustomerList customers={customers} onSelect={handleSelect} onDelete={handleDelete} />
      )}
    </div>
  );
}
