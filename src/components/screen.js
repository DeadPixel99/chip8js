import React, { Component } from 'react'

class Screen extends Component{

    constructor(props) {
        super(props);
        this.state = {
            bckgColor: 'rgb(232,222,163)',
            spriteColor: 'rgb(147,119,116)'
        }
    };

    draw = ()=>{
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillStyle = this.state.bckgColor;
        ctx.fillRect(0,0,1000,1000);
        ctx.fillStyle = this.state.spriteColor;

        for(let i = 0; i < 32; i++) {
            for(let j = 0; j < 64; j++) {
                if(this.props.gfx[(i*64)+j] == 0x1)
                    ctx.fillRect(j*10, i*10, 10, 10);
            }
        }
    };

    componentDidUpdate() {
        this.draw();
    }

    render() {
        return (
            <div>
                <canvas ref='canvas' className='screen' width={this.props.width} height={this.props.height}></canvas>
            </div>
        );
    }
}

export default Screen;