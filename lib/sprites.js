const orbStandard = new Image();
orbStandard.src = 'images/plasma-med-explosions.png';
const cannonImage = new Image();
cannonImage.src = 'images/cannon-sprite-alt-dark.png';
const bulletImage = new Image();
bulletImage.src = 'images/bullet.png';

const spriteSheetOne = {
  images: [orbStandard],
  framerate: 14,
  frames: {
    width:234,
    height:234,
    count: 17,
    regX:6,
    regY:6,
    spacing:12,
    margin:0
  },
  animations: {
      spin1:[0,10],
      spin2: {
        frames:[0,1,2,3,4,6,7,8,9,10]
      },
      explode:[13,16, "gone", 4],
      gone:[16]
  }
};
const standardOrb = new createjs.SpriteSheet(spriteSheetOne, "spin");

const spriteSheetTwo = {
  images: [cannonImage],
  framerate: 58,
  frames: {
    width:228,
    height:228,
    count: 4,
    regX:0,
    regY:0,
    spacing:12.5,
    margin:0
  },
  animations: {
      static: [3],
      fire: [0, 2, "static"]
  }
};
const cannon = new createjs.SpriteSheet(spriteSheetTwo, "static");

const spriteSheetThree = {
  images: [bulletImage],
  frames: {
    width:28,
    height:28,
    count: 1,
    regX:0,
    regY:0,
    spacing:0,
    margin:0
  },
  animations: {
      static: [0]
  }
};
const bullet = new createjs.SpriteSheet(spriteSheetThree, "static");
