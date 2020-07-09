import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dbConfig from './database/db.js';
// Express APIs
import api from './routes/auth.routes.js';

// MongoDB conection
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
        console.log('Database connected')
    },
    error => {
        console.log("Database can't be connected: " + error)
    }
)

// Remvoe MongoDB warning error
mongoose.set('useCreateIndex', true);


// Express settings
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

// Serve static resources
app.use('/public', express.static('public'));

app.use('/api', api)

// Define PORT
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})

// Express error handling
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});