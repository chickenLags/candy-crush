class Vector {
    x = 0;
    y = 0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distanceFrom(v2) {
        let pdx = Math.pow(this.x - v2.x, 2);
        let pdy = Math.pow(this.y - v2.y, 2);
        return Math.sqrt(pdx + pdy);
    }

    add(vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    }

    n_add(n) {
        this.x += n;
        this.y += n;
        return this;
    }

    min(vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    }

    n_min(n) {
        this.x -= n;
        this.y -= n;
        return this;
    }

    magnitude() {
        return Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) );
    }

    scale(scale) {
        this.x *= scale;
        this.y *= scale;
        return this;
    }
    
    copy() {
        return new Vector(this.x, this.y);
    }
}

module.exports = Vector;