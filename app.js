const http = require('http')
const url = require("url")
const mysql = require("mysql")
const port = 3000

let req_count = 0;

const con = mysql.createConnection ({
    host: "sql.freedb.tech",
    user: "freedb_comp3920_iang",
    password: "suc2&%7*a%D4brU",
    database: "freedb_comp3920NodeJS"
})


http.createServer((req, res) => {
    let q = url.parse(req.url, true) 
    let pathname = q.pathname

    if (pathname.includes("/lab5/api/v1/sql/") ) {

        let sql = pathname.substring(pathname.lastIndexOf('/') + 1)
        let clean_sql = sql.replace(/%20/g, " ")

        con.query(clean_sql, (err, result) => {
            if (err) throw err
            console.log(result)
            res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'})
            res.end(result)
        })
    } else if (req.method === "POST") {
        console.log(req.body)
    } else if (req.method === "GET") {
        
    } else {
        res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'})
        res.write("<p>home page</p>")
        res.end()
    }


}).listen(port)

console.log("Server is running and listening on port: " + port)