module.exports = class Tile {
  static get size() {
    return 50;
  }

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('tile');
    this.element.style.background = `#228${Math.random().toString(16)[2]}33`;
  }
}
