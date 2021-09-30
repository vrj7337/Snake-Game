import React, {useState, useRef, useEffect} from 'react';
import { useInterval } from './useInterval';
import {
  CANVAS_SIZE,
  SNAKE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
  APPLE_START
} from './constants';
import './App.css';



const App = () => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [dir, setDir] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameover] = useState(false);


  const startGame = () => {
     setSnake(SNAKE_START);
     setApple(APPLE_START);
     setDir([0, -1]);
     setSpeed(SPEED);
     setGameover(false);
  }

  const endGame = () => {
     setSpeed(null);
     setGameover(true);
  }

  const moveSnake = ({ keyCode }) => 
    keyCode >= 37 && keyCode <= 40 && setDir(DIRECTIONS[keyCode]);
  
  const createApple = () => 
     apple.map((_, i) => Math.floor(Math.random() * (CANVAS_SIZE[i]) / SCALE));

  const checkCollision = (piece, snk = snake) => {
     if(
       piece[0] * SCALE >=CANVAS_SIZE[0] ||
       piece[0] < 0 ||
       piece[1] * SCALE >= CANVAS_SIZE[1] ||
       piece[1] < 0
     )
     return true;

     for(const segment of snk) {
       if (piece[0] === segment[0] && piece[1] === segment[1]) return true;
     }
  return false;
  }

  const checkAppleCollision = newSnake => {
     if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
       let newApple = createApple();
       while(checkCollision(newApple, newSnake)) {
         newApple = createApple();
       }
       setApple(newApple);
       return true;
     }
     return false;
  }

  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [snakeCopy[0][0] + dir[0], snakeCopy[0][1] + dir[1]];
    snakeCopy.unshift(newSnakeHead);
    if(checkCollision(newSnakeHead)) endGame(); 
    if(!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  }

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, CANVAS_SIZE[0], window.innerWidth, window.innerHeight);
    context.fillStyle = "black";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "black";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver])

  useInterval(() => gameLoop(), speed);

  return (
   <>
    <div role="button" className="App" tabIndex="0" onKeyDown={e => moveSnake(e)}>
      {gameOver && <div className="GO"><h1>GAME OVER!</h1></div>}
      <button className ="button" onClick={startGame}><h2>Start Game</h2></button>
      <canvas className ="canvas"
        style = {{border: "1px solid aqua"}}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}PX`}
        />
        
        
    </div>
   </> 
  )
}

export default App;
