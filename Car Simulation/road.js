class Road{
    // default number of lanes will be 3
    // may add "HOV" express lane
    constructor(xCenter, width, LaneCount=3){
        this.x = xCenter;
        this.width = width;
        this.laneCount = LaneCount;

        this.left = this.x - width/2;
        this.right = this.x + width/2;

        const infinity = 100000;
        this.top = -infinity;
        this.bot = infinity;

        // start and end points of the solid lines
        this.solidLines = [[{x: this.left, y: this.top}, {x: this.left, y: this.bot}], 
            [{x: this.right, y: this.top},{x: this.right, y: this.bot}]];
    }

    getLaneCenter(laneNum){
        const laneWidth = this.width/this.laneCount;
        let laneIndex = laneNum;

        // avoid going out of bounds
        if(laneNum >= this.laneCount){
            laneIndex = this.laneCount - 1;
            console.log("Lane Index out of Bounds: Above the max");
        }
        if(laneNum < 0){
            laneIndex = 0;
            console.log("Lane Index out of Bounds: Negative Index");
        }
        return this.left + laneWidth/2 + laneIndex*laneWidth;
    }

    draw(ctx){
        ctx.lineWidth = 5;

        for(let i = 0; i <= this.laneCount; ++i){
            if(i == 0 || i == this.laneCount){
                ctx.setLineDash([]);
                ctx.strokeStyle = "yellow";
            }
            else{
                ctx.setLineDash([20, 20]);
                ctx.strokeStyle = "white";
            }


            ctx.beginPath();
            ctx.moveTo(lerp(this.left, this.right, i/this.laneCount), this.top);
            ctx.lineTo(lerp(this.left, this.right, i/this.laneCount), this.bot);
            ctx.stroke();
        }

    }
}