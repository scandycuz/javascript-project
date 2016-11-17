let ORB_AMOUNT = 2;
let ORB_SPEED = 1.5;
let TURN_FACTOR = 6;

let KEYCODE_SPACE = 32;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_A = 65;
var KEYCODE_D = 68;

let numberOfOrbs = 2;
let bulletSpeed = 40;
let dim_x = 500;
let dim_y = 600;
let orbs = [];
let bullets = [];
let canvas, stage, position;
let cannonInstance;
let lfHeld = rtHeld = false;

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function init() {
  canvas = document.getElementById("gameCanvas");
	stage = new createjs.Stage(canvas);

  canvas.width = dim_x;
  canvas.height = dim_y;
  canvas.onclick = handleClick;
  document.addEventListener("keydown", handleClick);

  stage.update();
}

function addCannon() {
  cannonInstance = new createjs.Sprite(cannon);
  cannonInstance.gotoAndPlay(`static`);
  cannonInstance.x = canvas.width / 2;
  cannonInstance.y = canvas.height;
  cannonInstance.regX = 117;
  cannonInstance.regY = 168;
  stage.addChild(cannonInstance);
}

function addStandardOrb() {
  var standardOrbInstance = new createjs.Sprite(standardOrb);
  standardOrbInstance.position = randomPosition();
  standardOrbInstance.x = standardOrbInstance.position[0];
  standardOrbInstance.y = standardOrbInstance.position[1];
  standardOrbInstance.scaleX = 0.5;
  standardOrbInstance.scaleY = 0.5;
  standardOrbInstance.regX = 118;
  standardOrbInstance.regY = 118;
  standardOrbInstance.vector = randomVector();
  let speed = Math.random();
  standardOrbInstance.speed = ((speed < 0.5) ? speed + 0.5 : speed) * ORB_SPEED;
  standardOrbInstance.bounds = 30;

  let animationNum = Math.floor(Math.random() * 2) + 1;
  standardOrbInstance.gotoAndPlay(`spin${animationNum}`);
  orbs.push(standardOrbInstance);
  stage.addChild(standardOrbInstance);
}

function handleClick(event) {
	//prevent extra clicks and hide text
	canvas.onclick = null;
  document.removeEventListener("keydown", handleClick);

	restart();
}

function randomPosition() {
  let pos;
  let exists = false;
  while (exists === false) {
    exists = true;
    let posX = dim_x * Math.random();
    if (posX < 30) {
      posX += 30
    } else if (posX > dim_x - 30) {
      posX -= 30;
    }
    let posY = dim_y * Math.random();
    if (posY < 30) {
      posY += 30
    } else if (posY > dim_y - 30) {
      posY -= 30;
    }
    pos = [
      posX,
      posY
    ];

    for (let i = 0; i < orbs.length; i++) {
      let obj = {};
      obj.x = pos[0];
      obj.y = pos[1];
      obj.bounds = 30;

      if (hasCollided(obj, orbs[i])) {
        exists = false;
      }
    }
  }

  return pos;
}

function randomVector() {
  return [
    randomVectorCoord(),
    randomVectorCoord()
  ]
}

function randomVectorCoord() {
  let num = (Math.random() * 2) - 1;
  if (num < 0 && num > -0.5) {
    num -= 0.5;
  } else if (num > 0 && num < 0.5) {
    num += 0.5;
  }
  return num;
}

function reset() {
  stage.removeAllChildren();
  addCannon();
  orbs = [];
  bullets = [];
  createjs.Ticker.removeEventListener("tick", tick);
  return console.log('congrats!');
}

function restart() {
  stage.removeAllChildren();
  orbs = [];
  stage.clear();

  for (let i = 0; i < numberOfOrbs; i++) {
    addStandardOrb();
  }
  addCannon();

	//start game timer
	if (!createjs.Ticker.hasEventListener("tick")) {
		createjs.Ticker.addEventListener("tick", tick);
	}
}

function outOfBounds(obj, bounds) {
	return obj.x < 0 + bounds || obj.x > canvas.width - bounds || obj.y < 0 + bounds || obj.y > canvas.height - bounds;
}

