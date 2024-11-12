const express = require('express')
const https = require('https')
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express()


app.use(bodyParser.urlencoded({extended:true}))
app.get('/',(req,res)=>{
    res.sendFile(__dirname + "/weather.html")
})

app.post('/',(req,res)=>{
    const query = req.body.cityName
    const apiKey = process.env.API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`
    var data = ''
    https.get(url, (response)=>{
        response.on('data',(chunk)=>{
            data += chunk
        })
        response.on('end', () =>{
            var weatherData = JSON.parse(data)

            if (weatherData.cod == 404){
                res.write("<p>The place you are searching for is not found please try again with the correct name or spelling</p>");
                res.write('<br><a href="/">Try againg</a>');
                res.end()
            }
            else{

                if (weatherData.weather && weatherData.weather.length > 0){
                    var description = weatherData.weather[0].description
                    var icon = weatherData.weather[0].icon
                    var imageUrl = " https://openweathermap.org/img/wn/"+icon+"@2x.png"
                    var temp = weatherData.main.temp

                    res.write("<h1> Current Weather Condition For " + query + "</h1>")
                    res.write("<p>The weather is currently " + description + "</p>")
                    res.write("<p>The temprature is " + temp + " degree celcius </p>")
                    res.write("<img   src="+imageUrl+">")
                    res.write('<br><a href="/">Search for another city</a>');
                    res.end() 
                }
                else{
                    res.write("<p>The place you are searching for is not found please try again with the correct name or spelling</p>");
                    res.write('<br><a href="/">Try againg</a>');
                    res.end()
                }
            }
                
        }).on('error',()=>{
            res.write("Error fetching data")
            res.write('<br><a href="/">Search for another city(please check your spelling or if the city or country exists)</a>');
        })
    })
})

app.listen(3000, ()=>{
    console.log("This weather condition telling server is serving at port number 3000")
})