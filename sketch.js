var dog, happydog, database, foodS, foodStock;
var Dog;
var fedTime, lastFed, feed, addFood, food;
var gameState, readState, currentTime, garden, washroom, bedroom;

function preload()
{
  dog = loadImage("images/dogImg.png");
  happydog = loadImage("images/dogImg1.png");
  garden = loadImage("images/virtual pet images/Garden.png");
  washroom = loadImage("images/virtual pet images/Wash Room.png");
  bedroom = loadImage("images/virtual pet images/Bed Room.png");
}

function setup() {
  createCanvas(400,500);
  database = firebase.database();
  food = new Food();
  Dog = createSprite(200,400,150,150);
  Dog.addImage(dog);
  Dog.scale = 0.15;
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  fedTime = database.ref('feedTime');
  fedTime.on("value", function (data){
    lastFed = data.val();
  })
  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  })
  //textSize(20);
  feed = createButton("Feed the dog");
  feed.position(300,95);
  feed.mousePressed(feedDog);
  addFood = createButton("Food");
  addFood.position(200,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  currentTime = hour();
  if(currentTime == lastFed+1)
  {
    update("playing");
    food.garden();
  }
  else if(currentTime == lastFed+2)
  {
    update("sleeping");
    food.bedroom();
  }
  else if(currentTime > (lastFed+2) && currentTime <= (lastFed+4))
  {
    update("bathing");
    food.washroom();
  }
  else
  {
    update("hungry");
    food.display();
  }
  if(gameState !== "hungry")
  {
    feed.hide();
    addFood.hide();
    Dog.remove();
  }
  else
  {
    feed.show();
    addFood.show();
    Dog.addImage(dog);
  }
  /*if(keyWentDown(UP_ARROW))
  {
    writeStock(foodS);
    Dog.addImage(happydog);
  }*/
  drawSprites();
}

function readStock(data)
{
  foodS = data.val();
  food.updateFoodStock(foodS);
}

/*function writeStock(x){
  if(x <= 0)
  {
    x = 0  
  }
  else
  {
    x = x-1;
  }
  database.ref('/').update({Food:x});
}*/

function feedDog()
{
  Dog.addImage(happydog);
  food.updateFoodStock(food.getFoodStock()-1);
  database.ref('/').update({
    Food:food.getFoodStock(),fedTime:hour(), gameState:"hungry"
  })
}

function addFoods()
{
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state)
{
  database.ref('/').update({
    gameState:state
  })
}