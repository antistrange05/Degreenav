const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve static files (like your HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Favicon endpoint
//app.get('/favicon.ico', (req, res) => {
    //res.sendFile(path.join(__dirname, 'assets', 'favicon.ico'));
//});

// Endpoint to serve course data based on requirement
app.get('/courses/:requirement', (req, res) => {
    const requirement = req.params.requirement;
    const filePath = path.join(__dirname, 'data', `${requirement}.txt`);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to read the file' });
        }

        const courses = parseCourses(data);
        res.json(courses);
    });
});

// Function to parse the course data from the .txt file
function parseCourses(data) {
    const lines = data.split('\n');
    const courses = [];

    lines.forEach(line => {
        const [code, name, credits] = line.split(','); // assuming CSV format in the text files
        if (code && name && credits) {
            courses.push({
                code: code.trim(),
                name: name.trim(),
                credits: parseInt(credits.trim(), 10),
            });
        }
    });

    return courses;
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

