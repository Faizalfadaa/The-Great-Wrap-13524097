import { angle, distance, orientation, Point } from "./point";
import { StepPhase, type Step } from "../types";

// Graham Scan Algorithm
export function grahamScan(list: Point[]) : Step[] {
    // Finish if there are only one Point
    if (list.length <= 1) {
        return [
            {
                phase: StepPhase.COMPLETE,
                message: "[COMPLETE] Hull Finished",
                hullPoints: list,
                persistentLines: [],
            },
        ]
    }

    // Get minimum point with the minimum Y coordinate
    let minPoint : Point = list[0]
    for (let i = 0; i < list.length; i++) {
        if (list[i].y < minPoint.y || (list[i].y === minPoint.y && list[i].x < minPoint.x)) {
            minPoint = list[i]
        }
    }

    // Sort list by polar angle
    const sortedList: Point[] = [...list].sort((a, b) => {
        if (a === minPoint) {
            return -1
        }

        if (b === minPoint) {
            return 1
        }

        const angleA = angle(minPoint, a)
        const angleB = angle(minPoint, b)
        if (angleA !== angleB) {
            return angleA - angleB;
        }

        return (distance(minPoint, a) - distance(minPoint, b))
    });

    // Insert First step to list
    const steps: Step[] = [
        {
            phase: StepPhase.SELECT_START,
            message: "[START] Choose point with Y minimum",
            hullPoints: [minPoint],
            persistentLines: [],
            currentPoint: minPoint
        }
    ]

    // Get every angle from every step from the sorted list
    const newSortedList = sortedList.filter((point) => point !== minPoint);
    for (let i = 0; i < newSortedList.length; i++) {
        const currentPoint = newSortedList[i];
        const currentAngle = angle(minPoint, currentPoint).toFixed(1);

        steps.push({
            phase: StepPhase.SORT,
            message: `[SORT] Sorting polar angle: ${currentAngle} degree`,
            hullPoints: [],
            persistentLines: newSortedList.slice(0, i + 1).map((point) => [minPoint, point]),
            currentPoint
        });
    }
    
    // Start finding convex hull from the sorted list
    let result : Point[] = []
    for(let i = 0; i < sortedList.length; i++) {
        const currentPoint = sortedList[i]

        steps.push({
            phase: StepPhase.CHECK,
            message: "[CHECK] Check next Point",
            hullPoints: [...result],
            persistentLines: [],
            currentPoint
        });

        while (result.length >= 2 && orientation(result[result.length - 2], result[result.length - 1], currentPoint) !== 1) {
            // Pop from the stack if it is counter clockwise
            result.pop()
            steps.push({
                phase: StepPhase.DISCARD,
                message: "[DISCARD] Invalid point. Pop from stack",
                hullPoints: [...result],
                persistentLines: [],
                currentPoint
            });
        }

        // Push to stack if the orientation is clockwise
        result.push(currentPoint)
        steps.push({
            phase: StepPhase.ACCEPT,
            message: "[ACCEPT] Insert Point to stack",
            hullPoints: [...result],
            persistentLines: [],
            currentPoint
        });
    }

    steps.push({
        phase: StepPhase.COMPLETE,
        message: "[COMPLETE] Convex Hull completed",
        hullPoints: [...result],
        persistentLines: []
    });

    return steps
}
