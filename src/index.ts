require('dotenv').config();
import express from 'express';

import bodyParser from 'body-parser';
import morgan from 'morgan';

import routes from './routes';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

const server = app.listen(5000, () => console.log('server up'));
