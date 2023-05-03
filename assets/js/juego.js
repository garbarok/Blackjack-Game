const miModulo = (() => {
  "use strict";

  let deck = [];
  const suits = ["C", "D", "H", "S"],
    faceCards = ["A", "J", "Q", "K"];

  let playerScores = [];

  // HTML element references
  const btnDraw = document.querySelector("#btnPedir"),
    btnHold = document.querySelector("#btnDetener"),
    btnNewGame = document.querySelector("#btnNuevo");

  const playerCardsDivs = document.querySelectorAll(".divCartas"),
    scoreElements = document.querySelectorAll("small");

  // Initialize the game
  const initializeGame = (numPlayers = 2) => {
    deck = createDeck();

    playerScores = [];
    for (let i = 0; i < numPlayers; i++) {
      playerScores.push(0);
    }

    scoreElements.forEach((elem) => (elem.innerText = 0));
    playerCardsDivs.forEach((elem) => (elem.innerHTML = ""));

    btnDraw.disabled = false;
    btnHold.disabled = false;
  };

  // Create a new deck
  const createDeck = () => {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let suit of suits) {
        deck.push(i + suit);
      }
    }

    for (let suit of suits) {
      for (let faceCard of faceCards) {
        deck.push(faceCard + suit);
      }
    }
    return _.shuffle(deck);
  };

  // Draw a card from the deck
  const drawCard = () => {
    if (deck.length === 0) {
      throw "No hay cartas en el deck";
    }
    return deck.pop();
  };

  const cardValue = (card) => {
    const value = card.substring(0, card.length - 1);
    return isNaN(value) ? (value === "A" ? 11 : 10) : value * 1;
  };

  // Accumulate points for a player
  const accumulatePoints = (card, playerIndex) => {
    playerScores[playerIndex] = playerScores[playerIndex] + cardValue(card);
    scoreElements[playerIndex].innerText = playerScores[playerIndex];
    return playerScores[playerIndex];
  };

  const createCardElement = (card, playerIndex) => {
    const imgCard = document.createElement("img");
    imgCard.src = `assets/cartas/${card}.png`;
    imgCard.classList.add("carta");
    playerCardsDivs[playerIndex].append(imgCard);
  };

  const determineWinner = () => {
    const [minPlayerScore, computerScore] = playerScores;
    const gameResult = document.getElementById("gameResult");

    setTimeout(() => {
      let resultMessage = "";
      if (computerScore === minPlayerScore) {
        resultMessage = "Nadie gana";
      } else if (minPlayerScore > 21) {
        resultMessage = "Computadora gana";
      } else if (computerScore > 21) {
        resultMessage = "Jugador gana";
      } else {
        resultMessage = "Computadora gana";
      }
      gameResult.textContent = resultMessage;
    }, 200);
  };

  // Computer's turn
  const computerTurn = (minPlayerScore) => {
    let computerScore = 0;

    do {
      const card = drawCard();
      computerScore = accumulatePoints(card, playerScores.length - 1);
      createCardElement(card, playerScores.length - 1);
    } while (computerScore < minPlayerScore && minPlayerScore <= 21);

    determineWinner();
  };

  // Event Listeners
  btnDraw.addEventListener("click", () => {
    const card = drawCard();
    const playerScore = accumulatePoints(card, 0);

    createCardElement(card, 0);

    if (playerScore > 21) {
      console.warn("Lo siento, has perdido.");
      btnDraw.disabled = true;
      btnHold.disabled = true;

      computerTurn(playerScore);
    } else if (playerScore === 21) {
      console.warn("21, genial!");
      btnDraw.disabled = true;
      btnHold.disabled = true;

      computerTurn(playerScore);
    }
  });

  btnHold.addEventListener("click", () => {
    computerTurn(playerScores[0]);
    btnDraw.disabled = true;
    btnHold.disabled = true;
  });

  btnNewGame.addEventListener("click", () => {
    initializeGame();
  });

  return {
    newGame: initializeGame,
  };
})();
