class Dot{
  PVector pos;
  PVector vel;
  PVector accel;
  
  boolean dead;
  boolean reachedGoal;
  float fitness;
  
  boolean isBest;
  Brain brain;
  
  Dot(){
    brain = new Brain(1000);
    
    pos = new PVector(width/2, height-25);
    vel = new PVector(0, 0);
    accel = new PVector(0, 0);
    
    dead = false;
    reachedGoal = false;
    isBest = false;
  }
  
  
  void show(){
    if(isBest){
      fill(0, 255, 0);
      ellipse(pos.x, pos.y, 7, 7);
    }
    else{
      fill(0);
      ellipse(pos.x, pos.y, 5, 5);
    }
    
  }
  
  void move(){
    if(brain.step < brain.directions.length){
     accel = brain.directions[brain.step++];
    }
    
    //no steps left
    if(brain.step == brain.directions.length){
      dead = true;
    }
    
    vel.add(accel);
    vel.limit(speedLimit);
    pos.add(vel);
    
  }
  
  void update(){
    if(!dead && !reachedGoal){
      move();
      for(int i = 0; i < obts.length; ++i){
        if(obts[i].inObstacle(pos.x, pos.y)){
          dead = true;
        }
      }
      if(pos.x <= 4 || pos.x >= width - 4 || pos.y <= 4 || pos.y >= height - 4){
       dead  = true; 
      }
      else if(dist(pos.x, pos.y, goal.x, goal.y) < 7){
        reachedGoal = true;
      }
    }
    
  }
  
  void calculateFitness(){
    if(reachedGoal){
      float maxDirections = (float)brain.directions.length;
      fitness = 1.0 + (maxDirections * maxDirections)/brain.step;
    }
    else{
      float distGoal = dist(pos.x, pos.y, goal.x, goal.y);
      fitness = 1.0/(distGoal * distGoal);
    }
  }
  
  Dot clone(){
   Dot clone = new Dot();
   clone.brain = brain.clone();
   
   return clone;
  }
  
}
