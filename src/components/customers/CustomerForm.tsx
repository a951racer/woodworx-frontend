import { useState, useEffect } from 'react';
import type { Customer, CreateCustomerDTO } from '../../types';

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (data: CreateCustomerDTO) => void;
  onCancel: () => void;
}

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
      setNotes(customer.notes);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setNotes('');
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: CreateCustomerDTO = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
      notes,
    };
    onSubmit(data);
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit} aria-label={customer ? 'Edit customer' : 'Create customer'}>
      <h2 className="customer-form__title">{customer ? 'Edit Customer' : 'New Customer'}</h2>

      <div className="customer-form__field">
        <label htmlFor="customer-name">Name</label>
        <input
          id="customer-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="customer-form__field">
        <label htmlFor="customer-email">Email</label>
        <input
          id="customer-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="customer-form__field">
        <label htmlFor="customer-phone">Phone</label>
        <input
          id="customer-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="customer-form__field">
        <label htmlFor="customer-address">Address</label>
        <input
          id="customer-address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="customer-form__field">
        <label htmlFor="customer-notes">Notes</label>
        <textarea
          id="customer-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
      </div>

      <div className="customer-form__actions">
        <button type="submit" className="customer-form__submit">
          {customer ? 'Update' : 'Create'}
        </button>
        <button type="button" className="customer-form__cancel" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
