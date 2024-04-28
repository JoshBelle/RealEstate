const express = require('express')
const router = express.Router();
const { auth } = require('../middleware/auth.js');
const { getAll } = require('../controllers/complexes.js');

// /api/complexes
router.get('/', getAll)

// /api/complexes/:id
router.get('/:id', (req, res) => {
    console.log('get by id')
})

// /api/complexes/
router.post('/', auth, (req, res) => {
    console.log('add employee')
})

// /api/complexes/:id/
router.put('/:id', auth, (req, res) => {
    console.log('change by id') 
})

// /api/complexes/:id/
router.delete('/:id', auth, (req, res) => {
    console.log('delete by id')
})

module.exports = { router }