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

const port = parseInt(process.env.port || '3000');

const server = app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
