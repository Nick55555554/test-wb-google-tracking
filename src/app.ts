import express from 'express'
import { dbMiddleware } from './db/middleware/db';
import router from './contorllers/routes'
import cors from 'cors'
import helmet from 'helmet'
import { TariffSyncService } from './services/tariff-sync-service';
import { db } from './db';

const {APP_PORT} = process.env || 3000;

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

TariffSyncService.startHourlySync(db)

app.listen(APP_PORT, () => {
    console.log(`Server listening on port ${APP_PORT}`)
})