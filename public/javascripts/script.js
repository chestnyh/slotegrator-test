function createChart(obj){

    return new Chart(obj.ctx, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            labels: obj.labels,
            datasets: [{
                label: obj.name,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: obj.data,
            }]
        },
    
        // Configuration options go here
        options: {
            animation:{
                duration : 0
            }
        }
    });
}

function Notifications(){
    
    var notifications = {
        success : document.getElementById("success-notify"), 
        info : document.getElementById("info-notify"),
        warning : document.getElementById("warning-notify"),
        danger : document.getElementById("danger-notify")
    }

    this.notify = function(notifId, text){
        for (var i in notifications){
            notifications[i].classList.add('d-none');
        }

        notifications[notifId].innerHTML = text;
        notifications[notifId].classList.remove('d-none');
    }
}

var notif = new Notifications();

function chartNotificatios(block_id, ){

    var block = document.getElementById(block_id);

    this.notify = function(text){
        var element = document.createElement("div");
        element.className = "alert alert-success"
        element.innerHTML = text;
        block.appendChild(element)
    }

}

var importantNotif = new chartNotificatios("importantNotify");
var unimportantNotif = new chartNotificatios("unimportantNotify");

var socket = new WebSocket("ws://localhost:3000/");

socket.onopen = function() {
    
    notif.notify("success", "Set connection");
    
    setInterval(function(){
        console.log("send data");
        socket.send('get_weather')
    }, 1000);

};
  
socket.onclose = function(event) {

    if (event.wasClean) {
        notif.notify("info", "Connection closed");
    } else {
        notif.notify("danger", 'Connecrtion breakage'); 
    }
};

var importantChart = createChart({
    name: "Weather in Kyiv",
    labels : [],
    data: [],
    ctx : document.getElementById('importantWeather').getContext('2d')
});

var unimportantChart = createChart({
    name: "Weather in London",
    labels : [],
    data: [],
    ctx : document.getElementById('unimportantWeather').getContext('2d')
});
  
socket.onmessage = function(event) {

    var result;
    
    if (event.data){
        result = JSON.parse(event.data);       
    }

    console.log(result);

    if(result.important.error){

        importantNotif.notify("Мы не дождались погоды из Киева.");
    }
    else{

        importantChart.data.labels.push(result.important.data.date);
        
        importantChart.data.datasets.forEach((dataset) => {
            dataset.data.push(Math.round(result.important.data.main.temp - 273.15));
        });

        importantChart.update();

        importantNotif.notify("Получены данные. Температура = " + Math.round(result.important.data.main.temp - 273.15));

    }

    if(result.unimportant.error){

        unimportantNotif.notify("Мы не дождались погоды из Лондона. Сначала получили данные из Киева.");

    }else{

        unimportantChart.data.labels.push(result.unimportant.data.date);

        unimportantChart.data.datasets.forEach((dataset) => {
            dataset.data.push(Math.round(result.unimportant.data.main.temp - 273.15));
        });

        unimportantChart.update();

        unimportantNotif.notify("Получены данные. Температура = " + Math.round(result.unimportant.data.main.temp - 273.15));
    }

};
  
socket.onerror = function(error) {
    notif.notify("danger", "Error " + error.message);
};