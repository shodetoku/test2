import { useState } from 'react';
import { getCurrentUser } from '../utils/auth';
import { mockInvoices } from '../utils/mockData';
import '../styles/Billing.css';

function Billing({ onNavigate }) {
  const [filterStatus, setFilterStatus] = useState('all');
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="billing">
        <div className="billing-container">
          <div className="not-logged-in">
            <h2>Please log in to view your billing information</h2>
            <button className="btn-login-redirect" onClick={() => onNavigate('login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredInvoices = filterStatus === 'all'
    ? mockInvoices
    : mockInvoices.filter(i => i.status === filterStatus);

  const totalUnpaid = mockInvoices
    .filter(i => i.status === 'unpaid')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPaid = mockInvoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="billing">
      <div className="billing-container">
        <div className="billing-header">
          <div>
            <h1>Billing & Invoices</h1>
            <p>View and manage your payments</p>
          </div>
        </div>

        <div className="billing-summary">
          <div className="summary-card unpaid">
            <div className="summary-icon">💳</div>
            <div className="summary-info">
              <span className="summary-label">Unpaid Balance</span>
              <span className="summary-amount">₱{totalUnpaid.toLocaleString()}</span>
            </div>
          </div>
          <div className="summary-card paid">
            <div className="summary-icon">✓</div>
            <div className="summary-info">
              <span className="summary-label">Total Paid</span>
              <span className="summary-amount">₱{totalPaid.toLocaleString()}</span>
            </div>
          </div>
          <div className="summary-card total">
            <div className="summary-icon">📊</div>
            <div className="summary-info">
              <span className="summary-label">Total Invoices</span>
              <span className="summary-amount">{mockInvoices.length}</span>
            </div>
          </div>
        </div>

        <div className="billing-content">
          <div className="filter-section">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All Invoices
            </button>
            <button
              className={`filter-btn ${filterStatus === 'unpaid' ? 'active' : ''}`}
              onClick={() => setFilterStatus('unpaid')}
            >
              Unpaid
            </button>
            <button
              className={`filter-btn ${filterStatus === 'paid' ? 'active' : ''}`}
              onClick={() => setFilterStatus('paid')}
            >
              Paid
            </button>
          </div>

          {filteredInvoices.length > 0 ? (
            <div className="invoices-list">
              {filteredInvoices.map((invoice) => (
                <div key={invoice.id} className={`invoice-card ${invoice.status}`}>
                  <div className="invoice-header">
                    <div className="invoice-id-section">
                      <span className="invoice-label">Invoice</span>
                      <span className="invoice-id">#{invoice.id}</span>
                    </div>
                    <span className={`status-badge ${invoice.status}`}>
                      {invoice.status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>

                  <div className="invoice-body">
                    <div className="invoice-description">
                      <h3>{invoice.description}</h3>
                    </div>

                    <div className="invoice-details">
                      <div className="detail-row">
                        <span className="detail-label">Invoice Date:</span>
                        <span className="detail-value">{new Date(invoice.date).toLocaleDateString()}</span>
                      </div>
                      {invoice.status === 'paid' && invoice.paidDate && (
                        <div className="detail-row">
                          <span className="detail-label">Paid Date:</span>
                          <span className="detail-value">{new Date(invoice.paidDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {invoice.status === 'unpaid' && invoice.dueDate && (
                        <div className="detail-row">
                          <span className="detail-label">Due Date:</span>
                          <span className="detail-value due-date">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="invoice-amount-section">
                      <span className="amount-label">Amount:</span>
                      <span className="amount-value">₱{invoice.amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="invoice-actions">
                    {invoice.status === 'unpaid' ? (
                      <>
                        <button className="btn-pay">Pay Now</button>
                        <button className="btn-download">Download Invoice</button>
                      </>
                    ) : (
                      <button className="btn-download">Download Receipt</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-invoices">
              <div className="no-data-icon">📄</div>
              <p>No {filterStatus !== 'all' ? filterStatus : ''} invoices found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Billing;
