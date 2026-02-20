/**
 * Patient Dashboard Route Example
 * 
 * Demonstrates how to integrate data from multiple databases
 * to create a complete patient dashboard view.
 * 
 * @module routes/patientDashboard
 */

import express from 'express';
import { getOwnDatabase, getReadOnlyDatabases } from '../database/mongodb.js';
import { getPatientModel } from '../models/patient.model.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * GET /api/patient-dashboard/:patientId
 * 
 * Get complete patient dashboard with data from all systems:
 * - Patient info from PARMS (your database)
 * - Billing info from IBMS (read-only)
 * - Doctor info from HRMS (read-only)
 */
router.get('/:patientId', authenticateJWT, async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    // 1. Get patient information from PARMS (your database)
    const Patient = await getPatientModel();
    const patient = await Patient.findById(patientId).lean();
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    // 2. Get appointments from PARMS
    const parmsDb = getOwnDatabase();
    const appointmentsCollection = parmsDb.collection('appointments');
    
    const upcomingAppointments = await appointmentsCollection
      .find({
        patientId: patientId,
        date: { $gte: new Date() },
        status: { $nin: ['cancelled', 'completed'] }
      })
      .sort({ date: 1 })
      .limit(5)
      .toArray();
    
    // 3. Get billing information from IBMS (read-only)
    const { ibms, hrms } = getReadOnlyDatabases();
    
    const billingCollection = ibms.collection('billings');
    const billingData = await billingCollection
      .find({ patientId: patientId })
      .sort({ date: -1 })
      .limit(10)
      .toArray();
    
    const totalOutstanding = billingData.reduce((sum, bill) => {
      return sum + (bill.amountDue || 0);
    }, 0);
    
    // 4. Get doctor information from HRMS (read-only)
    const doctorIds = [...new Set(upcomingAppointments.map(apt => apt.doctorId))];
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
        id: doc._id,
        name: `${doc.firstName} ${doc.lastName}`,
        specialty: doc.specialty,
        phone: doc.contactInfo?.phone
      };
    });
    
    // 5. Combine all data into dashboard response
    const dashboardData = {
      patient: {
        id: patient._id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.contactInfo?.email,
        phone: patient.contactInfo?.phone,
        dateOfBirth: patient.dateOfBirth
      },
      appointments: {
        upcoming: upcomingAppointments.map(apt => ({
          id: apt._id,
          date: apt.date,
          time: apt.time,
          type: apt.type,
          status: apt.status,
          doctor: doctorMap[apt.doctorId?.toString()] || null
        })),
        total: upcomingAppointments.length
      },
      billing: {
        recentBills: billingData.slice(0, 5).map(bill => ({
          id: bill._id,
          date: bill.date,
          amount: bill.amount,
          amountDue: bill.amountDue,
          status: bill.status,
          description: bill.description
        })),
        totalOutstanding,
        hasOutstanding: totalOutstanding > 0
      }
    };
    
    res.json({
      success: true,
      data: dashboardData
    });
    
  } catch (error) {
    console.error('Error fetching patient dashboard:', error);
    next(error);
  }
});

/**
 * GET /api/patient-dashboard/:patientId/billing
 * 
 * Get detailed billing history from IBMS
 */
router.get('/:patientId/billing', authenticateJWT, async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { limit = 20, skip = 0 } = req.query;
    
    // Verify patient exists in PARMS
    const Patient = await getPatientModel();
    const patient = await Patient.findById(patientId);
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found'
      });
    }
    
    // Get billing data from IBMS (read-only)
    const { ibms } = getReadOnlyDatabases();
    const billingCollection = ibms.collection('billings');
    
    const [bills, total] = await Promise.all([
      billingCollection
        .find({ patientId: patientId })
        .sort({ date: -1 })
        .skip(parseInt(skip))
        .limit(parseInt(limit))
        .toArray(),
      billingCollection.countDocuments({ patientId: patientId })
    ]);
    
    res.json({
      success: true,
      data: {
        bills,
        pagination: {
          total,
          limit: parseInt(limit),
          skip: parseInt(skip),
          hasMore: (parseInt(skip) + bills.length) < total
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching billing data:', error);
    next(error);
  }
});

/**
 * GET /api/patient-dashboard/doctors
 * 
 * Search available doctors from HRMS
 */
router.get('/doctors/search', authenticateJWT, async (req, res, next) => {
  try {
    const { specialty, name, department } = req.query;
    
    // Build search query
    const query = { role: 'doctor', status: 'active' };
    
    if (specialty) {
      query.specialty = new RegExp(specialty, 'i');
    }
    
    if (name) {
      query.$or = [
        { firstName: new RegExp(name, 'i') },
        { lastName: new RegExp(name, 'i') }
      ];
    }
    
    if (department) {
      query.department = department;
    }
    
    // Query HRMS database (read-only)
    const { hrms } = getReadOnlyDatabases();
    const staffCollection = hrms.collection('staff');
    
    const doctors = await staffCollection
      .find(query)
      .sort({ lastName: 1, firstName: 1 })
      .limit(50)
      .toArray();
    
    res.json({
      success: true,
      data: doctors.map(doc => ({
        id: doc._id,
        name: `${doc.firstName} ${doc.lastName}`,
        specialty: doc.specialty,
        department: doc.department,
        experience: doc.yearsOfExperience,
        availability: doc.availability || []
      }))
    });
    
  } catch (error) {
    console.error('Error searching doctors:', error);
    next(error);
  }
});

export default router;
