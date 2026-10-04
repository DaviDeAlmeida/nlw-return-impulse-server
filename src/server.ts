import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(routes);

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
    console.log(`HTTP server running on port ${port}`);
});
