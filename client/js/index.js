"use strict"

function loadLadder(ladder, format){
    var table = document.getElementById("ladder");
    while(table.lastChild.lastChild.className != "header"){
        table.lastChild.removeChild(table.lastChild.lastChild)
    }
    for (var i = 0; i < ladder.length; i++){
        if(i > 499){
            break;
        }
        var user = ladder[i];
        var row = table.insertRow();
        var nr = row.insertCell();
        var name = row.insertCell();
        var rating = row.insertCell();
        var games = row.insertCell();
        var wl = row.insertCell();
        var winperc = row.insertCell();
        nr.innerHTML = (i+1).toString();
        name.innerHTML = "<a href=/user?id=" + user.id + ">" + user.name + "</a>";
        rating.innerHTML = Math.floor(user[format + "rating"]);
        games.innerHTML = user[format + "wins"] + user[format + "losses"];
        wl.innerHTML = user[format + "wins"] + "/" + user[format + "losses"];
        winperc.innerHTML = Math.round((user[format + "wins"] / (user[format + "wins"] + user[format + "losses"])) * 1000) / 10 + "%"
    }
}

function sort(players, format){
    var max = (Object.keys(players).length > 500) ? 500 : Object.keys(players).length
    var result = []
    var bestplayer = new Object
    var bestindex = -3424
    for(var i = 0; i < max; i++){
        var highest = 0
        for(var player of Object.keys(players)){
            if(players[player][format + "wins"] + players[player][format + "losses"])
            if(players[player][format + "rating"] > highest){
                highest = players[player][format + "rating"]
                bestplayer = players[player]
                bestplayer.id = player
                bestindex = player
            }
        }
        if(highest == 0){
            break
        }
        result.push(bestplayer)
        delete players[bestindex]
    }
    return result
}

function pullformat(format){
    axios.get("/players").then(function(res){
        loadLadder(sort(res.data, format), format);
    }).catch(function (err) {
        //error
        console.log(err);
    });
}

axios.get("/players").then(function(res){
    loadLadder(sort(res.data, "s12"), "s12");
}).catch(function (err) {
    //error
    console.log(err);
});

