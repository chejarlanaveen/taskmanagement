// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');

// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // MongoDB connection
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected');
//   } catch (err) {
//     console.error('Error connecting to MongoDB:', err);
//     process.exit(1);
//   }
// };

// connectDB();

// // Task schema and model
// const taskSchema = new mongoose.Schema({
//   username: { type: String, required: true },
//   task_name: { type: String, required: true },
//   created_at: { type: String, required: true }, // Store date as a string in dd-mm-yy format
//   isDone: { type: Boolean, default: false },
// });

// const Task = mongoose.model('Task', taskSchema);

// // Endpoint to handle task creation
// app.post('/create-task', async (req, res) => {
//   const { username, task_name, created_at } = req.body;

//   if (!username || !task_name || !created_at) {
//     return res.status(400).json({ message: 'All fields are required.' });
//   }

//   try {
//     const dateParts = created_at.split('-');
//     if (dateParts.length !== 3 || dateParts[0].length !== 2 || dateParts[1].length !== 2 || dateParts[2].length !== 2) {
//       return res.status(400).json({ message: 'Invalid date format. Expected format: dd-mm-yy.' });
//     }

//     const newTask = new Task({ username, task_name, created_at });
//     const savedTask = await newTask.save();

//     return res.status(201).json({ message: 'Task created successfully', task: savedTask });
//   } catch (err) {
//     console.error('Error creating task:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// // Endpoint to fetch completed tasks
// app.get('/completed-tasks', async (req, res) => {
//   const { username } = req.query;

//   if (!username) {
//     return res.status(400).json({ message: 'Username is required.' });
//   }

//   try {
//     const tasks = await Task.find({ username, isDone: true });
//     return res.status(200).json({ tasks });
//   } catch (err) {
//     console.error('Error fetching completed tasks:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// // Endpoint to fetch pending tasks
// app.get('/pending-tasks', async (req, res) => {
//   const { username } = req.query;

//   if (!username) {
//     return res.status(400).json({ message: 'Username is required.' });
//   }

//   try {
//     const tasks = await Task.find({ username, isDone: false });
//     return res.status(200).json({ tasks });
//   } catch (err) {
//     console.error('Error fetching pending tasks:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// // Endpoint to fetch tasks with filters
// app.get('/tasks', async (req, res) => {
//   const { username, created_at, isDone } = req.query;

//   if (!username) {
//     return res.status(400).json({ message: 'Username is required.' });
//   }

//   try {
//     const filter = { username };

//     if (created_at) {
//       const dateParts = created_at.split('-');
//       if (dateParts.length !== 3 || dateParts[0].length !== 2 || dateParts[1].length !== 2 || dateParts[2].length !== 2) {
//         return res.status(400).json({ message: 'Invalid date format. Expected format: dd-mm-yy.' });
//       }
//       filter.created_at = created_at;
//     }

//     if (isDone !== undefined) {
//       filter.isDone = JSON.parse(isDone);
//     }

//     const tasks = await Task.find(filter);
//     return res.status(200).json({ tasks });
//   } catch (err) {
//     console.error('Error fetching tasks:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// // Endpoint to toggle a task's isDone status
// app.put('/toggle-task-status/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const task = await Task.findById(id);

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found.' });
//     }

//     task.isDone = !task.isDone;
//     const updatedTask = await task.save();

//     return res.status(200).json({ message: 'Task status updated successfully', task: updatedTask });
//   } catch (err) {
//     console.error('Error toggling task status:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// // Endpoint to update a task
// app.put('/update-task/:id', async (req, res) => {
//   const { id } = req.params;
//   const { task_name, created_at } = req.body;

//   if (!task_name || !created_at) {
//     return res.status(400).json({ message: 'Task name and created_at date are required.' });
//   }

//   try {
//     const dateParts = created_at.split('-');
//     if (dateParts.length !== 3 || dateParts[0].length !== 2 || dateParts[1].length !== 2 || dateParts[2].length !== 2) {
//       return res.status(400).json({ message: 'Invalid date format. Expected format: dd-mm-yy.' });
//     }

//     const updatedTask = await Task.findByIdAndUpdate(
//       id,
//       { task_name, created_at },
//       { new: true }
//     );

