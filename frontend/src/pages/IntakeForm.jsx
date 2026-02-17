import { useState, useEffect } from 'react';
import { saveToStorage, getFromStorage } from '../utils/storage';
import '../styles/IntakeForm.css';

function IntakeForm({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [suffix, setSuffix] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [gender, setGender] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [barangay, setBarangay] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('Philippines');
  const [zipCode, setZipCode] = useState('');

  const [mainReason, setMainReason] = useState('');
  const [duration, setDuration] = useState('');

  const [hospitalized, setHospitalized] = useState('');
  const [surgicalProcedures, setSurgicalProcedures] = useState('');
  const [admissionReason, setAdmissionReason] = useState('');
  const [admissionYear, setAdmissionYear] = useState('');
  const [procedureType, setProcedureType] = useState('');
  const [procedureYear, setProcedureYear] = useState('');

  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('');

  const [familyHistory, setFamilyHistory] = useState({
    hypertension: false,
    diabetes: false,
    heartDisease: false,
    stroke: false,
    cancer: false,
    asthma: false,
    kidneyDisease: false,
    thyroidDisorders: false,
    highCholesterol: false,
    tuberculosis: false,
  });
  const [familyHistoryOthers, setFamilyHistoryOthers] = useState('');

  useEffect(() => {
    const savedData = getFromStorage('intakeFormData');
    if (savedData) {
      setLastName(savedData.lastName || '');
      setFirstName(savedData.firstName || '');
      setSuffix(savedData.suffix || '');
      setDateOfBirth(savedData.dateOfBirth || '');
      setAge(savedData.age || '');
      setEmail(savedData.email || '');
      setMobileNumber(savedData.mobileNumber || '');
      setGender(savedData.gender || '');
      setStreetAddress(savedData.streetAddress || '');
      setBarangay(savedData.barangay || '');
      setCity(savedData.city || '');
      setProvince(savedData.province || '');
      setCountry(savedData.country || 'Philippines');
      setZipCode(savedData.zipCode || '');
      setMainReason(savedData.mainReason || '');
      setDuration(savedData.duration || '');
      setHospitalized(savedData.hospitalized || '');
      setSurgicalProcedures(savedData.surgicalProcedures || '');
      setAdmissionReason(savedData.admissionReason || '');
      setAdmissionYear(savedData.admissionYear || '');
      setProcedureType(savedData.procedureType || '');
      setProcedureYear(savedData.procedureYear || '');
      setCurrentMedications(savedData.currentMedications || '');
      setAllergies(savedData.allergies || '');
      setFamilyHistory(savedData.familyHistory || {});
      setFamilyHistoryOthers(savedData.familyHistoryOthers || '');
    }
  }, []);

  const handleFamilyHistoryChange = (condition) => {
    setFamilyHistory((prev) => ({
      ...prev,
      [condition]: !prev[condition],
    }));
  };

  const saveFormData = () => {
    const formData = {
      lastName,
      firstName,
      suffix,
      dateOfBirth,
      age,
      email,
      mobileNumber,
      gender,
      streetAddress,
      barangay,
      city,
      province,
      country,
      zipCode,
      mainReason,
      duration,
      hospitalized,
      surgicalProcedures,
      admissionReason,
      admissionYear,
      procedureType,
      procedureYear,
      currentMedications,
      allergies,
      familyHistory,
      familyHistoryOthers,
    };
    saveToStorage('intakeFormData', formData);
  };

  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1:
        return lastName && firstName && dateOfBirth && email && mobileNumber && streetAddress && city && province && zipCode;
      case 2:
        return mainReason && duration;
      case 3:
        const step3Valid = hospitalized && surgicalProcedures;
        if (!step3Valid) return false;
        if (hospitalized === 'Yes' && (!admissionReason || !admissionYear)) return false;
        if (surgicalProcedures === 'Yes' && (!procedureType || !procedureYear)) return false;
        return true;
      case 4:
        return currentMedications && allergies;
      case 5:
        const hasChecked = Object.values(familyHistory).some(val => val === true);
        return hasChecked || familyHistoryOthers;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) return;
    saveFormData();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowAlert(true);
      setTimeout(() => {
        setIsSubmitted(true);
      }, 2000);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReturnHome = () => {
    onClose(true);
  };

  const steps = [
    { number: 1, label: 'Patient Info', status: currentStep === 1 ? 'in-progress' : currentStep > 1 ? 'completed' : 'pending' },
    { number: 2, label: 'Consultation', status: currentStep === 2 ? 'in-progress' : currentStep > 2 ? 'completed' : 'pending' },
    { number: 3, label: 'Medical History', status: currentStep === 3 ? 'in-progress' : currentStep > 3 ? 'completed' : 'pending' },
    { number: 4, label: 'Medications', status: currentStep === 4 ? 'in-progress' : currentStep > 4 ? 'completed' : 'pending' },
    { number: 5, label: 'Family History', status: currentStep === 5 ? 'in-progress' : currentStep > 5 ? 'completed' : 'pending' },
  ];

  if (isSubmitted) {
    return (
      <div className="intake-form-overlay">
        <div className="intake-form-submitted">
          <div className="submitted-icon">
            <div className="checkmark-circle">
              <svg viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="25" fill="none" />
                <path fill="none" d="M14 27l7 7 16-16" />
              </svg>
            </div>
          </div>
          <h2>Intake Form Submitted!</h2>
          <p>Your patient information has been successfully submitted. Our team will contact you shortly for the testing. See you!</p>
          <button className="btn-return-home" onClick={handleReturnHome}>
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="intake-form-overlay">
      <div className="intake-form-wrapper">
        <div className="intake-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="logo-icon-green">+</div>
              <span>Logo Name</span>
            </div>
          </div>

          <div className="sidebar-content">
            <h2>Patient Intake Form</h2>
            <p className="sidebar-description">
              Please complete all sections to help us provide you with the best medical care possible.
            </p>

            <div className="steps-navigation">
              {steps.map((step) => (
                <div key={step.number} className={`step-item ${step.status}`}>
                  <div className="step-indicator">
                    <div className="step-number">{step.number}</div>
                  </div>
                  <div className="step-label">
                    <div className="step-title">{step.label}</div>
                    {step.status === 'in-progress' && (
                      <div className="step-status">In Progress</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="need-help">
              <div className="help-icon">📞</div>
              <div className="help-text">
                <div className="help-title">Need Help?</div>
                <div className="help-subtitle">Contact our support team at</div>
                <a href="tel:+15551234567" className="help-phone">+1 (555) 123 4567</a>
              </div>
            </div>
          </div>
        </div>

        <div className="intake-main">
          <button className="close-btn-top" onClick={onClose}>✕</button>

          <div className="form-content">
            {currentStep === 1 && (
              <>
                <div className="form-header">
                  <h2>Patient Information</h2>
                  <p>Please provide your personal details.</p>
                </div>

                <div className="form-section">
                  <div className="form-row-3">
                    <div className="form-field">
                      <label>Last Name <span className="required">*</span></label>
                      <input
                        type="text"
                        placeholder="Cruz"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>First Name <span className="required">*</span></label>
                      <input
                        type="text"
                        placeholder="Juan"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Suffix</label>
                      <input
                        type="text"
                        placeholder="Jr."
                        value={suffix}
                        onChange={(e) => setSuffix(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row-3">
                    <div className="form-field">
                      <label>Date of Birth <span className="required">*</span></label>
                      <input
                        type="text"
                        placeholder="mm/dd/yyyy"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Age</label>
                      <input
                        type="number"
                        placeholder="30"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Gender</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Email Address <span className="required">*</span></label>
                      <input
                        type="email"
                        placeholder="Juan@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Mobile Number <span className="required">*</span></label>
                      <input
                        type="tel"
                        placeholder="+639"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="section-divider">
                    <h3>Address Details</h3>
                  </div>

                  <div className="form-field">
                    <label>Street Address <span className="required">*</span></label>
                    <input
                      type="text"
                      placeholder="123 Main St"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                    />
                  </div>

                  <div className="form-row-2">
                    <div className="form-field">
                      <label>Barangay</label>
                      <input
                        type="text"
                        placeholder="Barangay"
                        value={barangay}
                        onChange={(e) => setBarangay(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>City <span className="required">*</span></label>
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row-3">
                    <div className="form-field">
                      <label>Province <span className="required">*</span></label>
                      <input
                        type="text"
                        placeholder="Province"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                      />
                    </div>
                    <div className="form-field">
                      <label>Country</label>
                      <select value={country} onChange={(e) => setCountry(e.target.value)}>
                        <option value="Philippines">Philippines</option>
                        <option value="USA">USA</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label>ZIP Code <span className="required">*</span></label>
                      <input
                        type="text"
                        placeholder="1000"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="form-header">
                  <h2>Reason for Consultation</h2>
                  <p>Tell us about your visit</p>
                </div>

                <div className="form-section">
                  <div className="form-field">
                    <label>Main reason of visit</label>
                    <textarea
                      placeholder="Describe your symptoms or reason for consultation"
                      value={mainReason}
                      onChange={(e) => setMainReason(e.target.value)}
                      rows="6"
                    />
                  </div>

                  <div className="form-field">
                    <label>Duration of Symptoms</label>
                    <input
                      type="text"
                      placeholder="e.g. 3 days, 2 weeks, 1 month"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="form-header">
                  <h2>Medical History</h2>
                  <p>Help us understand your health background</p>
                </div>

                <div className="form-section">
                  <div className="form-field">
                    <label>Have you been hospitalized before?</label>
                    <div className="radio-group-horizontal">
                      <label className="radio-button">
                        <input
                          type="radio"
                          name="hospitalized"
                          value="Yes"
                          checked={hospitalized === 'Yes'}
                          onChange={(e) => setHospitalized(e.target.value)}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="radio-button">
                        <input
                          type="radio"
                          name="hospitalized"
                          value="No"
                          checked={hospitalized === 'No'}
                          onChange={(e) => setHospitalized(e.target.value)}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  {hospitalized === 'Yes' && (
                    <div className="form-row-2">
                      <div className="form-field">
                        <label>Reason for admission</label>
                        <input
                          type="text"
                          placeholder="Reason"
                          value={admissionReason}
                          onChange={(e) => setAdmissionReason(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label>Year</label>
                        <input
                          type="text"
                          placeholder="Year"
                          value={admissionYear}
                          onChange={(e) => setAdmissionYear(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="form-field" style={{ marginTop: '2rem' }}>
                    <label>Have you undergone any surgical procedures?</label>
                    <div className="radio-group-horizontal">
                      <label className="radio-button">
                        <input
                          type="radio"
                          name="surgicalProcedures"
                          value="Yes"
                          checked={surgicalProcedures === 'Yes'}
                          onChange={(e) => setSurgicalProcedures(e.target.value)}
                        />
                        <span>Yes</span>
                      </label>
                      <label className="radio-button">
                        <input
                          type="radio"
                          name="surgicalProcedures"
                          value="No"
                          checked={surgicalProcedures === 'No'}
                          onChange={(e) => setSurgicalProcedures(e.target.value)}
                        />
                        <span>No</span>
                      </label>
                    </div>
                  </div>

                  {surgicalProcedures === 'Yes' && (
                    <div className="form-row-2">
                      <div className="form-field">
                        <label>Procedure/Type</label>
                        <input
                          type="text"
                          placeholder="Procedure"
                          value={procedureType}
                          onChange={(e) => setProcedureType(e.target.value)}
                        />
                      </div>
                      <div className="form-field">
                        <label>Year</label>
                        <input
                          type="text"
                          placeholder="Year"
                          value={procedureYear}
                          onChange={(e) => setProcedureYear(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="form-header">
                  <h2>Current Medications & Allergies</h2>
                  <p></p>
                </div>

                <div className="form-section">
                  <div className="form-field">
                    <label>Current Medications</label>
                    <textarea
                      placeholder="List any medications you are currently taking"
                      value={currentMedications}
                      onChange={(e) => setCurrentMedications(e.target.value)}
                      rows="5"
                    />
                  </div>

                  <div className="form-field">
                    <label>Allergies</label>
                    <textarea
                      placeholder="List any drug, food, or other allergies"
                      value={allergies}
                      onChange={(e) => setAllergies(e.target.value)}
                      rows="5"
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <div className="form-header">
                  <h2>Family Medical History</h2>
                  <p></p>
                </div>

                <div className="form-section">
                  <div className="checkbox-grid-family">
                    <label className="checkbox-label-family">
                      <input
                        type="checkbox"
                        checked={familyHistory.hypertension}
                        onChange={() => handleFamilyHistoryChange('hypertension')}
                      />
                      <span>Hypertension</span>
                    </label>
                    <label className="checkbox-label-family">
                      <input
                        type="checkbox"
                        checked={familyHistory.diabetes}
                        onChange={() => handleFamilyHistoryChange('diabetes')}
                      />
                      <span>Diabetes</span>
                    </label>
                    <label className="checkbox-label-family">
                      <input
                        type="checkbox"
                        checked={familyHistory.heartDisease}
                        onChange={() => handleFamilyHistoryChange('heartDisease')}
                      />
                      <span>Heart Disease</span>
                    </label>
                    <label className="checkbox-label-family">
                      <input
                        type="checkbox"
                        checked={familyHistory.stroke}
                        onChange={() => handleFamilyHistoryChange('stroke')}
                      />
                      <span>Stroke</span>
                    </label>
                    <label className="checkbox-label-family">
                      <input
                        type="checkbox"
                        checked={familyHistory.cancer}
                        onChange={() => handleFamilyHistoryChange('cancer')}
                      />
                      <span>Cancer</span>
                    </label>
                    <label className="checkbox-label-family">
                      <input
                        type="checkbox"
                        checked={familyHistory.asthma}
                        onChange={() => handleFamilyHistoryChange('asthma')}
                      />
                      <span>Asthma</span>
                    </label>
                    <label className="checkbox-label-family">
                      <input
                        type="checkbox"
                        checked={familyHistory.kidneyDisease}
                        onChange={() => handleFamilyHistoryChange('kidneyDisease')}
                      />
                      <span>Kidney Disease</span>
                    </label>
                    <label className="checkbox-label-family">
                      <input
                        type="checkbox"
                        checked={familyHistory.thyroidDisorders}
                        onChange={() => handleFamilyHistoryChange('thyroidDisorders')}
                      />
                      <span>Thyroid Disorders</span>
                    </label>
                    <label className="checkbox-label-family">
                      <input
                        type="checkbox"
                        checked={familyHistory.highCholesterol}
                        onChange={() => handleFamilyHistoryChange('highCholesterol')}
                      />
                      <span>High Cholesterol</span>
                    </label>
                    <label className="checkbox-label-family">
                      <input
                        type="checkbox"
                        checked={familyHistory.tuberculosis}
                        onChange={() => handleFamilyHistoryChange('tuberculosis')}
                      />
                      <span>Tuberculosis</span>
                    </label>
                  </div>

                  <div className="form-field" style={{ marginTop: '2rem' }}>
                    <label>Others</label>
                    <input
                      type="text"
                      placeholder="Please specify any other family medical history"
                      value={familyHistoryOthers}
                      onChange={(e) => setFamilyHistoryOthers(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-navigation">
              {currentStep > 1 && (
                <button className="btn-previous" onClick={handlePrevious}>
                  ← Previous
                </button>
              )}
              <button 
                className="btn-next" 
                onClick={handleNext}
                disabled={!isCurrentStepValid()}
              >
                {currentStep < 5 ? 'Next →' : 'Submit →'}
              </button>
            </div>
          </div>
        </div>
        {showAlert && (
          <div className="alert-container">
            <div className="alert-box alert-success">
              <div className="alert-icon">✓</div>
              <div className="alert-text">Form submitted successfully!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IntakeForm;
