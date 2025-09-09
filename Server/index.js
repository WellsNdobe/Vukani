import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // <-- load .env variables

const app = express();

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

const CONNECTION_URL = process.env.MONGO_URI; // from .env
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

app.get('/', (req, res) => {
    res.send('Hello to Vukani API');
});

