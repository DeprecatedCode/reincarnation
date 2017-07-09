require('./styles/index.css');

const gameArea = document.createElement('div');
gameArea.classList.add('game-area');
document.body.appendChild(gameArea);

const Planet = require('./models/planet');
const world = new Planet();
world.renderToElement(gameArea);

const keyDownMap = {};
document.body.addEventListener(
  'keydown', event => {
    if (!(event.key in keyDownMap)) {
      if (`keyDown:${event.key}` in world) {
        keyDownMap[event.key] = () => world[`keyDown:${event.key}`]();
      }
      else {
        keyDownMap[event.key] = false;
        console.warn(`No action for keyDown:${event.key}`);
      }
    }
    if (keyDownMap[event.key]) { 
      keyDownMap[event.key](event);
    }
  }
);

const keyUpMap = {};
document.body.addEventListener(
  'keyup', event => {
    if (!(event.key in keyUpMap)) {
      if (`keyUp:${event.key}` in world) {
        keyUpMap[event.key] = () => world[`keyUp:${event.key}`]();
      }
      else {
        keyUpMap[event.key] = false;
        console.warn(`No action for keyUp:${event.key}`);
      }
    }
    if (keyUpMap[event.key]) { 
      keyUpMap[event.key](event);
    }
  }
);
