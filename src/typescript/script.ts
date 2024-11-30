const url : string = '/assets/API/players.json';
let playersList = document.getElementById('players-list') as HTMLDivElement;
let playersCount = 0;
let switchCards = false;

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

    // Card already selected

    if (currentPlayerCard != null) {
        this.querySelector('.card-options')?.remove();
        this.classList.add('player-card');
        currentPlayerCard.classList.remove('selected');

        // Switching Cards

        if (switchCards == true) {
            // Switch Content
            let cParent = currentPlayerCard.parentElement as HTMLElement;
            let tParent = this.parentElement as HTMLElement;

            let intermediate = currentPlayerCard.parentElement?.className;
            cParent.className = this.parentElement?.className as string;
            tParent.className = intermediate as string;

            // this.classList.remove('active', 'possible-position');
            // this.classList.add('player-card');
            // this?.querySelector('.card-options')?.remove();
            // currentPlayerCard.classList.remove('active', 'possible-position');
            // currentPlayerCard.classList.add('player-card');
            currentPlayerPlaceholder?.querySelector('.card-options')?.remove();
                
                
            currentPlayerPlaceholder = null;
            currentPlayerCard = null;
            showAllPlayers();
            resetCards();
            switchCards = false;
            return;
        } else {
            this.innerHTML = currentPlayerCard.innerHTML;
            currentPlayerCard.classList.add('already-selected');
            this.classList.remove('active');
        }
        currentPlayerCard = null;
        hideRelevantPositions();
        return;
    } 


    this.classList.add('active');
    currentPlayerPlaceholder?.classList.remove('active');
    currentPlayerPlaceholder?.querySelector('.card-options')?.remove();
    currentPlayerPlaceholder = this;


    if (this.classList.contains('player-card')) {
        addOptions(this);
    }
    
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
    switchCards = false;
    if (currentPlayerPlaceholder != null) {
        currentPlayerPlaceholder?.classList.add('player-card');
        currentPlayerPlaceholder?.classList.remove('active');
        currentPlayerPlaceholder.innerHTML = this.innerHTML;
        currentPlayerPlaceholder = null;
        this.classList.add('already-selected');
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

//--------------------------------
// *** Search
//--------------------------------

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

//---------------------------------
// *** Add Options
//---------------------------------

function addOptions(element: HTMLElement) {
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
    })

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
            } else {
                item.classList.add('blocked-position');
            }
            currentPlayerCard = element;
            switchCards = true;
        })
    })

    element.append(div);
    
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

//-------------------------------
// *** Reset Cards
//-------------------------------


function resetCards() {
    selectedPlayersPlaceholders.forEach(item => {
        item.classList.remove('active', 'possible-position', 'blocked-position')
    });
}

//------------------------------------
// *** Formation
//------------------------------------

let formationSelect = document.getElementById('formation-select') as HTMLSelectElement;


formationSelect.addEventListener('change', function () {
    let positions = this.value.split('-');

    selectedPlayersPlaceholders.forEach((card, index) => {
        let cardHTML = card.parentElement as HTMLElement;

        cardHTML.className = "selected-player-container " + positions[index];
        if (card.getAttribute('data-position') != positions[index].replace(/[0-9]/, "") && !card.querySelector('.plus')) {
            card.classList.add('misplaced');
        } else {
            card.classList.remove('misplaced');
        }
        card.setAttribute('data-position', positions[index].replace(/[0-9]/, ""));
        if (!card.classList.contains('player-card')) {
            (card.querySelector('.role') as HTMLElement).textContent = positions[index].replace(/[0-9]/, "");
        }
    })
    
});