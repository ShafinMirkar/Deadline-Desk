const express = require('express')
const {getAllUsers, registerUser, getUserById, updateUser, deleteUser, loginUser } = require('../controllers/userController')
const Validate = require('../middlewares/validateLogin')
const router = express.Router()
const app = express()
router.route('/').post(registerUser)
router.route('/login').get(loginUser)

app.use(Validate)

router.route('/').get(getAllUsers)
router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser)

module.exports = router