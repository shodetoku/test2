export const mockUsers = [
  {
    id: '1',
    email: 'patient@example.com',
    password: 'password123',
    firstName: 'Juan',
    lastName: 'Cruz',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    phone: '+639123456789',
    address: '123 Main St, Quezon City',
    emergencyContact: {
      name: 'Maria Cruz',
      relationship: 'Wife',
      phone: '+639987654321'
    }
  }
];

export const mockAppointments = [
  {
    id: '1',
    patientId: '1',
    department: 'Cardiology',
    doctor: 'Dr. Michael Chen',
    date: '2026-02-20',
    time: '10:00 AM',
    status: 'confirmed',
    type: 'Consultation',
    notes: 'Regular checkup'
  },
  {
    id: '2',
    patientId: '1',
    department: 'General Medicine',
    doctor: 'Dr. Sarah Johnson',
    date: '2026-01-15',
    time: '2:00 PM',
    status: 'completed',
    type: 'Follow-up',
    notes: 'Blood pressure monitoring'
  }
];

export const mockLabResults = [
  {
    id: '1',
    patientId: '1',
    testName: 'Complete Blood Count',
    date: '2026-02-10',
    status: 'completed',
    results: {
      'White Blood Cells': '7.5 x10^9/L',
      'Red Blood Cells': '5.2 x10^12/L',
      'Hemoglobin': '14.5 g/dL',
      'Platelets': '250 x10^9/L'
    },
    normalRange: true
  },
  {
    id: '2',
    patientId: '1',
    testName: 'Lipid Panel',
    date: '2026-01-25',
    status: 'completed',
    results: {
      'Total Cholesterol': '185 mg/dL',
      'LDL': '110 mg/dL',
      'HDL': '55 mg/dL',
      'Triglycerides': '100 mg/dL'
    },
    normalRange: true
  }
];

export const mockMedicalRecords = {
  clinicalSummaries: [
    {
      id: '1',
      date: '2026-01-15',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Hypertension Stage 1',
      treatment: 'Lifestyle modifications and medication',
      notes: 'Patient responding well to treatment. Blood pressure under control.'
    },
    {
      id: '2',
      date: '2025-12-10',
      doctor: 'Dr. Michael Chen',
      diagnosis: 'Annual Physical Examination',
      treatment: 'Preventive care',
      notes: 'Overall health good. Continue current exercise routine.'
    }
  ],
  allergies: [
    { id: '1', allergen: 'Penicillin', reaction: 'Skin rash', severity: 'Moderate' },
    { id: '2', allergen: 'Peanuts', reaction: 'Anaphylaxis', severity: 'Severe' }
  ],
  immunizations: [
    { id: '1', vaccine: 'COVID-19 Booster', date: '2025-11-01', nextDue: '2026-11-01' },
    { id: '2', vaccine: 'Influenza', date: '2025-10-15', nextDue: '2026-10-15' },
    { id: '3', vaccine: 'Tetanus', date: '2023-05-20', nextDue: '2033-05-20' }
  ]
};

export const mockPrescriptions = [
  {
    id: '1',
    patientId: '1',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Sarah Johnson',
    prescribedDate: '2026-01-15',
    status: 'active',
    refillsRemaining: 3,
    instructions: 'Take in the morning with or without food'
  },
  {
    id: '2',
    patientId: '1',
    medication: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    prescribedBy: 'Dr. Michael Chen',
    prescribedDate: '2025-12-10',
    status: 'active',
    refillsRemaining: 5,
    instructions: 'Take at bedtime'
  },
  {
    id: '3',
    patientId: '1',
    medication: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Three times daily',
    prescribedBy: 'Dr. Sarah Johnson',
    prescribedDate: '2025-11-20',
    status: 'completed',
    refillsRemaining: 0,
    instructions: 'Complete full course. Taken with meals.'
  }
];

export const mockInvoices = [
  {
    id: '1',
    patientId: '1',
    date: '2026-02-10',
    description: 'Complete Blood Count Test',
    amount: 1500,
    status: 'paid',
    paidDate: '2026-02-11'
  },
  {
    id: '2',
    patientId: '1',
    date: '2026-01-25',
    description: 'Lipid Panel Test',
    amount: 2000,
    status: 'paid',
    paidDate: '2026-01-26'
  },
  {
    id: '3',
    patientId: '1',
    date: '2026-01-15',
    description: 'General Consultation - Dr. Sarah Johnson',
    amount: 1200,
    status: 'unpaid',
    dueDate: '2026-02-15'
  }
];

export const mockDepartments = [
  { id: '1', name: 'General Medicine', icon: '🩺' },
  { id: '2', name: 'Pediatrics', icon: '👶' },
  { id: '3', name: 'Cardiology', icon: '❤️' },
  { id: '4', name: 'Dermatology', icon: '👁️' },
  { id: '5', name: 'Orthopedics', icon: '🦴' },
  { id: '6', name: 'Neurology', icon: '🧠' }
];

export const mockDoctors = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'General Medicine', departmentId: '1' },
  { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiology', departmentId: '3' },
  { id: '3', name: 'Dr. Emily Rodriguez', specialty: 'Pediatrics', departmentId: '2' },
  { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics', departmentId: '5' }
];

export const mockTimeSlots = [
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM'
];

export const mockHealthAlerts = [
  {
    id: '1',
    type: 'reminder',
    title: 'Upcoming Appointment',
    message: 'You have an appointment with Dr. Michael Chen on Feb 20 at 10:00 AM',
    date: '2026-02-20',
    priority: 'high'
  },
  {
    id: '2',
    type: 'alert',
    title: 'Prescription Refill Due',
    message: 'Lisinopril prescription has 3 refills remaining',
    priority: 'medium'
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Annual Checkup',
    message: 'Time for your annual physical examination',
    priority: 'low'
  }
];
