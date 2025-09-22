import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import router from './routes/user.js';
import cookieParser from 'cookie-parser';
import bookRouter from './routes/book.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 3000;

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/", router)
app.use("/", bookRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});