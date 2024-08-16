const express = require('express');
const router = express.Router();
const loginHandler = require('../netlify/functions/Login');
const signupHandler = require('../netlify/functions/Signup');

router.post('/login', async (req, res) => {
  const response = await loginHandler({ body: JSON.stringify(req.body), httpMethod: 'POST' }, {});
  res.status(response.statusCode).json(JSON.parse(response.body));
});

router.post('/signup', async (req, res) => {
    const response = await signupHandler({ body: JSON.stringify(req.body), httpMethod: 'POST' }, {});
    res.status(response.statusCode).json(JSON.parse(response.body));
  });

module.exports = router;
