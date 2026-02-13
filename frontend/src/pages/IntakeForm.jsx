import { useState, useEffect } from 'react';
import { saveToStorage, getFromStorage } from '../utils/storage';
import '../styles/IntakeForm.css';

function IntakeForm({ onClose }) {
  // Patient Information
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
  const [country, setCountry] = useState('');
  const [zipCode, setZipCode] = useState('');

  // Reason for Consultation
  const [mainReason, setMainReason] = useState('');
  const [duration, setDuration] = useState('');

  // Medical History
  const [hospitalized, setHospitalized] = useState('');
  const [surgicalProcedures, setSurgicalProcedures] = useState('');
  const [admissionReason, setAdmissionReason] = useState('');
  const [admissionYear, setAdmissionYear] = useState('');
  const [procedureType, setProcedureType] = useState('');
  const [procedureYear, setProcedureYear] = useState('');

  // Medications / Allergies
  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('');

  // Family History
  const [familyHistory, setFamilyHistory] = useState({
    hypertension: false,
    asthma: false,
    diabetes: false,
    kidneyDisease: false,
    heartDisease: false,
    thyroidDisorders: false,
    stroke: false,
    highCholesterol: false,
    cancer: false,
    tuberculosis: false,
  });
  const [familyHistoryOthers, setFamilyHistoryOthers] = useState('');

  // load data from localStorage pag nag-load yung component
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
      setCountry(savedData.country || '');
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

  // to update family history checkbox
  const handleFamilyHistoryChange = (condition) => {
    setFamilyHistory((prev) => ({
      ...prev,
      [condition]: !prev[condition],
    }));
  };

  // save all the data
  const handleSave = (e) => {
    e.preventDefault();

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

    // save to localStorage
    saveToStorage('intakeFormData', formData);
    alert('Form saved successfully!');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      onClose();
    }
  };

  return (
    <div className="intake-form-overlay">
      <div className="intake-form-container">
        <div className="intake-form-header">
          <h2>Digital Intake Form Page</h2>
          <button className="close-btn" onClick={handleCancel}>
            ✕
          </button>
        </div>

        <p className="form-section-title">Patient Information</p>

        <form onSubmit={handleSave}>
          <div className="form-row">
            <div className="form-group">
              <label>
                Last Name<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>
                First Name<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Suffix</label>
              <input
                type="text"
                placeholder="Enter Suffix Name"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Date of Birth<span className="required">*</span>
              </label>
              <input
                type="date"
                placeholder="MM/DD/YY"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Age<span className="required">*</span>
              </label>
              <input
                type="number"
                placeholder="Enter Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Email Address<span className="required">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Mobile Number<span className="required">*</span>
              </label>
              <div className="phone-input">
                <span className="country-code">🇵🇭 +63</span>
                <input
                  type="tel"
                  placeholder="Enter Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>
                Gender<span className="required">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Enter Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Street Address<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Street Address"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Barangay<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Barangay"
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>
                City<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Province<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>
                Country<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                placeholder="Enter Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </div>

          <div className="section-header">Reason for Consultation</div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>
                Main reason of visit<span className="required">*</span>
              </label>
              <textarea
                placeholder="Enter reason"
                value={mainReason}
                onChange={(e) => setMainReason(e.target.value)}
                rows="4"
                required
              />
            </div>
            <div className="form-group">
              <label>
                Duration<span className="required">*</span>
              </label>
              <textarea
                placeholder="Enter Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                rows="4"
                required
              />
            </div>
          </div>

          <div className="section-header">Medical History</div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Got hospitalized before?<span className="required">*</span>
              </label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="hospitalized"
                    value="Yes"
                    checked={hospitalized === 'Yes'}
                    onChange={(e) => setHospitalized(e.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="hospitalized"
                    value="No"
                    checked={hospitalized === 'No'}
                    onChange={(e) => setHospitalized(e.target.value)}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Reason for admission</label>
              <input
                type="text"
                placeholder="Enter Reason"
                value={admissionReason}
                onChange={(e) => setAdmissionReason(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input
                type="text"
                placeholder="Enter Year"
                value={admissionYear}
                onChange={(e) => setAdmissionYear(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                Have you undergone any surgical procedures?
                <span className="required">*</span>
              </label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="surgicalProcedures"
                    value="Yes"
                    checked={surgicalProcedures === 'Yes'}
                    onChange={(e) => setSurgicalProcedures(e.target.value)}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="surgicalProcedures"
                    value="No"
                    checked={surgicalProcedures === 'No'}
                    onChange={(e) => setSurgicalProcedures(e.target.value)}
                  />
                  No
                </label>
              </div>
            </div>
            <div className="form-group">
              <label>Procedure/Type</label>
              <input
                type="text"
                placeholder="Enter Procedure"
                value={procedureType}
                onChange={(e) => setProcedureType(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Year</label>
              <input
                type="text"
                placeholder="Enter Year"
                value={procedureYear}
                onChange={(e) => setProcedureYear(e.target.value)}
              />
            </div>
          </div>

          <div className="section-header">Medications / Allergies</div>

          <div className="form-row">
            <div className="form-group">
              <label>Current Medications</label>
              <textarea
                placeholder="Enter Medicine"
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Allergies</label>
              <textarea
                placeholder="Enter Allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                rows="3"
              />
            </div>
          </div>

          <div className="section-header">Family History</div>

          <div className="family-history-section">
            <p className="family-history-label">Check all that applies</p>

            <div className="checkbox-grid">
              <div className="checkbox-column">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={familyHistory.hypertension}
                    onChange={() => handleFamilyHistoryChange('hypertension')}
                  />
                  Hypertension
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={familyHistory.diabetes}
                    onChange={() => handleFamilyHistoryChange('diabetes')}
                  />
                  Diabetes
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={familyHistory.heartDisease}
                    onChange={() => handleFamilyHistoryChange('heartDisease')}
                  />
                  Heart Disease
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={familyHistory.stroke}
                    onChange={() => handleFamilyHistoryChange('stroke')}
                  />
                  Stroke
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={familyHistory.cancer}
                    onChange={() => handleFamilyHistoryChange('cancer')}
                  />
                  Cancer
                </label>
              </div>

              <div className="checkbox-column">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={familyHistory.asthma}
                    onChange={() => handleFamilyHistoryChange('asthma')}
                  />
                  Asthma
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={familyHistory.kidneyDisease}
                    onChange={() => handleFamilyHistoryChange('kidneyDisease')}
                  />
                  Kidney Disease
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={familyHistory.thyroidDisorders}
                    onChange={() =>
                      handleFamilyHistoryChange('thyroidDisorders')
                    }
                  />
                  Thyroid Disorders
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={familyHistory.highCholesterol}
                    onChange={() =>
                      handleFamilyHistoryChange('highCholesterol')
                    }
                  />
                  High Cholesterol
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={familyHistory.tuberculosis}
                    onChange={() => handleFamilyHistoryChange('tuberculosis')}
                  />
                  Tuberculosis
                </label>
              </div>

              <div className="form-group full-width">
                <label>Others</label>
                <input
                  type="text"
                  placeholder="Please Specify"
                  value={familyHistoryOthers}
                  onChange={(e) => setFamilyHistoryOthers(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IntakeForm;
