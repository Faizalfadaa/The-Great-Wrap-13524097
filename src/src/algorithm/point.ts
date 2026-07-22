// Initialize Point type
export class Point {
    x: number
    y: number
  
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

// For create a new point
export function createPoint(x: number, y: number): Point {
    return new Point(x, y)
}

// Distance from two points
export function distance(p1: Point, p2: Point) : number {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}   

// Get the orientation from 3 points
export function orientation(p1: Point, p2: Point, p3: Point) : number {
    let d : number = (p3.y - p2.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p3.x - p2.x)
    if (d > 0) {
        return 1
    }

    if (d < 0) {
        return -1
    }

    return 0
}

// Get the polar angle from two points
export function angle(p1: Point, p2: Point) : number {
    let dx : number = p2.x - p1.x
    let dy : number = p2.y - p1.y

    let angleRadian : number = Math.atan2(dy, dx)
    let angleDegree : number = angleRadian * (180 / Math.PI)

    if (angleDegree < 0) {
        angleDegree += 360
    }

    return angleDegree
}