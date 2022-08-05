class Car{
    constructor(x, y, width, height, type){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = 0;

        this.edges = this.#updateEdges();

        this.maxSpeed = 3;
        this.speed = 0;
        this.accel = 0.15;
        this.friction = 0.05
        
        this.type = type;
        if(this.type != "bot"){
            this.sensor = new Sensors(this);
            this.brain = new NerualNetwork([this.sensor.rayCount, 6, 4]);
        }
        this.controls  = new Controls(this.type);

        if(type == "bot"){
            this.maxSpeed = 2;
        }

        this.isBest = type == "ai" ? false : true;
        if(type == "ai"){
            this.fitness = 0;
        }
        this.crash = false;
    }

    update(road, traffic){
        if(!this.crash){
            this.#move();
            this.#detectCollsion(road, traffic);
            this.edges = this.#updateEdges();
        }
        if(this.sensor){
            this.sensor.update(road, traffic);
            const offsets = this.sensor.readings.map(o=>o==null?0:o.offset);
            const outputs = NerualNetwork.feedForward(offsets, this.brain);
            if(this.type == 'ai'){
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    #detectCollsion(road, traffic){
        for(let i = 0; i < road.length; ++i){
            for(let j = 0; j < this.edges.length; ++j){
                const collide = getLineIntersection(this.edges[j], this.edges[(j+1)%4], 
                    road[i][0], road[i][1]);
                    if(collide){
                        this.crash = true;
                    }
            }
        }

        for(let i = 0; i < traffic.length; ++i){
            const collide = getPolyIntersection(this.edges, traffic[i].edges);
            if(collide){
                this.crash = true;
            }
        }

    }

    #updateEdges(){
        const points = [];
        const rad = Math.hypot(this.width, this.height)/2;
        const theta = Math.atan2(this.width, this.height);

        points.push({x: this.x - Math.sin(this.angle-theta)*rad,
            y: this.y - Math.cos(this.angle-theta)*rad});
        points.push({x: this.x - Math.sin(this.angle+theta)*rad,
            y: this.y - Math.cos(this.angle+theta)*rad});
        points.push({x: this.x - Math.sin(Math.PI+this.angle-theta)*rad,
            y: this.y - Math.cos(Math.PI+this.angle-theta)*rad});
        points.push({x: this.x - Math.sin(Math.PI+this.angle+theta)*rad,
            y: this.y - Math.cos(Math.PI+this.angle+theta)*rad});
        
        return points;
    }

    #move(){
        // controls to movement
        if(this.controls.forward){
            this.speed += this.accel;
        }
        if(this.controls.reverse){
            this.speed -= this.accel;
        }

        if(this.speed != 0){
            let flip;
            if(this.speed < 0){
                flip = -1;
            }
            else{
                flip = 1;
            }
            if(this.controls.left){
                this.angle += 0.02*flip;
            }
            if(this.controls.right){
                this.angle -= 0.02*flip; 
            }
        }

        // speed restrictions
        if(this.speed > 0){
            this.speed -= this.friction
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed/2){
            // car moves slower backwards
            this.speed = -this.maxSpeed/2;
        }
        
        // stop when speed is below friction
        if(this.speed < this.friction && this.speed > -this.friction){
            this.speed = 0;
        }

        // update position
        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
    }

    // update function must be called before draw function
    draw(ctx, drawSensors = false){
        ctx.beginPath();
        ctx.moveTo(this.edges[0].x, this.edges[0].y);
        for(let i = 1; i < this.edges.length; ++i){
            ctx.lineTo(this.edges[i].x, this.edges[i].y);
        }
        if(this.type != "bot"){
            ctx.fillStyle = "blue";
            if(this.crash){
                ctx.fillStyle = "navy";
            }
        }
        if(this.type == "bot"){
            ctx.fillStyle = "red";
            if(this.crash){
                ctx.fillStyle = "crimson";
            }
        }
        ctx.fill();

        if(this.sensor && drawSensors){
            this.sensor.draw(ctx);
        }
    }
}
