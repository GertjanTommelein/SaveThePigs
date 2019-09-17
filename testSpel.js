const gameContainer = document.getElementById("game-container");
const scoreDisplay = document.getElementById("score-display");
const lifeDisplay = document.getElementById("life-display");
const modalGameover = document.getElementById("modal-gameover");
const restartBtn = document.getElementById("restart-button");
const modalVictory = document.getElementById("modal-victory");
const restartBtn2 = document.getElementById("restart-btn");
const pigsSavedDisplay = document.getElementById("pigs-saved");
const pigsEatenDisplay = document.getElementById("pigs-eaten");
let pigScore;
let bulletInstances = 0;
class Game {
    constructor(rows, cols,tileSize,treasures,walls) {
        this.rows = rows;
        this.cols = cols;
        this.tileSize = tileSize;
        this.treasures = treasures;
        this.map = [];
        this.posUsed = [];
        this.posY_Used = [];
        this.walls = walls;
        this.pigPosition = [];
        this.rockImage = "images/rock.svg";
    }

    createMap() {
        
        this.map = [];
        
        for(let i=0; i<this.rows; i++) {
            let rowArr = [];
            this.map.push(rowArr);

            for(let j=0;j<this.cols;j++) {
                this.map[i].push(0);

            }
        }

        return this.map;
    }
    drawMap() {
        
        for(let i=0;i<this.rows;i++) {
            let newRow = document.createElement("div");
            newRow.setAttribute("class","row");
            newRow.setAttribute("id",i);
            

            for(let j=0;j<this.cols;j++) {
                let newField = document.createElement("div");
                newField.setAttribute("class","game-field");
                newField.setAttribute("id",i + "," + j);
                newField.style.width = this.tileSize + "px";
                newField.style.height = this.tileSize + "px";
                newRow.appendChild(newField);
                
            }
            gameContainer.appendChild(newRow);
        }
    }
    createWalls() {
        for(let i=0;i<this.walls;i++) {
            let randomX = Math.floor(Math.random() * game.cols);
            let randomY = Math.floor(Math.random() * game.rows);
            while(game.posUsed.includes(randomY + "," + randomX)) {
                randomX = Math.floor(Math.random() * game.cols);
                randomY = Math.floor(Math.random() * game.rows);
            }
            game.posUsed.push(randomY + "," + randomX);
            document.getElementById(randomY + "," + randomX).style.backgroundImage = "url(" + this.rockImage + ")";
            game.map[randomY][randomX] = 1;
        }
    }

    drawTreasures() {
        for(let i=0;i<game.treasures;i++) {
            this["pig" + i] = new Pig();
            console.log(this["pig" +i]);
            pigScore =  this["pig" + i].score;
            while(game.posUsed.includes(this["pig" + i].positionY + "," + this["pig" + i].positionX)) {
                this["pig" + i].positionX = Math.floor(Math.random() * game.cols);
                this["pig" + i].positionY = Math.floor(Math.random() * game.rows);
            }
            
            game.posUsed.push(this["pig" + i].positionY + "," + this["pig" + i].positionX);
            game.pigPosition.push(this["pig" + i].positionY + "," + this["pig" + i].positionX);
            document.getElementById(this["pig" + i].positionY + "," + this["pig" + i].positionX).style.backgroundImage = "url(" + this["pig" + i].image + ")";
            
        }
    }
    gameOver() {
        if(player.lifes == 0) {
            modalGameover.style.display = "flex";
            restartBtn.addEventListener("click", () => {location.reload();});
            console.log("game Over!!");
            benji.stopChase();
        }
    }
    victory(){
        if(game.pigPosition.length === 0) {
            modalVictory.style.display = "flex";
            pigsSavedDisplay.innerHTML = player.pigsSaved;
            pigsEatenDisplay.innerHTML = benji.pigsEaten;
            restartBtn2.addEventListener("click", () => {location.reload()});
            benji.stopChase();
        }
    }

    


}


