import React, { Component } from 'react'


class ControlPanel extends Component{

    constructor(props) {
        super(props);

    };

    onFile = (e)=>{
        let file = e.target.files[0];

        if(!file) {
            alert('No file selected!');
            return;
        }

        let fr = new FileReader();
        fr.onloadend = ()=>{
            this.props.handlers.inputFile(new Uint8Array(fr.result));
        };
        fr.readAsArrayBuffer(file);
    };

    onKey = e=>{
        this.props.onKey(e);
    };


    render() {
        return (
            <div className='c-panel'>
                <input type='file' onInput={this.onFile}/>
                <button onClick={this.onKey}>START</button>
                <button onClick={this.props.handlers.pause}>PAUSE</button>
                <button onClick={this.props.handlers.reset}>STOP</button>
            </div>
        );
    }
}



export default ControlPanel;