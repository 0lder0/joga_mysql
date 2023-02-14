const express = require("express")
const app = express()

const path = require("path")

const hbs = require("express-handlebars")
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "hbs")
app.engine("hbs", hbs.engine ({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts/"
}))

app.use(express.static("public"))

const mysql = require("mysql")

const bodyParser = require("body-parser")
const {query} = require("express");

app.use(bodyParser.urlencoded({extended: true}))

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "qwerty",
    database: "joga_mysql"
})

con.connect(function (err) {
    if (err) throw err
    console.log("Connected to joga_mysql db")
})

const articleRoutes = require('./routes/article')

app.use('/', articleRoutes)
app.use('/article', articleRoutes)



app.get("/author/:author_id", (req, res) => {
    let query = `SELECT article.*, author.name AS author_name FROM article join author on article.author_id=author.id where article.author_id = '${req.params.author_id}'`;
    let articles = []
    con.query(query, (err, result) => {
        if (err) throw err
        articles = result
        let author_name = result[0].author_name
        res.render("author", {
            articles: articles,
            author_name: author_name
        })
    })
});


app.listen(3000, () => {
    console.log("App is started at http://localhost:3000")
})