const crypto = require('crypto');

class CryptoUtils {
  static generateSecureKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  static generateSecureInt(min, max) {
    return crypto.randomInt(min, max);
  }

  static calculateHMAC(message, key) {
    return crypto.createHmac('sha256', key)
      .update(String(message))
      .digest('hex');
  }
}

module.exports = CryptoUtils;