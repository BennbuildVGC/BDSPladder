"use strict"

function fillInfo(player){
    var name = document.getElementById("name");
    var rating = document.getElementById("rating");
    var games = document.getElementById("played");
    var wl = document.getElementById("wl");
    var winperc = document.getElementById("winperc");
    var resultlist = document.getElementById("resultlist");
    name.innerHTML = player.name;
    rating.innerHTML = Math.floor(player.rating);
    games.innerHTML = player.wins + player.losses;
    wl.innerHTML = player.wins + "/" + player.losses;
    winperc.innerHTML = Math.round((player.wins / (player.wins + player.losses)) * 1000) / 10 + "%"
    if(player.results.length <= 0){
        let li = document.createElement("li");
        li.innerHTML = "No top cuts yet :(";
        resultlist.appendChild(li);
    }
    else{
        for(let i = 0; i < player.results.length; i++){
            let li = document.createElement("li");
            li.innerHTML = player.results[i];
            resultlist.appendChild(li);
        }
    }
}

axios.get("/usersdata" + window.location.search).then(function(res){
    fillInfo(res.data);
}).catch(function (err) {
    //error
    console.log(err);
  });