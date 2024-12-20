const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();


app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());

// MySQL connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected');
});

//fetch job data from API
const fetchJobsFromAPI = async () => {
    try {
        const response = await fetch('https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=c9ddfe98&app_key=2397935e97b5daaeb42d37175482badb&results_per_page=10');
        
        const data = await response.json();

        return data.results; // Return the job data array
    } catch (error) {
        console.error("Error fetching jobs from API:", error);
        throw error;
    }

};

//save fecthed jobs into database
const saveJobsToDatabase = (jobs) => {
    const query = `
        INSERT INTO jobs (id, title, company_name, description, location, salary, redirect_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    jobs.forEach(job => {
        const id = job.id;
        const title = job.title || 'No Title';
        const company_name = job.company?.display_name || 'Unknown';
        const description = job.description || 'No description available';
        const location = job.location?.display_name || 'Unknown Location';
        const salary = job.salary_min || 0;  // Default salary as 0 if not available
        const redirect_url = job.redirect_url || 'No URL available';

        db.query(query, [id, title, company_name, description, location, salary, redirect_url], (err) => {
            if (err) {
                console.error("Error saving job to database:", err);
            } else {
                console.log("Job saved successfully");
            }
        });
    });
};

//automate fetching and saving data
app.get('/fetch-jobs', async (req, res) => {
    try {
        const jobs = await fetchJobsFromAPI(); // Fetch jobs from API
        saveJobsToDatabase(jobs); // Save jobs to the database
        res.status(200).json({ message: "Jobs fetched and saved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch or save jobs" });
    }

});

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Start server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

//get all jobs
app.get('/jobs', (req, res) => {
    const sql = 'SELECT * FROM jobs';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// Endpoint to fetch searched job data from API and store it in the database

// app.post('/search-jobs', async (req, res) => {
//     try {
//         console.log(req.body)
//       const { searchQuery, location } = req.body;
//     //   console.log(req.body);
//       const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=c9ddfe98&app_key=2397935e97b5daaeb42d37175482badb&results_per_page=20&what=${searchQuery}&where=${location}&content-type=application/json`; // Replace with the actual API URL
//       const response = await fetch(apiUrl);
        
//       const jsonJobData = await response.json();
//       console.log(jsonJobData.results);

//       //  return data.results;

//       const newJobs = [];
//       // Loop through results and save them in the database using raw SQL
//       for (let job of jsonJobData.results) {
//         const {location} = job.location.display_name;
//         const {id, title, company_name, description, redirect_url} = job;

//         const checkQuery = `SELECT * FROM jobs WHERE id = ?`;
//         const existingJob = await new Promise((resolve, reject) => {
//             db.query(checkQuery, [id], (err, result) => {
//                 if (err) return reject(err);
//                 resolve(result);
//             });
//         });
       

//         if (existingJob.length === 0) {
//             const query = `
//             INSERT INTO jobs (id, title, company_name, location, description, redirect_url)
//             VALUES (?, ?, ?, ?, ?, ?)
//             `;
            
//             // Execute the query
//             db.query(query, [id, title, company_name, location, description, redirect_url], (err, result) => {
//             if (err) {
//                 console.error('Error inserting job into database:', err);
//             } else {
//                 console.log('Job inserted into database:', result.insertId);
//             }
//             });

//             // Add job to the list of inserted jobs
//             newJobs.push({
//                 id,
//                 title,
//                 company_name,
//                 location,
//                 description,
//                 redirect_url,
//             });
//         }
//         else {
//             console.log(`Job with ID ${id} already exists in the database.`);
//         }
//       }
  
//       res.status(200).json(newJobs);
//     } catch (error) {
//       console.error('Error fetching or storing jobs:', error);
//       res.status(500).json({ error: 'Failed to fetch and store jobs' });
//     }
//   });

app.post('/search-jobs', async (req, res) => {
    try {
        console.log(req.body);
        const { searchQuery, location } = req.body;
        
        // Construct the API URL with search query and location
        const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=c9ddfe98&app_key=2397935e97b5daaeb42d37175482badb&results_per_page=20&what=${searchQuery}&where=${location}&content-type=application/json`;

        // Make sure the fetch is awaited correctly
        const response = await fetch(apiUrl);
        const jsonJobData = await response.json();
        

        const newJobs = [];
        
        // Loop through results and save them in the database
        for (let job of jsonJobData.results) {
            const location = job.location.display_name;
            const company_name = job.company.display_name;
            const { id, title, description, redirect_url } = job;

            

            const checkQuery = `SELECT * FROM jobs WHERE id = ?`;
            const existingJob = await new Promise((resolve, reject) => {
                db.query(checkQuery, [id], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });

            if (existingJob.length === 0) {
                const query = `
                    INSERT INTO jobs (id, title, company_name, location, description, redirect_url)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                // Execute the query to insert job data into the database
                await new Promise((resolve, reject) => {
                    db.query(query, [id, title, company_name, location, description, redirect_url], (err, result) => {
                        if (err) return reject(err);
                        console.log('Job inserted into database:', result.insertId);
                        resolve();
                    });
                });

                
            } else {
                console.log(`Job with ID ${id} already exists in the database.`);
            }
            // Add job to the list of inserted jobs
            newJobs.push({
                id,
                title,
                company_name,
                location,
                description,
                redirect_url,
            });

            
        }
        console.log("-------------------New job ---------", newJobs[0]);
        // Send the response with the newly inserted jobs
        res.status(200).json(newJobs);
    } catch (error) {
        console.error('Error fetching or storing jobs:', error);
        res.status(500).json({ error: 'Failed to fetch and store jobs' });
    }
});

//signup logic - add new user to database
app.post("/signup", (req, res) => {
    console.log(req.body);
    const {name, email, password, profile_type } = req.body;

    if(!name || !email || !password ||!profile_type){
        return res.status(400).json({error: "Missing data"});
    }

    const query = "INSERT INTO users (name, email, password, profile_type) VALUES (?, ?, ?, ?)";
    db.query(query, [name,email, password, profile_type], (err, results) => {
        if(err){
            return res.status(500).json({error: "Database error"});
        }
        res.status(201).json({message: "user successfully created", id: results.insertId});
    });
});

//login logic
app.post("/login", (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({error: "Missing email or password"});
    }
    
    const query = "Select * from users where email=? and password=?";

    db.query(query, [email,password] , (err, results)=> {
        if(err){
            return res.status(500).json({error: "Database error"});
        }
        if(results.length ===0) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        res.status(200).json({message: "Login Sucessful", user: results[0]});
    })
});

// Job Application Endpoint
app.post('/apply', upload.single('resume'), (req, res) => {
    console.log(req.body); // Log request body
    console.log(req.file); // Log the uploaded file
    const { job_id, user_id, full_name, email, phone, cover_letter } = req.body;
    const resume_path = req.file ? req.file.name : null;

    if (!job_id || !user_id || !full_name || !email || !cover_letter) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const query = `
        INSERT INTO job_applications (job_id, user_id, full_name, email, phone, cover_letter, resume_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [job_id, user_id, full_name, email, phone, cover_letter, resume_path], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "Application submitted successfully", id: results.insertId });
    });
});

//get my job applications
app.get("/myjobapplications", (req, res) => {
    const user_id = req.query.user_id;
    // const sql = `select * from job_applications where user_id = ?`
    const sql = "select j.title, j.location, j.company_name,ja.email, ja.submitted_at from jobs j, job_applications ja where j.id = ja.job_id and ja.user_id = ?";
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).send({ error: "Database error" });
        }
        res.send(result);
    });
})