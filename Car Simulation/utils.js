// linear interpolation
function lerp(a,b,t){
    return a + (b-a)*t;
}

// Taken from Andre LeMothe
// returns the point of intersection and returns offset from A to B
function getLineIntersection(A,B,C,D){
    const s1 = {x: B.x - A.x, y: B.y - A.y};
    const s2 = {x: D.x - C.x, y: D.y - C.y};
    const s3 = {x: A.x - C.x, y: A.y - C.y};

    // avoid divide by zero
    if((-s2.x * s1.y + s1.x * s2.y) != 0){
        const s = (-s1.y * s3.x + s1.x * s3.y)/(-s2.x * s1.y + s1.x * s2.y);
        const t = (s2.x * s3.y - s2.y * s3.x)/(-s2.x * s1.y + s1.x * s2.y);

        if(s >= 0 && s <= 1 && t >= 0 && t <= 1){
            return {x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t), offset: t};
        }
    }

    return null;
}

// returns if there is an intesection
function getPolyIntersection(A,B){
    for(let i = 0; i < A.length; ++i){
        for(let j = 0; j < B.length; ++j){
            const intersect = getLineIntersection(A[i], A[(i+1)%A.length],
                B[j], B[(j+1)%B.length]);
            if(intersect){
                return true;
            }
        }
    }
    return false;
}