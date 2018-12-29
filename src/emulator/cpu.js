import {chars, keyboard} from './chars';

class CPU {

    constructor(rom) {
        this.reset();
        document.onkeydown = (function (that) {
            return function (e) {
                if(that.waitForKey) {
                    that.V[that.waitForKey] = keyboard[e.keyCode];
                    that.waitForKey = null;
                }
                that.key[keyboard[e.keyCode]] = 0x1;
            }
        })(this);
        document.onkeyup = (function (that) {
            return function (e) {
                that.key[keyboard[e.keyCode]] = 0x0;
            }
        })(this);
        rom && this.setROM(rom);
    }

    getImageData = ()=>{
        return this.GFX;
    };

    reset = ()=>{
        this.memory = new Array(4096).fill(0);
        this.V = new Array(16).fill(0);
        this.GFX = new Array(62 * 32).fill(0);
        this.stack = new Array(16).fill(0);
        this.key = new Array(16).fill(0);
        this.I = 0;
        this.pc = 0x200;
        this.sp = 0;
        this.dTimer = 0;
        this.sTimer = 0;
        this.waitForKey = null;
        //Set default font
        for (let i = 0; i < chars.length; i++) {
            this.memory[i] = chars[i];
        }

    };

    setROM = (romFile)=>{
        for(let i = 0; i < romFile.length; i++) {
            this.memory[i + 0x200] = romFile[i];
        }
    };

