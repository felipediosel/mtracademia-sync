import express from 'express';
import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { updateCron } from './cron/updateCron';

dotenv.config();

const app = express();
const route = Router();

app.use(cors({
    origin: `${process.env.CLIENT_URL}`
}));

app.use(express.json());

app.listen(process.env.PORT, () => {
    updateCron();
});

route.get('/', (req: Request, res: Response) => {
    updateCron();
    res.send('Cron updated!');
})

app.use(route);