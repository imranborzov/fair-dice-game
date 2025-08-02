const Table = require('cli-table3');

class TableGenerator {
  static generateProbabilityTable(dice, probabilities) {
    const headers = ['Die', ...dice.map(die => `Die ${die.getIndex()}`)];
    const subHeaders = ['', ...dice.map(die => die.toString())];
    const table = new Table({
      head: headers,
      style: {
        head: ['cyan', 'bold'],
        border: ['grey']
      }
    });

    table.push(subHeaders.map((header, index) => {
      if (index === 0) return 'Faces';
      return { content: header, hAlign: 'center' };
    }));

    table.push(new Array(headers.length).fill('─'.repeat(10)));

    for (let i = 0; i < dice.length; i++) {
      const die = dice[i];
      const row = [`Die ${die.getIndex()}`];
      
      for (let j = 0; j < dice.length; j++) {
        if (i === j) {
          row.push({ content: '─', hAlign: 'center' });
        } else {
          const prob = (probabilities[i][j] * 100).toFixed(1) + '%';
          row.push({ content: prob, hAlign: 'center' });
        }
      }
      
      table.push(row);
    }

    return '\nProbability table (rows beat columns):\n' + table.toString();
  }
}

module.exports = TableGenerator;