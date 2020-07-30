/*
August 3rd, 2020
Author: Tyler Wright
The Project containing this code is intended for academic use. The purpose of the project is to recreate the classic Atari Space Invaders game. 
The following is a JavaScript document containing all the functions and variables needed to create the logic for a game of space invaders.
Inteded to be linked to SpaceInavaders/index.html
 */

var enemies = []; //Globally accessible array intended to hold references to DOM elements of target class.

window.addEventListener("load", function () {
    for (i = 0; i < 10; i++) {
        for (j = 0; j < 5; j++) {
            var enemy = document.createElement("div");
            enemy.classList.add("target");
            enemy.style.top = (10 + (j * (window.innerWidth - 30) / 10)) + "px";
            enemy.style.left = (10 + (i * ((window.innerWidth - 30) / 10))) + "px";
            enemies.push(enemy);
            document.getElementById("container").appendChild(enemy);
        }
    }
    moveTargets();
});


function moveTargets() {
    endGame = false;
    var canMove = true;
    var moveR = setInterval(moveRight, 100);
    function moveRight() {
        enemies.forEach(element => {
            if (parseInt(getComputedStyle(element).left) >= (window.innerWidth - 20)) {
                clearInterval(moveR);
                canMove = false;
            }
        });
        if (canMove) {
            enemies.forEach(element => {
                element.style.left = ((parseInt(getComputedStyle(element).left) + 1) + "px");
            });
        } else if (!canMove) {
            enemies.forEach(element => {
                element.style.top = ((parseInt(getComputedStyle(element).top) + 10) + "px");
            });
            enemies.forEach(element => {
                if (parseInt(getComputedStyle(element).top, 10) >= (parseInt(getComputedStyle(document.getElementById("container")).height, 10) - 200)) {
                    endGame = true;
                    //Call a function to display the loss of a game.
                }
            });
            if (!endGame) {
                canMove = true;
                var moveL = setInterval(moveLeft, 100);
                function moveLeft() {
                    enemies.forEach(element => {
                        if (parseInt(getComputedStyle(element).left) <= 10) {
                            clearInterval(moveL);
                            canMove = false;
                        }
                    });
                    if (canMove) {
                        enemies.forEach(element => {
                            element.style.left = ((parseInt(getComputedStyle(element).left) - 1) + "px");
                        });
                    } else if (canMove == false) {
                        enemies.forEach(element => {
                            element.style.top = ((parseInt(getComputedStyle(element).top) + 10) + "px");
                        });
                        enemies.forEach(element => {
                            if (parseInt(getComputedStyle(element).top, 10) >= (parseInt(getComputedStyle(document.getElementById("container")).height, 10) - 200)) {
                                endGame = true;
                                //Call a function to display the loss of a game.
                            }
                        });
                        if (!endGame) {
                            moveTargets();
                        }
                    }
                }
            }
        }
    }
}




/*
Add an event listener to capture when the mouse moves. A DOM element will follow the mouse as it moves. The CSS page will remove the cursor, to make it appear like the DOM element is the cursor
*/
window.addEventListener("mousemove", function (e) {
    var x = e.clientX;  //get the mouses X coordinate
    var y = e.clientY;  //get the mouses Y coordinate
    //Change the mouse coordinates readout.
    document.getElementById("X").value = "X = " + x + "px";
    document.getElementById("Y").value = "Y = " + y + "px";
    //Set the new properties of the DOM element.
    var obj = document.getElementById("box");
    obj.style.top = y + "px"
    obj.style.left = (x - 5) + "px"
});

/*
The event listener which will fire when clicked. The purpose of the event is to trigger a shooting mechanic for the game.
*/
window.addEventListener("click", function (e) {
    var x = e.clientX;
    var y = e.clientY;
    shoot(x, y);    //activate the shooting function with the current mouse coordinates
});

/*
The shoot function will create an element in the DOM that will emulate a projectile. 
This function is intended to be called when ever the user wants to shoot.
*/
function shoot(x, y) {
    var shot = document.createElement("div");   //Create the shot object.
    shot.classList.add("shot");                 //Give shot object the shot class.
    shot.style.top = (y - 6) + "px";            //Position Shot object so that it comes from the center tip of mouse click.
    shot.style.left = (x - 3) + "px";
    document.getElementById("container").appendChild(shot);
    var posY = parseInt(getComputedStyle(shot).top, 10) //Set new variable to hold the shots originating coordinates.
    /*
    Function that describes the behaviour of a shot element.
    A shot element should behave like a projectile until it hits the ceiling, at which point it disappears.
     */
    function pew() {
        //When/if shot reaches the top, remove objectr from DOM.
        if (posY == 0) {
            clearInterval(pewPew);
            shot.remove();
            //If shot hits any targets, execute targetEliminated/Win condition
        } else {
            var collision = false
            var shotX1 = parseInt(getComputedStyle(shot).left, 10);
            var shotX2 = shotX1 + parseInt(getComputedStyle(shot).width, 10);
            var shotY1 = parseInt(getComputedStyle(shot).top, 10);
            var shotY2 = shotY1 + parseInt(getComputedStyle(shot).height, 10);
            enemies.forEach(element => {
                var enemyX1 = parseInt(getComputedStyle(element).left, 10) - 4;
                var enemyX2 = enemyX1 + parseInt(getComputedStyle(element).width, 10) * 1.5;
                var enemyY1 = parseInt(getComputedStyle(element).top, 10);
                var enemyY2 = enemyY1 + parseInt(getComputedStyle(element).height, 10);
                if (shotX1 > enemyX1 && shotX2 < enemyX2 && shotY1 > enemyY1 && shotY2 < enemyY2) {
                    console.log("HIT!");
                    collision = true;
                    element.remove();
                    shot.remove();
                }

            });
            //advance shot to the next position.
            if (!collision) {
                posY--;
                shot.style.top = posY + 'px';
            }
        }
    }
    var pewPew = setInterval(pew, 10);  //Set pew() to be called repeatedly 
}