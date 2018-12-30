import React, { Component } from 'react'
import Keyboard from './keyboard';
import decompile from './../emulator/decompiler'


class OPCode extends Component{

    render() {
        return (
            <div className='opcode-block' ref='block'>
                <Keyboard data={this.props.data.keys}/>
                {opCodeTable(this.props.data)}
                {vTable(this.props.data.V)}
                {stackTable(this.props.data)}
            </div>
        );
    }
}


function opCodeTable(data) {
    const {I, pc, size, mem} = data;

    return (
        <table style={{width: '65%', height: '35%'}}>
            <tbody>
            <tr>
                <td>Command:</td>
                <td>{decompile((mem[pc] << 8) | mem[pc + 1])}</td>
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
                <td>{size && `${size} bytes`}</td>
            </tr>
            </tbody>
        </table>
    )
}


function vTable(data) {

    return (
        <div className='v-table'>
            <table>
                <tbody>
                <tr>
                    <td>V(0)</td>
                    <td>V(1)</td>
                    <td>V(2)</td>
                    <td>V(3)</td>
                    <td>V(4)</td>
                    <td>V(5)</td>
                    <td>V(6)</td>
                    <td>V(7)</td>
                </tr>
                <tr>
                    <td>{data[0].toString(16)}</td>
                    <td>{data[1].toString(16)}</td>
                    <td>{data[2].toString(16)}</td>
                    <td>{data[3].toString(16)}</td>
                    <td>{data[4].toString(16)}</td>
                    <td>{data[5].toString(16)}</td>
                    <td>{data[6].toString(16)}</td>
                    <td>{data[7].toString(16)}</td>
                </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                <tr>
                    <td>V(8)</td>
                    <td>V(9)</td>
                    <td>V(A)</td>
                    <td>V(B)</td>
                    <td>V(C)</td>
                    <td>V(D)</td>
                    <td>V(E)</td>
                    <td>V(F)</td>
                </tr>
                <tr>
                    <td>{data[8].toString(16)}</td>
                    <td>{data[9].toString(16)}</td>
                    <td>{data[10].toString(16)}</td>
                    <td>{data[11].toString(16)}</td>
                    <td>{data[12].toString(16)}</td>
                    <td>{data[13].toString(16)}</td>
                    <td>{data[14].toString(16)}</td>
                    <td>{data[15].toString(16)}</td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}


function stackTable(data) {
    const {stack, sp} = data;

    return (
        <table className='stack-table'>
            <tbody>
                <tr>
                    <td>STACK:</td>
                    {sp > 8 && <td>...</td>}
                    {(sp > 8 ? stack.slice(8, sp) : stack.slice(0, sp)).map(e=><td>{e.toString(16)}</td>)}
                </tr>
            </tbody>
        </table>
    )
}


export default OPCode;