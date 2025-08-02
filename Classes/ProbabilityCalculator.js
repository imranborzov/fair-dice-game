class ProbabilityCalculator {
  static calculateWinProbability(die1, die2) {
    const faces1 = die1.getFaces();
    const faces2 = die2.getFaces();
    let wins = 0;
    let total = 0;

    for (const face1 of faces1) {
      for (const face2 of faces2) {
        total++;
        if (face1 > face2) {
          wins++;
        }
      }
    }

    return total > 0 ? wins / total : 0;
  }

  static calculateAllProbabilities(dice) {
    const probabilities = {};
    for (let i = 0; i < dice.length; i++) {
      probabilities[i] = {};
      for (let j = 0; j < dice.length; j++) {
        if (i !== j) {
          probabilities[i][j] = this.calculateWinProbability(dice[i], dice[j]);
        }
      }
    }
    return probabilities;
  }
}

module.exports = ProbabilityCalculator;