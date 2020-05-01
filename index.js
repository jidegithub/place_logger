const express = require('express');
const path = require('path')
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
// const MongoClient = require('mongodb').MongoClient

require('dotenv').config();

const middlewares = require('./middlewares')
const logs = require('./api/logs')

const app = express();


const db = process.env.MONGODB_URI_LOCAL;
const atlas = process.env.MONGODB_URI

mongoose.connect(atlas || db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false 
});

mongoose.connection.on('connected', () => {
	console.log('Mongoose is connected');
})

// callback format
// MongoClient.connect(connectionString, {
//     useUnifiedTopology: true,
//     useFindAndModify: false 
// }, (err, client) => {
//     if (err) return console.error(err)
//     console.log('Connected to Database')
// })

// promises format
// const db = process.env.MONGO_DB_ATLAS_URL;

// MongoClient.connect(db, 
//  { useUnifiedTopology: true})
// .then(client => {
//     console.log('Connected to Database')
//     const db = client.db('travel_log')
// })

// const db = process.env.MONGODB_URL_AT;
// mongoose.connect(db, 
// { useNewUrlParser: true, useUnifiedTopology: true},
// () => {console.log('Connected to Database')}
// )
    
app.use(morgan('common'));
app.use(helmet());

let whitelist = [process.env.CORS_ORIGIN, 'http://localhost:5000/', 'https://mytravel-log.herokuapp.com/']
app.use(cors({
	origin: function (origin, callback) {
		if (whitelist.indexOf(origin) !== -1) {
				callback(null, true)
			} else {
				callback(new Error('Not allowed by CORS'))
			}
		}
	// origin: process.env.CORS_ORIGIN 
	// origin: "https://mytravel-log.herokuapp.com/"
	// origin: "http://localhost:5000/"
}));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'client/build')))
	app.get('*', (req, res) => {
			res.sendFile(path.join(__dirname + '/client/build/index/html'))
	})
}

//bodyparsing middleware to interprete the body of the request(data parsing)
// there are other bodyparsers
// since  i am only going to be dealing with json, i se the below
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.get('/', (req, res) => {
//     res.json({
//         message: 'hello world!'
//     });
// });

// other routes
app.use('/api/logs', logs);

// ERROR HANDLER always comes last
app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337


app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
});