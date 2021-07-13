require('dotenv').config();
import express from 'express';
const app = express();

import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

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

app.use(routes);

const server = app.listen(3000, () => {
	console.log('Server listening on port 3000');
});