function placeInBounds(obj, bounds) {
  if (obj.x < 0 + bounds || obj.x > canvas.width - bounds) {
    obj.vector[0] = obj.vector[0] * -1;
  } else {
    obj.vector[1] = obj.vector[1] * -1;
  }
}

function hasCollided(object, otherObject) {
  object.pos = [object.x, object.y];
  otherObject.pos = [otherObject.x, otherObject.y];
  const centerDist = Util.distanceBetween(object.pos, otherObject.pos);
  return centerDist < (object.bounds + otherObject.bounds);
}

function hasWon() {
  if (orbs.length === 0) {
    alert('congrats!');
    createjs.Ticker.removeAllEventListeners();
  }
}

function tick(event) {

  for (let i = 0; i < orbs.length; i++) {
    let orb = orbs[i];
    orb.rotation += (orb.speed);
    orb.x += orb.vector[0] * orb.speed;
		orb.y += orb.vector[1] * orb.speed;
    if (outOfBounds(orb, orb.bounds)) {
  		placeInBounds(orb, orb.bounds);
  	}
    for (let j = 0; j < bullets.length; j++) {
      let bullet = bullets[j];
      if (hasCollided(orb, bullet)) {
        orb.gotoAndPlay("explode");
        bullets[j].visible = false;
        bullets[j].vector = [0,0];
        setTimeout(function(){
          stage.removeChild(orb);
          stage.removeChild(bullets[j]);
          let orbIndex = orbs.indexOf(orb);
          if (orbIndex > -1) {
            orbs.splice(orbIndex, 1);
          }
          if (j > -1) {
            bullets.splice(j, 1);
          }
        }, 1000);
      }
    }
  }

  //handle bullet movement and looping
	for (bulletIdx in bullets) {
		var obj = bullets[bulletIdx];

		obj.x += Math.sin(obj.rotation * (Math.PI / -180)) * bulletSpeed * -1;
		obj.y += Math.cos(obj.rotation * (Math.PI / -180)) * bulletSpeed * -1;

    if (outOfBounds(obj, 0)) {
      stage.removeChild(obj);
    }
	}

  if (lfHeld && cannonInstance.rotation >= -72) {
		cannonInstance.rotation -= TURN_FACTOR;
	} else if (rtHeld && cannonInstance.rotation <= 72 ) {
		cannonInstance.rotation += TURN_FACTOR;
	}

  hasWon();

  stage.update(event);
}

function fireCannon() {
  cannonInstance.gotoAndPlay("fire");
  let bulletInstance = new createjs.Sprite(bullet);
  bulletInstance.x = cannonInstance.x;
  bulletInstance.y = cannonInstance.y;
  bulletInstance.scaleX = 0.25;
  bulletInstance.scaleY = 0.25;
  bulletInstance.regX = 4;
  bulletInstance.regY = 4;
  bulletInstance.vector = [0, 1];
  bulletInstance.rotation = cannonInstance.rotation;
  bulletInstance.bounds = 2;
  bulletInstance.gotoAndPlay(`static`);
  bullets.push(bulletInstance);
  stage.addChild(bulletInstance);
  stage.setChildIndex( bulletInstance, 0);
}

function handleKeyDown(e) {

	if (!e) {
		var e = window.event;
	}
	switch (e.keyCode) {
		case KEYCODE_SPACE:
			fireCannon();
			return false;
    case KEYCODE_A:
		case KEYCODE_LEFT:
			lfHeld = true;
			return false;
		case KEYCODE_D:
		case KEYCODE_RIGHT:
			rtHeld = true;
			return false;
	}
}

function handleKeyUp(e) {

	if (!e) {
		var e = window.event;
	}
	switch (e.keyCode) {
    case KEYCODE_A:
		case KEYCODE_LEFT:
			lfHeld = false;
			return false;
		case KEYCODE_D:
		case KEYCODE_RIGHT:
			rtHeld = false;
			return false;
	}
}
