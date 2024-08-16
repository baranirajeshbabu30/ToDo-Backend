const mongoose = require('mongoose');
const Task = require('../../models/Task'); 
const User = require('../../models/User');  

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

exports.handler = async function (event, context) {
  switch (event.httpMethod) {
    case 'POST':
      return await createTask(event);
    case 'GET':
      return await getTasks(event);
    case 'PUT':
      return await updateTask(event);
    case 'DELETE':
      return await deleteTask(event);
    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
  }
};

const createTask = async (event) => {
  const { title, description, category, progress, userId, duedate } = JSON.parse(event.body);

  if (!title || !description || !category || !progress || !userId || !duedate) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'All fields are required' }),
    };
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    const task = new Task({ title, description, userId, category, progress, duedate });
    await task.save();
    return {
      statusCode: 201,
      body: JSON.stringify(task),
    };
  } catch (error) {
    console.error('Error saving task:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

const getTasks = async (event) => {
  const { userId } = event.queryStringParameters;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'User ID is required' }),
    };
  }

  try {
    const tasks = await Task.find({ userId });
    return {
      statusCode: 200,
      body: JSON.stringify(tasks),
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

const updateTask = async (event) => {
  const { id } = event.queryStringParameters;
  const { title, description, progress, category } = JSON.parse(event.body);

  try {
    const task = await Task.findById(id);

    if (!task) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Task not found' }),
      };
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.progress = progress || task.progress;
    task.category = category || task.category;

    await task.save();
    return {
      statusCode: 200,
      body: JSON.stringify(task),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

const deleteTask = async (event) => {
  const { id } = event.queryStringParameters;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid ID format' }),
    };
  }

  try {
    const result = await Task.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Task not found' }),
      };
    }

    return {
      statusCode: 204,
      body: null,
    };
  } catch (error) {
    console.error('Error deleting task:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

