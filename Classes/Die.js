class Die {
  constructor(faces, index) {
    this.faces = faces;
    this.index = index;
  }

  getFaces() {
    return this.faces;
  }

  getIndex() {
    return this.index;
  }

  toString() {
    return this.faces.join(',');
  }
}

module.exports = Die;