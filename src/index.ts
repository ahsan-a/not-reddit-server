require('dotenv').config();
import express from 'express';
const app = express();

import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import { createNotification } from './utils';

import routes from './routes';

app.use(
	cors({
		origin: process.env.origin || 'http://not-reddit.vercel.app',
		methods: ['GET', 'POST'],
	})
);

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// rate limiting
app.set('trust proxy', 1);
const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: parseInt(process.env.rateLimit || '35'), // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(routes);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
