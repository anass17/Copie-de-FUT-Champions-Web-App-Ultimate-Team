"use strict";
const url = '/assets/API/players.json';
let playersList = document.getElementById('players-list');
playersList.innerHTML = '';
fetch(url)
    .then(response => response.json())
    .then((data) => {
    console.log(data.players);
    for (let player of data.players) {
        let div = document.createElement('div');
        div.className = "player-card";
        div.innerHTML = `<div class="card-header">
                <h3 class="player-position">${player.position}</h3>
                <div>
                    <img class="player-image" src="assets/API/imgs/players/${player.name}.png" alt="">
                </div>
                <div>
                    <b class="player-rating">${player.overall_rating}</b>
                </div>
            </div>
            <h3 class="player-name">${player.name}</h3>
            <div class="player-info">
                <span>Age: ${player.age}</span>
                <span>N.: ${player.player_number}</span>
            </div>
            <h4 class="player-ligue">${player.league}</h4>
            <div class="player-assets">
                <img src="${player.nation_icon}" alt="" class="player-flag">
                <img src="${player.club_logo}" alt="" class="player-club">
            </div>`;
        playersList.append(div);
    }
})
    .catch(error => console.log(error));
