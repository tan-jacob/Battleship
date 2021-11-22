//const { create } = require("domain");

const xhttp = new XMLHttpRequest();
const GET = 'GET'
const POST = 'POST';
const PUT = 'PUT';

const width = 10;
let isHorizontal = true;

///////////////////////////////////////Battleship Game Logic///////////////////////////////////////

//Set up game logic
document.addEventListener('DOMContentLoaded', () => {
    //Grab grid containers
    const playerGrid = document.querySelector('.grid-board-player');
    const opponentGrid = document.querySelector('.grid-board-opponent');
    const displayGrid = document.querySelector('.container');
    
    //Grab ship containers
    const ships = document.querySelectorAll('.ship');
    const destroyer = document.querySelector('.destroyer-container');
    const carrier = document.querySelector('.carrier-container');
    const battleship = document.querySelector('.battleship-container');
    const submarine = document.querySelector('.submarine-container');
    const patrol = document.querySelector('.patrol-container');
    const playerSquares = [];
    const opponentSquares = [];

    //Ship dragging functionality
    let selectedShipNameWithIndex;
    let draggedShip;
    let draggedShipLength;

    ships.forEach(ship => ship.addEventListener('mousedown', (e) => {
        selectedShipNameWithIndex = e.target.id;
        console.log(selectedShipNameWithIndex);
      }))

    function dragStart() {
        draggedShip = this;
        draggedShipLength = this.childNodes.length;
        console.log(draggedShip);
      }
    
    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragDrop() {
        let shipNameWithLastId = draggedShip.lastChild.id;
        let shipClass = shipNameWithLastId.slice(0, -2);
        console.log(shipClass)
        let lastShipIndex = parseInt(shipNameWithLastId.substr(-1));
        let shipLastId = lastShipIndex + parseInt(this.dataset.id);
        // console.log(shipLastId)
        const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93];
        const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60];
        
        let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex);
        let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex);

        selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

        shipLastId = shipLastId - selectedShipIndex;
        // console.log(shipLastId)

        if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
            for (let i=0; i < draggedShipLength; i++) {
                let directionClass;
                if (i === 0) directionClass = 'start';
                if (i === draggedShipLength - 1) directionClass = 'end';
                playerSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', 'horizontal', directionClass, shipClass);
            }
        //As long as the index of the ship you are dragging is not in the newNotAllowedVertical array! This means that sometimes if you drag the ship by its
        //index-1 , index-2 and so on, the ship will rebound back to the displayGrid.
        } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
            for (let i=0; i < draggedShipLength; i++) {
                let directionClass;
                if (i === 0) directionClass = 'start';
                if (i === draggedShipLength - 1) directionClass = 'end';
                playerSquares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', 'vertical', directionClass, shipClass);
            }
        } else return

        displayGrid.removeChild(draggedShip);
        if(!displayGrid.querySelector('.ship')) allShipsPlaced = true
    }

    //Ship movement functionality
    ships.forEach(ship => ship.addEventListener('dragstart', dragStart));
    playerSquares.forEach(square => square.addEventListener('dragstart', dragStart));
    playerSquares.forEach(square => square.addEventListener('dragover', dragOver));
    playerSquares.forEach(square => square.addEventListener('dragenter', dragEnter));
    //playerSquares.forEach(square => square.addEventListener('dragleave', dragLeave));
    playerSquares.forEach(square => square.addEventListener('drop', dragDrop));
    //playerSquares.forEach(square => square.addEventListener('dragend', dragEnd));

    //Grab button
    const rotateButton = document.querySelector('#rotate');

    //Create board grid
    function createBoard(grid, squares) {
        for(let i = 0; i < 100; i ++) {
            const square = document.createElement('div');
            square.dataset.id = i;
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard(playerGrid, playerSquares);
    createBoard(opponentGrid, opponentSquares);

    //Create ship arrays
    const shipArray = [
        {
            name: 'patrol',
            directions: [
                [0, 1],
                [0, width]
            ]
        },
        {
            name: 'submarine',
            directions: [
                [0, 1, 2],
                [0, width, width*2]
            ]
        },
        {
            name: 'destroyer',
            directions: [
                [0, 1, 2],
                [0, width, width*2]
            ]
        },
        {
            name: 'battleship',
            directions: [
                [0, 1, 2, 3],
                [0, width, width*2, width*3]
            ]
        },
        {
            name: 'carrier',
            directions: [
                [0, 1, 2, 3, 4, 5],
                [0, width, width*2, width*3, width*4]
            ]
        }
    ]

    function rotateShip() {
        if (isHorizontal) {
            destroyer.classList.toggle('destroyer-container-vertical');
            patrol.classList.toggle('patrol-container-vertical');
            submarine.classList.toggle('submarine-container-vertical');
            battleship.classList.toggle('battleship-container-vertical');
            carrier.classList.toggle('carrier-container-vertical');
            isHorizontal = false;
        }
        if (!isHorizontal) {
            destroyer.classList.toggle('destroyer-container');
            patrol.classList.toggle('patrol-container');
            submarine.classList.toggle('submarine-container');
            battleship.classList.toggle('battleship-container');
            carrier.classList.toggle('carrier-container');
            isHorizontal = true;
        }
    }
    rotateButton.addEventListener('click', rotateShip);


})

///////////////////////////////////////Chatroom///////////////////////////////////////

///get data///
const endPointRoot = "http://localhost:8888/api/v1/"
const resource = "chatlog/"

function getData() {
    const url = endPointRoot + resource;
    xhttp.open("GET", url , true);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 & this.status == 200) {
            const obj = JSON.parse(this.responseText);
            console.log(obj);

            for (let i = 0; i < obj.length; i++) {
                let results = obj[i].name + ":" + obj[i].msg + '<br>'
                document.getElementById('chat').innerHTML += results;
                
            };

        }
    }
   
};

function inputValidator(message) {
    if (message.trim() == "") {
        alert("Message cannot be blank. Please try again");
        return false;
    }
    return true;
}

function post() {
    let name = document.getElementById('name').value;
    let msg = document.getElementById('msg').value;

    if (inputValidator(msg)) {
        let paramsJson = {'name': name, 'msg': msg};
        xhttp.open(POST, endPointRoot + resource, true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify(paramsJson));
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("returnMsg").innerHTML = this.responseText;
                console.log(this.responseText);
            }
        };
    }
}


window.onload = getData;
