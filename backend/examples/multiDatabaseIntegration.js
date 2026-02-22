/**
 * Multi-Database Integration Example
 * 
 * This file demonstrates how to integrate data from the three systems:
 * - PARMS (Full Read/Write Access)
 * - IBMS (Read-Only Access)
 * - HRMS (Read-Only Access)
 * 
 * @module examples/multiDatabaseIntegration
 */

import { getOwnDatabase, getReadOnlyDatabases } from '../database/mongodb.js';
import { getUserModel } from '../models/user.model.js';
import { getPatientModel } from '../models/patient.model.js';

/**
 * Example: Get patient data with billing information from IBMS
 * 
 * @param {string} patientId - Patient ID
 * @returns {Promise<Object>} Combined patient and billing data
 */
export async function getPatientWithBilling(patientId) {
  try {
    // Get patient from PARMS database (your own database)
    const Patient = await getPatientModel();
    const patient = await Patient.findById(patientId).lean();
    
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    // Get billing information from IBMS database (read-only)
    const { ibms } = getReadOnlyDatabases();
    const billingCollection = ibms.collection('billings');
    
    const billingRecords = await billingCollection
      .find({ patientId: patientId })
      .sort({ date: -1 })
      .limit(10)
      .toArray();
    
    // Combine data
    return {
      patient,
      billing: {
        records: billingRecords,
        totalOutstanding: billingRecords.reduce((sum, record) => {
          return sum + (record.outstanding || 0);
        }, 0)
      }
    };
  } catch (error) {
    console.error('Error fetching patient with billing:', error);
    throw error;
  }
}

/**
 * Example: Get appointment with doctor info from HRMS
 * 
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Combined appointment and doctor data
 */
export async function getAppointmentWithDoctorInfo(appointmentId) {
  try {
    // Get appointment from PARMS database (your own database)
    const parmsDb = getOwnDatabase();
    const appointmentsCollection = parmsDb.collection('appointments');
    
    const appointment = await appointmentsCollection.findOne({ 
      _id: appointmentId 
    });
    
    if (!appointment) {
      throw new Error('Appointment not found');
    }
    
    // Get doctor information from HRMS database (read-only)
    const { hrms } = getReadOnlyDatabases();
    const staffCollection = hrms.collection('staff');
    
    const doctorInfo = await staffCollection.findOne({
      _id: appointment.doctorId,
      role: 'doctor'
    });
    
    // Combine data
    return {
      appointment,
      doctor: doctorInfo ? {
        id: doctorInfo._id,
        name: `${doctorInfo.firstName} ${doctorInfo.lastName}`,
        specialty: doctorInfo.specialty,
        department: doctorInfo.department,
        contact: doctorInfo.contactInfo
      } : null
    };
  } catch (error) {
    console.error('Error fetching appointment with doctor info:', error);
    throw error;
  }
}

/**
 * Example: Get patient dashboard data from all systems
 * 
 * @param {string} patientId - Patient ID
 * @returns {Promise<Object>} Complete patient dashboard data
 */
export async function getPatientDashboard(patientId) {
  try {
    // Get patient from PARMS database
    const Patient = await getPatientModel();
    const patient = await Patient.findById(patientId).lean();
    
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    // Get upcoming appointments from PARMS
    const parmsDb = getOwnDatabase();
    const appointmentsCollection = parmsDb.collection('appointments');
    const upcomingAppointments = await appointmentsCollection
      .find({ 
        patientId: patientId,
        date: { $gte: new Date() }
      })
      .sort({ date: 1 })
      .limit(5)
      .toArray();
    
    // Get billing data from IBMS (read-only)
    const { ibms, hrms } = getReadOnlyDatabases();
    const billingCollection = ibms.collection('billings');
    const recentBills = await billingCollection
      .find({ patientId: patientId })
      .sort({ date: -1 })
      .limit(5)
      .toArray();
    
    // Get doctor information from HRMS (read-only)
    const doctorIds = [...new Set(upcomingAppointments.map(a => a.doctorId))];
    const staffCollection = hrms.collection('staff');
    const doctors = await staffCollection
      .find({ 
        _id: { $in: doctorIds },
        role: 'doctor'
      })
      .toArray();
    
    // Create doctor lookup map
    const doctorMap = {};
    doctors.forEach(doc => {
      doctorMap[doc._id.toString()] = {
        name: `${doc.firstName} ${doc.lastName}`,
        specialty: doc.specialty
      };
    });
    
    // Combine all data
    return {
      patient: {
        id: patient._id,
        name: `${patient.firstName} ${patient.lastName}`,
        email: patient.contactInfo?.email,
        phone: patient.contactInfo?.phone
      },
      upcomingAppointments: upcomingAppointments.map(apt => ({
        id: apt._id,
        date: apt.date,
        time: apt.time,
        doctor: doctorMap[apt.doctorId.toString()] || { name: 'Unknown' },
        status: apt.status
      })),
      billing: {
        recentBills,
        totalOutstanding: recentBills.reduce((sum, bill) => {
          return sum + (bill.outstanding || 0);
        }, 0)
      }
    };
  } catch (error) {
    console.error('Error creating patient dashboard:', error);
    throw error;
  }
}

/**
 * Example: Search doctors by specialty from HRMS (Read-Only)
 * 
 * @param {string} specialty - Medical specialty to search for
 * @returns {Promise<Array>} List of doctors
 */
export async function searchDoctorsBySpecialty(specialty) {
  try {
    const { hrms } = getReadOnlyDatabases();
    const staffCollection = hrms.collection('staff');
    
    const doctors = await staffCollection
      .find({
        role: 'doctor',
        specialty: new RegExp(specialty, 'i'),
        status: 'active'
      })
      .sort({ lastName: 1 })
      .toArray();
    
    return doctors.map(doc => ({
      id: doc._id,
      name: `${doc.firstName} ${doc.lastName}`,
      specialty: doc.specialty,
      department: doc.department,
      available: doc.availability || []
    }));
  } catch (error) {
    console.error('Error searching doctors:', error);
    throw error;
  }
}

/**
 * Example: Get inventory availability for medical supplies from IBMS (Read-Only)
 * 
 * @param {string} itemName - Item name to search
 * @returns {Promise<Array>} Available inventory items
 */
export async function checkMedicalSupplyAvailability(itemName) {
  try {
    const { ibms } = getReadOnlyDatabases();
    const inventoryCollection = ibms.collection('inventory');
    
    const items = await inventoryCollection
      .find({
        itemName: new RegExp(itemName, 'i'),
        quantity: { $gt: 0 }
      })
      .toArray();
    
    return items.map(item => ({
      id: item._id,
      name: item.itemName,
      quantity: item.quantity,
      unit: item.unit,
      location: item.location
    }));
  } catch (error) {
    console.error('Error checking inventory:', error);
    throw error;
  }
}

export default {
  getPatientWithBilling,
  getAppointmentWithDoctorInfo,
  getPatientDashboard,
  searchDoctorsBySpecialty,
  checkMedicalSupplyAvailability
};
