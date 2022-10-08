import {
    Contract,
    defaultProvider,
    Provider,
    } from "starknet";

export async function jps(startX, startY, endX, endY, grid, gridWidth, gridHeight) {
    const arr = convertGridToPoints(grid).map(element => String(element));
    
    const provider = new Provider();
    const erc20Address = "0x030edd0a62ac24437c8a9af9a2768092623b2939a4e48642e4a38caeed865577";
    // const contractJson = JSON.parse("./abi/main_abi.json")
    const abi = [{"members":[{"name":"x","offset":0,"type":"felt"},{"name":"y","offset":1,"type":"felt"},{"name":"walkable","offset":2,"type":"felt"}],"name":"Point","size":3,"type":"struct"},{"inputs":[{"name":"start_x","type":"felt"},{"name":"start_y","type":"felt"},{"name":"end_x","type":"felt"},{"name":"end_y","type":"felt"},{"name":"grids_len","type":"felt"},{"name":"grids","type":"felt*"},{"name":"width","type":"felt"},{"name":"height","type":"felt"}],"name":"path_finder","outputs":[{"name":"points_len","type":"felt"},{"name":"points","type":"Point*"}],"stateMutability":"view","type":"function"}];
    
    const erc20 = new Contract(abi, erc20Address, provider);
    const pathFinderResult = await erc20.path_finder(String(startX), String(startY), String(endX), String(endY), arr, String(gridWidth), String(gridHeight));
    if(!pathFinderResult){
        return [];
    } else {
        const parsedResult = pathFinderResult[0].map(element => {
            return {
                row: element.y.toString(),
                col: element.x.toString(),
            }
        })
        return parsedResult;
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
    console.log('maps: ', maps)
    return initialGrid;
}