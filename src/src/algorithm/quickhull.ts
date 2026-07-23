import { Point, pointToLine } from "./point";

export function quickHull(list: Point[]): Point[] {
    if (list.length <= 2) {
        return list
    }

    // Get minimum point with the minimum X coordinate
    let minPoint: Point = list[0]
    for (let i = 0; i < list.length; i++) {
        if (list[i].x < minPoint.x) {
            minPoint = list[i]
        }
    }

    // Get maximum point with the maximum X coordinate
    let maxPoint: Point = list[0]
    for (let i = 0; i < list.length; i++) {
        if (list[i].x > maxPoint.x) {
            maxPoint = list[i]
        }
    }

    // Remove minPoint and maxPoint from the list
    let newList: Point[] = list.filter(item => item !== maxPoint && item !== minPoint)

    // Divide points into two segments
    let [s1, s2] = createSegment(minPoint, maxPoint, newList)

    // Find hull for each segments
    let s1Hull: Point[] = findHull(s1, minPoint, maxPoint)
    let s2Hull: Point[] = findHull(s2, maxPoint, minPoint)

    return [...s1Hull, ...s2Hull]
}

function findHull(list: Point[], line1: Point,line2: Point): Point[] {
    // If there are no points, add the first point
    if (list.length === 0) {
        return [line1]
    }

    // Find the furthest point from the line
    let furthestPoint: Point = list[0]
    let furthestDistance: number = pointToLine(furthestPoint, [line1, line2])

    for (let i = 1; i < list.length; i++) {
        let currentDistance: number = pointToLine(list[i], [line1, line2])
        if (currentDistance > furthestDistance) {
            furthestPoint = list[i]
            furthestDistance = currentDistance
        }
    }

    // Remove furthest point from the current list
    let newList: Point[] = list.filter(point => point !== furthestPoint)

    // Divide into smaller segments
    let [s1] = createSegment(line1, furthestPoint, newList)
    let [s2] = createSegment(furthestPoint, line2, newList)

    // Recursively find each hull for each segments
    let s1Hull: Point[] = findHull(s1,line1,furthestPoint)
    let s2Hull: Point[] = findHull(s2,furthestPoint,line2)

    return [...s1Hull, ...s2Hull]
}

// Create segments of point divided by the line
export function createSegment(p1: Point, p2: Point, list: Point[]): [Point[], Point[]] {
    let above: Point[] = []
    let below: Point[] = []

    // Return if the line is vertical
    if (p2.x - p1.x === 0) {
        return [above, below]
    }

    // Create the line
    let m: number = (p2.y - p1.y) / (p2.x - p1.x)
    let c: number = -m * p1.x + p1.y

    // Cluster all the points
    for (const point of list) {
        if (point.y > m * point.x + c) {
            above.push(point)
        } else if (point.y < m * point.x + c) {
            below.push(point)
        }
    }

    return [above, below]
}
