import express from 'express';
import { Router, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import Manager from './cron/manager';

dotenv.config();

const app = express();
const route = Router();

app.use(cors({
    origin: `${process.env.CLIENT_URL}`
}));

app.use(express.json());

app.listen(process.env.PORT, () => {
    Manager.schedule();
});

route.get('/', (req: Request, res: Response) => {
    Manager.schedule();
    res.send();
})

app.use(route);