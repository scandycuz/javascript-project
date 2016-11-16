var orbStandard = new Image();
orbStandard.src = 'images/plasma-med.png';

var spriteSheetOne = {
  images: [orbStandard],
  framerate: 14,
  frames: {
    width:234,
    height:234,
    count: 11,
    regX:6,
    regY:6,
    spacing:12,
    margin:0
  },
  animations: {
      spin1:[0,10],
      spin2: {
        frames: [0,1,2,3,4,6,7,8,9,10]
      }
  }
};
var standardOrb = new createjs.SpriteSheet(spriteSheetOne, "spin");
