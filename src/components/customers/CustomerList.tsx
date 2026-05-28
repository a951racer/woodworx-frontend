import type { Customer } from '../../types';

interface CustomerListProps {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

function formatAddress(customer: Customer): string {
  const parts: string[] = [];
  if (customer.streetLine1) parts.push(customer.streetLine1);
  const cityStateZip = [
    customer.city,
    customer.state ? (customer.city ? `, ${customer.state}` : customer.state) : '',
    customer.zip,
  ].filter(Boolean).join(' ');
  if (cityStateZip) parts.push(cityStateZip);
  return parts.join(', ') || '';
}

export function CustomerList({ customers, onSelect, onDelete }: CustomerListProps) {
  if (customers.length === 0) {
    return <p className="customer-list__empty">No customers yet. Add your first customer to get started.</p>;
  }

  return (
    <ul className="customer-list" role="list">
      {customers.map((customer) => (
        <li key={customer._id} className="customer-list__item">
          <button
            type="button"
            className="customer-list__button"
            onClick={() => onSelect(customer)}
            aria-label={`Edit customer: ${customer.name}`}
          >
            <span className="customer-list__name">{customer.name}</span>
            {formatAddress(customer) && (
              <span className="customer-list__address">{formatAddress(customer)}</span>
            )}
            <span className="customer-list__projects">
              {customer.projects?.length || 0} project{(customer.projects?.length || 0) !== 1 ? 's' : ''}
            </span>
          </button>
          <button
            type="button"
            className="customer-list__delete"
            onClick={() => onDelete(customer._id)}
            aria-label={`Delete customer: ${customer.name}`}
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
}
