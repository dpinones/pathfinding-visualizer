import axios from 'axios';

export async function jps(startX, startY, endX, endY, grid, gridWidth, gridHeight) {

    const arr = convertGridToPoints(grid).map(element => String(element));
    try {
        const data = { 
            "start_x": String(startX),
            "start_y": String(startY),
            "end_x": String(endX),
            "end_y": String(endY),
            "grid": arr,
            "grid": arr,
            "grid_width": String(gridWidth),
            "grid_height": String(gridHeight)
        };

        const pathFinderResult = await axios.post('https://tu-api.com/endpoint', data);
        console.log(pathFinderResult.data);
        if(pathFinderResult[0] === 0){
            return [];
        }
        const parsedResult = pathFinderResult[0].map(element => {
            return {
                row: element.y.toString(),
                col: element.x.toString(),
            }
        })
        parsedResult.reverse();
        return parsedResult;
    } catch (error) {
        return [];
    }
}

const convertGridToPoints = (grid) => {
    const initialGrid = [];
    let maps = '';
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j].isWall) {
            initialGrid.push(1);
            maps = maps + '1,'
            } else {
            initialGrid.push(0);
            maps = maps + '0,'
            }
        }
    }
    return initialGrid;
}