import { Point } from "./point";

// Process input Files and store thme into list of Points
export function inputFile(input: string): Point[] {
    let points: Point[] = []
    let lines = input.split("\n").map((line) => line.trim()).filter((line) => line.length > 0)
    
    for (let line of lines) {
        let coordinates = line.split(/\s+/)

        if (coordinates.length != 2) {
            throw new Error("[ERROR] Format tidak valid")
        }

        let x: number = Number(coordinates[0])
        let y: number = Number(coordinates[1])

        if (Number.isNaN(x) || Number.isNaN(y)) {
            throw new Error("[ERROR] Input harus angka")
        }

        points.push(new Point(x, y));
    }

    return points;
}

// Read file and process the input using inputFile()
export async function readFile(file: File): Promise<Point[]> {
    const content: string = await file.text();
    return inputFile(content);
}