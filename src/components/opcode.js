import React, { Component } from 'react'
import Keyboard from './keyboard';
import decompile from './../emulator/decompiler'


class OPCode extends Component{

    constructor(props) {
        super(props);

    };

    render() {

        const {I, pc, size} = this.props.data;

        return (
            <div className='opcode-block' ref='block'>
                <Keyboard data={this.props.data.keys}/>
                <table>
                    <caption>Main registers</caption>
                    <tbody>
                        <tr>
                            <td>Next instruction:</td>
                            <td>MOV AX, BX</td>
                        </tr>
                        <tr>
                            <td>pc:</td>
                            <td>{pc}</td>
                        </tr>
                        <tr>
                            <td>I:</td>
                            <td>{I}</td>
                        </tr>
                        <tr>
                            <td>ROM size:</td>
                            <td>{size && `${size}byte`}</td>
                        </tr>
                        <tr>
                            <td>Next instruction:</td>
                            <td>MOV AX, BX</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}



export default OPCode;