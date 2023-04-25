// get the canvas element and 2D context 
const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');

// variables declared so they can be changed later
var score = 0;
var isGameOver = false;

// player object to give player attritubes 
var player = {
    // player's starting position
    positionX: 100, 
    positionY: 100,
    radius: 10,
    speed: 2,
    velocityX: 0,
    // player starts moving down
    velocityY: 2,
}

// collectible for the radius as this will stay the same
var collectible = {
    radius: 10,
}

/* positioning of a random place on the canvas by calculating the range and 
   adding the radius so the whole circle appears inside the canvas
*/
function positionCollectible() {
    collectible.positionX = Math.random() * (canvas.width - 2 * collectible.radius) + collectible.radius;
    collectible.positionY = Math.random() * (canvas.height - 2 * collectible.radius) + collectible.radius;
    
    // then call the collision so it can redraw the collectible
    collisionWithCollectible();
}

// draws the player
function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.positionX, player.positionY, player.radius, 0, Math.PI * 2);
    ctx.fill();
}

// draws the collectible
function drawCollectible() {
    ctx.beginPath();
    ctx.arc(collectible.positionX, collectible.positionY, collectible.radius, 0, Math.PI * 2);
    ctx.stroke();
}

// detects whether the player has hit a wall which results into the game being over
function collisionWithWalls() {
    if (player.positionX > canvas.width - player.radius || player.positionX < player.radius || 
        player.positionY > canvas.height - player.radius || player.positionY < player.radius) {
            isGameOver = true;
    }          
}

// detects whether the player has collided with the collectible and redraws the collectible in a new position 
function collisionWithCollectible() {
    var distX = player.positionX - collectible.positionX;
    var distY = player.positionY - collectible.positionY;
    var distance = Math.sqrt(distX*distX + distY*distY);
    

  if (distance < player.radius + collectible.radius) {
      positionCollectible();
      return true;
  }
}

// increments the score and the player's speed is increasing everytime, score is incremented
function updateScore() {
    player.speed += 1;
    score++;    
}

// the main function that draws and updates everything at every frame
function main() {
    // tells the browser that an animation is starting, and the main function is being called over and over
    requestAnimationFrame(main);
    
    // the canvas is cleared and a game over and score message pops up for the user, telling them game over and their score
    if (isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
               
        ctx.textAlign = 'center';
        ctx.font = '48px monospace';
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        
        ctx.font = '24px monospace';
        ctx.fillText(`You have scored: ${score} points!`, canvas.width / 2, canvas.height / 4);
        return;
    }
    
    // clears the canvas so the circle can move around and doesn't create a thick line 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // calls the functions and update them every frame
    drawPlayer(); 
    drawCollectible();
    collisionWithWalls();
    
    // updates the score once the player has collided with the collectible 
    if (collisionWithCollectible()) {
        updateScore();
    }
    
    // draws the score on the canvas so the user can see how well they are doing
    ctx.textAlign = 'left';
    ctx.font = '32px monospace';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    // player moves to a new position with the allocated velocity
    player.positionX += player.velocityX; 
    player.positionY += player.velocityY;
}

// captures the users input and moves depending on the keys pressed
function movePlayer(event) {
    if (event.key == 'ArrowLeft') {
        // this stops the player moving on the Y axis and moves them on the X axis, to the left
        player.velocityY = 0;
        player.velocityX = player.speed * -1;
      } 
    else if (event.key == 'ArrowRight') {
        player.velocityY = 0;
        player.velocityX = player.speed;  
      } 
    else if (event.key == 'ArrowUp') {
        player.velocityX = 0;
        player.velocityY = player.speed * -1;  
      } 
    else if (event.key == 'ArrowDown') {
        player.velocityX = 0;
        player.velocityY = player.speed;  
      }
}

// the collectible can be drawn for the first time
positionCollectible();

// calls the main function so the game can begin
main();

// listens for a keydown event from the movePlayer function
addEventListener('keydown', movePlayer);