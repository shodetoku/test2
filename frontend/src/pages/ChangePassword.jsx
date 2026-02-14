import { useState, useEffect } from 'react';

// --- SVG ICONS ---
// (No external library needed, these are guaranteed to be perfectly centered!)
const EyeIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const XIcon = () => (
  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


function ChangePassword({ onNavigate }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [rememberMe, setRememberMe] = useState(false);
  
  // Visibility States
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password Strength State
  const [strength, setStrength] = useState(0); 
  
  // Modal State
  const [modal, setModal] = useState({ show: false, type: '', message: '' });

  // Password Strength Logic
  useEffect(() => {
    let score = 0;
    if (newPassword.length > 5) score += 1; 
    if (newPassword.length > 9) score += 1; 
    if (/[A-Z]/.test(newPassword)) score += 1; 
    if (/[0-9]/.test(newPassword)) score += 1; 
    setStrength(score);
  }, [newPassword]);

  const getStrengthLabel = () => {
    switch (strength) {
      case 0: return '';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setModal({ show: true, type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setModal({ show: true, type: 'error', message: 'Passwords do not match!' });
      return;
    }

    if (strength < 2) {
        setModal({ show: true, type: 'error', message: 'Password is too weak.' });
        return;
    }

    setModal({ show: true, type: 'success', message: 'Password changed successfully!' });
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
  };

  // Standard Tailwind classes for the strength meter
  const strengthStyles = [
    "w-0 bg-transparent",
    "w-1/4 bg-red-500",
    "w-2/4 bg-amber-500",
    "w-3/4 bg-blue-500",
    "w-full bg-emerald-500"
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-gray-100 p-4 md:p-8 box-border font-sans">
      
      {/* --- MODAL --- */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] transition-opacity">
          <div className="bg-white p-8 rounded-xl w-[90%] max-w-[400px] text-center shadow-2xl">
            
            {/* UPDATED MODAL ICON CONTAINER */}
            <div className={`mb-4 inline-flex items-center justify-center w-20 h-20 rounded-full border-2 ${modal.type === 'success' ? 'text-emerald-500 bg-emerald-50 border-emerald-500' : 'text-red-500 bg-red-50 border-red-500'}`}>
              {/* NOW USING PERFECTLY CENTERED SVGs INSTEAD OF TEXT */}
              {modal.type === 'success' ? <CheckIcon /> : <XIcon />}
            </div>

            <h3 className="m-0 mb-2 text-2xl font-bold text-gray-900">{modal.type === 'success' ? 'Success!' : 'Error'}</h3>
            <p className="text-gray-500 mb-6">{modal.message}</p>
            <button onClick={closeModal} className="w-full bg-gray-900 text-white border-none py-3 px-8 rounded-md cursor-pointer font-semibold transition-colors duration-200 hover:bg-emerald-500">Okay</button>
          </div>
        </div>
      )}

      {/* --- CARD CONTAINER --- */}
      <div className="flex flex-col md:flex-row w-full max-w-[1000px] h-auto md:h-[750px] bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Left Panel */}
        <div className="hidden md:flex flex-1 relative bg-emerald-50 p-0 group overflow-hidden">
          <div className="relative w-full h-full">
            <img
              src="https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Doctor with phone"
              className="w-full h-full object-cover block transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 w-full p-10 bg-gradient-to-t from-black/80 to-transparent box-border text-white pointer-events-none">
              <h2 className="text-4xl m-0 mb-2 font-bold">Secure Access</h2> 
              <p className="text-base leading-relaxed opacity-90 m-0">
                Access your medical records, manage appointments, and connect with your doctors securely.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-white overflow-hidden">
          <div className="w-full max-w-[400px]">
            
            <div className="flex items-center justify-center gap-2 font-bold text-2xl text-gray-900 mb-8">
              <div className="flex"><span>🏥</span></div>
              <span>LOGO</span>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 m-0 mb-2">Secure Your Account</h1>
              <p className="text-gray-500 m-0 text-sm">Please create a strong password to protect your medical data.</p>
            </div>

            <form onSubmit={handleChangePassword}>
              
              {/* Old Password */}
              <div className="mb-5">
                <label className="block text-sm text-gray-700 mb-2 font-medium">Old Password</label>
                <div className="relative w-full">
                  <input
                    type={showOld ? "text" : "password"} 
                    placeholder="••••••••"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full py-3 pl-4 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-base box-border outline-none transition-colors duration-200 focus:border-emerald-500 focus:bg-white"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-0 flex items-center hover:text-gray-900"
                    onClick={() => setShowOld(!showOld)}
                  >
                    {showOld ? <EyeIcon/> : <EyeOffIcon/>}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="mb-5">
                <label className="block text-sm text-gray-700 mb-2 font-medium">New Password</label>
                <div className="relative w-full">
                  <input
                    type={showNew ? "text" : "password"} 
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full py-3 pl-4 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-base box-border outline-none transition-colors duration-200 focus:border-emerald-500 focus:bg-white"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-0 flex items-center hover:text-gray-900"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <EyeIcon/> : <EyeOffIcon/>}
                  </button>
                </div>
                {/* Strength Meter */}
                {newPassword && (
                  <div className="mt-2 flex items-center gap-2">
                      <div className="h-1 flex-1 bg-gray-200 rounded-sm overflow-hidden">
                        <div className={`h-full transition-all duration-300 ease-in-out ${strengthStyles[strength]}`}></div>
                      </div>
                      <span className="text-xs text-gray-500 font-semibold w-12 text-right">{getStrengthLabel()}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-5">
                <label className="block text-sm text-gray-700 mb-2 font-medium">Confirm Password</label>
                <div className="relative w-full">
                  <input
                    type={showConfirm ? "text" : "password"} 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full py-3 pl-4 pr-12 border border-gray-300 rounded-lg bg-gray-50 text-base box-border outline-none transition-colors duration-200 focus:border-emerald-500 focus:bg-white"
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-0 flex items-center hover:text-gray-900"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeIcon/> : <EyeOffIcon/>}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex justify-end items-center mb-6 text-sm">
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    onNavigate('forgot-password');
                  }} className="text-emerald-500 font-semibold cursor-pointer hover:text-emerald-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Button */}
              <button type="submit" className="w-full p-4 bg-gray-900 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors duration-200 hover:bg-emerald-500">
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;