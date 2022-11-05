document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const container = document.querySelector('.container')
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result')
    const widthInput = document.getElementById('width')
    const heightInput = document.getElementById('height')
    const bombAmountInput = document.getElementById('bomb-amount')
    let width = parseInt(widthInput.value)
    let height = parseInt(heightInput.value)
    let bombAmount = parseInt(bombAmountInput.value)
    let flags = 0
    let squares = []
    let isGameOver = false

    widthInput.addEventListener("input", function (e) {
        width = parseInt(widthInput.value)
        grid.style.width = 40*width + 'px'
        container.style.width = (40*width+100) + 'px'
        bombAmountInput.max = width*height
        createBoard()
    }, false)

    heightInput.addEventListener("input", function (e) {
        height = parseInt(heightInput.value)
        grid.style.height = 40*height + 'px';
        container.style.height = (40*height+100) + 'px'
        bombAmountInput.max = width*height

        createBoard()
    }, false)

    bombAmountInput.addEventListener("input", function (e) {
        bombAmount = parseInt(bombAmountInput.value)
        createBoard()
    }, false)



    //create Board
    function createBoard() {
        grid.innerHTML = ''
        flagsLeft.innerHTML = bombAmount

        //get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * height - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width * height; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            //normal click
            square.addEventListener('click', function (e) {
                click(square)
            })

            //cntrl and left click
            square.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        //add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++
                if (i > width-1 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++
                if (i > width && squares[i - width].classList.contains('bomb')) total++
                if (i > width+1 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++
                if (i < width*height-2 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++
                if (i < width*height-width && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++
                if (i < width*height-width-2 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++
                if (i < width*height-width-1 && squares[i + width].classList.contains('bomb')) total++
                squares[i].setAttribute('data', total)
            }
        }
    }

    createBoard()

    //add Flag with right click
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = ' 🚩'
                flags++
                flagsLeft.innerHTML = bombAmount - flags
                checkForWin()
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
                flagsLeft.innerHTML = bombAmount - flags
            }
        }
    }

    //click on square actions
    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total
                return
            }
            checkSquare(square, currentId)
        }
        square.classList.add('checked')
    }


    //check neighboring squares once square is clicked
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                //const newId = parseInt(currentId) - 1   ....refactor
                const newSquare = document.getElementById(newId)
                if (!newSquare.classList.contains('bomb')){
                    click(newSquare)
                }
            }
            if (currentId > width-1 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                //const newId = parseInt(currentId) +1 -width   ....refactor
                const newSquare = document.getElementById(newId)
                if (!newSquare.classList.contains('bomb')) {
                    click(newSquare)
                }
            }
            if (currentId > width) {
                const newId = squares[parseInt(currentId - width)].id
                //const newId = parseInt(currentId) -width   ....refactor
                const newSquare = document.getElementById(newId)
                if (!newSquare.classList.contains('bomb')) {
                    click(newSquare)
                }
            }
            if (currentId > width+1 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                //const newId = parseInt(currentId) -1 -width   ....refactor
                const newSquare = document.getElementById(newId)
                if (!newSquare.classList.contains('bomb')) {
                    click(newSquare)
                }
            }
            if (currentId < width*height-2 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                //const newId = parseInt(currentId) +1   ....refactor
                const newSquare = document.getElementById(newId)
                if (!newSquare.classList.contains('bomb')) {
                    click(newSquare)
                }
            }
            if (currentId < width*height-width && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                //const newId = parseInt(currentId) -1 +width   ....refactor
                const newSquare = document.getElementById(newId)
                if (!newSquare.classList.contains('bomb')) {
                    click(newSquare)
                }
            }
            if (currentId < width*height-width-2 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                //const newId = parseInt(currentId) +1 +width   ....refactor
                const newSquare = document.getElementById(newId)
                if (!newSquare.classList.contains('bomb')) {
                    click(newSquare)
                }
            }
            if (currentId < width*height-width-1) {
                const newId = squares[parseInt(currentId) + width].id
                //const newId = parseInt(currentId) +width   ....refactor
                const newSquare = document.getElementById(newId)
                if (!newSquare.classList.contains('bomb')) {
                    click(newSquare)
                }
            }
        }, 10)
    }

    //game over
    function gameOver(square) {
        result.innerHTML = 'BOOM! Game Over!'
        isGameOver = true

        //show ALL the bombs
        squares.forEach(square => {

            if (square.classList.contains('bomb')) {
                square.classList.add('checked')
                square.innerHTML = '💣'
                square.classList.remove('bomb')

            } else {
                let currentId = square.id
                if (square.classList.contains('bomb')) {
                    gameOver(square)
                } else {
                    let total = square.getAttribute('data')
                    if (total != 0) {
                        square.classList.add('checked')
                        if (total == 1) square.classList.add('one')
                        if (total == 2) square.classList.add('two')
                        if (total == 3) square.classList.add('three')
                        if (total == 4) square.classList.add('four')
                        square.innerHTML = total
                    }
                    checkSquare(square, currentId)
                }
                square.classList.add('checked')
            }
        })
    }

    //check for win
    function checkForWin() {
        ///simplified win argument
        let matches = 0

        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++
            }
            if (matches === bombAmount) {
                result.innerHTML = 'YOU WIN!'
                isGameOver = true
            }
        }
    }
})