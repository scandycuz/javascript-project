let ORB_AMOUNT = 1;
let TURN_FACTOR = 5;

let KEYCODE_SPACE = 32;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;
var KEYCODE_A = 65;
var KEYCODE_D = 68;

let numberOfOrbs = 2;
let dynamicBullets;
let speedCountdown = 2;
let dimensionCountdown = 6;
let orbCountDown = 2;
let bulletSpeed = 40;
let orbSpeed = 6;
let dimX = 600;
let dimY = 800;
let orbs = [];
let bullets = [];
let canvas, stage, position;
let cannonInstance;
let lfHeld = rtHeld = false;
let levelComplete = false;
let shotsRemaining = 10;
let currentLevel = 1;
let shotsThisRound = 0;

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function init() {
  canvas = document.getElementById("gameCanvas");
	stage = new createjs.Stage(canvas);

  canvas.width = dimX;
  canvas.height = dimY;
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
  cannonInstance.regY = 180;
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
  standardOrbInstance.speed = ((speed < 0.5) ? speed + 0.5 : speed) * orbSpeed;
  standardOrbInstance.bounds = 36;
  standardOrbInstance.exploded = false;
  let animationNum = Math.floor(Math.random() * 2) + 1;
  standardOrbInstance.gotoAndPlay(`spin${animationNum}`);
  orbs.push(standardOrbInstance);
  stage.addChild(standardOrbInstance);
}

function handleClick(event) {
	canvas.onclick = null;
  document.removeEventListener("keydown", handleClick);

  reset();
	restart();
}

