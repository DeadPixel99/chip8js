import React, { Component } from 'react';
import Screen from './screen';
import ControlPanel from './controlPanel';
import OPCode from './opcode';
import CPU from './../emulator/cpu';

class Chip8 extends Component{


    constructor(props) {
        super(props);
        this.cpu = new CPU();

        this.state = {
            image: this.cpu.getImageData(),
            speed: 5,
            rom: null,
            cpuState: this.cpu.getMemoryData()
        }
    }


    gameFileHandler = (game)=>{
        this.reset();
        this.setState({
           rom: game
        });
    };

    userInputHandler = (keyData)=>{
        this.startGame();
    };

    startGame = ()=>{
        this.cpu.setROM(this.state.rom);
        this.gameLoop = setInterval(()=>{
                for(let i = 0; i < this.state.speed; i++)
                    this.cpu.cycle();
                this.setState({
                    image: this.cpu.getImageData(),
                    cpuState: this.cpu.getMemoryData()
                });
            }, 16)
        };

    pauseGame = ()=>{
        if(this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        } else {
            this.startGame();
        }
    };

    reset = ()=>{
        clearInterval(this.gameLoop);
        this.cpu.reset();
        this.setState({
            image: this.cpu.getImageData()
        });
    };

    render() {

        const handlers = {
            reset: this.reset,
            pause: this.pauseGame,
            inputFile: this.gameFileHandler
        };

        return (
            <div className='chip8'>
                <h2 className='title'>CHIP-8.js</h2>
                <div className='data-block'>
                    <div>
                        <Screen width='640' height='320' gfx={this.state.image}/>
                        <ControlPanel onGame={this.gameFileHandler} onKey={this.userInputHandler} handlers={handlers}/>
                    </div>
                    <OPCode rom={this.state.rom} data={this.state.cpuState}/>
                </div>
            </div>
        );
    }

}

export default Chip8;