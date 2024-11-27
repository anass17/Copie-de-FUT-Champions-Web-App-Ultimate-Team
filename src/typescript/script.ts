const url : string = '/assets/API/players.json';
let playersList = document.getElementById('players-list') as HTMLDivElement;

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
    player_number: number
}

interface Players {
    players: PlayersDate[];
}

playersList.innerHTML = '';

fetch(url)
    .then(response => response.json())
    .then((data : Players) => {
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
	.catch(error => console.log(error))

let selectedPlayersPlaceholders = document.querySelectorAll('.selected-player');
let currentPlayerPlaceholder : Element | null = null;
let currentPlayerCard : Element | null = null;

selectedPlayersPlaceholders.forEach((item) => {
    item.addEventListener('click', showRelevantPlayers);
})


function showRelevantPlayers(this: HTMLElement) {
    let position = this.dataset.position as string;

    if (this.classList.contains('active')) {
        currentPlayerPlaceholder?.classList.remove('active');
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