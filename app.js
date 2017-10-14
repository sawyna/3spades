const server = require('./server/server.js');
const port = 9000;

const app = server.app();

app.listen(port);
console.log(`Listening at http://localhost:${port}`);
