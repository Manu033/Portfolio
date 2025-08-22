//jshint esversion:6

const express = require("express");
const bodyParser =require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
});

app.post("/", function(req, res){
    var num1= Number(req.body.n1);
    var num2= Number(req.body.n2);
    var resultado = num1+num2;
    res.send("La suma de esos numeros es de "+ resultado);
});




app.get("/bmicalculator", function(req, res){
    res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/bmicalculator", function(req, res){
    var peso= req.body.n3;
    var altura= req.body.n4;
    var resultado=peso/Math.pow(altura, 2);
  
    res.send("Su IMC es de "+ resultado);

  
});

app.listen(3000, function(){
    console.log("Servidor 3000 abierto");
});

