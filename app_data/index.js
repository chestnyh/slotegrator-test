var City = require('./city');
var https = require('https');
var logger = require('../logger');


var appData = function(){

    var importantCity = new City({
        id: 703448,
        name : 'Kiev', 
        important : true
    });

    var unimportantCity = new City({
        id : 2643743,
        name : 'London', 
        important : false
    });
    
    var requestIntrval = 2000;
    var waitTime = 3000;

    var isImportantReady = false;
    
    var weatherLast;

    this.getWeatherLast = function(){
        return weatherLast;
    }

    this.startRequests = function(){

        setInterval(function(){

            var newWeather = {
                important : {
                    error:false,
                    data : {}
                },
                unimportant : {
                    error:false,
                    data : {} 
                }
            };

            isImportantReady = false;

            var now = new Date();

            var importantReq = https.get(importantCity.url, function(res){

                let rawData = '';
    
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
    
                res.on('end', ()=>{
                    try{
                        var city = JSON.parse(rawData);
                        newWeather.important.data = city;
                        newWeather.important.data.date = now.toISOString();
                        unimportantReq.destroy();
                        weatherLast = newWeather
                    }
                    catch(e){
                        console.log(e.message);
                    }
                });
    
            });

            var unimportantReq = https.get(unimportantCity.url, function(res){

                let rawData = '';
    
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
    
                res.on('end', ()=>{
                    try{
                        var city = JSON.parse(rawData);
                        newWeather.unimportant.data = city;
                        newWeather.unimportant.data.date = now.toISOString();
                    }
                    catch(e){
                        console.log(e.message);
                    }
                });
    
            });

            importantReq.setTimeout(waitTime, function(){
                unimportantReq.destroy();
                importantReq.destroy();
            });

            importantReq.on('error', (error)=>{
                newWeather.important.error = "недождались погоды";
                logger.info("Недождались погоды из главного источника");
                unimportantReq.destroy();
            });

            unimportantReq.on('error', (error)=>{
                newWeather.unimportant.error = "важный источник ответил раньше";
                logger.info("Главный источник ответил раньше второстепенного");
            });
            
        }, requestIntrval);
    }    
}

module.exports = new appData();