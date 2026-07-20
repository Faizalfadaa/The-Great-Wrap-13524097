import { distance, orientation, Point } from "./point";

export function jarvisMarch(list: Point[]) : Point[] {
    // Get point with the minimum X coordinate
    let onHull : Point = list[0]
    for(let i = 0 ; i < list.length; i++) {
        if (list[i].x < onHull.x) {
            onHull = list[i]
        }
    }    

    let result : Point[] = []
    while (1) {
        result.push(onHull)
        let nextPoint : Point = list[0]
        for(const point of list) {
            let orient : number = orientation(onHull, nextPoint, point) 

            if (nextPoint == onHull || orient == 1 || (orient == 0 && distance(onHull, point) > distance(onHull, nextPoint))) {
                nextPoint = point
            }
        }

        onHull = nextPoint
        if(onHull == result[0]) {
            break
        }
    }

    return result
}