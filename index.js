'use strict';

const url="postgres://samar:1234@localhost:5432/demo";
const PORT=3000;


const express= require('express');
const cors=require("cors");
var bodyParser = require('body-parser');

const command = require('nodemon/lib/config/command');
require('dotenv').config();

const { Client } = require('pg');
const client = new Client(url);

const app= express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());




//routes
app.post("/addRecipe" , handleAdd);
app.get("/getRecipes", handleGet); 


function handleAdd(req , res){
    console.log(req.body);
    //res.send("Adding to db in progress");
    const {title , time , summary } = req.body;
   let sql = 'INSERT INTO recipe( title, time , summary ) VALUES   ($1 , $2 , $3) RETURNING *;'
    let values=[title , time , summary] ;

    client.query(sql , values).then((result)=>{
        console.log(result.rows);
        return res.status(201).json(result.rows[0]);

    }).catch();

}

function handleGet(req , res){
    let sql =' SELECT * FROM recipe;'

    client.query(sql)
    .then((result) =>{
        console.log(result);
        //res.send("I am working on it");
        res.json(result.rows);
    })
    .catch()
}


client.connect().then(()=>{
    app.listen(PORT ,()=>{
        console.log(`server is listening ${PORT}`);

    });


});

