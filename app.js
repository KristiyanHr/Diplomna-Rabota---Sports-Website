const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const leagueRoutes = require('./routes/leagueRoutes');
const authRoutes = require('./routes/authRoutes');
const indexRouter = require('./routes/index');
const MongoStore = require('connect-mongo');
const favouriteRoutes = require('./routes/favouriteRoutes');  
require('dotenv').config();

const dbURI = 'mongodb://localhost:27017/Sport_Website';

const app = express();

//connect to DB
mongoose.connect(dbURI) 
    .then((result) => app.listen(3000))
    .catch((err) => console.log(err));

//register view engine
app.set('view engine', 'ejs');

//middleware and static files(css, etc)
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'TheMostSecretSecretKey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: dbURI,
        autoRemove: 'native'
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

//routes
app.use('/', indexRouter);

app.use('/leagues', leagueRoutes); 

app.use('/', authRoutes); 

app.use('/favourites', favouriteRoutes);

// app.use('/games', (req, res) => {
//     res.render('showGames', { title: 'Класиране от минал сезон' });
// });

//404 page // FUNCTION use() going trough all the options after all the code above it
app.use((req,res)=>{
    res.status(404).render('404', {title: '404'})
});