"use strict";
const url = '/assets/API/players.json';
let playersList = document.getElementById('players-list');
playersList.innerHTML = '';
fetch(url)
    .then(response => response.json())
    .then((data) => {
    for (let player of data.players) {
        let div = document.createElement('div');
        div.className = "player-card";
        div.dataset.position = player.position.join('-');
        div.addEventListener('click', addPlayerToStadium);
        div.innerHTML = `<div class="card-header">
                <h3 class="player-position">${player.position[0]}</h3>
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
let selectedPlayersPlaceholders = document.querySelectorAll('.selected-player');
let currentPlayerPlaceholder = null;
let currentPlayerCard = null;
selectedPlayersPlaceholders.forEach((item) => {
    item.addEventListener('click', showRelevantPlayers);
});
function showRelevantPlayers() {
    let position = this.dataset.position;
    if (this.classList.contains('active')) {
        currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.remove('active');
        currentPlayerPlaceholder = null;
        showAllPlayers();
        return;
    }
    if (this.classList.contains('blocked-position')) {
        return;
    }
    if (currentPlayerCard != null) {
        console.log(currentPlayerCard.innerHTML);
        this.innerHTML = currentPlayerCard.innerHTML;
        this.classList.add('player-card');
        currentPlayerCard.classList.remove('selected');
        currentPlayerCard = null;
        hideRelevantPositions();
        return;
    }
    currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.remove('active');
    currentPlayerPlaceholder = this;
    this.classList.add('active');
    playersList.querySelectorAll('.player-card').forEach((item) => {
        var _a;
        const element = item;
        if (((_a = item.getAttribute('data-position')) === null || _a === void 0 ? void 0 : _a.search(position)) >= 0) {
            element.style.display = "";
        }
        else {
            element.style.display = "none";
        }
    });
}
function addPlayerToStadium() {
    if (currentPlayerPlaceholder != null) {
        currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.add('player-card');
        currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.remove('active');
        currentPlayerPlaceholder.innerHTML = this.innerHTML;
        currentPlayerPlaceholder = null;
        showAllPlayers();
    }
    else if (!this.classList.contains('selected')) {
        currentPlayerCard === null || currentPlayerCard === void 0 ? void 0 : currentPlayerCard.classList.remove('selected');
        this.classList.add('selected');
        currentPlayerCard = this;
        showRelevantPositions();
    }
    else {
        this.classList.remove('selected');
        currentPlayerCard = null;
        hideRelevantPositions();
    }
}
function showAllPlayers() {
    playersList.querySelectorAll('.player-card').forEach((item) => {
        const element = item;
        element.style.display = "";
    });
}
function showRelevantPositions() {
    let position = currentPlayerCard === null || currentPlayerCard === void 0 ? void 0 : currentPlayerCard.getAttribute('data-position');
    selectedPlayersPlaceholders.forEach((item) => {
        let HTMLItem = item;
        if (position.search(item.getAttribute('data-position')) >= 0) {
            HTMLItem.classList.add('possible-position');
            HTMLItem.classList.remove('blocked-position');
        }
        else {
            HTMLItem.classList.remove('possible-position');
            HTMLItem.classList.add('blocked-position');
        }
    });
}
function hideRelevantPositions() {
    selectedPlayersPlaceholders.forEach((item) => {
        let HTMLItem = item;
        HTMLItem.classList.remove('possible-position');
        HTMLItem.classList.remove('blocked-position');
    });
}
let searchInput = document.getElementById('search');
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener('keyup', function () {
    playersList.querySelectorAll('.player-card').forEach((item) => {
        var _a;
        const element = item;
        if ((((_a = item.querySelector('.player-name')) === null || _a === void 0 ? void 0 : _a.textContent).toLocaleLowerCase().search(this.value.toLocaleLowerCase()) >= 0)) {
            element.style.display = "flex";
        }
        else {
            element.style.display = "none";
        }
    });
});
