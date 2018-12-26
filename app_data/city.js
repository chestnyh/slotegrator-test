'use strict';

var config = require('../config');

function City(cityObj){

    let name = '',    
        id = '';
        
    if(cityObj.name)
        name = cityObj.name;
    else 
        throw new Error(`You can't generate city object without name`);    
    
    if(cityObj.id)
        id = cityObj.id;
    else
        throw new Error(`You can't generate city object without id`);
        
    this.url = "https://" + config.api + "?id=" + id + "&appid=" + config.apiKey;
}

module.exports = City;