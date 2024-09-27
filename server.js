// Import necessary dependencies/packages
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Configure the database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test the database connection
db.connect((err) => {
    if (err) {
        return console.error("Error connecting to MySQL: ", err);
    }
    console.log("Connected to MySQL as id: ", db.threadId);
});

// 1. Retrieve all patients
// http://localhost:3000/patients
app.get('/patients', (req, res) => {
    db.query('SELECT * FROM patients', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving patients');
        }

        // Create an HTML table for the results
        let html = '<table border="1"><tr><th>patient_id</th><th>first_name</th><th>last_name</th><th>date_of_birth</th><th>gender</th><th>language</th></tr>';
        results.forEach(patient => {
            html += `<tr>
                        <td>${patient.patient_id}</td>
                        <td>${patient.first_name}</td>
                        <td>${patient.last_name}</td>
                        <td>${new Date(patient.date_of_birth).toLocaleDateString()}</td>
                        <td>${patient.gender}</td>
                        <td>${patient.language}</td>
                     </tr>`;
        });
        html += '</table>';

        res.send(html); // Send the HTML table as the response
    });
});

// 2. Retrieve all providers
// http://localhost:3000/providers
app.get('/providers', (req, res) => {
    db.query('SELECT * FROM providers', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving providers');
        }

        // Create an HTML table for the results
        let html = '<table border="1"><tr><th>id</th><th>first_name</th><th>last_name</th><th>provider_specialty</th><th>email</th><th>phone</th><th>date</th></tr>';
        results.forEach(provider => {
            html += `<tr>
                        <td>${provider.provider_id}</td>
                        <td>${provider.first_name}</td>
                        <td>${provider.last_name}</td>
                        <td>${provider.provider_specialty}</td>
                        <td>${provider.email_address}</td>
                        <td>${provider.phone_number}</td>
                        <td>${new Date(provider.date_joined).toLocaleDateString()}</td>
                     </tr>`;
        });
        html += '</table>';

        res.send(html); // Send the HTML table as the response
    });
});



// 3. Filter patients by First Name
// http://localhost:3000/patients/first_name/John
app.get('/patients/first_name/:firstName', (req, res) => {
    const firstName = req.params.firstName;
    db.query('SELECT * FROM patients WHERE first_name = ?', [firstName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving patients by first name');
        }
        
        // Create an HTML table for the results
        let html = '<table border="1"><tr><th>patient_id</th><th>first_name</th><th>last_name</th><th>date_of_birth</th><th>gender</th><th>language</th></tr>';
        results.forEach(patient => {
            html += `<tr>
                        <td>${patient.patient_id}</td>
                        <td>${patient.first_name}</td>
                        <td>${patient.last_name}</td>
                        <td>${new Date(patient.date_of_birth).toLocaleDateString()}</td>
                        <td>${patient.gender}</td>
                        <td>${patient.language}</td>
                     </tr>`;
        });
        html += '</table>';

        res.send(html); // Send the HTML table as the response
    });
});


// 4. Retrieve all providers by their specialty
//http://localhost:3000/providers/specialty/Surgery
app.get('/providers/specialty/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    db.query('SELECT * FROM providers WHERE provider_specialty = ?', [specialty], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving providers by specialty');
        }

        // Create an HTML table for the results
        let html = '<table border="1"><tr><th>Provide_id</th><th>First_name</th><th>Last_name</th><th>Provider_specialty</th><th>Email_address</th><th>Phone_number</th><th>Date_joined</th></tr>';
        results.forEach(provider => {
            html += `<tr>
                        <td>${provider.provider_id}</td>
                        <td>${provider.first_name}</td>
                        <td>${provider.last_name}</td>
                        <td>${provider.provider_specialty}</td>
                        <td>${provider.email_address}</td>
                        <td>${provider.phone_number}</td>
                        <td>${provider.date_joined}</td>
                     </tr>`;
        });
        html += '</table>';

        res.send(html); // Send the HTML table as the response
    });
});


// Listen to the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


