const express = require('express')
const{signup, signin, google} = require('../controllers/user.js')
const router = express.Router();

router.post('/api/signup', signup);
router.post('/api/signin', signin);
router.post('/api/auth/google', google)

module.exports = router;