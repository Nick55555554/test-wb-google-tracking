import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { SyncJob } from './cron-jobs';
import { db } from './db';

const { APP_PORT } = process.env || 3000;

const SPREAD_SHEET_ID = '1-zQtqgovzdXqgTJf9XUXoPG3Z9HtY6ZtLI0voNaCxEA';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

const syncJob = new SyncJob(SPREAD_SHEET_ID);

syncJob.syncAndExport(db);

app.listen(APP_PORT, () => {
    console.log(`Server listening on port ${APP_PORT}`);
});
