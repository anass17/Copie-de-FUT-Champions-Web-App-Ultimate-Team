"use strict";
var _a, _b, _c, _d;
const url = '/assets/API/players.json';
let playersList = document.getElementById('players-list');
let playersCount = 0;
let switchCards = false;
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
    var _a, _b, _c, _d, _e, _f;
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
    // Card already selected
    if (currentPlayerCard != null) {
        (_b = this.querySelector('.card-options')) === null || _b === void 0 ? void 0 : _b.remove();
        this.classList.add('player-card');
        currentPlayerCard.classList.remove('selected');
        // Switching Cards
        if (switchCards == true) {
            // Switch Content
            let cParent = currentPlayerCard.parentElement;
            let tParent = this.parentElement;
            let intermediate = (_c = currentPlayerCard.parentElement) === null || _c === void 0 ? void 0 : _c.className;
            cParent.className = (_d = this.parentElement) === null || _d === void 0 ? void 0 : _d.className;
            tParent.className = intermediate;
            // this.classList.remove('active', 'possible-position');
            // this.classList.add('player-card');
            // this?.querySelector('.card-options')?.remove();
            // currentPlayerCard.classList.remove('active', 'possible-position');
            // currentPlayerCard.classList.add('player-card');
            (_e = currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.querySelector('.card-options')) === null || _e === void 0 ? void 0 : _e.remove();
            currentPlayerPlaceholder = null;
            currentPlayerCard = null;
            showAllPlayers();
            resetCards();
            switchCards = false;
            return;
        }
        else {
            this.innerHTML = currentPlayerCard.innerHTML;
            currentPlayerCard.classList.add('already-selected');
            this.classList.remove('active');
        }
        currentPlayerCard = null;
        hideRelevantPositions();
        return;
    }
    this.classList.add('active');
    currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.remove('active');
    (_f = currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.querySelector('.card-options')) === null || _f === void 0 ? void 0 : _f.remove();
    currentPlayerPlaceholder = this;
    if (this.classList.contains('player-card')) {
        addOptions(this);
    }
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
    switchCards = false;
    if (currentPlayerPlaceholder != null) {
        currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.add('player-card');
        currentPlayerPlaceholder === null || currentPlayerPlaceholder === void 0 ? void 0 : currentPlayerPlaceholder.classList.remove('active');
        currentPlayerPlaceholder.innerHTML = this.innerHTML;
        currentPlayerPlaceholder = null;
        this.classList.add('already-selected');
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
//--------------------------------
// *** Search
//--------------------------------
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
//---------------------------------
// *** Add Options
//---------------------------------
function addOptions(element) {
    let div = document.createElement('div');
    div.className = "card-options";
    let deleteButton = document.createElement('button');
    deleteButton.className = "delete-option";
    deleteButton.textContent = "X";
    div.append(deleteButton);
    deleteButton.addEventListener('click', function (e) {
        e.stopPropagation();
        element.innerHTML =
            `<b class="role">${element.getAttribute('data-position')}</b>
            <span class="plus">+</span>`;
        element.classList.remove('player-card', 'active');
        currentPlayerPlaceholder = null;
        showAllPlayers();
    });
    let switchButton = document.createElement('button');
    switchButton.className = "switch-option";
    switchButton.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 224c0 17.7 14.3 32 32 32s32-14.3 32-32c0-53 43-96 96-96l160 0 0 32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9S320 19.1 320 32l0 32L160 64C71.6 64 0 135.6 0 224zm512 64c0-17.7-14.3-32-32-32s-32 14.3-32 32c0 53-43 96-96 96l-160 0 0-32c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6l0-32 160 0c88.4 0 160-71.6 160-160z"/></svg>`;
    div.append(switchButton);
    switchButton.addEventListener('click', function (e) {
        e.stopPropagation();
        selectedPlayersPlaceholders.forEach(item => {
            if (element != item && item.getAttribute('data-position') === element.getAttribute('data-position')) {
                item.classList.add('possible-position');
            }
            else {
                item.classList.add('blocked-position');
            }
            currentPlayerCard = element;
            switchCards = true;
        });
    });
    element.append(div);
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
//-------------------------------
// *** Reset Cards
//-------------------------------
function resetCards() {
    selectedPlayersPlaceholders.forEach(item => {
        item.classList.remove('active', 'possible-position', 'blocked-position');
    });
}
//------------------------------------
// *** Formation
//------------------------------------
let formationSelect = document.getElementById('formation-select');
formationSelect.addEventListener('change', function () {
    let positions = this.value.split('-');
    selectedPlayersPlaceholders.forEach((card, index) => {
        let cardHTML = card.parentElement;
        cardHTML.className = "selected-player-container " + positions[index];
        if (card.getAttribute('data-position') != positions[index].replace(/[0-9]/, "") && !card.querySelector('.plus')) {
            card.classList.add('misplaced');
        }
        else {
            card.classList.remove('misplaced');
        }
        card.setAttribute('data-position', positions[index].replace(/[0-9]/, ""));
        if (!card.classList.contains('player-card')) {
            card.querySelector('.role').textContent = positions[index].replace(/[0-9]/, "");
        }
    });
});
