import React, { Component } from 'react';
import Screen from './screen';
import ControlPanel from './controlPanel';
import CPU from './../emulator/cpu';

class Chip8 extends Component{


    constructor(props) {
        super(props);
        const cpu = new CPU();

        this.state = {
            cpu: cpu,
            image: cpu.getImageData(),
            gameLoop: null,
            speed: 8
        }
    }


    gameFileHandler = (game)=>{
        this.stopGame();
        this.state.cpu.reset();
        this.state.cpu.setROM(game);
    };

    userInputHandler = (keyData)=>{
        this.startGame();
    };

    startGame = ()=>{
        this.setState({
            gameLoop: setInterval(()=>{
                for(let i = 0; i < this.state.speed; i++)
                    this.state.cpu.cycle();
                this.setState({
                    image: this.state.cpu.getImageData()
                });
            }, 16)
        })
    };

    stopGame = ()=>{
        clearInterval(this.state.gameLoop);
    };

    render() {
        return (
            <div className='chip8'>
                <h2 className='title'>CHIP-8.js</h2>
                <Screen width='640' height='320' gfx={this.state.image}/>
                <ControlPanel onGame={this.gameFileHandler} onKey={this.userInputHandler}/>
            </div>
        );
    }

}

export default Chip8;