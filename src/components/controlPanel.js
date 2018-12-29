import React, { Component } from 'react'


class ControlPanel extends Component{

    constructor(props) {
        super(props);
    };

    onFile = (e)=>{
        let file = e.target.files[0];
        let fr = new FileReader();
        fr.onloadend = ()=>{
                this.props.onGame(new Uint8Array(fr.result));
        };
        fr.readAsArrayBuffer(file);
    };

    onKey = e=>{
        this.props.onKey(e);
    };


    render() {
        return (
            <div>
                <input type='file' onInput={this.onFile}/>
                <button onClick={this.onKey}>START</button>
                <button>PAUSE</button>
            </div>
        );
    }
}



export default ControlPanel;