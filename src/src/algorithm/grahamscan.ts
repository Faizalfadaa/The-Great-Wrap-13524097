import { angle, distance, orientation, Point } from "./point";

// Graham Scan Algorithm
export function grahamScan(list: Point[]) : Point[] {
    // Get minimum point with the minimum Y coordinate
    let minPoint : Point = list[0]
    for(let i = 0 ; i < list.length; i++) {
        if (list[i].y < minPoint.y) {
            minPoint = list[i]
        }
    }

    // Sort list by polar angle
    const sortedList: Point[] = list.sort((a, b) => {
        if (a === minPoint) {
            return -1;
        }

        if (b === minPoint) {
            return 1;
        }

        const angleA = angle(minPoint, a);
        const angleB = angle(minPoint, b);
        if (angleA !== angleB) {
            return angleA - angleB;
        }

        return (distance(minPoint, a) - distance(minPoint, b));
    });
    
    let result : Point[] = []
    for(let i = 0; i < sortedList.length; i++) {
        while (result.length >= 2 && orientation(result[result.length - 2], result[result.length - 1], sortedList[i]) != 1) {
            result.pop
        }
        result.push(sortedList[i])
    }

    return result
}