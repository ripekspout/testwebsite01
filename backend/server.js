// const express = require('express');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// const itemRoutes = require('./routes/items');
// app.use('/api/items', itemRoutes);

// // Root route
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Welcome to MySQL Node.js API',
//         endpoints: {
//             items: '/api/items'
//         }
//     });
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Route not found'
//     });
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         success: false,
//         message: 'Something went wrong!',
//         error: err.message
//     });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });


// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import itemRoutes from './routes/items.js';  // ← Note .js extension!

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/items', itemRoutes);

// // Root route
// app.get('/', (req, res) => {
//     res.json({
//         message: 'Welcome to MySQL Node.js API',
//         endpoints: {
//             items: '/api/items'
//         }
//     });
// });

// // 404 handler
// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: 'Route not found'
//     });
// });

// // Error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).json({
//         success: false,
//         message: 'Something went wrong!',
//         error: err.message
//     });
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));  
app.use(express.urlencoded({ limit: '50mb', extended: true })); 

// Routes
const itemRoutes = require('./routes/items');
app.use('/api/items', itemRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to MySQL Node.js API',
        endpoints: {
            items: '/api/items'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});