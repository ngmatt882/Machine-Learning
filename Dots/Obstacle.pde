class Obstacle{
  PVector pos;
  int owidth;
  int olen;
  
  Obstacle(int posx, int posy, int w, int l){
    pos = new PVector(posx, posy);
    owidth = w;
    olen = l;
  }
  
  void show(){
    fill(0, 0, 255);
    rect(pos.x, pos.y, owidth, olen);
  }
  
  boolean inObstacle(float x, float y){
    if(x > pos.x  && y > pos.y && x < pos.x + owidth && y < pos.y + olen){
      return true;
    }
    return false;
  }
}
