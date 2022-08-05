class Sensors{
    constructor(car, numSensors = 5){
        this.car = car;
        this.rayCount = numSensors;
        this.rayLength = 150;
        this.raySpread = Math.PI/2 // Spread Sensor in front 90 degree

        // used for collision detection
        // [[start pt, end pt]...] where start/end pt = [x, y]
        this.rays = [];
        this.readings = [];
    }

    update(road, traffic){
        this.#castRays();
        this.readings = []
        for(let i = 0; i < this.rayCount; ++i){
            this.readings.push(this.#detect(
                this.rays[i], road, traffic)
            );
        }
    }

    #detect(ray, road, traffic){
        let collision = [];

        for(let i = 0; i < road.length; ++i){
            const collide = getLineIntersection(ray[0], ray[1], 
                road[i][0], road[i][1]);
            if(collide){
                collision.push(collide);
            }
        }

        for(let i = 0; i < traffic.length; ++i){
            for(let j = 0; j < traffic[i].edges.length; ++j){
                const collide = getLineIntersection(ray[0], ray[1],
                    traffic[i].edges[j], traffic[i].edges[(j+1)%traffic[i].edges.length]);
                if(collide){
                    collision.push(collide);
                }
            }
        }

        if(collision.length == 0){
            return null;
        }

        const offsets = collision.map(e => e.offset);
        const minOffset = Math.min(...offsets);
        return collision.find(e => e.offset == minOffset);
    }
    
    #castRays(){
        this.rays = []; // reset rays
        for(let i = 0; i < this.rayCount; ++i){
            const rayAngle = lerp(this.raySpread/2,
                -this.raySpread/2, 
                this.rayCount == 1 ? 0.5 : i/(this.rayCount - 1)) - this.car.angle;
            const start = {x: this.car.x, y: this.car.y};
            const end = {x: this.car.x + this.rayLength * Math.sin(rayAngle),
                y: this.car.y - this.rayLength * Math.cos(rayAngle)};

            this.rays.push([start, end]);
        }
    }

    draw(ctx){
        for(let i = 0; i < this.rayCount; ++i){
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "lime";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.stroke();

            if(this.readings[i]){
                const collide = this.readings[i];
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.strokeStyle = "black";
                ctx.moveTo(collide.x, collide.y);
                ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
                ctx.stroke();
            }
        }
    }
}