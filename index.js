const express = require("express");
const favicon = require('serve-favicon');
const url = require("url");
const http = require("http");
const fs = require("fs")

const port = 80;
const app = express();
app.use(express.static(__dirname + "/client", {extensions:['html']}));
app.use(favicon(__dirname + '/favicon.ico'));


app.get("/players", function(req, res){
    fs.readFile('players.json', (err, data) => {
        if (err) throw err;
        let players = JSON.parse(data);
        res.json(players)
    });
});

app.get("/usersdata", function(req, res){
    fs.readFile('players.json', (err, data) => {
        if (err) throw err;
        let players = JSON.parse(data);
        let id = url.parse(req.url, true).query["id"]
        res.json(players[id])
    });
});

http.createServer(app).listen(port);
