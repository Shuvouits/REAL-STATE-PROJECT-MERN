const express = require('express')
const{signup, signin, google, updateUser} = require('../controllers/user.js')
const {authUser} = require('../middleware/auth.js')
const router = express.Router();

router.post('/api/signup', signup);
router.post('/api/signin', signin);
router.post('/api/auth/google', google)

router.post('/api/update/:id', authUser, updateUser);

module.exports = router;