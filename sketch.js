var dog,Dog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed, currentTime;
var feed,addFood;
var foodObj;
var gameState, readState;
var bedroom, garden, washroom;

function preload(){
Dog=loadImage("images/Dog.png");
happyDog=loadImage("images/happy dog.png");
milk=loadImage("images/milk.png");
bedroom=loadImage("images/Bed Room.png");
garden=loadImage("images/Garden.png");
washroom=loadImage("images/Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(900,600);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  
  dog=createSprite(700,300,170,170);
  dog.addImage(Dog);
  dog.scale=0.4;
  
  feed=createButton("feed the dog");
  feed.position(700,100);
  feed.mousePressed(feedDog);

  addFood=createButton("add food");
  addFood.position(800,100);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);

   currentTime=hour();
   if(currentTime==(lastFed+1)){
     update("Playing");
     foodObj.garden();
   }else if(currentTime==(lastFed+2)){
     update("Sleeping");
     foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
     update("Bathing");
     foodObj.washroom();
   }else{
     update("Hungry")
     foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
     feed.show();
     addFood.show();
     dog.addImage(Dog);
   }
 
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}