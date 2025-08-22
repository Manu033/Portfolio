const { log } = require("console");
const express = require("express");
const bodyParse = require("body-parser");
const env = require("dotenv");



const app= express();

const https = require("https");
env.config();

app.use(bodyParse.urlencoded({extended: true}));


app.get("/", function(req, res){

    res.sendFile(__dirname+"/index.html");

});

app.post("/", function(req, res){

    var city = req.body.cityName;
    const appkey= process.env.API_KEY;
    const unit= "metric"
    const url="https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+appkey+"&units="+unit;

        https.get(url, function(response){

        response.on("data", function(data){//recuperar los datos que nos trae la api
            const weaterData = JSON.parse(data);//transformamos los datos en codigo javascript
            const temp = weaterData.main.temp;//guardamos un dato especifico en una variable
            const description = weaterData.weather[0].description;
            const icon = weaterData.weather[0].icon;
            const imgUrl= "http://openweathermap.org/img/wn/"+icon+"@2x.png";
        


        res.write("<p>El cielo esta " +description+"</p>");
        res.write("<h1>La temperatura actual en "+city+" es de "+temp+"</h1>");
        res.write("<img src="+imgUrl+">");
        res.send();
        });
        

    });

})


app.listen(3000, function(){
    console.log("Servidor prendido 3000");
});