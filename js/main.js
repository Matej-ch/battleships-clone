document.addEventListener('DOMContentLoaded',() => {
    const userGrid = document.querySelector('.grid-user');
    const computerGrid = document.querySelector('.grid-computer');
    const displayGrid = document.querySelector('.grid-display');

    const ships = document.querySelectorAll('.ship');

    const destroyer = document.querySelector('.destroyer-container');
    const cruiser = document.querySelector('.cruiser-container');
    const submarine = document.querySelector('.submarine-container');
    const battleship = document.querySelector('.battleship-container');
    const carrier = document.querySelector('.carrier-container');

    const startButton = document.querySelector('#start');
    const rotateButton = document.querySelector('#rotate');
    const turnDisplay = document.querySelector('#whose-go');
    const infoDisplay = document.querySelector('#info');

    const userSquares = [];
    const computerSquares = [];
    const width = 10;
    let isHorizontal = true;
    let isGameOver = true;
    let currentPlayer = 'user';

    function createBoard(grid, squares) {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.dataset.id = i;
            grid.appendChild(square);
            squares.push(square);
        }
    }

    createBoard(userGrid,userSquares);
    createBoard(computerGrid,computerSquares);

    //ships
    const shipArray = [{
            name: 'destroyer',
            directions: [
                [0,1],
                [0,width]
            ]
        },
        {
            name: 'submarine',
            directions: [
                [0,1,2],
                [0,width,width*2]
            ]
        },
        {
            name: 'cruiser',
            directions: [
                [0,1,2],
                [0,width,width*2]
            ]
        },
        {
            name: 'battleship',
            directions: [
                [0,1,2,3],
                [0,width,width*2,width*3]
            ]
        },
        {
            name: 'carrier',
            directions: [
                [0,1,2,3,4],
                [0,width,width*2,width*3,width*4]
            ]
        },]

    function generateShips(ship) {
        let randomDirection = Math.floor(Math.random() * ship.directions.length);
        let current = ship.directions[randomDirection];
        let direction = 1;
        if (randomDirection === 0) {
            direction = 1;
        }

        if (randomDirection === 1) {
            direction = 10;
        }

        let randomStart = Math.abs(Math.floor(Math.random() * computerSquares.length - (ship.directions[0].length * direction)));

        const isTaken = current.some(index => computerSquares[randomStart + index].classList.contains('taken'));
        const isAtRightEdge = current.some(index => (randomStart + index) % width === width - 1);
        const isAtLeftEdge = current.some(index => (randomStart + index) % width === 0);

        if(!isTaken && !isAtRightEdge && !isAtLeftEdge) {
            current.forEach(index => computerSquares[randomStart + index].classList.add('taken',ship.name));
        } else {
            generateShips(ship);
        }
    }

    generateShips(shipArray[0]);
    generateShips(shipArray[1]);
    generateShips(shipArray[2]);
    generateShips(shipArray[3]);
    generateShips(shipArray[4]);

    //rotate ships
    function rotate() {
        if(isHorizontal) {
            destroyer.classList.toggle('destroyer-container-vertical');
            submarine.classList.toggle('submarine-container-vertical');
            cruiser.classList.toggle('cruiser-container-vertical');
            battleship.classList.toggle('battleship-container-vertical');
            carrier.classList.toggle('carrier-container-vertical');
            isHorizontal = false;
            return;
        }

        if(!isHorizontal) {
            destroyer.classList.toggle('destroyer-container-vertical');
            submarine.classList.toggle('submarine-container-vertical');
            cruiser.classList.toggle('cruiser-container-vertical');
            battleship.classList.toggle('battleship-container-vertical');
            carrier.classList.toggle('carrier-container-vertical');
            isHorizontal = true;
            return;
        }
    }

    rotateButton.addEventListener('click',rotate);

    //move around user ship

    let selectedShipNameWithIndex;
    let draggedShip;
    let draggedShipLength;

    ships.forEach(ship => {
        ship.addEventListener('dragstart',dragStart);
        ship.addEventListener('mousedown',(e) => {
            selectedShipNameWithIndex = e.target.id;
        })
    });

    userSquares.forEach(square => square.addEventListener('dragstart',dragStart));
    userSquares.forEach(square => square.addEventListener('dragover',dragOver));
    userSquares.forEach(square => square.addEventListener('dragenter',dragEnter));
    userSquares.forEach(square => square.addEventListener('dragleave',dragLeave));
    userSquares.forEach(square => square.addEventListener('drop',dragDrop));
    userSquares.forEach(square => square.addEventListener('dragend',dragEnd));

    function dragStart() {
        draggedShip = this;
        draggedShipLength = this.childElementCount;
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave(e) {
        e.preventDefault();
    }

    function* range(start, end) {
        if(start > end) {
            for (let i = start; i >= end; i--) {
                yield i;
            }
        } else {
            for (let i = start; i <= end; i++) {
                yield i;
            }
        }
    }

    //@TODO Fix error, on side goes on other side of board
    function dragDrop() {
        let shipNameWithLastId= draggedShip.lastElementChild.id;
        let shipClass = shipNameWithLastId.slice(0,-2);
        let lastShipIndex = shipNameWithLastId.substr(-1);
        let shipLastId = lastShipIndex + parseInt(this.dataset.id);
        const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93];
        const notAllowedVertical = [...range(99, 60)];

        let newNotAllowedHorizontal = notAllowedHorizontal.splice(0,10* lastShipIndex);
        let newNotAllowedVertical = notAllowedVertical.splice(0,10* lastShipIndex);
        let selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1));

        shipLastId = shipLastId - selectedShipIndex;

        if(isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
            for (let i =0; i < draggedShipLength; i++) {
                userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken',shipClass);
            }
        } else if(!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
            for (let i =0; i < draggedShipLength; i++) {
                userSquares[parseInt(this.dataset.id) - selectedShipIndex + (width * i)].classList.add('taken',shipClass);
            }
        } else {
            return;
        }

        displayGrid.removeChild(draggedShip);
    }

    function dragEnd() {

    }

    function playGame() {
        if(isGameOver) { return; }
        if(currentPlayer ===  'user') {
            turnDisplay.innerHTML = 'Your go';
            computerSquares.forEach(square => square.addEventListener('click',function (e) {
                revealSquare(square);
            }))
        }
        if(currentPlayer ===  'computer') {
            turnDisplay.innerHTML = 'Computers go';
        }
    }

    startButton.addEventListener('click',playGame);


    let destroyerCount = 0;
    let submarineCount = 0;
    let cruiserCount = 0;
    let battleshipCount = 0;
    let carrierCount = 0;
    function revealSquare(square) {
        if(square.classList.contains('destroyer')) {
            destroyerCount++;
        }
        if(square.classList.contains('submarine')) {
            submarineCount++;
        }
        if(square.classList.contains('cruiser')) {
            cruiserCount++;
        }
        if(square.classList.contains('battleship')) {
            battleshipCount++;
        }
        if(square.classList.contains('carrier')) {
            carrierCount++;
        }
    }

});