const express = require("express");
const cors = require("cors");
const app = express();
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

const HTTP_PORT = process.env.PORT || 3000;

app.use(cors()) //to set as global middleware
app.use(express.json()) //to read .json 
require('dotenv').config() //to read .env 

app.get("/",(req,res) => {
    res.json({message:"API Listening"})
})

app.post("/api/movies",(req,res) => {
    db.addNewMovie(req.body)
    .then((data) => {
        res.status(201).json(data);
    })
    .catch((error) => {
        res.status(500).json(error);
    })
})

app.get("/api/movies",(req,res) => {
    const page = req.query.page;
    const perPage = req.query.perPage;
    const title = req.query.title;

    if(!page && !perPage)
     return res.status(500).json({message:"missing parameter"})

    db.getAllMovies(page, perPage, title)
    .then((data) => {
        res.status(201).json(data);
    })
    .catch((error) => {
        res.status(500).json(error);
    })
})

app.get("/api/movies/:id",(req,res) => {
    db.getMovieById(req.params.id)
    .then((data) => {
        res.status(201).json(data);
    })
    .catch((error) => {
        res.status(500).json(error);
    })
})

app.put("/api/movies/:id",(req,res) => {
    db.updateMovieById(res.body, res.params.id)
    .then((data) => {
        res.status(201).json(data);
    })
    .catch((error) => {
        res.status(500).json(error);
    })
})

app.delete("/api/movies/:id",(req,res) => {
    db.deleteMovieById(res.params.id)
    .then((data) => {
        res.status(201).json(data);
    })
    .catch((error) => {
        res.status(500).json(error);
    })
})

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