//     if (!updatedTask) {
//       return res.status(404).json({ message: 'Task not found.' });
//     }

//     return res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
//   } catch (err) {
//     console.error('Error updating task:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// // Endpoint to delete multiple tasks
// app.post('/delete-tasks', async (req, res) => {
//   const { ids } = req.body;

//   if (!Array.isArray(ids) || ids.length === 0) {
//     return res.status(400).json({ message: 'Task IDs are required for deletion.' });
//   }

//   try {
//     const result = await Task.deleteMany({ _id: { $in: ids } });
//     return res.status(200).json({
//       message: 'Tasks deleted successfully',
//       deletedCount: result.deletedCount,
//     });
//   } catch (err) {
//     console.error('Error deleting tasks:', err);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });

// // Start server
// const PORT = 5007;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

connectDB();

// Task schema and model
const taskSchema = new mongoose.Schema({
  username: { type: String, required: true },
  task_name: { type: String, required: true },
  created_at: { type: String, required: true }, // Store date as a string in dd-mm-yy format
  isDone: { type: Boolean, default: false },
});

const Task = mongoose.model('Task', taskSchema);

// Endpoint to handle task creation
app.post('/create-task', async (req, res) => {
  const { username, task_name, created_at } = req.body;

  if (!username || !task_name || !created_at) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const dateParts = created_at.split('-');
    if (dateParts.length !== 3 || dateParts[0].length !== 2 || dateParts[1].length !== 2 || dateParts[2].length !== 2) {
      return res.status(400).json({ message: 'Invalid date format. Expected format: dd-mm-yy.' });
    }

    const newTask = new Task({ username, task_name, created_at });
    const savedTask = await newTask.save();

    return res.status(201).json({ message: 'Task created successfully', task: savedTask });
  } catch (err) {
    console.error('Error creating task:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to fetch completed tasks
app.get('/completed-tasks', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const tasks = await Task.find({ username, isDone: true });
    return res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching completed tasks:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to fetch pending tasks
app.get('/pending-tasks', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const tasks = await Task.find({ username, isDone: false });
    return res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching pending tasks:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to fetch tasks with filters
app.get('/tasks', async (req, res) => {
  const { username, created_at, isDone } = req.query;

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const filter = { username };

    if (created_at) {
      const dateParts = created_at.split('-');
      if (dateParts.length !== 3 || dateParts[0].length !== 2 || dateParts[1].length !== 2 || dateParts[2].length !== 2) {
        return res.status(400).json({ message: 'Invalid date format. Expected format: dd-mm-yy.' });
      }
      filter.created_at = created_at;
    }

    if (isDone !== undefined) {
      filter.isDone = JSON.parse(isDone);
    }

    const tasks = await Task.find(filter);
    return res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to toggle a task's isDone status
app.put('/toggle-task-status/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    task.isDone = !task.isDone;
    const updatedTask = await task.save();

    return res.status(200).json({ message: 'Task status updated successfully', task: updatedTask });
  } catch (err) {
    console.error('Error toggling task status:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to update a task
app.put('/update-task/:id', async (req, res) => {
  const { id } = req.params;
  const { task_name, created_at } = req.body;

  if (!task_name || !created_at) {
    return res.status(400).json({ message: 'Task name and created_at date are required.' });
  }

  try {
    const dateParts = created_at.split('-');
    if (dateParts.length !== 3 || dateParts[0].length !== 2 || dateParts[1].length !== 2 || dateParts[2].length !== 2) {
      return res.status(400).json({ message: 'Invalid date format. Expected format: dd-mm-yy.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { task_name, created_at },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (err) {
    console.error('Error updating task:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to delete multiple tasks
app.post('/delete-tasks', async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Task IDs are required for deletion.' });
  }

  try {
    const result = await Task.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({
      message: 'Tasks deleted successfully',
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error('Error deleting tasks:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Development vs Production Environment
if (process.env.NODE_ENV === 'development') {
  const PORT = process.env.PORT2 || 5007;
  app.listen(PORT, () => {
    console.log(`Server running locally at http://localhost:${PORT}`);
  });
} else {
  // For production (e.g., Vercel), export the app
  module.exports = app;
}