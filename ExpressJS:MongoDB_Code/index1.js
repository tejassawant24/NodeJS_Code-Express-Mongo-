const express = require('express');
const app = express();
app.use(express.json());
let genre = require('./routes/movie_assignment/genre.routes');
let movie = require('./routes/movie_assignment/movie.routes');

app.use('/api/genre', genre);
app.use('/api/movie', movie);


//Connect to Database
let connection = require('./mongo/connection');
connection.ConnectToDatabase();

//Server Create
port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`server working on port number ${port}`);
});