# JavaScript Project

[Live](http://scandycuz.github.io/javascript-project/)

The goal of this game is to hit as many targets as possible with as few shots as possible. When a target is hit by a shot, that target is destroyed, and then sends out additional shots that can then hit other targets. The more target hits that are hit consecutively starting with a single shot, the more projectiles will release after each target is destroyed.

The player starts with 10 shots. If the player destroys all of the targets on a single level, they will regain the shot they used. The player also gains a shot every time points goal is met, starting at 250 points, and increasing incrementally each time. The with of the game canvas also increases every number of levels, in order to further increment the difficulty. When the player runs out of shots, the game is over.

### Technologies

* HTML, CSS, JavaScript, Canvas

### Libraries

* EaselJS
  * Rendering game content
* SoundJS
  * Audio Effects
* PreloadJs
  * Preloading content
* Web Font Loader
  * Google Fonts javaScript library

### Additional Information

Code to establish the vectors of projectiles that fire after a target is destroyed, depending on the number of projectiles:

```js
  let degrees = 360;
  let angle = 360 / bulletCount;
  let angles = [];
  while(degrees > 0) {
    angles.push(degrees);
    degrees -= angle;
  }

  angles.forEach( (angle) => {
    let dynamicBulletInstance = new createjs.Sprite(bullet);
    let xVec = Math.cos(angle * 3.1459 / 180);
    let yVec = Math.sin(angle * 3.1459 / 180);
    dynamicBulletInstance.vector = [xVec, yVec];
    //...
  });
```

### Future Implementation

* Add more sound effects / music
* Add varieties of targets with different behaviors
* Add power-ups for additional projectile behaviors
