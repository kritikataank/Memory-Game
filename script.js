// Array of card images (replace with your own images)
const cardImages = ['🐶', '🐱', '🐰', '🦊', '🦁', '🐻', '🐼', '🐨'];

// Duplicate the card images to create pairs
const cardPairs = cardImages.concat(cardImages);

let moveCounter = 0;
let matchedPairs = 0;
let timerInterval;
let isFlipped = false;
let firstCard, secondCard;

function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function stopGame() {
    clearInterval(timerInterval);
    isFlipped = true;
    firstCard = null;
    secondCard = null;
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.removeEventListener('click', flipCard));
}

function hideCongratsMessage() {
    const congratsMessage = document.getElementById('congratsMessage');
    congratsMessage.style.display = 'none';
}

function confettiEffect() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    const { innerWidth, innerHeight } = window;
    const DENSITY = 0.1;
    const PARTICLE_COUNT = Math.floor(DENSITY * (innerWidth * innerHeight) / 50);

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const particles = [];

    function Particle(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = Math.random() * 6 + 2;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.rotation = Math.random() * 360;
    }

    Particle.prototype.draw = function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.fillRect(-this.radius, -this.radius, this.radius * 2, this.radius * 2);
        ctx.closePath();
        ctx.restore();
    };

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particles.length; i++) {
            particles[i].x += particles[i].speedX;
            particles[i].y += particles[i].speedY;
            particles[i].rotation += Math.random() * 4 - 2;
            particles[i].draw();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * innerWidth;
        const y = Math.random() * innerHeight;
        const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        particles.push(new Particle(x, y, color));
    }

    animate();
}

function hideConfetti() {
    const confettiCanvas = document.getElementById('confettiCanvas');
    confettiCanvas.style.display = 'none';
}

function showConfetti() {
    const confettiCanvas = document.getElementById('confettiCanvas');
    confettiCanvas.style.display = 'block';
}

function startGame() {
    resetGame();
    startTimer();
}

function flipCard() {
    if (isFlipped) return;
    if (this === firstCard) return;

    this.classList.add('flipped');
    this.style.color = 'initial'; // Show the image
    this.style.backgroundImage = "url('blank.png')";

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkForMatch();
    }
}

function checkForMatch() {
    moveCounter++;
    updateMoveCounter();

    const isMatch = firstCard.innerText === secondCard.innerText;
    isFlipped = true;

    if (isMatch) {
        matchedPairs += 2;
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        firstCard = null;
        secondCard = null;
        isFlipped = false;
        setTimeout(() => {
            firstCard.classList.add("shake");
            secondCard.classList.add("shake");
        }, 400);
        setTimeout(() => {
            firstCard.classList.remove("shake", "flip");
            secondCard.classList.remove("shake", "flip");
            firstCard = secondCard = "";
            isFlipped = false;
        }, 1200);

        checkForWin();
    } else {
        isFlipped = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard.style.color = 'transparent'; // Hide the image again
            secondCard.style.color = 'transparent'; // Hide the image again
            firstCard.style.backgroundImage = "url('cover.png')";
            secondCard.style.backgroundImage = "url('cover.png')";
            firstCard = null;
            secondCard = null;
            isFlipped = false;
        }, 1000);
    }
}

function checkForWin() {
    if (matchedPairs === cardPairs.length) {
        clearInterval(timerInterval);

        // Show the congratulations message with confetti effect
        const congratsMessage = document.getElementById('congratsMessage');
        congratsMessage.style.display = 'block';

        // Remove click event listeners from all cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.removeEventListener('click', flipCard));

        // Display confetti effect
        confettiEffect();
        showConfetti();

        setTimeout(() => {
            congratsMessage.style.display = 'none'; // Hide the congratulations message
            resetGame(); // Restart the game
            hideConfetti(); // Hide the confetti
        }, 5000); // 5 seconds
        stopGame();
    }
}

function updateMoveCounter() {
    const moveCounterElement = document.getElementById('moveCounter');
    moveCounterElement.innerText = moveCounter;
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    let seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const formattedSeconds = String(seconds % 60).padStart(2, '0');
        timerElement.innerText = `${minutes}:${formattedSeconds}`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    const timerElement = document.getElementById('timer');
    timerElement.innerText = '00:00';
}

function resetGame() {
    moveCounter = 0;
    matchedPairs = 0;
    isFlipped = false;
    firstCard = null;
    secondCard = null;

    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';

    document.getElementsByTagName('h1')[0].style.display = 'none';

    shuffleCards(cardPairs);

    for (const card of cardPairs) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.innerText = card;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    }

    // Hide the congratulations message if it was visible
    hideCongratsMessage();
    hideConfetti();
    resetTimer();
    updateMoveCounter();
}


document.getElementById('resetbutton').addEventListener('click', resetGame);
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('stopbutton').addEventListener('click', stopGame);
