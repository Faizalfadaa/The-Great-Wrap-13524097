import { Point, pointToLine } from "./point";
import { StepPhase, type Step } from "../types";

export function quickHull(points: Point[]): Step[] {
    // Remove duplicate points
    let list: Point[] = []
    for (const point of points) {
        let isDuplicate: boolean = false
        for(let i = 0; i < list.length; i++) {
            if(list[i].x === point.x && list[i].y === point.y) {
                isDuplicate = true
                break
            }
        }

        if (!isDuplicate) {
            list.push(point)
        }
    }

    // Return if there is only 1 point
    if (list.length <= 1) {
        return [
            {
                phase: StepPhase.COMPLETE,
                message: "[COMPLETE] Hull Finished",
                hullPoints: list,
                persistentLines: []
            }
        ]
    }

    // Return if there are only 2 points
    if (list.length <= 2) {
        return [
            {
                phase: StepPhase.COMPLETE,
                message: "[COMPLETE] Hull Finished",
                hullPoints: list,
                persistentLines: []
            }
        ]
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

    // If all points have the same X, the hull is the lowest and highest point
    if (minPoint === maxPoint) {
        let minYPoint: Point = list[0]
        let maxYPoint: Point = list[0]

        for (let i = 0; i < list.length; i++) {
            if (list[i].y < minYPoint.y) {
                minYPoint = list[i]
            }

            if (list[i].y > maxYPoint.y) {
                maxYPoint = list[i]
            }
        }

        return [
            {
                phase: StepPhase.SELECT_START,
                message: "[START] All points have same X. Choose Y minimum and Y maximum",
                hullPoints: [minYPoint, maxYPoint],
                persistentLines: [[minYPoint, maxYPoint]],
                currentPoint: minYPoint
            },
            {
                phase: StepPhase.COMPLETE,
                message: "[COMPLETE] Convex Hull completed",
                hullPoints: [minYPoint, maxYPoint],
                persistentLines: [],
            }
        ]
    }

    // Remove minPoint and maxPoint from the list
    let newList: Point[] = list.filter(item => item !== maxPoint && item !== minPoint)

    // Divide points into two segments
    let [s1, s2] = createSegment(minPoint, maxPoint, newList)
    const steps: Step[] = [
        {
            phase: StepPhase.SELECT_START,
            message: "[START] Choose points with X minimum and X maximum",
            hullPoints: [minPoint, maxPoint],
            persistentLines: [[minPoint, maxPoint]],
            currentPoint: minPoint
        }
    ]

    // Find hull for each segments
    let s1Hull: Point[] = findHull(s1, minPoint, maxPoint, steps, [minPoint, maxPoint], "above")
    let s2Hull: Point[] = findHull(s2, maxPoint, minPoint, steps, [minPoint, ...s1Hull, maxPoint], "below")
    let result: Point[] = [minPoint, ...s1Hull, maxPoint, ...s2Hull]

    steps.push({
        phase: StepPhase.COMPLETE,
        message: "[COMPLETE] Convex Hull completed",
        hullPoints: result,
        persistentLines: [],
    })

    return steps
}

function findHull(list: Point[], point1: Point, point2: Point, steps: Step[], hullPoints: Point[], side: string): Point[] {
    // Return if there are no points outside the line
    if (list.length === 0) {
        steps.push({
            phase: StepPhase.CHECK,
            message: "[CHECK] No point outside this line",
            hullPoints,
            persistentLines: [[point1, point2]],
        })

        return []
    }

    // Find the furthest point from the line
    let furthestPoint: Point = list[0]
    let furthestDistance: number = pointToLine(furthestPoint, [point1, point2])
    for (let i = 0; i < list.length; i++) {
        let currentDistance: number = pointToLine(list[i], [point1, point2])
        steps.push({
            phase: StepPhase.CHECK,
            message: "[CHECK] Find furthest point from line",
            hullPoints,
            persistentLines: [[point1, point2]],
            currentPoint: list[i]
        })

        if (currentDistance > furthestDistance) {
            furthestPoint = list[i]
            furthestDistance = currentDistance
        }
    }

    steps.push({
        phase: StepPhase.ACCEPT,
        message: "[ACCEPT] Select furthest point",
        hullPoints: [...hullPoints, furthestPoint],
        persistentLines: [[point1, furthestPoint], [furthestPoint, point2]],
        currentPoint: furthestPoint
    })

    // Remove furthest point from the current list
    let newList: Point[] = list.filter(point => point !== furthestPoint)

    // Divide into smaller segments
    let [point1Above, point1Below] = createSegment(point1, furthestPoint, newList)
    let [point2Above, point2Below] = createSegment(furthestPoint, point2, newList)

    let s1: Point[] = []
    let s2: Point[] = []
    if (side === "above") {
        s1 = point1Above
        s2 = point2Above
    } else {
        s1 = point1Below
        s2 = point2Below
    }

    // Recursively find each hull for each segments
    let s1Hull: Point[] = findHull(s1, point1, furthestPoint, steps, [...hullPoints, furthestPoint], side)
    let s2Hull: Point[] = findHull(s2, furthestPoint, point2, steps, [...hullPoints, ...s1Hull, furthestPoint], side)

    return [...s1Hull, furthestPoint, ...s2Hull]
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