function randomPosition() {
  let pos;
  let exists = false;
  while (exists === false) {
    exists = true;
    let posX = dimX * Math.random();
    if (posX < 40) {
      posX = posX + 40
    } else if (posX > dimX - 40) {
      posX = posX - 40;
    }
    let posY = dimY * Math.random();
    if (posY < 40) {
      posY += 40
    } else if (posY > dimY - 40) {
      posY -= 40;
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
  return num;
}

function reset() {
  stage.removeAllChildren();
  stage.clear();
  orbs = [];
  bullets = [];
}

function nextLevel() {
  levelComplete = true;
  if (shotsThisRound === 1) {
    shotsRemaining++;
    // temporary
    alert(`Nice shooting! You get an extra shot, ${shotsRemaining} shots left`);
  } else {
    alert(`'${shotsRemaining} shots left'`);
  }

  setTimeout( () => {
    if (orbCountDown > 0) {
      orbCountDown--;
    } else {
      numberOfOrbs += ORB_AMOUNT;
      orbCountDown = 2;
    }

    if (speedCountdown > 0) {
      speedCountdown--;
    } else {
      orbSpeed += 0.5;
      speedCountdown = 2;
    }

    if (dimensionCountdown > 0) {
      dimensionCountdown--;
    } else {
      dimensionCountdown = 6;
      canvasAddition = canvas.width / 6
      canvas.width += canvasAddition;
      dimX += canvasAddition;;
    }

    restart();
  }, 600);
}

function restart() {
  levelComplete = false;
  shotsThisRound = 0;
  stage.removeAllChildren();
  stage.clear();
  addCannon();
  orbs = [];
  bullets = [];

  for (let i = 0; i < numberOfOrbs; i++) {
    addStandardOrb();
  }

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
  } else if (obj.y < 0 + bounds || obj.y > canvas.width - bounds) {
    obj.vector[1] = obj.vector[1] * -1;
  } else {
    obj.vector[0] = obj.vector[0] * -1;
    obj.vector[1] = obj.vector[1] * -1;
  }
}

function hasCollided(object, otherObject) {
  object.pos = [object.x, object.y];
  otherObject.pos = [otherObject.x, otherObject.y];
  const centerDist = Util.distanceBetween(object.pos, otherObject.pos);
  return centerDist < (object.bounds + otherObject.bounds);
}

function endGame() {
  // temporary UI
  alert('Game over!');
  reset();
}

function gameOver() {
  if (shotsRemaining <= 0) {
    let bulletArrayLength = bullets.length;
    let counter = 0;
    for (let i = 0; i < bullets.length; i++) {
      let bullet = bullets[i];
      if (outOfBounds(bullet, bullet.bounds)) {
        counter++;
      }
    }
    return (counter === bullets.length && shotsThisRound > 0 );
  } else {
    return false;
  }
}

function won() {
  return (!levelComplete && orbs.length === 0);
}

function orbExplode (orb, bulletObj) {
  let bulletCount = bulletObj.bulletCount;
  let bulletCountdown = bulletObj.bulletCountdown;

  if (bulletCount > 12) {
    // do nothing
  } else if (bulletCountdown > 0) {
    bulletCountdown--;
  } else if (bulletCountdown === 0) {
    bulletCountdown = 2;
    bulletCount = bulletCount + 4;
  }

  let degrees = 360;
  let angle = 360 / bulletCount;
  let angles = [];
  while(degrees > 0) {
    angles.push(degrees);
    degrees -= angle;
  }

  if (orbs.length > 0) {
    angles.forEach( (angle) => {
      let dynamicBulletInstance = new createjs.Sprite(bullet);
      dynamicBulletInstance.x = orb.x;
      dynamicBulletInstance.y = orb.y;
      dynamicBulletInstance.scaleX = 0.25;
      dynamicBulletInstance.scaleY = 0.25;
      dynamicBulletInstance.regX = 4;
      dynamicBulletInstance.regY = 4;
      let xVec = Math.cos(angle * 3.1459 / 180);
      let yVec = Math.sin(angle * 3.1459 / 180);
      dynamicBulletInstance.vector = [xVec, yVec];
      dynamicBulletInstance.bounds = 8;
      dynamicBulletInstance.dynamic = true;
      dynamicBulletInstance.active = true;
      dynamicBulletInstance.bulletCount = bulletCount;
      dynamicBulletInstance.bulletCountdown = bulletCountdown;
      dynamicBulletInstance.gotoAndPlay(`static`);
      bullets.push(dynamicBulletInstance);
      stage.addChild(dynamicBulletInstance);
    });
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
      let orbIndex = orbs.indexOf(orb);
      if (bullet.active && !orb.exploded && hasCollided(orb, bullet)) {
        if (orbIndex > -1) {
          orbs.splice(orbIndex, 1);
        }
        if (j > -1) {
          bullets.splice(j, 1);
        }
        orb.exploded = true;
        bullet.active = false;
        bullet.vector = [0, 0];
        bullet.visible = false;
        orb.gotoAndPlay("explode");
        orbExplode(orb, bullet);
        setTimeout( () => {
          stage.removeChild(bullet);
          stage.removeChild(orb);
        }, 600)
      }
    }
  }

	for (let i = 0; i < bullets.length; i++) {
		var bullet = bullets[i];

    if (bullet.dynamic === true) {
      bullet.x += bullet.vector[0] * bulletSpeed;
      bullet.y += bullet.vector[1] * bulletSpeed;
    } else {
      bullet.x += Math.sin(bullet.rotation * (Math.PI / -180)) * bulletSpeed * -1;
      bullet.y += Math.cos(bullet.rotation * (Math.PI / -180)) * bulletSpeed * -1;
    }

    if (outOfBounds(bullet, bullet.bounds)) {
      stage.removeChild(bullet);
    }
	}

  if (lfHeld && cannonInstance.rotation >= -72) {
		cannonInstance.rotation -= TURN_FACTOR;
	} else if (rtHeld && cannonInstance.rotation <= 72 ) {
		cannonInstance.rotation += TURN_FACTOR;
	}

  if (won()) {
    return nextLevel();
  } else if (gameOver()) {
    return endGame();
  } else {
    stage.update(event);
  }
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
  bulletInstance.bounds = 8;
  bulletInstance.dynamic = false;
  bulletInstance.active = true;
  bulletInstance.bulletCount = 4;
  bulletInstance.bulletCountdown = 1;
  bulletInstance.gotoAndPlay(`static`);
  bullets.push(bulletInstance);
  stage.addChild(bulletInstance);
  stage.setChildIndex( bulletInstance, 0);

  shotsThisRound++;
  shotsRemaining--;
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
