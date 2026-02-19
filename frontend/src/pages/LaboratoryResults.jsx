import { useState } from 'react';
import { getCurrentUser } from '../utils/auth';
import { mockLabReports } from '../utils/mockData';
import Sidebar from '../components/Sidebar';
import '../styles/LaboratoryResults.css';

function LaboratoryResults({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="lab-results-wrapper">
        <Sidebar />
        <div className="laboratory-results">
          <div className="lab-container">
            <div className="not-logged-in">
              <h2>Please log in to view your laboratory results</h2>
              <button className="btn-login-redirect" onClick={() => onNavigate('login')}>
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredReports = searchQuery
    ? mockLabReports.filter(report =>
        report.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : mockLabReports;

  return (
    <div className="lab-results-wrapper">
      <Sidebar />
      <div className="laboratory-results">
        <div className="lab-container">
          <div className="lab-header">
            <div className="patient-portal-label">PATIENT PORTAL</div>
            <h1>Laboratory Results</h1>
            <p className="lab-subtitle">A secure, read-only record of your diagnostic history and biological markers.</p>
          </div>

          <div className="overall-health-card">
            <div className="health-status-header">
              <div className="health-status-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2"/>
                  <path d="M8 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="health-status-info">
                <h2>Overall Health Status: Good</h2>
                <p>Based on your results from the last 12 months</p>
              </div>
            </div>
            <div className="health-metrics">
              <div className="metric-item optimal">
                <div className="metric-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="metric-info">
                  <span className="metric-label">METABOLIC PANEL</span>
                  <span className="metric-value">Optimal</span>
                  <span className="metric-date">Last checked: 14 days ago</span>
                </div>
              </div>
              <div className="metric-item elevated">
                <div className="metric-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 7v6M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="metric-info">
                  <span className="metric-label">INFLAMMATORY MARKERS</span>
                  <span className="metric-value">Slightly Elevated</span>
                  <span className="metric-date">Last checked: 32 days ago</span>
                </div>
              </div>
              <div className="metric-item optimal">
                <div className="metric-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="metric-info">
                  <span className="metric-label">ORGAN FUNCTION</span>
                  <span className="metric-value">Stable</span>
                  <span className="metric-date">Last checked: 14 days ago</span>
                </div>
              </div>
            </div>
            <div className="next-screening">
              <span className="next-screening-label">NEXT SCHEDULED SCREENING</span>
              <span className="next-screening-date">December 14, 2023</span>
            </div>
          </div>

          <div className="lab-reports-section">
            <div className="section-header">
              <h3>Recent Lab Reports</h3>
              <div className="search-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="2"/>
                  <path d="m21 21-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="lab-table">
              <div className="table-header">
                <div className="col-test">LAB TEST NAME</div>
                <div className="col-provider">SERVICE PROVIDER</div>
                <div className="col-date">DATE PERFORMED</div>
                <div className="col-status">STATUS</div>
                <div className="col-actions">ACTIONS</div>
              </div>

              {filteredReports.length > 0 ? (
                <>
                  {filteredReports.map((report) => (
                    <div key={report.id} className="table-row">
                      <div className="col-test">
                        <div className="test-icon">
                          {report.status === 'normal' ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" fill="#fee2e2"/>
                              <path d="M8 12h8M12 8v8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="#fef2f2" stroke="#ef4444" strokeWidth="1.5"/>
                            </svg>
                          )}
                        </div>
                        <div className="test-info">
                          <div className="test-name">{report.testName}</div>
                          <div className="test-category">{report.category}</div>
                        </div>
                      </div>
                      <div className="col-provider">{report.serviceProvider}</div>
                      <div className="col-date">
                        {new Date(report.datePerformed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className="col-status">
                        <span className={`status-badge ${report.status}`}>
                          {report.status === 'normal' ? 'Normal' : 'Flagged'}
                        </span>
                      </div>
                      <div className="col-actions">
                        <button className="btn-view-report">
                          View Full Report
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="table-footer">
                    <span>Showing 4 of 24 results</span>
                    <div className="pagination">
                      <button className="page-btn" disabled>Previous</button>
                      <button className="page-btn">Next</button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-results">
                  <p>No lab reports found matching your search.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bottom-cards">
            <div className="guide-card">
              <div className="guide-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <path d="M12 16v-4M12 8h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="guide-content">
                <h4>How to read your results?</h4>
                <p>Our interactive guide helps you understand clinical ranges and terminology used by healthcare providers.</p>
                <button className="btn-open-guide">Open Lab Guide</button>
              </div>
            </div>

            <div className="pending-card">
              <h4>New Results Pending</h4>
              <p>Your Vitamin D Panel (Oct 28) is being processed.</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
              <span className="progress-label">75% COMPLETE</span>
              <div className="pending-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                  <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LaboratoryResults;
