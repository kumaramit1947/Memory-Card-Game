// Unicode for all the emojis
const emojis = ["&#x1F600", "&#x1F923", "&#x1F642", "&#x1F607", "&#x1F929", "&#x1F910"];
const allFaces = [...emojis, ...emojis];

const container = document.querySelector(".container");
const modal = document.querySelector(".result-modal");
const timer = document.querySelector('#time');
const flips = document.querySelector('#flips');
const level = document.querySelector('#level');

// Header detail variables
let timerStart = 45;
let flipsCount = 0;
let levelCount = 1;
let countDown = timerStart;
// ****************
// to store the previous clicked card
let previousCard = "first";
// to check if rejection process is going on -> used to prevent other cards to be clicked until rejection process is over 
let inProcess = false;
let leftCount = 12;
let timeInterval;
let winTimeout;

// Function to attach the Emojis to the Front side of each Card
function setEmojis(isWin = false) {
    clearInterval(timeInterval);
    clearTimeout(winTimeout);
    cards.forEach((card) => {
        card.classList.remove("rotate");
        card.querySelector(".front").classList.remove("visible", "success", "reject");
    });
    flipsCount = 0;
    leftCount=12;
    if (isWin) {
        levelCount++;
        timerStart--;
    }
    countDown = timerStart;
    setTimer(timerStart);
    setFlips(flipsCount);
    setLevel(levelCount);
    previousCard = "first";
    modal.classList.add("hide");
    container.classList.remove("hide");
    allFaces.sort((a, b) => Math.random() - 0.5);
    fronts.forEach((ele, ind) => {
        ele.innerHTML = allFaces[ind];
    });

}
// ***********
// Functions to set the header section details
function setTimer(t) {
    timer.textContent = t;
}
function setFlips(f) {
    flips.textContent = f;
}
function setLevel(l) {
    level.textContent = l;
}
// ***************
// Function to start the timer
function startTimerFunc(func,interval){
     func();
     return setInterval(func,interval);
}
function timerCallback() {
    setTimer(countDown--);
    if (countDown < 0) {
        resultModal(false);
    }
}
// **************
// Function to check if the clicked cards match or not
function checkCard(e) {
    if (e.target.classList.contains('front') || inProcess) return;
    setFlips(++flipsCount);
    if (previousCard === "first") {
        previousCard = null;
        timeInterval = startTimerFunc(timerCallback,1000);
    }
    const card = e.target;
    const front = card.querySelector('.front');
    card.classList.add('rotate');
    front.classList.add('visible');

    if (previousCard === null) {
        previousCard = front;
        return;
    }
    if (previousCard.textContent === front.textContent) {
        previousCard.classList.add('success');
        front.classList.add('success');
        leftCount -= 2;
        previousCard = null;
        if (leftCount === 0) resultModal(true);
    }
    else {
        inProcess = true;
        previousCard.classList.add('reject');
        front.classList.add('reject');
        setTimeout(() => {
            previousCard.parentNode.classList.remove('rotate');
            previousCard.classList.remove('visible', 'reject');
            card.classList.remove('rotate');
            front.classList.remove('visible', 'reject');
            previousCard = null;
            inProcess = false;
        }, 1000);
    }

}
// ********************
// Function to perform action on Winning the round
function resultModal(isWin) {
    clearInterval(timeInterval);
    container.classList.add("hide");
    const winMsg = modal.querySelector(".win-msg");
    const loseMsg = modal.querySelector(".lose-msg");
    modal.classList.remove("hide");
    // cards.forEach((card) => {
    //     card.classList.remove("rotate");
    //     card.querySelector(".front").classList.remove("visible", "success", "reject");
    // });
    if (isWin) {
        loseMsg.classList.add("hide");
        winMsg.classList.remove("hide");
        // modal.classList.remove("reject");
        // modal.classList.add("success");
        winTimeout=setTimeout(() => {
            setEmojis(isWin);
        }, 5000);
    }
    else {
        winMsg.classList.add("hide");
        loseMsg.classList.remove("hide");
        // modal.classList.remove("success");
        // modal.classList.add("reject");
    }
}
// *******************
// Creating 12 Cards -- here emojis are not being attached yet 
for (let count = 0; count < 12; count++) {
    const card = document.createElement('div');
    card.textContent="?";
    card.classList.add('card');
    container.append(card);
}

// Creating the Front side of each Card, then attaching the Emojis on each Front side 
const cards = container.querySelectorAll('.card');
cards.forEach((ele, ind) => {
    const front = document.createElement("div");
    front.classList.add('front');
    ele.append(front);
});
const fronts = container.querySelectorAll('.front');
setEmojis();
// *************

// Attaching Handler for every Click Event on individual Card
cards.forEach((card) => {
    card.addEventListener('click', checkCard);
});



