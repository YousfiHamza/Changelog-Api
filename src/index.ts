import express, { Application } from 'express';
import dotenv from 'dotenv'; // For env File
import morgan from 'morgan'; // For logging
import cors from 'cors'; // For Cross Origin Resource Sharing

import router from './router';

//For env File 
dotenv.config();

// PORT
const PORT = process.env.PORT || 1234;

const app: Application = express();

app.use(cors()); // For Cross Origin Resource Sharing

app.use(express.json()); // For parsing application/json

app.use(morgan('dev')); // For logging

app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use('/api', router)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} ... 🚀`);
});
