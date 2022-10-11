  import {
    Contract,
    defaultProvider,
    Provider,
  } from "starknet";

export function astar(grid, startNode, finishNode) {

  //
  get_starknet();
  //
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  let unvisitedNodes = []; //open list
  let visitedNodesInOrder = []; //closed list
  startNode.distance = 0;
  unvisitedNodes.push(startNode);

  while (unvisitedNodes.length !== 0) {
    unvisitedNodes.sort((a, b) => a.totalDistance - b.totalDistance);
    let closestNode = unvisitedNodes.shift();
    if (closestNode === finishNode) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    let neighbours = getNeighbours(closestNode, grid);
    for (let neighbour of neighbours) {
      let distance = closestNode.distance + 1;
      //f(n) = g(n) + h(n)
      if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes)) {
        unvisitedNodes.unshift(neighbour);
        neighbour.distance = distance;
        neighbour.totalDistance =
          distance + manhattenDistance(neighbour, finishNode);
        neighbour.previousNode = closestNode;
      } else if (distance < neighbour.distance) {
        neighbour.distance = distance;
        neighbour.totalDistance =
          distance + manhattenDistance(neighbour, finishNode);
        neighbour.previousNode = closestNode;
      }
    }
  }
  return visitedNodesInOrder;
}

function getNeighbours(node, grid) {
  let neighbours = [];
  let { row, col } = node;
  if (col !== grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  if (row !== grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col !== 0) neighbours.push(grid[row][col - 1]);
  if (row !== 0) neighbours.push(grid[row - 1][col]);
  return neighbours.filter(
    (neighbour) => !neighbour.isWall && !neighbour.isVisited
  );
}

function neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes) {
  for (let node of unvisitedNodes) {
    if (node.row === neighbour.row && node.col === neighbour.col) {
      return false;
    }
  }
  return true;
}

function manhattenDistance(node, finishNode) {
  let x = Math.abs(node.row - finishNode.row);
  let y = Math.abs(node.col - finishNode.col);
  return x + y;
}

export function getNodesInShortestPathOrderAstar(finishNode) {
  let nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

async function get_starknet(){
  const provider = new Provider()

  const erc20Address = "0x05b4fc161748ddada82bd1c72b6323ee203a6ebf400ac2acdb068f541aff2e03";
  // const contractJson = JSON.parse("./abi/main_abi.json")
  const abi = [
      {
          "inputs": [],
          "name": "root",
          "outputs": [
              {
                  "name": "root",
                  "type": "felt"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "name": "root",
                  "type": "felt"
              }
          ],
          "name": "set_merkle_root",
          "outputs": [],
          "type": "function"
      }
  ];
  
  const erc20 = new Contract(abi, erc20Address, provider);
  const balanceBeforeTransfer = await erc20.root();

}