    cycle = (opcode)=>{
        if(this.waitForKey)
            return;

        let opCode = opcode ? opcode : (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
        let Vx = (opCode & 0x0F00) >> 8;
        let Vy = (opCode & 0x00F0) >> 4;

        this.pc += 2;

        switch (opCode & 0xF000) {
            //CLS, RET, SYS
            case 0x0000: {
                if(opCode == 0x00E0) //CLS
                    this.GFX = new Array(62 * 32).fill(0);
                else if (opCode == 0x00EE) //RET
                    this.pc = this.stack[--this.sp];
                else {
                    this.pc = opCode & 0x0FFF //SYS
                }
                break;
            }
            //JP
            case 0x1000: {
                this.pc = opCode & 0x0FFF;
                break;
            }
            //CALL
            case 0x2000: {
                this.stack[this.sp] = this.pc;
                this.sp++;
                this.pc = opCode & 0x0FFF;
                break;
            }
            //SE Vx, byte
            case 0x3000: {
                let byte = opCode & 0x00FF;
                if(this.V[Vx] == byte)
                    this.pc+=2;
                break;
            }
            //SNE Vx, byte
            case 0x4000: {
                let byte = opCode & 0x00FF;
                if(this.V[Vx] != byte)
                    this.pc+=2;
                break;
            }
            //SE Vx, Vy
            case 0x5000: {
                if(this.V[Vx] == this.V[Vy])
                    this.pc+=2;
                break;
            }
            //LD Vx, byte
            case 0x6000: {
                this.V[Vx] = opCode & 0x00FF;
                break;
            }
            //ADD Vx, Byte
            case 0x7000: {
                let val = this.V[Vx] + (opCode & 0x00FF);
                if(val > 255)
                    val -= 256;
                this.V[Vx] = val;
                break;
            }
            //OR, AND, XOR, ADD, SUB, SHR, SUBN, SHL
            case 0x8000: {
                switch (opCode & 0x000F) {
                    //LD Vx, Vy
                    case 0x0000: {
                        this.V[Vx] = this.V[Vy];
                        break;
                    }
                    //OR Vx, Vy
                    case 0x0001: {
                        this.V[Vx] |= this.V[Vy];
                        break;
                    }
                    //AND Vx, Vy
                    case 0x0002: {
                        this.V[Vx] &= this.V[Vy];
                        break;
                    }
                    //XOR Vx, Vy
                    case 0x0003: {
                        this.V[Vx] ^= this.V[Vy];
                        break;
                    }
                    //ADD Vx, Vy
                    case 0x0004: {
                        let res = this.V[Vx] + this.V[Vy];

                        if(res > 255) {
                            this.V[0xF] = 0x1;
                            res -= 256;
                        }
                        this.V[Vx] = res;

                        break;
                    }
                    //SUB Vx, Vy
                    case 0x0005: {
                        let res = this.V[Vx] - this.V[Vy];
                        if(res < 0) {
                            this.V[0xF] = 0x0;
                            this.V[Vx] = res + 256;
                        }
                        else {
                            this.V[0xF] = 0x1;
                            this.V[Vx] = res;
                        }
                        break;
                    }
                    //SHR Vx
                    case 0x0006: {
                        this.V[0xF] = this.V[Vx] & 0x1;
                        this.V[Vx] >>= 1;
                        break;
                    }
                    //SUBN Vx
                    case 0x0007: {
                        let res = this.V[Vx] - this.V[Vy];
                        if(res < 0) {
                            this.V[0xF] = 0x1;
                            this.V[Vx] = res + 256;
                        }
                        else {
                            this.V[0xF] = 0x0;
                            this.V[Vx] = res;
                        }
                        break;
                    }
                    //SHL Vx
                    case 0x000E: {
                        this.V[0xF] = this.V[Vx] >> 7;
                        this.V[Vx] <<= 1;
                        if(this.V[Vx] > 255)
                            this.V[Vx] -= 256;
                        break;
                    }
                }
                break;
            }
            //SNE Vx, Vy
            case 0x9000: {
                if(this.V[Vx] != this.V[Vy])
                    this.pc+=2;
                break;
            }
            //LD I, addr
            case 0xA000: {
                this.I = opCode & 0x0FFF;
                break;
            }
            //JP V0, addr
            case 0xB000: {
                this.pc = (opCode & 0x0FFF) + this.V[0x0];
                break;
            }
            //RNF Vx, byte
            case 0xC000: {
                let kk = opCode & 0x00FF;
                this.V[Vx] = Math.floor(Math.random() * 255) & kk;
                break;
            }
            //DRW Vx, Vy, nibble
            case 0xD000: {
                let height = opCode & 0x000F;
                let x = this.V[Vx];
                let y = this.V[Vy];
                this.V[0xF] = 0;

                for(let yL = 0; yL < height; yL++) {
                    let byte = this.memory[this.I + yL];
                    for(let xL = 0; xL < 8; xL++) {
                        if((byte & 0x80) > 0)
                        {
                            if(this.GFX[(x + xL + ((y + yL) * 64))] == 1)
                                this.V[0xF] = 1;
                            this.GFX[x + xL + ((y + yL) * 64)] ^= 1;
                        }
                        byte <<= 1;
                    }
                }
                break;
            }
            //SKP, SKNP
            case 0xE000: {
                switch (opCode & 0x00FF) {
                    // SKP Vx
                    case 0x009E: {
                        if (this.key[this.V[Vx]] == 0x1) {
                            this.pc += 2;
                        }
                        break;
                    }

                    // SKNP Vx
                    case 0x00A1: {
                        if (this.key[this.V[Vx]] == 0x0) {
                            this.pc += 2;
                        }
                        break;
                    }

                }
                break;
            }
            //LD, ADD
            case 0xF000: {
                switch (opCode & 0x00FF) {
                    //LD Vx, DT
                    case 0x07: {
                        this.V[Vx] = this.dTimer;
                        break;
                    }
                    //LD Vx, K
                    case 0x0A: {
                        //Wait for a key press, store the value of the key in Vx
                        this.waitForKey = Vx;
                        break;
                    }
                    //LD DT, Vx
                    case 0x15: {
                        this.dTimer = this.V[Vx];
                        break;
                    }
                    //LD ST, Vx
                    case 0x18: {
                        this.sTimer = this.V[Vx];
                        break;
                    }
                    //ADD I, Vx
                    case 0x1E: {
                        this.I += this.V[Vx];
                        break;
                    }
                    //LD F, Vx
                    case 0x29: {
                        //Set I = location of sprite for digit Vx
                        this.I = this.V[Vx] * 5;
                        break;
                    }
                    //LD B, Vx
                    case 0x33: {
                        let number = this.V[Vx];
                        for (let i = 3; i > 0; i--) {
                            this.memory[this.I + i - 1] = parseInt(number % 10);
                            number /= 10;
                        }
                        break;
                    }
                    //LD [I], Vx
                    case 0x55: {
                        for(let i = 0; i <= Vx; i++) {
                            this.memory[this.I + i] = this.V[i];
                        }
                        break;
                    }
                    //LD LD Vx, [I]
                    case 0x65: {
                        for(let i = 0; i <= Vx; i++) {
                            this.V[i] = this.memory[this.I + i];
                        }
                        break;
                    }
                }
                break;
            }
            default:
                console.log(`Warning! Unresolved opcode 0x${opCode.toString(16)}`);
        }

        this.setTimers();
    };

    setTimers = ()=>{
        if (this.dTimer > 0) {
            this.dTimer--;
        }

        if (this.sTimer > 0) {
            beep();
            this.sTimer--;
        }
    };

}


function beep() {
    const snd = new Audio("data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq//uQZBoABQt4yMVxYAIAAAkQoAAAHvYpL5m6AAgAACXDAAAAD59jblTirQe9upFsmZbpMudy7Lz1X1DYsxOOSWpfPqNX2WqktK0DMvuGwlbNj44TleLPQ+Gsfb+GOWOKJoIrWb3cIMeeON6lz2umTqMXV8Mj30yWPpjoSa9ujK8SyeJP5y5mOW1D6hvLepeveEAEDo0mgCRClOEgANv3B9a6fikgUSu/DmAMATrGx7nng5p5iimPNZsfQLYB2sDLIkzRKZOHGAaUyDcpFBSLG9MCQALgAIgQs2YunOszLSAyQYPVC2YdGGeHD2dTdJk1pAHGAWDjnkcLKFymS3RQZTInzySoBwMG0QueC3gMsCEYxUqlrcxK6k1LQQcsmyYeQPdC2YfuGPASCBkcVMQQqpVJshui1tkXQJQV0OXGAZMXSOEEBRirXbVRQW7ugq7IM7rPWSZyDlM3IuNEkxzCOJ0ny2ThNkyRai1b6ev//3dzNGzNb//4uAvHT5sURcZCFcuKLhOFs8mLAAEAt4UWAAIABAAAAAB4qbHo0tIjVkUU//uQZAwABfSFz3ZqQAAAAAngwAAAE1HjMp2qAAAAACZDgAAAD5UkTE1UgZEUExqYynN1qZvqIOREEFmBcJQkwdxiFtw0qEOkGYfRDifBui9MQg4QAHAqWtAWHoCxu1Yf4VfWLPIM2mHDFsbQEVGwyqQoQcwnfHeIkNt9YnkiaS1oizycqJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}

export default CPU;