var PLAY = 1;
var END = 0;
var gameState = PLAY;

var player,fallImg, runImg;

var ground;
var obstacleGroup, obstacle1, obstacle1Img;
var score = 0;

var GameOver, GameOverImg;
var birdGrp, bird1, bird1Img;

var coin, coinImg, coinGroup;

var wow, wowImg;

var CloudsGroup,cloud1,cloud2,cloud3;

var jumpSound, collectSound, overSound;
localStorage['HighestScore'] = 0;
function preload(){

runImg = loadAnimation("run/0.png","run/1.png","run/2.png","run/3.png","run/4.png");
fallImg = loadImage("fall.png");

obstacle1Img=loadImage("barricade.png");
bird1Img=loadAnimation("Bird/0.png","Bird/1.png","Bird/2.png","Bird/3.png","Bird/4.png","Bird/7.png","Bird/8.png","Bird/9.png","Bird/10.png","Bird/11.png","Bird/16.png","Bird/17.png","Bird/18.png","Bird/19.png","Bird/20.png","Bird/29.png","Bird/30.png","Bird/31.png","Bird/32.png","Bird/33.png","Bird/38.png","Bird/39.png")

GameOverImg = loadImage("gameover.png");

coinImg=loadImage("coin.png");
wowImg=loadImage("wow.png");

jumpSound = loadSound("jump.wav");
collectSound=loadSound("coin collect.mp3");
overSound=loadSound("gO.wav");

cloud1=loadImage("cloud.png");
cloud2=loadImage("cloud1.png");
cloud3=loadImage("cloud2.png");
}
function setup() {
  createCanvas(displayWidth,displayHeight);
  
  score = 0;

  ground=createSprite(288,640,10000000000,40);
  ground.velocityX = -(6 + 25*score/100);
  ground.x=ground.width/2;
  ground.shapeColor=rgb(11, 116, 196);

  player = createSprite(135,640);
  player.scale=1.15;
  player.addAnimation("run", runImg);
  player.addImage("fall", fallImg);


  obstacleGroup = new Group();
  birdGrp=new Group();
  coinGroup=new Group();
  CloudsGroup=new Group();

  GameOver = createSprite(displayWidth/2,displayHeight/2-10);
  GameOver.scale=1.25;
  GameOver.addImage(GameOverImg);


}
function draw(){

  background(rgb(237, 247, 255));

 if(gameState===PLAY){
  playFunc();
 } 
 
 else if(gameState === END){
   endFunc();
 }
var HighestScore = localStorage["HighestScore"];
textSize(35);
textFont("Monospace");
textStyle(BOLD);
fill("#0090ff");
text("Highest Score : " + HighestScore + " Points",800,50);

drawSprites();
}
function barricade(){
 if (frameCount%150===0){
  obstacle1 = createSprite(1580,640);
  obstacle1.scale = 0.44;
  obstacle1.velocityX = -(5 + 10*score/100);
  obstacle1.addImage("obstacleImg", obstacle1Img);
  obstacle1.lifetime = 400;
  obstacleGroup.add(obstacle1);

  obstacle1.collide(ground);
  GameOver.depth=obstacle1.depth;
  GameOver.depth=GameOver.depth+1;

 } 
 
}
function birds(){
  if (frameCount%260===0){
    bird1=createSprite(1600,500);
    bird1.velocityX= -(7 + 10*score/100);
    bird1.addAnimation("bird",bird1Img);
    bird1.lifetime=400;
    birdGrp.add(bird1);
    GameOver.depth=bird1.depth;
    GameOver.depth=GameOver.depth+1;
  
  }
}
function reset(){
  gameState = PLAY;
  GameOver.visible = false;
  obstacleGroup.destroyEach();
  birdGrp.destroyEach();
  player.changeAnimation("run", runImg);

if(localStorage["HighestScore"]<score){
  localStorage["HighestScore"] = score;
}

  score = 0;
}
function points(){
  if(frameCount%253===0){
  coin=createSprite(1370,random(110,515),20,20);
  coin.velocityX=-(5 + 10*score/100);
  coin.scale=0.175;
  coin.addImage("coin",coinImg);
  coin.lifetime=400;
  coinGroup.add(coin);
  GameOver.depth=coin.depth;
  GameOver.depth=GameOver.depth+1;
  }
}
function spawnClouds() {
  if (frameCount % 137 === 0) {
    var cloud = createSprite(1365,random(365,250),40,10);
    cloud.scale = random(0.06,0.139);
    cloud.velocityX = -(+3+ 15*score/100);

    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: cloud.addImage(cloud1);
              break;
      case 2: cloud.addImage(cloud2);
              break;
      case 3: cloud.addImage(cloud3);
              break;
      default: break;
    }

    cloud.lifetime = 450;
    

    cloud.depth = GameOver.depth;
    GameOver.depth = GameOver.depth + 1;
    
    cloud.depth = player.depth;
    player.depth = player.depth + 1;
    CloudsGroup.add(cloud);
  }
  

}
function playFunc(){
  GameOver.visible=false;

  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }
  ground.velocityX = -4;

 if(keyDown("up")&& player.y >=350) {
  player.velocityY = -23;
  jumpSound.play();
}
player.velocityY = player.velocityY + 0.59;

if(obstacleGroup.isTouching(player)||birdGrp.isTouching(player)){
  overSound.play();
  gameState=END;

}
 player.collide(ground);
 barricade();
 birds();
 points();
 spawnClouds();

 if(coinGroup.isTouching(player)){
 score= score+10;
 coinGroup.destroyEach();
 collectSound.play();

  wow=createSprite(700,80,10,10);
  wow.velocityX = -1;
  wow.scale =0.5;
  wow.addImage(wowImg);
  wow.lifetime=35;
  GameOver.depth=wow.depth;
  GameOver.depth=GameOver.depth+1;
 }

 textSize(35);
 textFont("Monospace");
 textStyle(BOLD);
 fill("#0090ff");
 text("Score : " + score + " Points" , 200,50);
}
function endFunc(){
  ground.velocityX = 0;
  player.velocityY = 0;
  
  GameOver.visible = true;

  obstacleGroup.setVelocityXEach(0);
  birdGrp.setVelocityXEach(0);

  player.changeImage("fall",fallImg);
  
  obstacleGroup.setLifetimeEach(-1);
  birdGrp.setLifetimeEach(-1);
  coinGroup.setLifetimeEach(-1);
  CloudsGroup.setLifetimeEach(-1);

  if(mousePressedOver(GameOver)) {
    reset();
  }
 
}