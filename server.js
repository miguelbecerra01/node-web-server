const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//port from enviromental variables from heroku or other server, if it doesn't exist use 3000
const port = process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
//set handlebars to be the template engine
app.set('view engine', 'hbs');


//middleware to create a log of refresh of pages.
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}:${req.method} ${req.url}`;

    console.log(log);
    fs.appendFileSync('./log/server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.')
        }
    });
    next();
});

//middleware to redirect to a page of maintenance page...without next.
/*
app.use((req, res, next) => {
    res.render('maintenance.hbs', {
        pageTitle: 'Ups!',
        message: 'We are in maintenance, we will be up and running shortly'
    })
});*/

//use a middleware to read static files (html)
app.use(express.static(__dirname + '/public'));


//create a function that can be called from a template
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});


app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Hi welcome to my page'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
    var badMessage = {
        statusCode: 400,
        errorMessage: 'Unable to fulfill the request'
    };
    res.send(badMessage);
});

app.get('/maintenance', (req, res) => {
    res.render('maintenance.hbs', {
        pageTitle: 'Ups!',
        message: 'We are in maintenance, we will be up and running shortly'
    })
});


//app.listen(3000);

//the port is dinamic from heroku
app.listen(port, () => {
    console.log(`Server is up and running on port ${port} `);
});