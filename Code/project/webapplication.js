//Import the express and body-parser modules
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const res = require('express/lib/response');

// Connects to the database
const connectionPool = mysql.createPool({
    connectionLimit: 1,
    host: "localhost",
    user: "root",
    password: "",
    database: "cookingmania",
    debug: false
});

//Create express app and configure it with body-parser
const app = express();
app.use(bodyParser.json());

//Set up express to serve static files from the directory called 'public'
app.use(express.static('public'));

//Data structure that will be accessed using the web service
let userArray = [];

// Serve HTML page
app.get('/', (req, res) => {
    res.sendFile('./cookingmania.html', {root: __dirname});
})

//Set up application to handle GET requests sent to the user path
app.get('/users/*', handleGetRequest);//Returns user with specified ID
app.get('/users', handleGetRequest);//Returns all users


//Set up application to handle POST requests sent to the user path
app.post('/users', handlePostRequestUser);//Adds a new user


// Get testimonials GET request
app.get('/testimonials', handleGetTestimonials);

//Handles GET requests to our web service
function handleGetRequest(request, response){
    //Split the path of the request into its components
    var pathArray = request.url.split("/");

    //Get the last part of the path
    var pathEnd = pathArray[pathArray.length - 1];

    //If path ends with 'users' we return all users
    if(pathEnd === 'users'){
        response.send(userArray);
    }

    //If the last part of the path is a valid user id, return data about that user
    else if(pathEnd in userArray){
        response.send(userArray[pathEnd]);
    }

    //The path is not recognized. Return an error message
    else
        response.send("{error: 'Path not recognized'}");
}

//Handles POST requests to our web service
function handlePostRequestUser(request, response){
    //Output the data sent to the server
    let newUser = request.body;
    let name = newUser['name'];
    let email = newUser['email'];
    let password = newUser['password'];


    registerUserDatabase(name, email, password).then((success) => {
        response.send(JSON.stringify({'registered': true}));
    }, (err) => {
        response.statusCode = 400;
        response.send(JSON.stringify({'registered': false, 'error': err}));
    });
}
// storing the registered users in the database

function registerUserDatabase(name, email, password) {
    let query = `INSERT INTO users (username, email, password, posts) VALUES ('${name}', '${email}', '${password}', 0)`;
    return new Promise((resolve, reject) => {
        connectionPool.query(query, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        })
    })
}

// getting the testimonaisl from the database

function handleGetTestimonials(request, response) {
    getTestimonialsFromDatabase().then((result) => {
        response.send(JSON.stringify(result));
    }, (err) => {
        response.statusCode = 500;
        response.send(JSON.stringify({'error': err}));
    })
}
function getTestimonialsFromDatabase() {
    let query = `SELECT testimonials.comment, users.username FROM testimonials INNER JOIN users ON testimonials.user_id = users.id`;
    return new Promise((resolve, reject) => {
        connectionPool.query(query, (err, res) => {
            if (!err) {
                resolve(res);
            } else {
                reject(err);
            }
        })
    })
}




//Start the app listening on port 8080
app.listen(8080, () => {
    console.log('App running on port 8080');
});
