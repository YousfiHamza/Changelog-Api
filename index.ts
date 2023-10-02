import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

//For env File 
dotenv.config();

const app: Application = express();

const PORT = process.env.PORT || 1234;

app.get('/', (req: Request, res: Response) => {
    res.status(200)
    res.json({message: 'Hello World from express'});
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} ... 🚀`);
});
