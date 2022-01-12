"use strict"

function fillInfo(player){
    var name = document.getElementById("name");
    var s12rating = document.getElementById("s12rating");
    var s12games = document.getElementById("s12played");
    var s12wl = document.getElementById("s12wl");
    var s12winperc = document.getElementById("s12winperc");
    var bdsprating = document.getElementById("bdsprating");
    var bdspgames = document.getElementById("bdspplayed");
    var bdspwl = document.getElementById("bdspwl");
    var bdspwinperc = document.getElementById("bdspwinperc");
    var resultlist = document.getElementById("resultlist");
    name.innerHTML = player.name;
    s12rating.innerHTML = Math.floor(player.s12rating);
    s12games.innerHTML = player.s12wins + player.s12losses;
    s12wl.innerHTML = player.s12wins + "/" + player.s12losses;
    s12winperc.innerHTML = Math.round((player.s12wins / (player.s12wins + player.s12losses)) * 1000) / 10 + "%"
    bdsprating.innerHTML = Math.floor(player.bdsprating);
    bdspgames.innerHTML = player.bdspwins + player.bdsplosses;
    bdspwl.innerHTML = player.bdspwins + "/" + player.bdsplosses;
    bdspwinperc.innerHTML = Math.round((player.bdspwins / (player.bdspwins + player.bdsplosses)) * 1000) / 10 + "%"
    if(player.results.length <= 0){
        let li = document.createElement("li");
        li.innerHTML = "No top cuts yet :(";
        resultlist.appendChild(li);
    }
    else{
        for(let i = 0; i < player.results.length; i++){
            let row = resultlist.insertRow()
            row.innerHTML = player.results[i];
        }
    }
}

axios.get("/usersdata" + window.location.search).then(function(res){
    fillInfo(res.data);
}).catch(function (err) {
    //error
    console.log(err);
  });