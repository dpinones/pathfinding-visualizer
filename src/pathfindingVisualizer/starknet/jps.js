import {
    Contract,
    Provider,
    } from "starknet";

import JPSAbi from '../abi/main_abi.json'

export async function jps(startX, startY, endX, endY, grid, gridWidth, gridHeight) {
    const arr = convertGridToPoints(grid).map(element => String(element));
    
    const provider = new Provider();
    const pathFinderAddress = "0x04474763bccfee577b1ed182e8a143d035fd25cfc984e762203a8b7c0f26df75";
    const pathFinder = new Contract(JPSAbi, pathFinderAddress, provider);
    const pathFinderResult = await pathFinder.path_finder(String(startX), String(startY), String(endX), String(endY), arr, String(gridWidth), String(gridHeight));
    if(!pathFinderResult){
        return [];
    } else {
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