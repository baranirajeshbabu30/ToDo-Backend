const { v4: uuidv4 } = require('uuid');
const User = require('../../models/User');


exports.handler = async function(event, context) {
  if (event.httpMethod === 'POST') {
    const { username, password, useremail } = JSON.parse(event.body);

    if (!username || !password || !useremail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    try {
      const existingUser = await User.findOne({ useremail });
      if (existingUser) {
        return {
          statusCode: 400,
          body: JSON.stringify({ msg: 'User already exists' }),
        };
      }

      const userId = uuidv4();
      const user = new User({
        userId,
        username,
        password,
        useremail,
      });

      await user.save();
      return {
        statusCode: 201,
        body: JSON.stringify({ message: 'User created successfully' }),
      };
    } catch (error) {
      console.error('Signup error:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Error creating user' }),
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method Not Allowed' }),
  };
};
