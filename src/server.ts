import express, { query } from 'express';
import cors from 'cors';

import movieRoute from './routes/movieRoute';
import loginRoute from './routes/loginRoute';
import favoriteRoute from './routes/favoriteRoute';
import dislikeRoute from './routes/dislikeRoute';

//Express configuration
const app = express();

app.use(cors());
app.use(express.json());


//Routes
app.use('/movies', movieRoute)
app.use('/login', loginRoute)
app.use('/favorites', favoriteRoute)
app.use('/dislike', dislikeRoute)

app.listen(3333);