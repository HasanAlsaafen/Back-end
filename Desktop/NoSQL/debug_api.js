
const http = require('http');

const url = 'http://localhost:3000/api/students/69456c74ceba28b4358c537f/activity-summary';

http.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log('Response Body:', data);
  });
}).on('error', (err) => {
  console.log('Error: ', err.message);
});
