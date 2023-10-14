const http = require('http')
const url = require("url")
const port = 3000

let req_count = 0;

http.createServer((req, res) => {
    let q = url.parse(req.url, true) 
    let pathname = q.pathname

    if (req.method === "POST" && pathname.includes("INSERT")) {
        
    }

    if (req.method === "GET" && pathname.includes("SELECT")) {
        
    }


}).listen(port)

console.log("Server is running and listening on port: " + port)