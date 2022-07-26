Population test;
Obstacle[] obts;

PVector goal = new PVector(400, 50);
int speedLimit = 5;

void setup(){
  size(800,800);
  test = new Population(1000);
  frameRate(500);
  
  int numOfObstacles = 2;
  
  // rectangle obstacles
  obts = new Obstacle[numOfObstacles];
  obts[0] = new Obstacle(0, 300, 600, 10);
  obts[1] = new Obstacle(200, 500, 600, 10);
}

void draw(){
  background(255);
  
  fill(255, 0, 0);
  ellipse(goal.x, goal.y, 15, 15);
  
  for(int i = 0; i < obts.length; ++i){
    obts[i].show();
  }
  
  if(test.finished()){
    test.calculateFitness();
    test.naturalSelection();
    test.mutatePopulation();
  }
  else{
    test.update();
    test.show();
  }
}
