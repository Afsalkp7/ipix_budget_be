import express from 'express';
import bodyParser from 'body-parser';
import database from './database/connect.js';
import dotenv from 'dotenv';
import cors from 'cors';
import auth from './routes/auth.js';
import incomeRouter from './routes/income.js'
import expenseRouter from './routes/expense.js'
import planningRouter from './routes/planning.js'
import dashRouter from './routes/dashboard.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(cors());

database();

app.use('/api/auth', auth);
app.use("/api/income", incomeRouter)
app.use("/api/expense",expenseRouter)
app.use("/api/planning",planningRouter)
app.use("/api/dashboard",dashRouter)


app.get('/', (req, res) => {
    res.status(200).json({ msg: 'connect' });
  });
  
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });