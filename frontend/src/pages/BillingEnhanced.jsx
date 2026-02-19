import { useState } from 'react';
import { getCurrentUser } from '../utils/auth';
import { mockBillingTransactions } from '../utils/mockData';
import Sidebar from '../components/Sidebar';
import '../styles/BillingEnhanced.css';

function BillingEnhanced({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="billing-enhanced-wrapper">
        <Sidebar />
        <div className="billing-enhanced">
          <div className="billing-container-enhanced">
            <div className="not-logged-in">
              <h2>Please log in to view your billing information</h2>
              <button className="btn-login-redirect" onClick={() => onNavigate('login')}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredTransactions = searchQuery
    ? mockBillingTransactions.filter(transaction =>
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.provider.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockBillingTransactions;

  const recentPayments = mockBillingTransactions
    .filter(t => t.paymentStatus === 'paid')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="billing-enhanced-wrapper">
      <Sidebar />
      <div className="billing-enhanced">
        <div className="billing-container-enhanced">
          <div className="billing-header-enhanced">
            <div className="patient-portal-label">PATIENT PORTAL</div>
            <h1>Billing & Financial</h1>
            <p className="billing-subtitle">Review your current balance, recent payments, and insurance claims in one secure place.</p>
          </div>

          <div className="balance-card">
            <div className="balance-header">
              <div className="balance-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="#10b981" strokeWidth="2"/>
                  <path d="M2 10h20M7 15h2" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="balance-info">
                <h2>Total Balance Due: $450</h2>
                <p>Next statement generation: Nov 01, 2024</p>
              </div>
            </div>
            <div className="balance-stats">
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="#10b981" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-label">RECENT PAYMENTS</span>
                  <span className="stat-value">${recentPayments.toFixed(2)}</span>
                  <span className="stat-info">Last 30 days total</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" stroke="#f59e0b" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-label">UPCOMING STATEMENTS</span>
                  <span className="stat-value">1 Statement</span>
                  <span className="stat-info">Due by Nov 15, 2024</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#3b82f6" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <span className="stat-label">INSURANCE COVERAGE</span>
                  <span className="stat-value">Active</span>
                  <span className="stat-info">Primary: Blue Cross Shield</span>
                </div>
              </div>
            </div>
            <div className="last-payment">
              <span className="last-payment-label">LAST PAYMENT RECEIVED</span>
              <span className="last-payment-date">October 12, 2024</span>
            </div>
          </div>

          <div className="billing-history-section">
            <div className="section-header">
              <h3>Billing History</h3>
              <div className="search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="billing-table">
              <div className="table-header">
                <div className="col-date">SERVICE DATE</div>
                <div className="col-description">DESCRIPTION</div>
                <div className="col-provider">PROVIDER</div>
                <div className="col-amount">AMOUNT</div>
                <div className="col-status">PAYMENT STATUS</div>
              </div>

              {filteredTransactions.length > 0 ? (
                <>
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="table-row">
                      <div className="col-date">
                        {new Date(transaction.serviceDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="col-description">
                        <div className="description-main">{transaction.description}</div>
                        <div className="description-sub">{transaction.category}</div>
                      </div>
                      <div className="col-provider">{transaction.provider}</div>
                      <div className="col-amount">${transaction.amount.toFixed(2)}</div>
                      <div className="col-status">
                        <span className={`payment-badge ${transaction.paymentStatus}`}>
                          {transaction.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="table-footer">
                    <span>Showing 4 of 24 transactions</span>
                    <div className="pagination">
                      <button className="page-btn" disabled>Previous</button>
                      <button className="page-btn">Next</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-results">
                  <p>No transactions found matching your search.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bottom-cards">
            <div className="payment-methods-card">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="white" strokeWidth="2"/>
                  <path d="M2 10h20" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <div className="card-content">
                <h4>Manage Payment Methods</h4>
                <p>Securely update your stored credit cards or bank information for easier future payments.</p>
                <button className="btn-wallet-settings">Wallet Settings</button>
              </div>
            </div>

            <div className="insurance-claim-card">
              <h4>Insurance Claim Processing</h4>
              <p>Claim for Lab Panel (Oct 10) is currently being reviewed by your provider.</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
              <span className="progress-label">75% COMPLETE</span>
              <div className="claim-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingEnhanced;
