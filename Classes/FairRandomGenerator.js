const CryptoUtils = require('./CryptoUtils');

class FairRandomGenerator {
  static async generateFairNumber(min, max, prompt, rl) {
    console.log(`\nGenerating fair random number between ${min} and ${max - 1}...`);
    
    // Step 1: Generate cryptographically secure key
    const key = CryptoUtils.generateSecureKey();
    
    // Step 2: Generate computer number
    const computerNumber = CryptoUtils.generateSecureInt(min, max);
    
    // Step 3: Calculate HMAC
    const hmac = CryptoUtils.calculateHMAC(computerNumber, key);
    
    // Step 4: Show HMAC to user
    console.log('Computer has made its choice. HMAC:', hmac);
    
    // Step 5: Get user input
    const userNumber = await this.getUserNumber(prompt, min, max, rl);
    
    // Step 6: Calculate result using modular arithmetic
    const result = (computerNumber + userNumber) % max;
    
    // Step 7: Reveal key and computer number
    console.log(`Computer number: ${computerNumber}`);
    console.log(`Your number: ${userNumber}`);
    console.log(`Key: ${key}`);
    console.log(`Result: (${computerNumber} + ${userNumber}) % ${max} = ${result}`);
    console.log(`Verification HMAC: ${CryptoUtils.calculateHMAC(computerNumber, key)}`);
    
    return result;
  }

  static async getUserNumber(prompt, min, max, rl) {
    return new Promise(resolve => {
      const askNumber = () => {
        rl.question(prompt, answer => {
          const num = parseInt(answer.trim(), 10);
          if (Number.isInteger(num) && num >= min && num < max) {
            resolve(num);
          } else {
            console.log(`Please enter an integer between ${min} and ${max - 1}`);
            askNumber();
          }
        });
      };
      askNumber();
    });
  }
}

module.exports = FairRandomGenerator;