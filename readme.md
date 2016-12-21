# Reaction

[Live](http://scandycuz.github.io/reaction/)

The goal of Reaction is to hit as many targets as possible while firing as few times as possible. When a target is hit by a shot, that target is destroyed, and then sends out additional shots that can then hit other targets. The more targets that are hit consecutively starting with a single shot, the more projectiles that will release after each target is destroyed.

The player starts with 20 shots. If the player destroys all of the targets on a single level, they will regain the shot they used. The player also gains two additional shots every time a points threshold is passed, starting at 250 points and doubling each time. Every set number of levels, the width of the game canvas increases in width and the amount of targets increases. When the player runs out of shots, the game ends.

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
  * Google Fonts JavaScript library

### Code Snippet

Code to determine the number and angles of bullets released after a target is hit by a bullet:

```js
  function ExplodeTarget(target, collidedBullet) {
    // get number of bullets
    let numberOfBullets = collidedBullet.numberOfBullets;

    // set bullet angles
    let currentAngle = 360;
    let angleToDecrementBy = 360 / numberofBullets;

    // increment number of bullets to be released in subsequent collisions
    if (numberOfBullets < 12) {
      numberOfBullets += 4;
    }

    // Create new bullets
    while (currentAngle > 0) {
      createBullet(currentAngle, numberOfBullets);
      currentAngle -= angleToDecreaseBy;
    }
  }
```

### Future Implementation

* Add new varieties of targets with different behaviors to increase difficulty at later levels. For example, targets that require more than one shot to destroy.
* Add power-ups for additional projectile behaviors
