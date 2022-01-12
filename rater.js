const apiurl = "https://dtmwra1jsgyb0.cloudfront.net/"
const request = require("sync-request")
const fs = require('fs')
const e = require("express")
const tours = require("./tours.json")
const formats = require("./formats.json")

roundcount = 1
roundmax = 0
stagecount = 1
stagemax = 0
tourname = ""
tourformat = ""
players = new Object

function rate(tid, callback){
    tourid = tid
    stagecount = 1
    stages(JSON.parse(request("GET", apiurl + "tournaments/"+ tourid).getBody()))

}

function stages(body){
    tourname = body.name
    stagemax = body.stageIDs.length
    for(let stage of body.stageIDs){
        currentstage = stage
        roundcount = 1
        rounds(JSON.parse((request("GET", apiurl + "stages/" + stage)).getBody()))
        stagecount++;
    }
}

function rounds(body){
    roundmax = body.bracket.roundsCount
    for(let i = 1; i < body.bracket.roundsCount + 1; i++){
        fites = JSON.parse((request("GET", apiurl + "stages/" + currentstage + "/matches?roundNumber=" + i)).getBody())
        if(fites.length <= 0){
            continue;
        }
        matches(fites)
        roundcount++;
    }
    if(stagecount == stagemax){
        standings = JSON.parse((request("GET", apiurl + "stages/" + currentstage + "/standings")).getBody())
        for(s of standings){
            x = s.place
            id = s.team.userID
            if(x == 1){
                players[id].results.push(tourname + ": <strong>1st</strong>")
            }
            else if(x == 2){
                players[id].results.push(tourname + ": <strong>2nd</strong>")
            }
            else{
                n = Math.pow(2,Math.ceil(Math.log(x)/Math.log(2)))
                players[id].results.push(tourname + ": <strong>Top "+ n + "</strong>")
            }
        }
    }
}

function matches(body){
    for(let match of body){
        if(match.isBye){
            continue;
        }
        rateplayers(match.bottom.team.userID, match.top.team.userID, match.bottom.winner, match.bottom.team.name, match.top.team.name);
    }
}


function rateplayers(pid, opid, won, pname, opname){
    if(!(pid in players)){
        players[pid] = {
            name : pname,
            results : []
        }
        for(f of formats){
            players[pid][f + "rating"] = 1000
            players[pid][f + "wins"] = 0
            players[pid][f + "losses"] = 0
        }
    }
    prating = players[pid][tourformat + "rating"]
    players[pid].name = pname;
    if(!(opid in players)){
        players[opid] = {
            name : opname,
            results : []
        }
        for(f of formats){
            players[opid][f + "rating"] = 1000
            players[opid][f + "wins"] = 0
            players[opid][f + "losses"] = 0
        }
    }
    oprating = players[opid][tourformat + "rating"]
    players[opid].name = opname;
    players[pid][tourformat + "rating"] = rateind(prating, oprating, won)
    players[opid][tourformat + "rating"] = rateind(oprating, prating, !won)
    /**
    if(stagecount == stagemax){
        if(roundcount == roundmax){
            if(won){
                players[pid].results.push(tourname + ": <strong>1st</strong>")
                players[opid].results.push(tourname + ": <strong>2nd</strong>")
            }
            else{
                players[opid].results.push(tourname + ": <strong>1st</strong>")
                players[pid].results.push(tourname + ": <strong>2nd</strong>")
            }
        }
        else{
            if(won){
                players[opid].results.push(tourname + ": <strong>Top " + 2 ** ((roundmax + 1) - roundcount) + "</strong>")
            }
            else{
                players[pid].results.push(tourname + ": <strong>Top " + 2 ** ((roundmax + 1) - roundcount) + "</strong>")
            }
        }
    }
    */
    if(won){
        players[pid][tourformat + "wins"]++;
        players[opid][tourformat + "losses"]++;
    }
    else{
        players[opid][tourformat + "wins"]++;
        players[pid][tourformat + "losses"]++;
    }
}

function rateind(rating, orating, win){
    r1 = 10 ** (prating / 400)
    r2 = 10 ** (orating / 400)
    e1 = r1 / (r1 + r2)
    s1 = win ? 1 : 0;
    if(rating >= 1600){
        k = 32;
    }
    else if(rating >= 1300){
        k = 40;
    }
    else if(rating >= 1100){
        k = 50;
    }
    else if(rating == 1000){
        k = win ? 80 : 20;
    }
    else{
        k = win ? 80 - (30 * ((rating - 1000) / 100)) : k = 20 + (30 * ((rating - 1000) / 100));
    }
    f = rating + (k * (s1 - e1));
    if(f <= 1000){
        return 1000;
    }
    else{
        return f;
    }

}
for(format of formats){
    tourformat = format
    for(tour of tours[tourformat]){
        rate(tour);
    }
}

fs.writeFileSync("players.json", JSON.stringify(players))

