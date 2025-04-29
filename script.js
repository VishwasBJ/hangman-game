document.addEventListener('DOMContentLoaded', () => {
    // Game variables
    const wordLists = {
        easy: [
            "cat", "dog", "sun", "moon", "book", "tree", "fish", "bird", "cake",
            "ball", "home", "car", "star", "milk", "game", "hat", "pen", "cup"
        ],
        medium: [
            "python", "coding", "program", "browser", "keyboard", "monitor", "website",
            "internet", "computer", "software", "function", "variable", "object", "method"
        ],
        hard: [
            "algorithm", "javascript", "developer", "framework", "database", "inheritance",
            "encryption", "authentication", "deployment", "middleware", "repository", "architecture"
        ]
    };
    
    let currentWord = "";
    let guessedLetters = new Set();
    let incorrectGuesses = 0;
    let maxAttempts = 6;
    let gameOver = false;
    let wins = 0;
    let losses = 0;
    let currentDifficulty = "easy";
    
    // DOM elements
    const wordDisplay = document.getElementById('word-display');
    const messageEl = document.getElementById('message');
    const attemptsLeft = document.getElementById('attempts-left');
    const guessedLettersContainer = document.getElementById('guessed-letters-container');
    const keyboard = document.getElementById('keyboard');
    const newGameBtn = document.getElementById('new-game-btn');
    const winsEl = document.getElementById('wins');
    const lossesEl = document.getElementById('losses');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const hangmanParts = document.querySelectorAll('.hangman-part');
    
    // Initialize the game
    function initGame() {
        // Create keyboard
        createKeyboard();
        
        // Start a new game
        newGame();
        
        // Event listeners
        newGameBtn.addEventListener('click', newGame);
        
        // Difficulty buttons
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentDifficulty = btn.dataset.difficulty;
                newGame();
            });
        });
    }
    
    // Create keyboard
    function createKeyboard() {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        
        keyboard.innerHTML = '';
        
        for (const letter of letters) {
            const button = document.createElement('button');
            button.textContent = letter;
            button.classList.add('key');
            button.dataset.letter = letter;
            button.addEventListener('click', () => handleGuess(letter));
            keyboard.appendChild(button);
        }
        
        // Add keyboard event listener
        document.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (/^[a-z]$/.test(key) && !gameOver) {
                handleGuess(key);
            }
        });
    }
    
    // Start a new game
    function newGame() {
        // Reset game state
        currentWord = getRandomWord();
        guessedLetters = new Set();
        incorrectGuesses = 0;
        gameOver = false;
        
        // Reset UI
        updateWordDisplay();
        updateAttemptsLeft();
        updateGuessedLetters();
        resetHangman();
        resetKeyboard();
        messageEl.textContent = '';
    }
    
    // Get a random word based on difficulty
    function getRandomWord() {
        const wordList = wordLists[currentDifficulty];
        return wordList[Math.floor(Math.random() * wordList.length)];
    }
    
    // Handle a letter guess
    function handleGuess(letter) {
        if (gameOver || guessedLetters.has(letter)) {
            return;
        }
        
        guessedLetters.add(letter);
        
        // Update keyboard
        const keyEl = document.querySelector(`.key[data-letter="${letter}"]`);
        keyEl.classList.add('used');
        
        if (currentWord.includes(letter)) {
            keyEl.classList.add('correct');
            updateWordDisplay();
            checkWin();
        } else {
            keyEl.classList.add('incorrect');
            incorrectGuesses++;
            updateHangman();
            updateAttemptsLeft();
            checkLoss();
        }
        
        updateGuessedLetters();
    }
    
    // Update the word display
    function updateWordDisplay() {
        wordDisplay.textContent = currentWord
            .split('')
            .map(letter => guessedLetters.has(letter) ? letter : '_')
            .join(' ');
    }
    
    // Update attempts left
    function updateAttemptsLeft() {
        attemptsLeft.textContent = maxAttempts - incorrectGuesses;
    }
    
    // Update guessed letters
    function updateGuessedLetters() {
        guessedLettersContainer.innerHTML = '';
        
        const sortedLetters = Array.from(guessedLetters).sort();
        
        for (const letter of sortedLetters) {
            const span = document.createElement('span');
            span.textContent = letter;
            span.classList.add('guessed-letter');
            
            if (currentWord.includes(letter)) {
                span.style.backgroundColor = '#2ecc71';
                span.style.color = 'white';
            } else {
                span.style.backgroundColor = '#e74c3c';
                span.style.color = 'white';
            }
            
            guessedLettersContainer.appendChild(span);
        }
    }
    
    // Update hangman drawing
    function updateHangman() {
        if (incorrectGuesses > 0 && incorrectGuesses <= hangmanParts.length) {
            hangmanParts[incorrectGuesses - 1].style.display = 'block';
        }
    }
    
    // Reset hangman drawing
    function resetHangman() {
        hangmanParts.forEach(part => {
            part.style.display = 'none';
        });
    }
    
    // Reset keyboard
    function resetKeyboard() {
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('used', 'correct', 'incorrect');
        });
    }
    
    // Check if player has won
    function checkWin() {
        const maskedWord = wordDisplay.textContent.replace(/\s/g, '');
        
        if (maskedWord === currentWord) {
            gameOver = true;
            wins++;
            winsEl.textContent = wins;
            messageEl.textContent = 'Congratulations! You won!';
            messageEl.style.color = '#2ecc71';
        }
    }
    
    // Check if player has lost
    function checkLoss() {
        if (incorrectGuesses >= maxAttempts) {
            gameOver = true;
            losses++;
            lossesEl.textContent = losses;
            messageEl.textContent = `Game over! The word was: ${currentWord}`;
            messageEl.style.color = '#e74c3c';
            
            // Reveal the word
            wordDisplay.textContent = currentWord.split('').join(' ');
        }
    }
    
    // Initialize the game
    initGame();
});