class Player {
    constructor() {
        this.positionX = Math.floor(Math.random() *  game.cols);
        this.positionY = Math.floor(Math.random() * game.rows);
        while(game.posUsed.includes(this.positionX + "," + this.positionY)) {
            this.positionX = Math.floor(Math.random() * game.cols);
            this.positionY = Math.floor(Math.random() * game.rows);
        }
        
        game.posUsed.push(this.positionX + "," + this.positionY);
        this.image = "images/spiderman.svg";
        this.score = 0;
        this.lifes = 3;
        this.bulletPos = this.positionX +1;
        this.countWebs = 0;
        this.shot = [];
        this.pigsSaved = 0;
    }
    drawPlayer() {
        console.log(document.getElementById(this.positionY + "," + this.positionX));
        document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url(" + this.image + ")";
    }
    move(direction) {
        switch(direction) {
            case "right":
                    document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url('')";
                    if(this.positionX == game.cols - 1 || game.map[this.positionY][this.positionX +1] == 1 ) {
                    }else {
                    this.positionX = this.positionX + 1;
                    }
                    break;
            case "left":
                    document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url('')";
                    if(this.positionX == 0 || game.map[this.positionY][this.positionX -1] == 1) {
                    }else {
                    this.positionX = this.positionX - 1;
                    }
                    break;
            case "up":
                    if(this.positionY == 0 || game.map[this.positionY-1][this.positionX] == 1) {

                    }else {
                    document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url('')";
                    this.positionY = this.positionY - 1;
                    }
                    break;
            case "down":
                    if(this.positionY == game.rows - 1 || game.map[this.positionY +1][this.positionX] == 1) {

                    }else {
            
                    document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url('')";
                    this.positionY = this.positionY + 1;
                    }
                    
                    
        }
    }
    savePig() {
        // checks if the players position is on a pig
        if(game.pigPosition.includes(this.positionY + "," + this.positionX)) {
            // if it is then remove the pigs coordinates from the pigPosition array
            game.pigPosition.splice(game.pigPosition.indexOf(this.positionY + "," + this.positionX),1);
            this.pigsSaved = this.pigsSaved +1;
            // and increase the players score by 100
            this.score += pigScore;
            scoreDisplay.innerHTML = this.score;
        }
        // end game when all pigs are saved
        game.victory();
    }
    shoot() {
        let nameInstance = this.countWebs;
        this.shot.push( "player." + "web" + this.countWebs + this.countWebs);
        this["web" + this.countWebs] = new Spiderweb(nameInstance);
        this["web" + this.countWebs + this.countWebs] = setInterval(this["web" + this.countWebs].shoot.bind(this["web" + this.countWebs]),1000);
        this.countWebs++;
    }
    displayLife(){
        let hearts = "";
        for(let i=0;i<this.lifes;i++){
            hearts += "&#10084;";
        }
        lifeDisplay.innerHTML = hearts;
    }
}

class Pig {
    constructor() {
        this.score = 100;
        this.positionX = Math.floor(Math.random() * game.cols);
        this.positionY = Math.floor(Math.random() * game.rows);
        this.image = "images/pig.svg";
    }
    drawPig() {
        document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url(" + this.image + ")";
    }

    
}

class Wolf {
    constructor() {
        this.positionX = Math.floor(Math.random() * game.cols);
        this.positionY = Math.floor(Math.random() * game.rows);

        while(game.posUsed.includes(this.positionY + "," + this.positionX)) {
            console.log(this.positionY + "," + this.positionX);
            this.positionX = Math.floor(Math.random() * game.cols);
            this.positionY = Math.floor(Math.random() * game.rows);
        }
        this.image = "images/wolf.svg";
        this.pigsEaten = 0;
    }
    drawWolf() {
        
        document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url(" + this.image + ")";
    }
    eat() {
        // checks if the wolfs position is on a pig
        if(game.pigPosition.includes(this.positionY + "," + this.positionX)) {
            // if it is then remove the pigs coordinates from the pigPosition array
            game.pigPosition.splice(game.pigPosition.indexOf(this.positionY + "," + this.positionX),1);
            this.pigsEaten = this.pigsEaten +1;
        }
        
        if(player.positionY + "," + player.positionX == this.positionY + "," + this.positionX) {
            document.getElementById(player.positionY + "," + player.positionX).style.backgroundImage = "url(" + this.image + ")";
            player.lifes = player.lifes - 1;
            player.displayLife();
            game.gameOver();
            console.log("mmm.. tasty snack");
            // player respawn on death
            player.positionY = Math.floor(Math.random() * game.rows);
            player.positionX = Math.floor(Math.random() * game.cols);
            while(game.posUsed.includes(player.positionY + "," + player.positionX)) {
                player.positionX = Math.floor(Math.random() * game.cols);
                player.positionY = Math.floor(Math.random() * game.rows);
            }
            player.drawPlayer();
        }
    }
    respawn(){
        this.positionX = Math.floor(Math.random() * game.cols);
        this.positionY = Math.floor(Math.random() * game.rows);

        while(game.posUsed.includes(this.positionY + "," + this.positionX)) {
            console.log(this.positionY + "," + this.positionX);
            this.positionX = Math.floor(Math.random() * game.cols);
            this.positionY = Math.floor(Math.random() * game.rows);
        }
        this.drawWolf();
        this.chase();
    }
    move() {
        
        if(this.positionY < player.positionY && game.map[this.positionY +1][this.positionX] != 1) {
            document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url()";
            this.positionY = this.positionY +1;
            this.drawWolf();
            this.eat();
        }
        else if(this.positionY > player.positionY && game.map[this.positionY -1][this.positionX] != 1) {
            document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url()";
            this.positionY = this.positionY -1;
            this.drawWolf();
            this.eat();
        }
        else if(this.positionX < player.positionX && game.map[this.positionY][this.positionX +1] != 1) {
            document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url()";
            this.positionX = this.positionX +1;
            this.drawWolf();
            this.eat();
        }
         else if(this.positionX > player.positionX && game.map[this.positionY][this.positionX -1] != 1) {
            document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url()";
            this.positionX = this.positionX -1;
            this.drawWolf();
            this.eat();
        }
        else if (this.positionX <=  player.positionX && game.map[this.positionY][this.positionX +1] == 1) {
            document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url()";
            let count = 1;
            while(game.map[this.positionY][this.positionX + count] == 1){
            count++;
            }
            this.positionX = this.positionX + count;
            this.drawWolf();
            this.eat();
            
        }
        else if (this.positionX >=  player.positionX && game.map[this.positionY][this.positionX -1] == 1) {
            document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url()";
            let count = 1;
            while(game.map[this.positionY][this.positionX - count] == 1){
            count++;
            }
            this.positionX = this.positionX - count;
            this.drawWolf();
            this.eat();
            
        }
        else if (this.positionY <=  player.positionY && game.map[this.positionY +1][this.positionX] == 1) {
            document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url()";
            let count = 1;
            while(game.map[this.positionY + count][this.positionX] == 1){
            count++;
            }
            this.positionY = this.positionY + count;
            this.drawWolf();
            this.eat();
            
        }
        else if (this.positionY >=  player.positionY && game.map[this.positionY -1][this.positionX] == 1) {
            document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url()";
            let count = 1;
            while(game.map[this.positionY - count][this.positionX] == 1){
            count++;
            }
            this.positionY = this.positionY - count;
            this.drawWolf();
            this.eat();
            
        }
    }
    chase() {
         this.wolfMove = setInterval(this.move.bind(this),1000);
         
    }
    stopChase(){
        
        clearInterval(this.wolfMove);
    }
}

