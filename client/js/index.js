"use strict"

function loadLadder(ladder){
    var table = document.getElementById("ladder");
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
        rating.innerHTML = Math.floor(user.rating);
        games.innerHTML = user.wins + user.losses;
        wl.innerHTML = user.wins + "/" + user.losses;
        winperc.innerHTML = Math.round((user.wins / (user.wins + user.losses)) * 1000) / 10 + "%"
    }
}

function sort(players){
    var max = (Object.keys(players).length > 500) ? 500 : Object.keys(players).length
    var result = []
    var bestplayer = new Object
    var bestindex = -3424
    for(var i = 0; i < max; i++){
        var highest = 0
        for(var player of Object.keys(players)){
            if(players[player].rating > highest){
                highest = players[player].rating
                bestplayer = players[player]
                bestplayer.id = player
                bestindex = player
            }
        }
        result.push(bestplayer)
        delete players[bestindex]
    }
    return result
}

axios.get("/players").then(function(res){
    loadLadder(sort(res.data));
}).catch(function (err) {
    //error
    console.log(err);
  });

