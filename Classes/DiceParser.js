const Die = require('./Die');

class DiceParser {
  static parse(args) {
    if (!Array.isArray(args) || args.length < 3) {
      throw new Error('Need at least 3 dice. Usage: node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3');
    }

    const dice = args.map((diceString, index) => {
      const faces = diceString.trim().split(',').map(faceValue => {
        const num = parseInt(faceValue.trim(), 10);
        if (!Number.isInteger(num)) {
          throw new Error(`Die #${index} contains non-integer value: "${faceValue}"`);
        }
        return num;
      });

      if (faces.length === 0) {
        throw new Error(`Die #${index} is empty`);
      }
      return new Die(faces, index);
    });

    const expectedFaces = dice[0].getFaces().length;
    const invalidDie = dice.find(die => die.getFaces().length !== expectedFaces);
    if (invalidDie) {
      throw new Error('All dice must have the same number of faces');
    }
    return dice;
  }
}

module.exports = DiceParser;