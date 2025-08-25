const express = require('express')
const { getContacts, postContact, getContactById, updateContact, deleteContact } = require('../controllers/contactController')
const Validate = require('../middlewares/validateLogin')
const router = express.Router()
const app = express()

app.use(Validate)
router.route('/')
    .get(getContacts)
    .post(postContact)
    
router.route('/:id')
    .get(getContactById)
    .put(updateContact)
    .delete(deleteContact)

module.exports = router