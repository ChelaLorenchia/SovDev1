const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  if (req.session.role !== 'admin') return res.send('Unauthorized');
  res.sendFile('public/Admin Home.html');
});

module.exports = router;
