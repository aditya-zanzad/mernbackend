const express = require('express');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcrypt'); // Import bcrypt
const app = express();

// Import database connection
require("./db/conn");
const Register = require("./models/registers");

const port = process.env.PORT || 3000;

// Define path for static files
const publicPath = path.join(__dirname, '../public');
const templatePath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Set up static directory to serve
app.use(express.static(publicPath));

// Set the view engine to Handlebars
app.set('view engine', 'hbs');
app.set('views', templatePath);

// Register partials
hbs.registerPartials(partialsPath);

// Use express.urlencoded middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

// Define route for the home page
app.get('/', (req, res) => {
    // Render the 'index' view
    res.render('index'); // Ensure correct file extension
});

// Route to handle POST request for registration
app.post('/register', async (req, res) => {
    const { firstName, lastName, email, gender, phone, age, password } = req.body;

    try {
        // Check if the email already exists in the database
        const existingUser = await Register.findOne({ email });
        if (existingUser) {
            return res.status(400).send('Email already exists');
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

        // Create a new document based on the Register model
        const newRegistration = new Register({
            firstName,
            lastName,
            email,
            gender,
            phone,
            age,
            password: hashedPassword // Store the hashed password
        });

        // Save the new document to the database
        const savedRegistration = await newRegistration.save();

        console.log('User registered successfully:', savedRegistration);
        // Redirect to the home page after successful registration
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
});


// Route to handle POST request for login
// Assuming this is the route handler for handling POST request for login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt with email:', email); // Log the email received
    
    try {
        // Find user by email in the database
        const user = await Register.findOne({ email });
        
        // If user does not exist, return "User not found" response
        if (!user) {
            return res.status(401).send('User not found');
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        
        // If passwords don't match, return "Invalid password" response
        if (!isMatch) {
            return res.status(401).send('Invalid password');
        }
        
        // If the password matches, render a new page (e.g., dashboard)
        res.render('dashboard', { user }); // Assuming you have a 'dashboard.hbs' view file
    } catch (error) {
        // If any error occurs during login, log the error and return a generic error response
        console.error('Error logging in user:', error);
        res.status(500).send('Error logging in user');
    }
});



// Route to render the registration form
app.get('/register', (req, res) => {
    res.render('register');
});

// Route to render the login form
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard');
})

app.get('/services', (req, res) => {
    res.render('services');
})

app.get('/aboutpage', (req, res) => {
    res.render('aboutpage');
})

app.get('/service', (req, res) => {
    res.render('service');

})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.get('/logout', (req, res) => {
    res.render('index');
})


// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
