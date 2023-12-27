let cards = [];
let playersData = [];

function getPlayers() {
    // let numberOfPlayers = document.getElementById("numPlayers").value;
    // playersData = [];
    // for (let i = 0; i < numberOfPlayers; i++) {
    //     playersData[i] = {
    //         name: prompt("What is the name of the player " + (i + 1) + "?"),
    //         score: 0,
    //         id: i
    //     };
    // }
    // console.log(playersData);


    for (let i = 0; i < playersData.length; i++) {
        let playersContainer = document.createElement("div");
        playersContainer.className = "player";
        playersContainer.id = playersData[i].id;
        playersContainer.innerHTML = playersData[i].name + " : " + playersData[i].score;
        playersElement.appendChild(playersContainer);
    }
}

function renderScore() {
    playersElement.innerHTML = "";
    for (let i = 0; i < playersData.length; i++) {
        let playerContainer = document.createElement("div");
        playerContainer.className = "player";
        playerContainer.innerHTML = playersData[i].name + `
score: ` + playersData[i].score;
        playersElement.appendChild(playerContainer);
    }
}

function chooseColor() {
    let num6 = Math.floor(Math.random() * 1000000000000).toString();
    num6 = num6+num6+num6+num6+num6+num6;
    num6= num6.substring(0, 6);
    return "#" + num6;
}


function numCards() {
    let numberOfCards = (document.getElementById("numCards").value) / 2;
    if (numberOfCards < 2){numberOfCards=2}
    cards = [];
    for (let i = 0; i < numberOfCards; i++) {
        cards[i] = {
            color: chooseColor(),
            isOpen: false
        };
    }
    cards = cards.concat(cards);
    shuffle(cards);
    console.log(cards);
}


let timerElement = document.querySelector(".timer");
let scoreElement = document.querySelector(".score");
let boardElement = document.querySelector(".board");
let bodyElement = document.querySelector("body");
let playersElement = document.querySelector(".players");
let formElement = document.querySelector(".form");

let openedCards = [];
let matchedPairs = 0;
let movesCount = 0;
let timerIntervalId;
let timerValue = 0;
let startTime;

function getPlayersAndStartGame() {
    let numberOfPlayers = document.getElementById("numPlayers").value;
    if (numberOfPlayers < 1){numberOfPlayers=1}
    playersData = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        playersData[i] = {
            name: prompt("הכניסי שם לשחקנית מספר " + (i + 1) + ":"),
            score: 0,
            id: i
        };
    }
    console.log(playersData);
    numCards()
    startGame();  // כאשר סיימת להכניס את שמות השחקנים, תקרא לפונקציה startGame
    // playersElement.innerHTML = "";
    renderScore();

}

// כמו קודם, רק עם השינוי בקריאה לפונקציה getPlayersAndStartGame במקום לקרוא לפונקציה getPlayers
document.querySelector(".startGame").addEventListener("click", getPlayersAndStartGame);

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function startGame() {
    getPlayers();
    document.querySelector(".startGame").style.display = "none";
    movesCount = 0;
    matchedPairs = 0;
    openedCards = [];
    renderBoard();
    startTimer();
    startTime = new Date().getTime();
    currentPlayerIndex = 0; // הוספת משתנה למעקב אחרי מי השחקן הנוכחי
}



function renderBoard() {

    boardElement.innerHTML = "";

    for (let i = 0; i < cards.length; i++) {
        let cardContainer = document.createElement("div");
        cardContainer.className = "card";
        if ((cards[i].isOpen)) {
            cardContainer.innerHTML = `<div class="card-inner" style="background-color:${cards[i].color}; border-radius: 50%;"></div>`;
        }
        else {
            cardContainer.innerHTML = `<div class="card-inner" data-type="${cards[i].color}" onclick="flipCard(this)" ></div>`;
        }

        boardElement.appendChild(cardContainer);
    }
    console.log(cards)

}

function flipCard(event) {
    console.log ("תור שחקנית מספר " + (currentPlayerIndex + 1) + "!")

    const cardContainer = event.parentElement;

    if (openedCards.length < 2) {
        console.log(cardContainer);
        console.log(cardContainer.dataset.type);
        console.log(openedCards)
        cardContainer.innerHTML = `<div class="card-inner" style="background-color:${event.dataset.type}; border-radius: 50%;"></div>`;
        openedCards.push(event);

        if (openedCards.length === 2) {
            movesCount++;
            
            setTimeout(() => {
                checkMatch();
                renderBoard();
                updateScore();
            }, 1000);
            
            if (currentPlayerIndex === playersData.length) {
                currentPlayerIndex = 0;
            }
        }

        return;
    }

    renderBoard();
    updateScore();
}

הכגכהג

function checkMatch() {
    const firstCard = openedCards[0];
    const secondCard = openedCards[1];

    if (firstCard.dataset.type === secondCard.dataset.type) {
        let closeColor = firstCard.dataset.type;
        cards.forEach(v => { if (v.color === closeColor) v.isOpen = true; })
        // Match found
        matchedPairs++;

        playersData[currentPlayerIndex].score++;
        currentPlayerIndex++
        renderScore()


        console.log("playersData" + playersData);
        console.log("currentPlayerIndex" + currentPlayerIndex);
        console.log("cards after match" + cards);

        if (matchedPairs === cards.length / 2) {
            // All pairs matched, game over
            stopTimer();
            document.querySelector(".timer").style.display = "none";
            boardElement.style.display = "none";
            playersElement.style.display = "none";
            let endGame = document.querySelector(".endGame");
            let winner = ""
            let maxScore = 0;
            for (let i = 0; i < playersData.length; i++) {
                if (playersData[i].score > maxScore) {
                    winner = playersData[i].name;
                    maxScore = playersData[i].score;
                }
            }
            endGame.innerHTML = `<div class="endGame" style="z-index: 100;"><h1>Game Over</h1>
            <p>The winner is ${winner}  with ${maxScore} matches.</p>
            <p>Game time was: ${timerValue} seconds.</p></div>`;
        }
    } else {
        // No match
        let closeColor = firstCard.dataset.type;
        cards.forEach(v => { if (v.color === closeColor) v.isOpen = false; })
        closeColor = secondCard.dataset.type;
        cards.forEach(v => { if (v.color === closeColor) v.isOpen = false; })
        currentPlayerIndex++
    }

    openedCards = [];
    return;
}




function updateScore() {
    scoreElement.innerText = `Moves: ${movesCount}`;
}

function startTimer() {
    timerValue = 0;
    timerIntervalId = setInterval(() => {
        timerValue++;
        timerElement.innerText = `Time: ${timerValue}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerIntervalId);
    const endTime = new Date().getTime();
    const elapsedTime = (endTime - startTime) / 1000;
    timerElement.textContent = `Time: ${elapsedTime.toFixed(1)}s`;
}

