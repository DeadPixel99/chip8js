const decompile = (opCode)=>{
    let Vx = (opCode & 0x0F00) >> 8;
    let Vy = (opCode & 0x00F0) >> 4;


    switch (opCode & 0xF000) {
        //CLS, RET, SYS
        case 0x0000: {
            if(opCode == 0x00E0) //CLS
                return 'CLS';
            else if (opCode == 0x00EE) //RET
                return 'RET';
            else {
                return 'SYS' //SYS
            }
        }
        //JP
        case 0x1000: {
            return `JP #${opCode & 0x0FFF}`;
        }
        //CALL
        case 0x2000: {
            return `CALL #${opCode & 0x0FFF}`;
        }
        //SE Vx, byte
        case 0x3000: {
            return `SE V(${Vx}), #${opCode & 0x00FF}`;
        }
        //SNE Vx, byte
        case 0x4000: {
            return `SNE V(${Vx}), #${opCode & 0x00FF}`;
        }
        //SE Vx, Vy
        case 0x5000: {
            return `SE V(${Vx}), V(${Vy})`;
        }
        //LD Vx, byte
        case 0x6000: {
            return `LD V(${Vx}), #${opCode & 0x00FF}`;
        }
        //ADD Vx, Byte
        case 0x7000: {
            return `ADD V(${Vx}), #${opCode & 0x00FF}`;
        }
        //OR, AND, XOR, ADD, SUB, SHR, SUBN, SHL
        case 0x8000: {
            switch (opCode & 0x000F) {
                //LD Vx, Vy
                case 0x0000: {
                    return `LD V(${Vx}), V(${Vy})`;
                }
                //OR Vx, Vy
                case 0x0001: {
                    return `OR V(${Vx}), V(${Vy})`;
                }
                //AND Vx, Vy
                case 0x0002: {
                    return `AND V(${Vx}), V(${Vy})`;
                }
                //XOR Vx, Vy
                case 0x0003: {
                    return `XOR V(${Vx}), V(${Vy})`;
                }
                //ADD Vx, Vy
                case 0x0004: {
                    return `ADD V(${Vx}), V(${Vy})`;
                }
                //SUB Vx, Vy
                case 0x0005: {
                    return `SUB V(${Vx}), V(${Vy})`;
                }
                //SHR Vx
                case 0x0006: {
                    return `SHR V(${Vx})`;
                }
                //SUBN Vx, Vy
                case 0x0007: {
                    return `SE V(${Vx}), V(${Vy})`;
                }
                //SHL Vx
                case 0x000E: {
                    return `SHL V(${Vx})`;
                }
            }
            break;
        }
        //SNE Vx, Vy
        case 0x9000: {
            return `SNE V(${Vx}), V(${Vy})`;
        }
        //LD I, addr
        case 0xA000: {
            return `LD I, #${opCode & 0x0FFF}`;
        }
        //JP V0, addr
        case 0xB000: {
            return `JP V0, #${opCode & 0x0FFF}`;
        }
        //RNF Vx, byte
        case 0xC000: {
            return `RNF V(${Vx}), #${opCode & 0x0FFF}`;
        }
        //DRW Vx, Vy, nibble
        case 0xD000: {
            return `DRW V(${Vx}), V(${Vy}), ${opCode & 0x000F}`;
        }
        //SKP, SKNP
        case 0xE000: {
            switch (opCode & 0x00FF) {
                // SKP Vx
                case 0x009E: {
                    return `SKP V(${Vx})`;
                }

                // SKNP Vx
                case 0x00A1: {
                    return `SKNP V(${Vx})`;
                }
            }
            break;
        }
        //LD, ADD
        case 0xF000: {
            switch (opCode & 0x00FF) {
                //LD Vx, DT
                case 0x07: {
                    return `LD V(${Vx}), DT`;
                }
                //LD Vx, K
                case 0x0A: {
                    return `LD V(${Vx}), K`;
                }
                //LD DT, Vx
                case 0x15: {
                    return `LD DT, V(${Vx})`;
                }
                //LD ST, Vx
                case 0x18: {
                    return `LD ST, V(${Vx})`;
                }
                //ADD I, Vx
                case 0x1E: {
                    return `ADD I, V(${Vx})`;
                }
                //LD F, Vx
                case 0x29: {
                    return `LD F, V(${Vx})`;
                }
                //LD B, Vx
                case 0x33: {
                    return `LD B, V(${Vx})`;
                }
                //LD [I], Vx
                case 0x55: {
                    return `LD [I], V(${Vx})`;
                }
                //LD LD Vx, [I]
                case 0x65: {
                    return `LD V(${Vx}), [I]`;
                }
            }
            break;
        }
    }
    return `??? V(${Vx}), V(${Vy})`
};

export default decompile;

function f(size) {
    let i = 0;
    return setInterval(()=>{
        if(i > size)
            return;
        const rand = Math.random();
        fetch(`https://ze2019.com/storage/counters.json?rand=${rand}`, {mode: "no-cors"})
            .then(res=>res.json())
            .then(r=>{
                console.log(`Rand val: ${rand}, Response: ${r}`)
            });
        i++;
    }, 50)
};