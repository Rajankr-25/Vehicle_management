const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Customer = require('../models/Customer');
const Branch = require('../models/Branch');
const User = require('../models/User');
const { protect, admin } = require('../middleware/authMiddleware');

// Employees
router.get('/employees', protect, admin, async (req, res) => {
    const employees = await Employee.find({});
    res.json(employees);
});

router.post('/employees', protect, admin, async (req, res) => {
    const { name, email, position, branch, salary } = req.body;
    const employee = new Employee({ name, email, position, branch, salary });
    await employee.save();
    res.status(201).json(employee);
});

// Customers
router.get('/customers', protect, admin, async (req, res) => {
    const customers = await Customer.find({}).populate('user', 'name email');
    res.json(customers);
});

// Branches
router.get('/branches', protect, admin, async (req, res) => {
    const branches = await Branch.find({});
    res.json(branches);
});

router.post('/branches', protect, admin, async (req, res) => {
    const { name, location, contact } = req.body;
    const branch = new Branch({ name, location, contact });
    await branch.save();
    res.status(201).json(branch);
});

router.delete('/employees/:id', protect, admin, async (req, res) => {
    const employee = await Employee.findById(req.params.id);
    if (employee) {
        await employee.deleteOne();
        res.json({ message: 'Employee removed' });
    } else {
        res.status(404).json({ message: 'Employee not found' });
    }
});

router.delete('/branches/:id', protect, admin, async (req, res) => {
    const branch = await Branch.findById(req.params.id);
    if (branch) {
        await branch.deleteOne();
        res.json({ message: 'Branch removed' });
    } else {
        res.status(404).json({ message: 'Branch not found' });
    }
});

module.exports = router;
