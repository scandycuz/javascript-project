var ORB_AMOUNT = 2;
var ORB_SPEED = 1.5;

var numberOfOrbs = 2;
var dim_x = 500;
var dim_y = 600;
var orbs = [];
var canvas, stage, position;

function init() {
  canvas = document.getElementById("gameCanvas");
	stage = new createjs.Stage(canvas);

  canvas.width = dim_x;
  canvas.height = dim_y;
  canvas.onclick = handleClick;

  stage.update();
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
  var num = Math.floor(Math.random()*99) + 1;
  return (num *= Math.floor(Math.random()*2) == 1) ? 1 : -1;
}

function restart() {
  stage.removeAllChildren();
  orbs = [];
  stage.clear();

  for (let i = 0; i < numberOfOrbs; i++) {
    addStandardOrb();
  }

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

function tick(event) {

  for (let i = 0; i < orbs.length; i++) {
    let orb = orbs[i];
    orb.rotation += (orb.speed);
    orb.x += orb.vector[0] * orb.speed;
		orb.y += orb.vector[1] * orb.speed;
    if (outOfBounds(orb, orb.bounds)) {
  		placeInBounds(orb, orb.bounds);
  	}
  }

  stage.update(event);
}
