import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { SyncJob } from './cron-jobs';
import { db } from './db';

const { APP_PORT, SPREAD_SHEET_ID } = process.env;

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

const syncJob = new SyncJob(SPREAD_SHEET_ID!);

app.listen(APP_PORT, () => {
    console.log(`Server listening on port ${APP_PORT}`);

    syncJob.syncAndExport(db);
});
