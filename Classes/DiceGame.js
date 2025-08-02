const readline = require('readline');
const DiceParser = require('./DiceParser');
const CryptoUtils = require('./CryptoUtils');
const FairRandomGenerator = require('./FairRandomGenerator');
const ProbabilityCalculator = require('./ProbabilityCalculator');
const TableGenerator = require('./TableGenerator');

class DiceGame {
  constructor() {
    this.dice = [];
    this.probabilities = {};
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async initialize(args) {
    this.dice = DiceParser.parse(args);
    this.probabilities = ProbabilityCalculator.calculateAllProbabilities(this.dice);
    
    console.log('Loaded dice:');
    this.dice.forEach(die => {
      console.log(`  Die ${die.getIndex()}: ${die.toString()}`);
    });
  }

  async determineFirstPlayer() {
    console.log('\nDetermining who makes the first move...');
    const firstPlayerIndex = await FairRandomGenerator.generateFairNumber(
      0, 2, 
      'Enter your number (0 or 1): ', 
      this.rl
    );
    
    const firstPlayer = firstPlayerIndex === 0 ? 'computer' : 'user';
    console.log(`First player: ${firstPlayer}`);
    return firstPlayer;
  }

  async showMenu(availableDice) {
    console.log('\nAvailable options:');
    availableDice.forEach(die => {
      console.log(`${die.getIndex()} - Die ${die.getIndex()} (${die.toString()})`);
    });
    console.log('? - Help/Table');
    console.log('9 - Exit');
  }

  async getUserChoice(availableDice) {
    return new Promise(resolve => {
      const askChoice = () => {
        this.rl.question('Your choice: ', answer => {
          const choice = answer.trim();
          
          if (choice === '9') {
            resolve('exit');
          } else if (choice === '?') {
            resolve('help');
          } else {
            const dieIndex = parseInt(choice, 10);
            const selectedDie = availableDice.find(die => die.getIndex() === dieIndex);
            if (selectedDie) {
              resolve(selectedDie);
            } else {
              console.log('Invalid choice. Please try again.');
              askChoice();
            }
          }
        });
      };
      askChoice();
    });
  }

  async selectDice(firstPlayer) {
    const availableDice = [...this.dice];
    let userDie, computerDie;

    if (firstPlayer === 'computer') {
      const computerIndex = CryptoUtils.generateSecureInt(0, availableDice.length);
      computerDie = availableDice.splice(computerIndex, 1)[0];
      console.log(`\nComputer selected Die ${computerDie.getIndex()} (${computerDie.toString()})`);
      
      await this.showMenu(availableDice);
      const userChoice = await this.getUserChoice(availableDice);
      
      if (userChoice === 'exit') return null;
      if (userChoice === 'help') {
        this.showHelp();
        return this.selectDice(firstPlayer);
      }
      
      userDie = userChoice;
    } else {

      await this.showMenu(availableDice);
      const userChoice = await this.getUserChoice(availableDice);
      
      if (userChoice === 'exit') return null;
      if (userChoice === 'help') {
        this.showHelp();
        return this.selectDice(firstPlayer);
      }
      
      userDie = userChoice;
      const userIndex = availableDice.findIndex(die => die.getIndex() === userDie.getIndex());
      availableDice.splice(userIndex, 1);
      
      const computerIndex = CryptoUtils.generateSecureInt(0, availableDice.length);
      computerDie = availableDice[computerIndex];
      console.log(`Computer selected Die ${computerDie.getIndex()} (${computerDie.toString()})`);
    }

    return { userDie, computerDie };
  }

  async rollDice(userDie, computerDie) {
    console.log('\n=== ROLLING DICE ===');
    
    console.log(`\nRolling your die (Die ${userDie.getIndex()})...`);
    const userRoll = await FairRandomGenerator.generateFairNumber(
      0, userDie.getFaces().length,
      `Enter your number (0-${userDie.getFaces().length - 1}): `,
      this.rl
    );
    const userResult = userDie.getFaces()[userRoll];
    console.log(`Your roll: ${userResult}`);
    
    console.log(`\nRolling computer's die (Die ${computerDie.getIndex()})...`);
    const computerRoll = await FairRandomGenerator.generateFairNumber(
      0, computerDie.getFaces().length,
      `Enter your number (0-${computerDie.getFaces().length - 1}): `,
      this.rl
    );
    const computerResult = computerDie.getFaces()[computerRoll];
    console.log(`Computer roll: ${computerResult}`);
    
    console.log('\n=== RESULTS ===');
    if (userResult > computerResult) {
      console.log('🎉 You won!');
    } else if (userResult < computerResult) {
      console.log('🤖 Computer won!');
    } else {
      console.log('🤝 It\'s a tie!');
    }
  }

  showHelp() {
    const table = TableGenerator.generateProbabilityTable(this.dice, this.probabilities);
    console.log(table);
  }

  cleanup() {
    this.rl.close();
  }

  async run() {
    try {
      const args = process.argv.slice(2);
      await this.initialize(args);
      
      const firstPlayer = await this.determineFirstPlayer();
      const diceSelection = await this.selectDice(firstPlayer);
      
      if (!diceSelection) {
        console.log('Game cancelled.');
        return;
      }
      
      const { userDie, computerDie } = diceSelection;
      await this.rollDice(userDie, computerDie);
      
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    } finally {
      this.cleanup();
    }
  }
}

module.exports = DiceGame;