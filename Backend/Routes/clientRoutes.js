const express = require('express');
const router = express.Router();
const addNewClientController = require('../Controllers/addnewClientController');

// Clean, dedicated client routes
router.post('/add-client', addNewClientController.addClient);
router.get('/get-all-clients', addNewClientController.getAllClients);
router.delete('/delete-client/:id', addNewClientController.deleteClient);

module.exports = router;