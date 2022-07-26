class Population{
  Dot[] popul;
  int gen = 1;
  
  int totalFitness;
  int numReached;
  int minSteps;
  int bestIndex;
  
  Population(int size){
    popul = new Dot[size];
    totalFitness = 0;
    numReached = 0;
    
    for(int i = 0;  i < popul.length;  ++i){
      popul[i] = new Dot();
      
    }
  }
  
  
  void update(){
    for(int i = 0; i < popul.length; ++i){
      popul[i].update();
    }
    
  }
  
  void show(){
    for(int i = 0; i < popul.length; ++i){
      popul[i].show();
    }
  }
  
  float calculateTotalFitness(){
    float totalFitness = 0;
    for(int i = 0; i < popul.length; ++i){
      totalFitness += popul[i].fitness;
    }
    
    return totalFitness;
  }
  
  void calculateFitness(){
    for(int i = 0; i < popul.length; ++i){
      popul[i].calculateFitness();
      if(popul[i].fitness > 1){
        ++numReached;
      }
    }
    
    selectBestDot();
  }
  
  int selectBestDot(){
    bestIndex = -1;
    minSteps = popul[0].brain.directions.length;
    float bestFitness = -1;
    
    for(int i = 0; i < popul.length; i++){
      if(popul[i].fitness > bestFitness){
        bestFitness = popul[i].fitness;
        bestIndex = i;
      }
      if(popul[i].fitness > 1.0){
        minSteps = popul[i].brain.step;
      }
    }
    
    println("Gen: ", gen);
    println("Total Dots reached goal:", numReached);
    println("Least steps taken: ", popul[bestIndex].brain.step);
    
    return bestIndex;
  }
  
  void naturalSelection(){
    Dot[] newPopul = new Dot[popul.length];
    calculateTotalFitness();
    
    newPopul[0] = popul[bestIndex].clone();
    newPopul[0].isBest = true;
    for(int i = 1; i < newPopul.length; i++){
      newPopul[i] = selectParent().clone();
    }
    
    popul = newPopul;
    numReached = 0;
    gen++;
  }
  
  Dot selectParent() {
    float rand = random(totalFitness);
    float sum = 0;

    for(int i = 0; i < popul.length; i++){
      sum += popul[i].fitness;
      if (sum > rand) {
        return popul[i];
      }
    }

    //should never get to this point

    return null;
  }
  
  void mutatePopulation(){
    float learnRate = 0.30;
    for (int i = 0; i < popul.length; i++){
      if(!popul[i].isBest){
        popul[i].brain.mutate();
      }
      
      float l = random(1);
      if(popul[i].dead && l < learnRate){
        popul[i].brain.learn();
        print("l");
      }
    }
  }
  
  boolean finished(){
    for (int i = 0; i < popul.length; i++){
      if(!popul[i].dead && !popul[i].reachedGoal){
        return false;
      }
    }
    
    return true;
  }
}
