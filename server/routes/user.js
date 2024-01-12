const express = require('express')
const{signup, signin} = require('../controllers/user.js')
const router = express.Router();

router.post('/api/signup', signup);
router.post('/api/signin', signin)

module.exports = router;