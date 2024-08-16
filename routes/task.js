const express = require('express');
const router = express.Router();
const todoHandler = require('../netlify/functions/todo');

router.post('/todo', async (req, res) => {
  const response = await todoHandler({ body: JSON.stringify(req.body), httpMethod: 'POST' }, {});
  res.status(response.statusCode).json(JSON.parse(response.body));
});
module.exports = router;