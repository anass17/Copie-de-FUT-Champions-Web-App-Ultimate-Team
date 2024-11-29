const url : string = '/assets/API/players.json';
let playersList = document.getElementById('players-list') as HTMLDivElement;
let playersCount = 0;

interface PlayersDate {
    id: number,
    name: string,
    position: string[],
    nationality: string,
    league: string,
    club: string,
    overall_rating: number,
    nation_icon: string,
    club_logo: string,
    age: number,
    player_number: number,
    player_image?: string
}

interface Players {
    players: PlayersDate[];
}

playersList.innerHTML = '';

fetch(url)
    .then(response => response.json())
    .then((data : Players) => {
        for (let player of data.players) {
            addPlayerCard(player)
        }
        playersCount = data.players.length;
    })
	.catch(error => console.log(error))

let selectedPlayersPlaceholders = document.querySelectorAll('.selected-player');
let currentPlayerPlaceholder : Element | null = null;
let currentPlayerCard : Element | null = null;

selectedPlayersPlaceholders.forEach((item) => {
    item.addEventListener('click', showRelevantPlayers);
})

function addPlayerCard(player : PlayersDate) {
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

function showRelevantPlayers(this: HTMLElement) {
    let position = this.dataset.position as string;

    if (this.classList.contains('active')) {
        currentPlayerPlaceholder?.classList.remove('active');
        currentPlayerPlaceholder?.querySelector('.card-options')?.remove();
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

    currentPlayerPlaceholder?.querySelector('.card-options')?.remove();

    if (this.classList.contains('player-card')) {
        addOptions(this);
    }

    currentPlayerPlaceholder?.classList.remove('active');
    currentPlayerPlaceholder = this;

    this.classList.add('active');
    
    playersList.querySelectorAll('.player-card').forEach((item) => {

        const element = item as HTMLElement;

        if ((item.getAttribute('data-position')?.search(position) as number) >= 0) {
            element.style.display = "";
        } else {
            element.style.display = "none";
        }
    });
}

function addPlayerToStadium(this : HTMLElement) {
    if (currentPlayerPlaceholder != null) {
        currentPlayerPlaceholder?.classList.add('player-card');
        currentPlayerPlaceholder?.classList.remove('active');
        currentPlayerPlaceholder.innerHTML = this.innerHTML;
        currentPlayerPlaceholder = null;
        showAllPlayers();
    } else if (!this.classList.contains('selected')) {
        currentPlayerCard?.classList.remove('selected');
        this.classList.add('selected');
        currentPlayerCard = this;

        showRelevantPositions();
    } else {
        this.classList.remove('selected');
        currentPlayerCard = null;
        hideRelevantPositions();
    }
}

function showAllPlayers() {
    playersList.querySelectorAll('.player-card').forEach((item) => {

        const element = item as HTMLElement;

        element.style.display = "";
    });
}

function showRelevantPositions() {
    let position = currentPlayerCard?.getAttribute('data-position') as string;
    selectedPlayersPlaceholders.forEach((item) => {
        let HTMLItem = item as HTMLElement;
        if (position.search((item.getAttribute('data-position') as string)) >= 0) {
            HTMLItem.classList.add('possible-position');
            HTMLItem.classList.remove('blocked-position')
        } else {
            HTMLItem.classList.remove('possible-position');
            HTMLItem.classList.add('blocked-position')
        }
    })
}

function hideRelevantPositions() {
    selectedPlayersPlaceholders.forEach((item) => {
        let HTMLItem = item as HTMLElement;
        HTMLItem.classList.remove('possible-position');
        HTMLItem.classList.remove('blocked-position');
    })
}

let searchInput = document.getElementById('search');

searchInput?.addEventListener('keyup', function (this: HTMLInputElement) {
    playersList.querySelectorAll('.player-card').forEach((item) => {

        const element = item as HTMLElement;

        if (((item.querySelector('.player-name')?.textContent as string).toLocaleLowerCase().search(this.value.toLocaleLowerCase()) >= 0)) {
            element.style.display = "flex";
        } else {
            element.style.display = "none";
        }
    });
});

function addOptions(element: HTMLElement) {
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
    })
}

let menu = document.getElementById('menu') as HTMLElement;

menu?.firstElementChild?.addEventListener('click', function () {
    if (!menu.classList.contains('open')) {
        menu.classList.add('open');
        menu.classList.remove('closed');
    } else {
        menu.classList.remove('open');
        menu.classList.add('closed');
    }
});

menu.querySelector('.pen-icon')?.addEventListener('click', function () {
    modal.style.display = "flex";
});

//-----------------------------------------
// *** Modal: Add players
//-----------------------------------------

let modal = document.getElementById('modal-container') as HTMLElement;
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
]

modal?.querySelector('.close-btn')?.addEventListener('click', function () {
    modal.style.display = 'none';
});

modal.querySelector('.add-player')?.addEventListener('click', function () {
    let errors : boolean = false;
    for (let i = 0; i < inputs.length; i++) {
        let itemHTML = inputs[i] as HTMLInputElement;

        if (itemHTML.value.search(validRegExp[i]) >= 0) {
            itemHTML.style.borderColor = "";
        } else {
            itemHTML.style.borderColor = "red";
            errors = true;
        }
    }

    if (errors == true) {
        return;
    }
    //C:\fakepath\green-player-background.png

    let data : PlayersDate = {
        id: ++playersCount,
        name: (inputs[0] as HTMLInputElement).value,
        age: +(inputs[1] as HTMLInputElement).value,
        player_number: +(inputs[2] as HTMLInputElement).value,
        overall_rating: 
            Math.round((+(inputs[3] as HTMLInputElement).value 
            + +(inputs[4] as HTMLInputElement).value
            + +(inputs[5] as HTMLInputElement).value
            + +(inputs[6] as HTMLInputElement).value
            + +(inputs[7] as HTMLInputElement).value
            + +(inputs[8] as HTMLInputElement).value) / 6),
        nationality: (inputs[9] as HTMLInputElement).value,
        nation_icon: `https://www.countryflags.com/wp-content/uploads/${(inputs[9] as HTMLInputElement).value}-flag-png-large.png`,
        position: [(inputs[10] as HTMLInputElement).value],
        league: (inputs[11] as HTMLInputElement).value,
        club: "",
        player_image: "/assets/API/imgs/players/" + (inputs[12] as HTMLInputElement).value.replace("C:\\fakepath\\", ''),
        club_logo: "/assets/API/imgs/club/" + (inputs[13] as HTMLInputElement).value.replace("C:\\fakepath\\", ''),
    }


    addPlayerCard(data);
    modal.style.display = 'none';
});

inputs.forEach((item, index) => {
    let itemHTML = item as HTMLInputElement;
    itemHTML.addEventListener('blur', function () {
        if (this.value.search(validRegExp[index]) >= 0) {
            this.style.borderColor = "";
        } else {
            this.style.borderColor = "red";
        }
    })
})