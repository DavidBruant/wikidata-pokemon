"use strict";

var http = require('http');
var https = require('https');

var wdk = require('wikidata-sdk')

/*
// Searching for pikachu entities

var url = wdk.searchEntities('pikachu');

https.get(url, function(res){
    console.log('STATUS', res.statusCode);
    //console.log('HEADERS', JSON.stringify(res.headers));
    
    var chunks = [];
    
    res.on('data', function (chunk) {
        chunks.push(chunk);
    });
    res.on('end', function() {
        var body = Buffer.concat(chunks);
        console.log(body.length, body);
        
        console.log(JSON.parse(body.toString()))
    })
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});
*/


// Being an 'instance of', P31 : https://www.wikidata.org/wiki/Property:P31
// Pokémon species: https://www.wikidata.org/wiki/Q3966183

http.get("http://wdq.wmflabs.org/api?q=claim[31:3966183]", function(res){
    console.log('STATUS', res.statusCode);
    
    var chunks = [];
    
    res.on('data', function (chunk) {
        chunks.push(chunk);
    });
    res.on('end', function() {
        var body = Buffer.concat(chunks);
        
        var result = JSON.parse(body.toString());
        var pokemonEntityIds = result.items;
        
        console.log('pokemonEntityIds', pokemonEntityIds.length);
        
        var pokemonsUrl = wdk.getEntities(pokemonEntityIds.slice(0, 50));
        
        https.get(pokemonsUrl, function(res){
            console.log('STATUS', res.statusCode);
            var chunks = [];

            res.on('data', function (chunk) {
                chunks.push(chunk);
            });
            res.on('end', function() {
                console.log()
                var body = Buffer.concat(chunks);
                var result = JSON.parse(body.toString());
                
                var entities = Object.keys(result.entities).map(function(k){ return result.entities[k] });
                var names = entities.map(function(e){
                    return e.labels.en.value;
                });
                
                
                console.log('POKEMONS', names);
                
                console.log(entities.slice(0, 5));
            })
        })
        
    })
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});


