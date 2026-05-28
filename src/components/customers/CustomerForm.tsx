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
  const [streetLine1, setStreetLine1] = useState('');
  const [streetLine2, setStreetLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      setStreetLine1(customer.streetLine1 || '');
      setStreetLine2(customer.streetLine2 || '');
      setCity(customer.city || '');
      setState(customer.state || '');
      setZip(customer.zip || '');
      setNotes(customer.notes);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setStreetLine1('');
      setStreetLine2('');
      setCity('');
      setState('');
      setZip('');
      setNotes('');
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: CreateCustomerDTO = {
      name,
      email: email || undefined,
      phone: phone || undefined,
      streetLine1: streetLine1 || undefined,
      streetLine2: streetLine2 || undefined,
      city: city || undefined,
      state: state || undefined,
      zip: zip || undefined,
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

      <fieldset className="customer-form__fieldset">
        <legend>Address</legend>
        <div className="customer-form__field">
          <label htmlFor="customer-street1">Street Line 1</label>
          <input
            id="customer-street1"
            type="text"
            value={streetLine1}
            onChange={(e) => setStreetLine1(e.target.value)}
          />
        </div>
        <div className="customer-form__field">
          <label htmlFor="customer-street2">Street Line 2</label>
          <input
            id="customer-street2"
            type="text"
            value={streetLine2}
            onChange={(e) => setStreetLine2(e.target.value)}
          />
        </div>
        <div className="customer-form__address-row">
          <div className="customer-form__field customer-form__field--city">
            <label htmlFor="customer-city">City</label>
            <input
              id="customer-city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="customer-form__field customer-form__field--state">
            <label htmlFor="customer-state">State</label>
            <input
              id="customer-state"
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
          <div className="customer-form__field customer-form__field--zip">
            <label htmlFor="customer-zip">Zip</label>
            <input
              id="customer-zip"
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
        </div>
      </fieldset>

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