class Spiderweb {
    constructor(name) {
        
        this.positionX = player.positionX +1;
        this.positionY = player.positionY;
        this.bulletInstances = 0;
        this.count = 0;
        this.name = name;
        this.image = "images/spiderweb2.svg";
        
        
    }
    shoot(){
        this.bulletInstances = this.bulletInstances +1;
        if(this.positionY + "," + this.positionX == benji.positionY + "," + benji.positionX) {
            
            clearInterval(eval(player.shot[this.name]));
            
            
            benji.stopChase();
            document.getElementById(benji.positionY + "," + benji.positionX).style.backgroundImage = "url('')";
            document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url('')";
            benji.respawn();
        }
        if(this.positionX == 15 || game.map[this.positionY][this.positionX] == 1) {
            
            console.log(this.positionX);
            clearInterval(eval(player.shot[this.name]));
            console.log("positie : " + this.positionX);
            document.getElementById(this.positionY + "," + (this.positionX -1)).style.backgroundImage = "url('')";
            
            console.log(player.shot);
        }else {
        
        if(this.bulletInstances > 1){
            
            this.positionX = this.positionX -1;
            console.log(this.positionX);
          document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url('')";
          this.positionX = this.positionX +1;
        }
        console.log(this.bulletInstances);
        console.log(this.positionY);
        console.log(this.positionX);
        document.getElementById(this.positionY + "," + this.positionX).style.backgroundImage = "url(" + this.image + ")";
        this.positionX = this.positionX +1;
        
        
      }
    }
      
    
    
}


// initializing game
let game = new Game(8,20,64,7,20);
let player = new Player();
let benji = new Wolf();


game.createMap();
game.drawMap();

player.drawPlayer();
game.createWalls();
player.displayLife();
game.drawTreasures();
benji.drawWolf();
benji.chase();




// CONTROLS
window.addEventListener("keydown",function(e) {
        e.preventDefault();
        if(e.keyCode === 39) {
            player.move("right");
            player.drawPlayer();
            player.savePig();
            benji.eat();
        }
});
window.addEventListener("keydown", function(e) {
    e.preventDefault();
    if(e.keyCode === 37) {
        player.move("left");
        player.drawPlayer();
        player.savePig();
        benji.eat();
    }
});
window.addEventListener("keydown", function(e) {
    e.preventDefault();
    if(e.keyCode === 38) {
        player.move("up");
        player.drawPlayer();
        player.savePig();
        benji.eat();
    }
});
window.addEventListener("keydown", function(e) {
    e.preventDefault();
    if(e.keyCode === 40) {
        player.move("down"); // changed
        player.drawPlayer();
        player.savePig();
        benji.eat();
    }
});
window.addEventListener("keydown", function(e) {
    e.preventDefault();
    if(e.keyCode === 32){
        player.shoot();
        
        
        
        this.console.log("boom");
    }
})