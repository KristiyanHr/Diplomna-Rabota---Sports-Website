const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const leagueRoutes = require('./routes/leagueRoutes');
const authRoutes = require('./routes/authRoutes');
const indexRouter = require('./routes/index');
require('dotenv').config();

const dbURI = 'mongodb+srv://netninja:test1234@nodeandmongo.ciemb.mongodb.net/Sport_Website?retryWrites=true&w=majority&appName=NodeAndMongo';

const app = express();

//connect to DB
mongoose.connect(dbURI)
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));


//register view engine
app.set('view engine', 'ejs');

//middleware and static files(css, etc)
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET|| 'TheMostSecretSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: process.env.NODE_ENV === 'production'}
}));

//routes
app.use('/', indexRouter);

app.use('/leagues', leagueRoutes); // Use the league routes

app.use('/', authRoutes); // using auth routes

// app.use('/games', (req, res) => {
//     res.render('showGames', { title: 'Класиране от минал сезон' });
// });

//404 page // FUNCTION use() going trough all the options after all the code above it
app.use((req,res)=>{
    res.status(404).render('404', {title: '404'})
});