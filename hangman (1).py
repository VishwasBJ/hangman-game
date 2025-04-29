import random
import time

class Hangman:
    def __init__(self):
        self.word_list = [
            "python", "javascript", "programming", "computer", "algorithm",
            "developer", "keyboard", "internet", "software", "hardware",
            "database", "network", "security", "framework", "variable",
            "function", "object", "method", "class", "inheritance"
        ]
        self.reset_game()
    
    def reset_game(self):
        self.word = random.choice(self.word_list).lower()
        self.guessed_letters = set()
        self.incorrect_guesses = 0
        self.max_attempts = 6
        self.game_over = False
        self.won = False
        return self.get_game_state()
    
    def guess(self, letter):
        if self.game_over:
            return self.get_game_state()
        
        letter = letter.lower()
        
        if letter in self.guessed_letters:
            return self.get_game_state()
        
        self.guessed_letters.add(letter)
        
        if letter not in self.word:
            self.incorrect_guesses += 1
            
        # Check if player has won
        if all(letter in self.guessed_letters for letter in self.word):
            self.won = True
            self.game_over = True
        
        # Check if player has lost
        if self.incorrect_guesses >= self.max_attempts:
            self.game_over = True
        
        return self.get_game_state()
    
    def get_masked_word(self):
        return ''.join([letter if letter in self.guessed_letters else '_' for letter in self.word])
    
    def get_game_state(self):
        return {
            "word": self.word if self.game_over else self.get_masked_word(),
            "guessed_letters": sorted(list(self.guessed_letters)),
            "incorrect_guesses": self.incorrect_guesses,
            "remaining_attempts": self.max_attempts - self.incorrect_guesses,
            "game_over": self.game_over,
            "won": self.won
        }

# Demo of how the game works
if __name__ == "__main__":
    game = Hangman()
    print("Welcome to Hangman!")
    print(f"Word to guess: {game.get_masked_word()}")
    
    while not game.game_over:
        guess = input("Guess a letter: ").lower()
        if len(guess) != 1 or not guess.isalpha():
            print("Please enter a single letter.")
            continue
        
        state = game.guess(guess)
        print(f"Word: {state['word']}")
        print(f"Guessed letters: {', '.join(state['guessed_letters'])}")
        print(f"Remaining attempts: {state['remaining_attempts']}")
        
    if game.won:
        print(f"Congratulations! You guessed the word: {game.word}")
    else:
        print(f"Game over! The word was: {game.word}")