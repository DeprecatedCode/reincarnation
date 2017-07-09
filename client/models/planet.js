const Tile = require('./tile');

module.exports = class Planet {
  constructor() {
    this.keys = {};
    this.acceleration = 0.01;
    this.deceleration = 0.005;
    this.maxMoveSpeed = 0.5;
    this.velocityX = 0.85;
    this.velocityY = -0.85;
    this.viewportX = 0;
    this.viewportY = 0;
    this.viewportHeight = 400;
    this.viewportWidth = 600;
    this.size = 50;
    this.zoom = 13;
    this.zoomTarget = 10;
    this.grid = {};
  }

  renderToElement(parent) {
    this.parent = parent;
    this.element = document.createElement('div');
    this.element.classList.add('planet');
    this.element.style.width = `${this.size * Tile.size}px`;
    this.parent.appendChild(this.element);

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let tile = this.grid[`${x}:${y}`] = new Tile();
        this.element.appendChild(tile.element);
        if (x >= this.size / 2) {
          tile.element.classList.add('swap-x-candidate');  
        }
        if (y >= this.size / 2) {
          tile.element.classList.add('swap-y-candidate');  
        }
      }
    }

    this.render();
  }

  ['keyDown:-']() {
    this.zoom -= 1;
    if (this.zoom < 1) {
      this.zoom = 1;
    }
  }
  
  ['keyDown:=']() {
    this.zoom += 1;
    if (this.zoom > 20) {
      this.zoom = 20;
    }
  }

  ['keyDown:ArrowUp']() { this.keys['ArrowUp'] = true; }
  ['keyUp:ArrowUp']() { this.keys['ArrowUp'] = false; }

  ['keyDown:ArrowDown']() { this.keys['ArrowDown'] = true; }
  ['keyUp:ArrowDown']() { this.keys['ArrowDown'] = false; }

  ['keyDown:ArrowLeft']() { this.keys['ArrowLeft'] = true; }
  ['keyUp:ArrowLeft']() { this.keys['ArrowLeft'] = false; }

  ['keyDown:ArrowRight']() { this.keys['ArrowRight'] = true; }
  ['keyUp:ArrowRight']() { this.keys['ArrowRight'] = false; }

  moveViewport() {
    // Handle pressed keys

    if (this.keys.ArrowUp) {
      this.velocityY = Math.min(this.maxMoveSpeed, this.velocityY + this.acceleration);
    }

    if (this.keys.ArrowDown) {
      this.velocityY = Math.max(-this.maxMoveSpeed, this.velocityY - this.acceleration);
    }

    if (this.keys.ArrowLeft) {
      this.velocityX = Math.min(this.maxMoveSpeed, this.velocityX + this.acceleration);
    }

    if (this.keys.ArrowRight) {
      this.velocityX = Math.max(-this.maxMoveSpeed, this.velocityX - this.acceleration);
    }

    // Y-direction

    if (this.velocityY > this.deceleration) {
      this.velocityY -= this.deceleration;
    }

    else if (this.velocityY > 0) {
      this.velocityY = 0;
    }

    if (this.velocityY < -this.deceleration) {
      this.velocityY += this.deceleration;
    }

    else if (this.velocityY < 0) {
      this.velocityY = 0;
    }

    this.viewportY += this.velocityY;

    if (this.viewportY < -this.size / 2) {
      this.viewportY += this.size;
    }

    else if (this.viewportY > this.size / 2) {
      this.viewportY -= this.size;
    }

    // X-direction

    if (this.velocityX > this.deceleration) {
      this.velocityX -= this.deceleration;
    }

    else if (this.velocityX > 0) {
      this.velocityX = 0;
    }

    if (this.velocityX < -this.deceleration) {
      this.velocityX += this.deceleration;
    }

    else if (this.velocityX < 0) {
      this.velocityX = 0;
    }

    this.viewportX += this.velocityX;

    if (this.viewportX < -this.size / 2) {
      this.viewportX += this.size;
    }

    else if (this.viewportX > this.size / 2) {
      this.viewportX -= this.size;
    }
  }

  updateZoom() {
    this.zoom = this.zoom + (this.zoomTarget - this.zoom) / 20;
  }

  render() {
    this.moveViewport();
    this.updateZoom();

    this.element.style.transformOrigin = `top left`;
    const scale = Math.pow(1.2, this.zoom - 10);
    this.element.style.transform = `translate(${Tile.size * this.viewportX}px, ${Tile.size * this.viewportY}px) scale(${scale})`;
    this.viewportX > 0 ? this.element.classList.add('swap-x-on') : this.element.classList.remove('swap-x-on');
    this.viewportY > 0 ? this.element.classList.add('swap-y-on') : this.element.classList.remove('swap-y-on');
    requestAnimationFrame(() => this.render());
  }
};
