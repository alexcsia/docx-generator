**CV Template Service**

**A minimal Node.js HTTP service that generates DOCX files from JSON CV data.**

Requirements

Node.js v20+

npm

**Installation:**

1.Clone the repository

2.cd cv-template

3.npm install

**Build:**

The service is written in TypeScript and bundled with esbuild. To create a production-ready bundle:

npm run build

This will generate a bundled file:

dist/bundle.js

**Run:**

Start the service with:

npm start

The service will start an HTTP server on port 3001.

_Note: Once built, you can also just copy and run only the dist/bundle.js with:_
_node bundle.js_

**Run with Docker**

docker build -t my-app .

docker run -p 3001:3001 my-app

**Usage:**

Send a POST request to /generate with JSON data representing a CV. The server will respond with a DOCX file.

Example:

const response = await fetch('http://localhost:3001/generate', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(cvJSON),
});

**Accepted JSON schema:**

{
"firstName": "",
"lastName": "",
"highest_degree":"",
"specialization":"",
"birthday": null,
"nationality": "",
"image": "",
"education": [
{
"institution": "",
"employer":"",
"degree": "",
"major": "",
"thesis": "",
"specialization":"",
"location": "",
"details": [],
"start_date": null,
"end_date": null,
}
],
"certifications": [
{
"name":"",
"issuer":"",
"details":[],
"issued_date":null,
"expiry_date":null,
}
],
"training": [
{
"name":"",
"place":"",
"details":[],
"start_date":null,
"end_date":null,
}
],
"experience": [
{
"job_title": "",
"experiences": [
{
"employer": "",
"location": "",
"project":"",
"contractType": "",
"start_date": YYYY-MM-01,
"end_date": YYYY-MM-01,
"job_description": []
}
]
}
],
"skills": {
"Fachkenntnisse":[],
"Sprachkenntnisse": [],
"other_skills":[],
}
}
