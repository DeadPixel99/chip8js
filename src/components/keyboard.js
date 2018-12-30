import React, { Component } from 'react';
import {keyboard} from "../emulator/chars";

class Keyboard extends Component{

    getTD = (index)=>{
        return  <td className={this.props.data[index] === 0x1 ? 'pressed' : ''}>{index.toString(16).toUpperCase()}</td>
    };

    render() {
        return (
            <table>
                <caption>Keyboard</caption>
                <tbody className='keyboard'>
                    <tr>
                        {this.getTD(0x1)}
                        {this.getTD(0x2)}
                        {this.getTD(0x3)}
                        {this.getTD(0xC)}
                    </tr>
                    <tr>
                        {this.getTD(0x4)}
                        {this.getTD(0x5)}
                        {this.getTD(0x6)}
                        {this.getTD(0xD)}
                    </tr>
                    <tr>
                        {this.getTD(0x7)}
                        {this.getTD(0x8)}
                        {this.getTD(0x9)}
                        {this.getTD(0xE)}
                    </tr>
                    <tr>
                        {this.getTD(0xA)}
                        {this.getTD(0x0)}
                        {this.getTD(0xB)}
                        {this.getTD(0xF)}
                    </tr>
                </tbody>
            </table>
        )
    }
}

export default Keyboard