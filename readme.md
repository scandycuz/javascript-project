# Reaction

[Live](http://scandycuz.github.io/reaction/)

The goal of Reaction is to hit as many targets as possible with as few shots as possible. When a target is hit by a shot, that target is destroyed, and then sends out additional shots that can then hit other targets. The more targets that are hit consecutively starting with a single shot, the more projectiles that will release after each target is destroyed.

The player starts with 10 shots. If the player destroys all of the targets on a single level, they will regain the shot they used. The player also gains two additional shots every time a points goal is met, starting at 250 points and doubling each time it is passed. The width of the game canvas also increases at a set level interval, in order to further increment the difficulty. When the player runs out of shots, the game ends.

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

### Additional Information

Code to determine the number and angles of the bullets released after a target is hit by a bullet:

```js
  function ExplodeTarget(target, collidedBullet) {
    // get number of bullets
    let numberOfBullets = collidedBullet.numberOfBullets;

    // set bullet angles
    let currentAngle = 360;
    let angleToDecrementBy = 360 / numberofBullets;

    // increment number of bullets released after subsequent collisions
    if (numberOfBullets < 12) {
      nextNumberOfBullets += 4;
    }

    // Create new bullets
    while (currentAngle > 0) {
      createBullet(currentAngle, nextNumberOfBullets);
      currentAngle -= angleToDecreaseBy;
    }
  }
```

### Future Implementation

* Add more sound effects / music
* Add varieties of targets with different behaviors
* Add power-ups for additional projectile behaviors
