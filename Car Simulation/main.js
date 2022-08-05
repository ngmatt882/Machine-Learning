const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const laneCount = 3;
const road = new Road(canvas.width/2, canvas.width - 20, laneCount);
const startLane = road.getLaneCenter(1);
const startPoint = 100;

const cars = new Population(300);
let bestCar = 0;

// this section can later be replaced with the readily available functions in *population.js*
if(localStorage.getItem("bestCar")){
    for(let i = 0; i < cars.population.length; ++i){
        cars.population[i].brain = JSON.parse(localStorage.getItem("bestCar"));
        if(i != 0){
            // change mutation rate as you refresh
            NerualNetwork.mutateNetwork(cars.population[i].brain, 0.2);
        }
    }
}

const numTrafficCars = 20;
const traffic = [];

// Moves perspective based on speed
// Allows to see more when reverse
// ONLY WORKS WHEN THERE IS ONE CAR
const upperView = 0.6;
const lowerView = 0.7;
const viewStep = 0.001;
let currView = 0.7;


setTraffic();
animate();

function save(){
    localStorage.setItem("bestCar", JSON.stringify(cars.population[bestCar].brain));
}

function discard(){
    localStorage.removeItem("bestCar");
}

function animate(){
    // resizes canvas when adjusting winddow 
    // and allows car to "move"
    canvas.height = window.innerHeight;
    
    ctx.save();

    bestCar = cars.findBest();

    setView(bestCar);
    // replace 0.7 with currView here
    ctx.translate(0, canvas.height*0.7 - cars.population[bestCar].y);

    //update
    cars.updatePopulation(road.solidLines, traffic);
    for(let i = 0; i < traffic.length; ++i){
        traffic[i].update([],[]);
    }

    //draw
    road.draw(ctx);
    for(let i = 0; i < traffic.length; ++i){
        traffic[i].draw(ctx);
    }
    cars.drawPopulation(ctx);

    ctx.restore();
    requestAnimationFrame(animate);
}

function setTraffic(){
    let nextPoint = 200;
    traffic.push(new Car(road.getLaneCenter(1), startPoint - nextPoint, 30, 50, "bot"));
    nextPoint += 300;
    for(let i = 0; i < numTrafficCars; ++i){
        const empty = Math.floor(Math.random()*laneCount);
        for(let j = 0; j < laneCount; ++j){
            if(j != empty){
                traffic.push(new Car(road.getLaneCenter(j), startPoint - nextPoint, 30, 50, "bot"));
            }
        }

        nextPoint += 300;
    }
}

// only works when there is one drive-able car
function setView(car){
    if(car.speed < 0){
        currView -= viewStep;
        currView = Math.max(currView, upperView);
    }

    if(car.speed > 0){
        currView += viewStep;
        currView = Math.min(currView, lowerView);
    } 
}
