const DiceGame = require('./Classes/DiceGame');

if (require.main === module) {
  const game = new DiceGame();
  game.run();
}