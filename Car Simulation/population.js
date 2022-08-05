class Population{
    constructor(numCars){
        this.population = this.setPopulation(numCars);
        this.bestCar = 0;
        this.findBest();

        this.gen = 1;
        this.maxSteps = -300 - (this.gen*30);
    }

    setPopulation(pop){
        const cars = [];
        for(let i = 0; i < pop; ++i){
            cars.push(new Car(road.getLaneCenter(1), startPoint, 30, 50, "ai"));
        }
    
        return cars;
    }

    updatePopulation(road, traffic){
        for(let i = 0; i < this.population.length; ++i){
            this.population[i].update(road, traffic);
        }

        this.findBest();
    }

    drawPopulation(ctx){
        for(let i = 0; i < this.population.length; ++i){
            this.population[i].draw(ctx);
        }
        this.population[this.bestCar].draw(ctx, true);
    }

    findBest(){
        let bestIndex = 0;
        let bestDist = this.population[0].y;
        for(let i = 1; i < this.population.length; ++i){
            if(this.population[i].y < bestDist){
                bestDist = this.population[i].y;
                bestIndex = i;
            }
        }

        this.bestCar = bestIndex;
        return bestIndex;
    }

    bestFitness(){
        let bestIndex = 0;
        let bestFit = this.population[0].fitness;
        for(let i = 1; i < this.population.length; ++i){
            if(this.population[i].fitness > bestFit){
                bestFit = this.population[i].fitness;
                bestIndex = i;
            }
            else if(this.population[i].fitness == bestFit){
                if(this.population[i].y < this.population[bestIndex].y){
                    bestIndex = i;
                }
            }
        }

        return bestIndex;
    }

    mutatePopulation(){
        for(let i = 0; i < this.population.length; ++i){
            this.population[i].brain.mutateNetwork(0.1);
        }
    }

    // checks if all the cars died
    // if passes certain calculate fitness
    checkPopulation(traffic){

        if(traffic[0].y < this.maxSteps){
            this.calcFitness(traffic[0].y);
            return true;
        }

        let finish = true;

        for(let i = 0; i < this.population.length; ++i){
            if(!this.population[i].crash){
                finish = false;
                for(let j = 0; j < traffic.length; j += 2){
                    if(this.population[i].y < traffic[0].y){
                        // does not matter if one car is ahead of the other in this area
                        if(this.population[i].fitness < (j/2 + 1)){
                            this.population[i].fitness = j/2 + 1;
                        }
                    }
                    else{
                        break;
                    }
                }
            }
        }

        return finish;
    }

    calcFitness(dist){
        for(let i = 0; i < this.population.length; ++i){
            if(this.population[i].y > traffic[0].y && !this.population[i].crash){
                this.population[i].fitness = (this.population[i].y - dist)/200;
            }
        }
    }
}