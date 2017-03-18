// @flow
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000 ;  

let app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

//with app.use we register middlewares

//middleware is a function with three parameters...
app.use((req, res, next) => {
	var now = new Date().toString();
	let log = `${now}: ${req.method} ${req.path}`;
	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) console.log('Unable to append to server.log.');
	});
	//remember to call next! 
	next();
});

//a middleware that stops all other calls
// app.use((req, res, next) => {
// 	res.render('maintenance.hbs');
// });

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

app.get('/', (req, res) => {
	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome! Bienvenido!'
	});
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page'
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'This route is bad'
	});
});

app.use(express.static(__dirname+'/public'));

app.listen(port, () => {
	console.log(`Server is up on port ${port}.`);
});

