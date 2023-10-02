const http = require('http');

const PORT = process.env.PORT || 1234;

const server = http.createServer((req, res) => {
    if(req.url === '/' && req.method === 'GET') {
        res.write('Hello World');
        res.statusCode = 200;
        res.end();
    }
})

server.listen(PORT, () => {
    console.log(`Server is running on ${PORT} ... 🚀`);
});
