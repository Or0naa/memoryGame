const emojis = [
    "card1.jpg", "card2.jpg", "card3.jpg", "card4.jpg",
    "card5.jpg", "card6.jpg", "card7.jpg", "card8.jpg"
];
                    


const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
};

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    selectedCards: []
};
const audio = document.getElementById('audio');
const audioMatch = document.getElementById('audioMatch');


function shuffle(arrayForShuffling) {
    let temp;
    for (let i = 0; i < arrayForShuffling.length * 2; i++) {
        let random1 = Math.floor(Math.random() * arrayForShuffling.length);
        let random2 = Math.floor(Math.random() * arrayForShuffling.length);
        temp = arrayForShuffling[random1];
        arrayForShuffling[random1] = arrayForShuffling[random2];
        arrayForShuffling[random2] = temp;
    }
    return arrayForShuffling;
}

const pickRandom = (array, items) => {
    const arrayForShuffling = [...array];
    const randomPicks = [];
    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * arrayForShuffling.length);
        randomPicks.push(arrayForShuffling[randomIndex]);
        arrayForShuffling.splice(randomIndex, 1);
    }
    return randomPicks;
};

const generateGame = () => {
    const dimensions = 4; 

    const picks = pickRandom(emojis, (dimensions * dimensions) / 2); 
    const items = shuffle([...picks, ...picks]);
    const cards = `
        <div class="board">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">
                        <img src="imges/${item}" alt="Card Image" data-img="${item}">
                    </div>
                </div>
            `).join('')}
       </div>
    `;

    const parser = new DOMParser().parseFromString(cards, 'text/html');
    selectors.board.replaceWith(parser.querySelector('.board'));
};


const startGame = () => {
    state.gameStarted = true;
    selectors.start.classList.add('disabled');

    state.loop = setInterval(() => {
        state.totalTime++;
        selectors.moves.innerText = `${state.totalFlips} moves`;
        selectors.timer.innerText = `time: ${state.totalTime} sec`;
    }, 1000);
};

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });
    state.flippedCards = 0;
    state.selectedCards = [];
};

const compareCards = () => {
    const [firstCard, secondCard] = state.selectedCards;
 
    if (firstCard.src === secondCard.src) {
        firstCard.parentElement.parentElement.classList.add('matched');
        secondCard.parentElement.parentElement.classList.add('matched');
        audio.play();
    } else {
        audioMatch.play();
    }
};


const flipCard = card => {
    if (!state.gameStarted) {
        startGame();
    }

    if (!card.classList.contains('flipped') && state.flippedCards < 2) {
        card.classList.add('flipped');
        state.flippedCards++;
        state.selectedCards.push(card.querySelector('.card-back img'));
    }

    if (state.flippedCards === 2) {
        state.totalFlips++;
        compareCards();
        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }

    if (!document.querySelectorAll('.card:not(.matched)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped');
            selectors.win.innerHTML = `
                <span class="win-text">
                    You won!<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `;
            clearInterval(state.loop);
        }, 1000);
    }
};

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target;
        const eventParent = eventTarget.parentElement;

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame();
        }
    });
};

generateGame();
attachEventListeners();