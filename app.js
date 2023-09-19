import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './src/routes/index.js';
import usersRouter from './src/routes/users.js';
import todosRouter from './src/routes/todos.js';

const app = express();
const __dirname = path.dirname(import.meta.url);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todos', todosRouter);

export default app;