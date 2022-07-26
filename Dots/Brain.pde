class Brain{
 PVector[] directions;
 int step = 0;
 
 
 Brain(int size){
  directions = new PVector[size];
  randomize();
 }
  
  
 void randomize(){
  for(int i = 0; i < directions.length; ++i){
   float randomAngle = random(2*PI);
   directions[i] = PVector.fromAngle(randomAngle);
  }
 }
 
 Brain clone(){
  Brain clone = new Brain(directions.length);
  for(int i = 0; i < directions.length; ++i){
   clone.directions[i] = directions[i].copy();
  }
  
  return clone;
 }
 
 void mutate(){
  float mutationRate = 0.01; 
  for(int i = 0; i < directions.length; ++i){
    float m = random(1);
    if(m < mutationRate){
      float randomAngle = random(2*PI);
      directions[i] = PVector.fromAngle(randomAngle);
    }
  }
 }
 
 void learn(){
   int lr = (int)random(2);
   int traceBack = 2 + (int)random(5);
   if(lr == 1){
     directions[step - traceBack] = PVector.fromAngle(0);
   }
   else{
     directions[step - traceBack] = PVector.fromAngle(PI);
   }
 }
}
