const { v4: uuidv4 } = require('uuid');
const User = require('../../models/User');
const generateToken = require('../../utils/generateToken');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Adjust as needed
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'OPTIONS, POST',
};

exports.handler = async function(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: JSON.stringify({}),
    };
  }

  if (event.httpMethod === 'POST') {
    const { useremail, password } = JSON.parse(event.body);

    if (!useremail || !password) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Email and password are required' }),
      };
    }

    try {
      const user = await User.findOne({ useremail });
      if (!user) {
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'User not found' }),
        };
      }

      if (password !== user.password) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Invalid credentials' }),
        };
      }

      const token = generateToken(user);
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ token, userId: user.userId, useremail }),
      };
    } catch (error) {
      console.error('Login error:', error.message);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Error logging in' }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: corsHeaders,
    body: JSON.stringify({ error: 'Method Not Allowed' }),
  };
};
