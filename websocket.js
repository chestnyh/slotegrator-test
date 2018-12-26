var appData = require('./app_data');

var onSocketRequest = function(request) {
    var connection = request.accept(null, request.origin);

    connection.on('message', function(message) {

        if (message.type !== 'utf8') {
            console.log(message);
            return;
        }
        if (message.utf8Data = 'get_weather')
            connection.send(JSON.stringify(appData.getWeatherLast()));            

    });
  
    connection.on('close', function(connection) {
        console.log('close');
    });
}

module.exports = onSocketRequest;