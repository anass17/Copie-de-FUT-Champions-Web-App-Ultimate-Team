"use strict";
var _a, _b, _c, _d;
const url = '/assets/API/players.json';
let playersList = document.getElementById('players-list');
let playersCount = 0;
playersList.innerHTML = '';
fetch(url)
    .then(response => response.json())
    .then((data) => {
    for (let player of data.players) {
        addPlayerCard(player);
    }
    playersCount = data.players.length;
})
    .catch(error => console.log(error));
let selectedPlayersPlaceholders = document.querySelectorAll('.selected-player');
let currentPlayerPlaceholder = null;
let currentPlayerCard = null;
selectedPlayersPlaceholders.forEach((item) => {
    item.addEventListener('click', showRelevantPlayers);
});
function addPlayerCard(player) {
    let div = document.createElement('div');
    div.className = "player-card";
    div.dataset.position = player.position.join('-');
    div.addEventListener('click', addPlayerToStadium);
    div.innerHTML = `<div class="card-header">
        <h3 class="player-position">${player.position[0]}</h3>
        <div>
            <img class="player-image" src="${player.player_image || `assets/API/imgs/players/${player.name}.png`}" alt="">
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
function showRelevantPlayers() {
    var _a, _b;
    let position = this.dataset.position;
    if (this.classList.contains('active')) {
        currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.remove('active');
        (_a = currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.querySelector('.card-options')) === null || _a === void 0 ? void 0 : _a.remove();
        currentPlayerPlaceholder = null;
        showAllPlayers();
        return;
    }
    if (this.classList.contains('blocked-position')) {
        return;
    }
    if (currentPlayerCard != null) {
        this.innerHTML = currentPlayerCard.innerHTML;
        this.classList.add('player-card');
        currentPlayerCard.classList.remove('selected');
        currentPlayerCard = null;
        hideRelevantPositions();
        return;
    }
    (_b = currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.querySelector('.card-options')) === null || _b === void 0 ? void 0 : _b.remove();
    if (this.classList.contains('player-card')) {
        addOptions(this);
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
function addOptions(element) {
    let div = document.createElement('div');
    div.className = "card-options";
    let button = document.createElement('button');
    button.className = "delete-option";
    button.textContent = "X";
    div.append(button);
    element.append(div);
    div.addEventListener('click', function (e) {
        e.stopPropagation();
        element.innerHTML =
            `<b class="role">${element.getAttribute('data-position')}</b>
            <span class="plus">+</span>`;
        element.classList.remove('player-card', 'active');
        currentPlayerPlaceholder = null;
        showAllPlayers();
    });
}
let menu = document.getElementById('menu');
(_a = menu === null || menu === void 0 ? void 0 : menu.firstElementChild) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
    if (!menu.classList.contains('open')) {
        menu.classList.add('open');
        menu.classList.remove('closed');
    }
    else {
        menu.classList.remove('open');
        menu.classList.add('closed');
    }
});
(_b = menu.querySelector('.pen-icon')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
    modal.style.display = "flex";
});
//-----------------------------------------
// *** Modal: Add players
//-----------------------------------------
let modal = document.getElementById('modal-container');
let inputs = modal.querySelectorAll('input, select');
let validRegExp = [
    /^[a-z A-Z]+$/,
    /^[1-5][0-9]$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[1-9][0-9]?$/,
    /^[a-z ]+$/,
    /^[A-Z]+$/,
    /^[a-zA-Z 0-9]+$/,
    /\.(png|jpg|jpeg|webp)$/,
    /\.(png|jpg|jpeg|webp)$/,
];
(_c = modal === null || modal === void 0 ? void 0 : modal.querySelector('.close-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
    modal.style.display = 'none';
});
(_d = modal.querySelector('.add-player')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', function () {
    let errors = false;
    for (let i = 0; i < inputs.length; i++) {
        let itemHTML = inputs[i];
        if (itemHTML.value.search(validRegExp[i]) >= 0) {
            itemHTML.style.borderColor = "";
        }
        else {
            itemHTML.style.borderColor = "red";
            errors = true;
        }
    }
    if (errors == true) {
        return;
    }
    //C:\fakepath\green-player-background.png
    let data = {
        id: ++playersCount,
        name: inputs[0].value,
        age: +inputs[1].value,
        player_number: +inputs[2].value,
        overall_rating: Math.round((+inputs[3].value
            + +inputs[4].value
            + +inputs[5].value
            + +inputs[6].value
            + +inputs[7].value
            + +inputs[8].value) / 6),
        nationality: inputs[9].value,
        nation_icon: `https://www.countryflags.com/wp-content/uploads/${inputs[9].value}-flag-png-large.png`,
        position: [inputs[10].value],
        league: inputs[11].value,
        club: "",
        player_image: "/assets/API/imgs/players/" + inputs[12].value.replace("C:\\fakepath\\", ''),
        club_logo: "/assets/API/imgs/club/" + inputs[13].value.replace("C:\\fakepath\\", ''),
    };
    addPlayerCard(data);
    modal.style.display = 'none';
});
inputs.forEach((item, index) => {
    let itemHTML = item;
    itemHTML.addEventListener('blur', function () {
        if (this.value.search(validRegExp[index]) >= 0) {
            this.style.borderColor = "";
        }
        else {
            this.style.borderColor = "red";
        }
    });
});
