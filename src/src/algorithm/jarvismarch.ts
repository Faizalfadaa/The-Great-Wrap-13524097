import { distance, orientation, Point } from "./point";
import { StepPhase, type Step } from "../types";

// Jarvis March Algorithm
export function jarvisMarch(list: Point[]) : Step[] {
    // Finish if there are only one Point
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

    // Get point with the minimum X coordinate
    let onHull : Point = list[0]
    for(let i = 0 ; i < list.length; i++) {
        if (list[i].x < onHull.x) {
            onHull = list[i]
        }
    }    

    const steps: Step[] = [
        {
            phase: StepPhase.SELECT_START,
            message: "[START] Choose point with X minimum",
            hullPoints: [onHull],
            persistentLines: [],
            currentPoint: onHull
        }
    ]

    let result : Point[] = []

    // Start finding convex hull
    while (1) {
        result.push(onHull)
        steps.push({
            phase: StepPhase.ACCEPT,
            message: "[ACCEPT] Insert Point to hull",
            hullPoints: [...result],
            persistentLines: [],
            currentPoint: onHull
        })

        let nextPoint : Point
        if (list[0] === onHull) {
            nextPoint = list[1]
        } else {
            nextPoint = list[0]
        }

        let checkedLines : Point[][] = []
        for(const point of list) {
            if (point === onHull) {
                continue
            }

            checkedLines = [...checkedLines, [onHull, point]]
            let orient : number = orientation(onHull, nextPoint, point) 
            steps.push({
                phase: StepPhase.CHECK,
                message: "[CHECK] Check candidate point",
                hullPoints: [...result],
                persistentLines: [...checkedLines],
                currentPoint: point
            })

            if (nextPoint === onHull || orient === 1 || (orient === 0 && distance(onHull, point) > distance(onHull, nextPoint))) {
                nextPoint = point

                steps.push({
                    phase: StepPhase.ACCEPT,
                    message: "[ACCEPT] Update next hull candidate",
                    hullPoints: [...result],
                    persistentLines: [...checkedLines],
                    currentPoint: nextPoint
                })
            }
        }

        onHull = nextPoint
        if(onHull === result[0]) {
            break
        }
    }

    steps.push({
        phase: StepPhase.COMPLETE,
        message: "[COMPLETE] Convex Hull completed",
        hullPoints: [...result],
        persistentLines: [],
    })

    return steps
}