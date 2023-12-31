const http = require('http')
const url = require("url")
const mysql = require("mysql")
const port = 3000

let req_count = 0;

const con = mysql.createPool ({
    host: "sql.freedb.tech",
    user: "freedb_comp3920_iang",
    password: "suc2&%7*a%D4brU",
    database: "freedb_comp3920NodeJS"
})

const query = (sql) => {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, rows) => {
            if(err) {
                return reject(err);
            }           
            return resolve(rows)
        })
    }) 
}

http.createServer((req, res) => {
    let q = url.parse(req.url, true) 
    let pathname = q.pathname

    if (pathname.includes("/lab5/api/v1/sql/") ) {

        let sql = pathname.substring(pathname.lastIndexOf('/') + 1)
        let clean_sql = sql.replace(/%20/g, " ")

        con.query(clean_sql, (err, result) => {
            if (err) {
                res.writeHead(400, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'})
                res.end("You got an SQL error, please check your SQL query")
            }
            console.log(result)
            res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'})
            
            let table = "<table>"
            for (let i = 0; i < result.length; i++) {
                table += `<tr><td>${result[i].patientid}</td><td>${result[i].name}</td><td>${result[i].dateOfBirth}</td></tr>`
            }
            table += "</table>"

            res.write(table)
            res.end()
        })

    } else if (req.method === "OPTIONS") {
        res.writeHead(200, {
            'access-control-allow-origin': '*',
            'access-control-allow-methods': 'GET, POST, OPTIONS',
            'access-control-allow-headers': 'Content-Type'
        })
        res.end()

    } else if (req.method === "POST" && pathname == "/lab5/insert") {
        let body = ""
        
        req.on('data', function(chunk) {
            if (chunk != null) {
                body += chunk
            }
        })

        req.on("end", async () => {
            let data = JSON.parse(body)

            let table = await query(data.table)

            con.query(data.query, (err, result) => {
                if (err) {
                    res.writeHead(400, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'})
                    console.log(err)
                    res.end("You got an SQL error, please check your SQL query")
                }
                console.log(result)
                res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'})
                res.end("We got your POST request")
            })
        })

    }  else if (req.method === "GET" && pathname.includes("/lab5/select")) {
        let sql = q.query["query"]

        con.query(sql, (err, result) => {
            if (err) {
                res.writeHead(400, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'})
                console.log(err)
                res.end("You got an SQL error, please check your SQL query")
            }
            console.log(result)
            res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'})            
            res.end(JSON.stringify({response: `We got your GET request`, result}))
        })
        
    } else {
        res.writeHead(200, {'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*'})
        res.write("<p>home page</p>")
        res.end()
    }

}).listen(port)

console.log("Server is running and listening on port: " + port)