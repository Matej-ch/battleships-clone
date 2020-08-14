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

    }
});