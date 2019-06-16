//-----------------------------

var opcodess = [
    {
        name: 'add',
        opcode: '0000'
    },
    {
        name: 'sub',
        opcode: '0001'
    },
    {
        name: 'slt',
        opcode: '0010'
    },
    {
        name: 'or',
        opcode: '0011'
    },
    {
        name: 'nand',
        opcode: '0100'
    },
    {
        name: 'addi',
        opcode: '0101'
    },
    {
        name: 'slti',
        opcode: '0110'
    },
    {
        name: 'ori',
        opcode: '0111'
    },
    {
        name: 'lui',
        opcode: '1000'
    },
    {
        name: 'lw',
        opcode: '1001'
    },
    {
        name: 'sw',
        opcode: '1010'
    },
    {
        name: 'beq',
        opcode: '1011'
    },
    {
        name: 'jalr',
        opcode: '1100'
    },
    {
        name: 'j',
        opcode: '1101'
    },
    {
        name: 'halt',
        opcode: '1110'
    },
]


let ui = new UI();
ui.preLoader();
ui.navbar();
//------------Define registers

let reg = [];
for (let i = 0; i < 16; i++) {
    reg[i] = new register();
    reg[i].name = i.toString();
}
let registers = document.querySelectorAll('.register');
let UImem = document.querySelector('#mem-value');

regDefaultValues = [
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000',
    '00000000000000000000000000000000'
];
for (let i = 0; i < 16; i++) {
    reg[i].value = regDefaultValues[i];
    registers[i].value = regDefaultValues[i];
}

//------------------------------

//Define Memory 
var memory = [];
for (let i = 0; i < 512000; i++) {
    memory.push(Math.round(Math.random()));
}
var memoryDeafault = memory;
UImem.value = memory;
//addToLs(memory);
function addToLs(memory) {
    let mem;
    if (localStorage.getItem('memory') === null) {
        mem = [];
    } else {
        mem = JSON.parse(localStorage.getItem('memory'));
    }
    mem.push(memory);
    localStorage.setItem('memory', JSON.stringify(mem));
}
function loadFromLs() {
    let mem;
    if (localStorage.getItem('memory') === null) {
        mem = [];
    } else {
        mem = JSON.parse(localStorage.getItem('memory'));
    }
    //memory = mem;
    //console.log(memory);
}
function clearLS() {
    localStorage.clear();
}
clearLS();
document.addEventListener('DOMContentLoaded', loadFromLs);
//------------------------
console.log(`Memory : ${memory}`);

console.log(`Registers : ${reg}`);


//oldRegex->>/(?:(.*)\s+)?([.A-Za-z0-9]+)\s+([-A-Za-z0-9]*),?([-A-Za-z0-9]*),?([-A-Za-z0-9]*)/
//(?:((?!\s).*)\s+)?([.A-Za-z0-9]+)\s+([-A-Za-z0-9]*)\s*,?\s*([-A-Za-z0-9]*)\s*,?\s*([-A-Za-z0-9]*)\s*

//label .fill 5 >>incurrect
//label .fill 5>>currect

//.fill 5 >>currect
//.fill 5>>currect

let regex = /(?:((?!\s).*)\s+)?([.A-Za-z0-9]+)\s+([-A-Za-z0-9]*)\s*,?\s*([-A-Za-z0-9]*)\s*,?\s*([-A-Za-z0-9]*)\s*([#].*)?/
let text;
let formAssemble = document.querySelector('#form-assemble');
let results = document.querySelector('.results');
let loading = document.querySelector('.loading');
let header = document.querySelector('.card');
let card = document.querySelector('.card').parentElement;
let textarea = document.querySelector('#text');


var symbolTable = [];
var pc = 0;
var error = false;
var usage;
let memusage;

formAssemble.addEventListener('submit', (e) => {
    memusage = 0;
    usage = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    error = false;
    e.preventDefault();
    pc = 0;
    symbolTable = [];
    for (let i = 0; i < 16; i++) {
        reg[i].value = regDefaultValues[i];
        registers[i].value = regDefaultValues[i];
    }

    //let isTrueError = false;++++------

    if (document.querySelector('.alert')) {
        $('.alert').fadeOut();
        document.querySelector('.alert').remove();
    }
    results.innerHTML = '';
    ui.showLoading();
    setTimeout(function () {
        ui.addToHis(document.querySelector('#text').value);
        text = document.querySelector('#text').value.split('\n');
        // let labels = [];
        if (/\s*/.exec(text)) {
            ui.showResults();
        }
        var machinCode;
        try {
            addToSymBolTable(text, symbolTable);
        }
        catch (e) {
            error = true;
            results.innerHTML = '';
            if (e.name === 'Error') {
                ui.showError(e);
                //isTrueError=false;
                error = true;
            }
            memory = memoryDeafault;
            UImem.value = memory;
        }
        for (let index = 0; index < text.length; index++) {

            console.log(index);

            // console.log('no error');
            //counter++;
            if (!error) {
                console.log(index)
                let match = regex.exec(text[index]);
                if (match) {
                    //if (pc == index) {
                        // console.log(index);
                        selectTextareaLine(textarea, index);
                        if (match[2].toLocaleLowerCase() === '.fill') {
                            try {
                                let label = symbolTable.find(obj => {
                                    if (obj.label === match[1]) return obj;
                                });

                                let value = symbolTable.find(obj => {
                                    if (obj.label === match[3]) return obj;
                                });

                                //console.log(value);
                                if (value === undefined) {
                                    if (isNaN(Number(match[3]))) {
                                        //check error

                                        throw new Error(`Invalid label : (${match[3]})`);
                                    }
                                    else {
                                        label.value = match[3];
                                        console.log(match[3]);
                                    }
                                }
                                else {
                                    label.value = (value.address).toString();
                                }
                                // machinCode = label.value;

                                // let output = document.createElement('input');
                                // output.className = "form-control machin-code";
                                // output.disabled = true;
                                // output.value = machinCode;
                                // results.appendChild(output);
                                // ui.showResults();
                            } catch (e) {
                                error = true;
                                results.innerHTML = '';
                                if (e.name === 'Error') {
                                    ui.showError(e);
                                    //isTrueError=false;
                                }
                                for (let i = 0; i < 16; i++) {
                                    reg[i].value = regDefaultValues[i];
                                    registers[i].value = regDefaultValues[i];
                                }
                                memory = memoryDeafault;
                                UImem.value = memory;
                            }

                        }
                        else if (match[2].toLocaleLowerCase() === '.space') {
                            try {
                                let label = symbolTable.find(obj => {
                                    if (obj.label === match[1]) return obj;
                                });

                                let value = symbolTable.find(obj => {
                                    if (obj.label === match[3]) return obj;
                                });

                                //console.log(value);
                                if (value === undefined) {
                                    if (isNaN(Number(match[3]))) {
                                        //check error

                                        throw new Error(`Invalid label : (${match[3]})`);
                                    }
                                    else {
                                        label.value = match[3];
                                        console.log(match[3]);
                                    }
                                }
                                else {
                                    label.value = (value.address).toString();
                                }
                                // machinCode = label.value;

                                // let output = document.createElement('input');
                                // output.className = "form-control machin-code";
                                // output.disabled = true;
                                // output.value = machinCode;
                                // results.appendChild(output);

                                // ui.showResults();
                            } catch (e) {
                                error = true;
                                results.innerHTML = '';
                                if (e.name === 'Error') {
                                    ui.showError(e);
                                    //isTrueError=false;
                                }
                                for (let i = 0; i < 16; i++) {
                                    reg[i].value = regDefaultValues[i];
                                    registers[i].value = regDefaultValues[i];
                                }
                                memory = memoryDeafault;
                                UImem.value = memory;
                            }


                        }
                        else if (match[2].toLocaleLowerCase() === 'add' || match[2].toLocaleLowerCase() === 'sub' || match[2].toLocaleLowerCase() === 'slt' || match[2].toLocaleLowerCase() === 'or' || match[2].toLocaleLowerCase() === 'nand') {
                            machinCode = makeMachinCode_rtype(match[2], Number(match[3]), Number(match[4]), Number(match[5]));
                            // makeResult(machinCode);
                            // ui.showResults();
                            pc++;
                        }
                        else if ((match[2].toLocaleLowerCase() === 'addi' || match[2].toLocaleLowerCase() === 'ori' || match[2].toLocaleLowerCase() === 'slti' || match[2].toLocaleLowerCase() === 'lui' || match[2].toLocaleLowerCase() === 'lw' || match[2].toLocaleLowerCase() === 'sw' || match[2].toLocaleLowerCase() === 'beq' || match[2].toLocaleLowerCase() === 'jalr') /*&& makeMachinCode_itype(match[2], Number(match[3]), Number(match[4]), match[5], index, symbolTable)*/) {
                            machinCode = makeMachinCode_itype(match[2], Number(match[3]), Number(match[4]), match[5], index, symbolTable);
                            // makeResult(machinCode);
                            // ui.showResults();
                        }
                        else if (match[2].toLocaleLowerCase() === 'j'/* && makeMachinCode_jtype(match[2], match[3], symbolTable)*/) {
                            machinCode = makeMachinCode_jtype(match[2], match[3], symbolTable);
                            // makeResult(machinCode);
                            // ui.showResults();
                        }
                        else if (match[2].toLocaleLowerCase() === 'halt') {
                            machinCode = makeMachinCode_jtype(match[2], '0', symbolTable);
                            // makeResult(machinCode);
                            // ui.showResults();
                        }
                        else {
                            try {
                                throw new Error(`Invalid opcode : (${match[2]})`);
                            } catch (e) {
                                error = true;
                                results.innerHTML = '';
                                if (e.name === 'Error') {
                                    ui.showError(e);
                                    //isTrueError=false;
                                }
                                for (let i = 0; i < 16; i++) {
                                    reg[i].value = regDefaultValues[i];
                                    registers[i].value = regDefaultValues[i];
                                }
                                memory = memoryDeafault;
                                UImem.value = memory;
                            }

                        //}
                         }
                    // else if (pc > index) {
                    // }
                    // else if (pc < index) {
                    //     console.log('here');
                    //     index = pc - 1;
                    //     console.log(index);
                    // }
                }

            }
        }


        console.log(symbolTable);
        console.log(pc);
        runCode = async () => {

            for (let index = 0; index < text.length; index++) {

                console.log(index);
                await new Promise(resolve => setTimeout(resolve, 500));
                // console.log('no error');
                //counter++;

                console.log(index)
                let match = regex.exec(text[index]);
                if (match) {
                    if (pc == index) {
                        // console.log(index);
                        selectTextareaLine(textarea, index);
                        if (match[2].toLocaleLowerCase() === '.fill') {
                            try {
                                let label = symbolTable.find(obj => {
                                    if (obj.label === match[1]) return obj;
                                });

                                let value = symbolTable.find(obj => {
                                    if (obj.label === match[3]) return obj;
                                });

                                //console.log(value);
                                if (value === undefined) {
                                    if (isNaN(Number(match[3]))) {
                                        //check error

                                        throw new Error(`Invalid label : (${match[3]})`);
                                    }
                                    else {
                                        label.value = match[3];
                                        console.log(match[3]);
                                    }
                                }
                                else {
                                    label.value = (value.address).toString();
                                }
                                machinCode = label.value;

                                let output = document.createElement('input');
                                output.className = "form-control machin-code";
                                output.disabled = true;
                                output.value = machinCode;
                                results.appendChild(output);
                                ui.showResults();
                            } catch (e) {
                                error = true;
                                results.innerHTML = '';
                                if (e.name === 'Error') {
                                    ui.showError(e);
                                    //isTrueError=false;
                                }
                                for (let i = 0; i < 16; i++) {
                                    reg[i].value = regDefaultValues[i];
                                    registers[i].value = regDefaultValues[i];
                                }
                            }

                        }
                        else if (match[2].toLocaleLowerCase() === '.space') {
                            try {
                                let label = symbolTable.find(obj => {
                                    if (obj.label === match[1]) return obj;
                                });

                                let value = symbolTable.find(obj => {
                                    if (obj.label === match[3]) return obj;
                                });

                                //console.log(value);
                                if (value === undefined) {
                                    if (isNaN(Number(match[3]))) {
                                        //check error

                                        throw new Error(`Invalid label : (${match[3]})`);
                                    }
                                    else {
                                        label.value = match[3];
                                        console.log(match[3]);
                                    }
                                }
                                else {
                                    label.value = (value.address).toString();
                                }
                                machinCode = label.value;

                                let output = document.createElement('input');
                                output.className = "form-control machin-code";
                                output.disabled = true;
                                output.value = machinCode;
                                results.appendChild(output);

                                ui.showResults();
                            } catch (e) {
                                error = true;
                                results.innerHTML = '';
                                if (e.name === 'Error') {
                                    ui.showError(e);
                                    //isTrueError=false;
                                }
                                for (let i = 0; i < 16; i++) {
                                    reg[i].value = regDefaultValues[i];
                                    registers[i].value = regDefaultValues[i];
                                }
                            }


                        }
                        else if (match[2].toLocaleLowerCase() === 'add' || match[2].toLocaleLowerCase() === 'sub' || match[2].toLocaleLowerCase() === 'slt' || match[2].toLocaleLowerCase() === 'or' || match[2].toLocaleLowerCase() === 'nand') {
                            machinCode = makeMachinCode_rtype(match[2], Number(match[3]), Number(match[4]), Number(match[5]));
                            makeResult(machinCode);
                            ui.showResults();
                            pc++;
                        }
                        else if ((match[2].toLocaleLowerCase() === 'addi' || match[2].toLocaleLowerCase() === 'ori' || match[2].toLocaleLowerCase() === 'slti' || match[2].toLocaleLowerCase() === 'lui' || match[2].toLocaleLowerCase() === 'lw' || match[2].toLocaleLowerCase() === 'sw' || match[2].toLocaleLowerCase() === 'beq' || match[2].toLocaleLowerCase() === 'jalr') /*&& makeMachinCode_itype(match[2], Number(match[3]), Number(match[4]), match[5], index, symbolTable)*/) {
                            machinCode = makeMachinCode_itype(match[2], Number(match[3]), Number(match[4]), match[5], index, symbolTable);
                            makeResult(machinCode);
                            ui.showResults();
                        }
                        else if (match[2].toLocaleLowerCase() === 'j'/* && makeMachinCode_jtype(match[2], match[3], symbolTable)*/) {
                            machinCode = makeMachinCode_jtype(match[2], match[3], symbolTable);
                            makeResult(machinCode);
                            ui.showResults();
                        }
                        else if (match[2].toLocaleLowerCase() === 'halt') {
                            machinCode = makeMachinCode_jtype(match[2], '0', symbolTable);
                            makeResult(machinCode);
                            ui.showResults();
                        }
                        else {
                            try {
                                throw new Error(`Invalid opcode : (${match[2]})`);
                            } catch (e) {
                                error = true;
                                results.innerHTML = '';
                                if (e.name === 'Error') {
                                    ui.showError(e);
                                    //isTrueError=false;
                                }
                                for (let i = 0; i < 16; i++) {
                                    reg[i].value = regDefaultValues[i];
                                    registers[i].value = regDefaultValues[i];
                                }
                            }

                        }
                        document.querySelector('#usage-val').innerHTML = `${calusage()}%`;
                        document.querySelector('#mem-usage').innerHTML = `${calmemusage()}%`;
                    }
                    else if (pc > index) {
                    }
                    else if (pc < index) {
                        console.log('here');
                        index = pc - 1;
                        console.log(index);
                    }
                }
            }
        }
        if (!error) {
            machinCode = '';
            pc = 0;
            symbolTable = [];
            try {
                addToSymBolTable(text, symbolTable);
            }
            catch (e) {
                error = true;
                results.innerHTML = '';
                if (e.name === 'Error') {
                    ui.showError(e);
                    //isTrueError=false;
                    error = true;
                }
                memory = memoryDeafault;
                UImem.value = memory;
            }
            for (let i = 0; i < 16; i++) {
                reg[i].value = regDefaultValues[i];
                registers[i].value = regDefaultValues[i];
            }
            memory = memoryDeafault;
            UImem.value = memory;
            runCode();
        }
      
        console.log(reg);

    }, 2000);
    // catch (e) {



    // } 
})
function toBinary(number) {
    let test = (number).toString(2);
    let temp = 4 - (test.length);
    if (test.length !== 4) {
        for (let i = 0; i < temp; i++) test = '0' + test;
    }
    return test;
}
function fill32(number, tofill) {
    //let test = (number).toString(2);
    let temp = 32 - (number.length);
    if (number.length !== 32) {
        for (let i = 0; i < temp; i++) number = tofill + number;
    }

    return number;

}
function addToSymBolTable(text, symbolTable) {


    text.forEach((element, index) => {
        let match = regex.exec(element);
        //you cant enter after a line
        if (match) {
            let indicator = false;
            symbolTable.forEach(symbol => {
                if (match[1] === symbol.label) {
                    indicator = true;
                    throw new Error(`Multi declare lable : You can not define labels more than once (${match[1]})`);
                }
            });
            if (indicator === false) {
                if (match[1] !== undefined) {
                    symbolTable.push({
                        label: match[1],
                        address: index,
                        value: ''
                    });
                }
            }

        }

    })
}

function makeMachinCode_rtype(instruction, field0, field1, field2) {
    try {


        let machinCode = '000000000000';
        let rd, rt, rs;
        if (field0 < 0 || field0 >= 16) {
            throw new Error(`Enter valid register between 0 and 15 : Invalid register (${field0}).`);
        } else {
            rd = toBinary(field0);
        }
        if (field2 < 0 || field2 >= 16) {
            throw new Error(`Enter valid register between 0 and 15 : Invalid register (${field2}).`);
        } else {
            rt = toBinary(field2);
        }
        if (field1 < 0 || field1 >= 16) {
            throw new Error(`Enter valid register between 0 and 15 : Invalid register (${field1}).`);
        } else {
            rs = toBinary(field1);
        }

        switch (instruction.toLocaleLowerCase()) {
            case 'add':
              
                
                machinCode = '0000' + opcodess.find(obj => obj.name == 'add').opcode + rs + rt + rd + machinCode;


                break;
            case 'sub':

                machinCode = '0000' + opcodess.find(obj => obj.name == 'sub').opcode + rs + rt + rd + machinCode;

                break;
            case 'slt':

                machinCode = machinCode = '0000' + opcodess.find(obj => obj.name == 'slt').opcode + rs + rt + rd + machinCode;

                break;
            case 'or':

                machinCode = machinCode = '0000' + opcodess.find(obj => obj.name == 'or').opcode + rs + rt + rd + machinCode;
                break;

            case 'nand':

                machinCode = machinCode = '0000' + opcodess.find(obj => obj.name == 'nand').opcode + rs + rt + rd + machinCode;
                break;
        }
        runMachinCode_rtype(instruction, field0, field1, field2);

        return machinCode;
    }
    catch (e) {
        error = true;
        results.innerHTML = '';
        if (e.name === 'Error') {
            ui.showError(e);
            //isTrueError=false;
        }
        for (let i = 0; i < 16; i++) {
            reg[i].value = regDefaultValues[i];
            registers[i].value = regDefaultValues[i];
        }
        memory = memoryDeafault;
        UImem.value = memory;

    }

}
function makeMachinCode_itype(instruction, field0, field1, field2, index, symbolTable) {
    try {
        let machinCode;
        let offset;
        let rt, rs;
        if (field0 < 0 || field0 >= 16) {
            throw new Error(`Enter valid register between 0 and 15 : Invalid register (${field0}).`);
        } else {
            rt = toBinary(field0);
        }
        if (field1 < 0 || field1 >= 16) {
            throw new Error(`Enter valid register between 0 and 15 : Invalid register (${field1}).`);
        } else {
            rs = toBinary(field1);
        }
        let targetLabel;
        for (let i = 0; i < symbolTable.length; i++) {
            if (symbolTable[i].label === field2) {
                targetLabel = symbolTable[i];
            }
        }
        // console.log(targetLabel);
        // console.log(Number(targetLabel.address)-(index+1));
        if (instruction.toLocaleLowerCase() === 'beq' && targetLabel) {
            offset = make16Bit(Number(targetLabel.address) - (index + 1));
            console.log(targetLabel);
            console.log(offset);

        }
        else if (targetLabel) {
            offset = make16Bit(Number(targetLabel.address));
            console.log(targetLabel);

        }


        if (offset === undefined) {
            if (isNaN(Number(field2))) {

                throw new Error(`Invalid label : cant't use label without declaration (${field2}).`);
            }
            else {
                offset = make16Bit(Number(field2));
            }
        }

        switch (instruction.toLocaleLowerCase()) {
            case 'addi':
                opcode = opcodess.find(obj => obj.name == 'addi').opcode;
                machinCode = '0000' + opcode + rs + rt + offset;
                break;
            case 'ori':
                opcode = opcodess.find(obj => obj.name == 'ori').opcode;
                machinCode = '0000' + opcode + rs + rt + offset;
                break;
            case 'slti':
                opcode = opcodess.find(obj => obj.name == 'slti').opcode;
                machinCode = '0000' + opcode + rs + rt + offset;
                break;
            case 'lui':
                opcode = opcodess.find(obj => obj.name == 'lui').opcode;
                machinCode = '0000' + opcode + rs + rt + offset;
                break;
            case 'lw':
                opcode = opcodess.find(obj => obj.name == 'lw').opcode;
                machinCode = '0000' + opcode + rs + rt + offset;
                break;
            case 'sw':
                opcode = opcodess.find(obj => obj.name == 'sw').opcode;
                machinCode = '0000' + opcode + rs + rt + offset;

                break;
            case 'beq':
                opcode = opcodess.find(obj => obj.name == 'beq').opcode;
                machinCode = '0000' + opcode + rs + rt + offset;
                break;
            case 'jalr':
                opcode = opcodess.find(obj => obj.name == 'jalr').opcode;
                machinCode = '0000' + opcode + rs + rt + offset;
                break;
        }
        try {
            
            runMachinCode_itype(instruction, field0, field1, field2, index, symbolTable)

        }
        catch (e) {
            console.log('IM HEREERERERERERERERERE00');
            throw e;
        }

        return machinCode;
    } catch (e) {
        error = true;
        results.innerHTML = '';
        if (e.name === 'Error') {
            ui.showError(e);
            //isTrueError=false;
        }
        for (let i = 0; i < 16; i++) {
            reg[i].value = regDefaultValues[i];
            registers[i].value = regDefaultValues[i];
        }
        memory = memoryDeafault;
        UImem.value = memory;

    }

}

function make16Bit(number) {

    if (number > 32767 || number < -32768) {
        throw new Error(`Invalid offset : can't use a number outside the 16-bit range (${number}).`);
    }
    let temp = (Math.abs(number)).toString(2);
    let temp2 = 16 - temp.length;
    if (number < 0) {


        number = Math.abs(number) - 1;
        let array_num = [];
        for (let i = 0; i < number.toString(2).length; i++) {
            array_num.push(number.toString(2)[i]);
        }
        // console.log(array_num);
        // //console.log(~number);
        //     //console.log((~number+1>>>0).toString(2));
        for (let i = 0; i < array_num.length; i++) {
            if (array_num[i] == '1') {
                array_num[i] = '0';
            }
            else {
                array_num[i] = '1';
            }
        }
        //console.log(array_num);
        number = array_num.toString();
        // console.log(number);
        number = number.replace(/,/g, '');
        //console.log(number);
        temp = number;
        temp2 = 16 - temp.length;
        // console.log(number);
        // // number = JSON.stringify(array_num);
        // // console.log(number);
        for (let i = 0; i < temp2; i++) {
            temp = '1' + temp;
        }
        //console.log(temp);

    } else {
        for (let i = 0; i < temp2; i++) {
            temp = '0' + temp;
        }
    }

    console.log(temp);
    return temp;
}
//calculate two complements
function two_complements(number) {


    let array = [];

    let two_complement_number;
    let size = number.length;
    let i = size - 1;


    for (let j = 0; j < number.length; j++) {
        if (number[j] == '1') {
            array.push('0');
        }

        else
            array.push('1');
    }

    let two_complement = array;
    for (let i = number.length - 1; i >= 0; i--) {
        if (array[i] == '1') {
            two_complement[i] = '0';
        } else {
            two_complement[i] = '1';
            break;
        }
    }

    two_complement_number = two_complement.toString().replace(/,/g, '');

    if (i == -1) {
        two_complement_number = '1' + two_complement_number;
        return two_complement_number;
    }
    else {
        return two_complement_number
    }
}

function makeMachinCode_jtype(instruction, field0, symbolTable) {
    try {
        let targetAddress;
        let machinCode;

        for (let i = 0; i < symbolTable.length; i++) {
            if (symbolTable[i].label === field0) {
                targetAddress = make16Bit(Number(symbolTable[i].address));
            }
        }
        if (targetAddress === undefined) {
            if (isNaN(Number(field0))) {
                err = true;
                throw new Error(`Invalid label : cant't use label without declaration (${field0}).`);
            }
            else {
                targetAddress = make16Bit(Number(field0));
            }
        }
        switch (instruction.toLocaleLowerCase()) {
            case 'j':
                opcode = opcodess.find(obj => obj.name == 'j').opcode;
                machinCode = '0000' + opcode + '00000000' + targetAddress;
                break;

            case 'halt':
                opcode = opcodess.find(obj => obj.name == 'halt').opcode;
                machinCode = '0000' + opcode + '00000000' + targetAddress;
                break;
        }
        try {
            runMachinCode_jtype(instruction, field0, symbolTable);
        }
        catch (e) {
            throw e
        }

        return machinCode;

    } catch (e) {
        error = true;
        results.innerHTML = '';
        if (e.name === 'Error') {
            ui.showError(e);
            //isTrueError=false;
        }
        for (let i = 0; i < 16; i++) {
            reg[i].value = regDefaultValues[i];
            registers[i].value = regDefaultValues[i];
        }
        memory = memoryDeafault;
        UImem.value = memory;

    }

}
//----------------------------------

function makeResult(machinCode) {
    if (machinCode) {
        let output = document.createElement('input');
        output.className = "form-control machin-code";
        output.disabled = true;
        if (isNaN(parseInt(machinCode, 2))) {
            console.log(machinCode);
            output.value = machinCode;
        }
        else {
            //console.log(parseInt(machinCode, 2));
            // output.value = parseInt(machinCode, 2).toString(10);
            output.value = machinCode;
            let decimalCode = output.value;
        }
        //output.value = machinCode;

        results.appendChild(output);
    }
}
//function for execute rtype

// runMachinCode_rtype('slt',1,1,2);

function runMachinCode_rtype(instruction, field0, field1, field2) {
    let rd, rt, rs, rdUI, rtUI, rsUI;
    rd = reg.find(reg => reg.name == field0);
    rdUI = registers[Number(field0)];
    rt = reg.find(reg => reg.name == field2);
    rtUI = registers[Number(field2)];
    rs = reg.find(reg => reg.name == field1);
    rsUI = registers[Number(field1)];
    console.log(rd);
    console.log(rs);
    console.log(rt);
    let result = '';
    switch (instruction.toLocaleLowerCase()) {
        case 'add':
            rd.value = addANDsub(rs.value, rt.value);
            rdUI.value = rd.value;
            usage[rd.name] = 1;
            usage[rt.name] = 1;
            usage[rs.name] = 1;
            console.log(usage);
            console.log(rd.value);
            break;
        case 'sub':
            rd.value = addANDsub(rs.value, two_complements(rt.value));
            rdUI.value = rd.value;
            usage[rd.name] = 1;
            usage[rt.name] = 1;
            usage[rs.name] = 1;
            console.log(rd.value);
            break
        case 'slt':
            rd.value = slt_stli(rs.value, rt.value);
            rdUI.value = rd.value;
            usage[rd.name] = 1;
            usage[rt.name] = 1;
            usage[rs.name] = 1;
            console.log(rd.value);
            break;
        case 'or'://TODO MAKE FUNCTION
            rd.value = or_ori(rs.value, rt.value);
            rdUI.value = rd.value;
            usage[rd.name] = 1;
            usage[rt.name] = 1;
            usage[rs.name] = 1;
            console.log(rd.value);
            break;
        case 'nand'://TODO MAKE FUNCTION
            result = '';
            for (let i = 0; i < 32; i++) {
                if (rt.value[i] == '0' || rs.value[i] == '0') {
                    result += '0';
                }
                if (rt.value[i] == '1' && rs.value[i] == '1') {
                    result += '1';
                }
            }
            rd.value = result;
            rdUI.value = rd.value;
            usage[rd.name] = 1;
            usage[rt.name] = 1;
            usage[rs.name] = 1;
            console.log(rd.value);
            break;
    }

}
function addANDsub(num1, num2) {
    let result;
    if (num1[0] == '0' && num2[0] == '0') {
        result = (parseInt(num1, 2) + parseInt(num2, 2)).toString(2);
        result = fill32(result, '0')
        return result;

    }
    if (num1[0] == '1' && num2[0] == '1') {
        let two_complement_num1 = two_complements(num1);
        let two_complement_num2 = two_complements(num2);
        decimal_num1 = parseInt(two_complement_num1, 2);
        decimal_num2 = parseInt(two_complement_num2, 2);
        result = decimal_num1 + decimal_num2;
        result = fill32(result.toString(2), '0');
        console.log(result);
        result = two_complements(result);
        return result;
    }
    if (num1[0] == '1' && num2[0] == '0') {
        let two_complement_num1 = two_complements(num1);
        let decimal_num1 = (-1) * (parseInt(two_complement_num1, 2));
        let decimal_num2 = parseInt(num2, 2);
        let result = decimal_num1 + decimal_num2;
        if (result > 0) {
            result = fill32(result.toString(2), '0');
            console.log(result);
            return result;
        }
        else {
            result = two_complements(fill32(((-1) * result).toString(2), '0'));
            //console.log(fill32(((-1) * result).toString(2)), '0');
            return result;

        }
    }
    if (num1[0] == '0' && num2[0] == '1') {
        two_complement_num2 = two_complements(num2);
        decimal_num2 = (-1) * (parseInt(two_complement_num2, 2));
        decimal_num1 = parseInt(parseInt(num1, 2));
        let result = decimal_num1 + decimal_num2;
        if (result > 0) {
            result = fill32(result.toString(2), '0');
            console.log(result);
            return result;
        }
        else {
            result = two_complements(fill32(((-1) * result).toString(2), '0'));
            return result;
        }

    }
}
function slt_stli(num1, num2) {
    let result = '';
    if (num1[0] == '0' && num2[0] == '0') {
        decimal_num1 = parseInt(num1, 2);
        decimal_num2 = parseInt(num2, 2);
        if (decimal_num1 > decimal_num2) {
            for (let i = 0; i < 32; i++) result += '0';
            return result;
        }
        else {
            for (let i = 0; i < 31; i++) result += '0';
            result += '1';
            return result;
        }

    }
    else if (num1[0] == '1' && num2[0] == '1') {
        two_complement_num1 = two_complements(num1)
        two_complement_num2 = two_complements(num2)
        decimal_num1 = parseInt(two_complement_num1, 2)
        decimal_num2 = parseInt(two_complement_num2, 2)
        if (decimal_num1 < decimal_num2) {
            for (let i = 0; i < 31; i++) result += '0';
            result += '1';
            return result

        }
        else {
            for (let i = 0; i < 32; i++) result += '0';
            return result;
        }
    }

    else if (num1[0] == '1' && num2[0] == '0') {
        for (let i = 0; i < 31; i++) result += '0';
        result += '1';
        return result;

    }
    else {
        for (let i = 0; i < 32; i++) result += '0';
        return result;

    }


}

//runMachinCode_rtype('add',3,1,2);

function runMachinCode_itype(instruction, field0, field1, field2, index, symbolTable) {
    // we replace field0 and offset when we put this function in itype machinchode

    let offset;
    let targetLabel;
    
    for (let i = 0; i < symbolTable.length; i++) {
        if (symbolTable[i].label === field2) {
            targetLabel = symbolTable[i];
        }
    }
    // console.log(targetLabel);
    // console.log(Number(targetLabel.address)-(index+1));
    if (instruction.toLocaleLowerCase() === 'beq' && targetLabel) {
        offset = make16Bit(Number(targetLabel.address) - (index + 1));
        console.log(targetLabel);


    }
    else if (targetLabel) {
        offset = make16Bit(Number(targetLabel.address));
        console.log(targetLabel);

    }


    if (offset === undefined) {
        if (isNaN(Number(field2))) {

            throw new Error(`Invalid label : cant't use label without declaration (${field2}).`);
        }
        else {
            offset = make16Bit(Number(field2));
        }
    }

    rd = reg.find(reg => reg.name == field0);
    rdUI = registers[Number(field0)];

    rs = reg.find(reg => reg.name == field1);
    rsUI = registers[Number(field1)];
    switch (instruction.toLocaleLowerCase()) {
        case 'addi':
            rd.value = addi(rs, offset);
            rdUI.value = rd.value;
            usage[rd.name] = 1;
            usage[rs.name] = 1;
            pc++;
            break;
        case 'slti':
            if (offset[0] == "0") {
                offset = fill32(offset, "0")
            }
            else {
                offset = fill32(offset, "1")
            }
            rd.value = slt_stli(rs.value, offset);
            rdUI.value = rd.value;
            usage[rd.name] = 1;
            usage[rs.name] = 1;
            console.log(rd.value);
            pc++;

            break;
        case 'ori':


            if (offset[0] == "0") {
                offset = fill32(offset, "0")
            }
            else {
                offset = fill32(offset, "1")
            }//zero extention
            rd.value = or_ori(rs.value, offset);
            rdUI.value = rd.value;
            usage[rd.name] = 1;
            usage[rs.name] = 1;
            console.log(rd.value);
            pc++
            break;

        case 'lw':
            if (offset[0] == "0") {
                offset = fill32(offset, "0")
            }
            else {
                offset = fill32(offset, "1")
            }
            finalOffset = addANDsub(rs.value, offset);
            if (finalOffset[0] == 1) {
                //console.log('here')
                throw new Error('Access Denied : Invalid Address !');
            }
            else {
                finalOffset = parseInt(finalOffset, 2);
                let memvalue = '';
                //console.log(finalOffset);
                for (let i = (finalOffset) * 32; i < (finalOffset) * 32 + 32; i++) {
                    memvalue += memory[i];
                    //console.log(memory[i]);
                }
                console.log(memory);
                //console.log(memvalue);
                rd.value = memvalue;
                rdUI.value = rd.value;
                usage[rd.name] = 1;
                usage[rs.name] = 1;
                console.log(rd);
            }
            memusage+=32;
            pc++;

            break;
        case 'sw':
            if (offset[0] == "0") {
                offset = fill32(offset, "0")
            }
            else {
                offset = fill32(offset, "1")
            }
            finalOffset = addANDsub(rs.value, offset);
            if (finalOffset[0] == 1) {
                throw new Error('Access Denied : Invalid Address !');
            }
            else {
                finalOffset = parseInt(finalOffset, 2);

                console.log();
                for (let i = (finalOffset) * 32; i < (finalOffset) * 32 + 32; i++) {
                    //value = Number(rd.value[i]);
                    //console.log(i-(finalOffset-1)*32);
                    memory[i] = parseInt(rd.value[(i - (finalOffset) * 32)], 2);
                }
                UImem.value = memory;
                console.log(memory);
            }
            usage[rd.name] = 1;
            usage[rs.name] = 1;
            memusage+=32;
            pc++

            break;
        case 'beq':
                usage[rd.name] = 1;
                usage[rs.name] = 1;
            if (rd.value == rs.value) {

                binary_pc = fill32(pc.toString(2), '0');
                if (offset[0] == "0") {
                    offset = fill32(offset, "0")
                }
                else {
                    offset = fill32(offset, "1")
                }
                newOffset = addANDsub(binary_pc, offset);
                newOffset = addANDsub(newOffset, '00000000000000000000000000000001')
                //console.log(newOffset);
                pc = parseInt(newOffset, 2);

                //console.log(binary_pc);
                // number = parseInt(offset, 2);
                // pc = pc + number + 1;
                console.log(pc)
            }
            else {
                pc++;
            }
            break;
        case 'jalr':
                usage[rd.name] = 1;
                usage[rs.name] = 1;
            if (rs.value[0] == '1') {
                throw new Error(`invalid value for pc in register : (${rs.name}) !`);
            }
            else {
                binary_pc = fill32(pc.toString(2), '0');
                rd.value = addANDsub(binary_pc, '00000000000000000000000000000001');
                pc = parseInt(rs.value, 2);
                console.log(pc);
            }

            break;


    }
}

function addi(rs, imm) {

    if (imm[0] == "0") {
        imm = fill32(imm, "0")
    }
    else {
        imm = fill32(imm, "1")
    }
    return addANDsub(rs.value, imm);



}
function or_ori(num1, num2) {
    let result = '';
    for (let i = 0; i < 32; i++) {
        if (num2[i] == '1' || num1[i] == '1') {
            result += '1';
        }
        if (num2[i] == '0' && num1[i] == '0') {
            result += '0';
        }
    }
    return result;
}

function runMachinCode_jtype(instruction, field0, symbolTable) {
    let targetAddress;

    for (let i = 0; i < symbolTable.length; i++) {
        if (symbolTable[i].label === field0) {
            targetAddress = make16Bit(Number(symbolTable[i].address));
        }
    }
    if (targetAddress === undefined) {
        if (isNaN(Number(field0))) {
            err = true;
            throw new Error(`Invalid label : cant't use label without declaration (${field0}).`);
        }
        else {
            targetAddress = make16Bit(Number(field0));
        }
    }
    switch (instruction.toLocaleLowerCase()) {
        case 'j':
            if (targetAddress[0] == '0') {
                targetAddress = fill32(targetAddress, '0');
            }
            pc = parseInt(targetAddress, 2);
            console.log(pc)
            break;
    }

}
function selectTextareaLine(tarea, lineNum) {

    var lines = tarea.value.split("\n");

    // calculate start/end
    var startPos = 0, endPos = tarea.value.length;
    for (var x = 0; x < lines.length; x++) {
        if (x == lineNum) {
            break;
        }
        startPos += (lines[x].length + 1);

    }
    console.log(lineNum)
    var endPos = lines[lineNum].length + startPos;

    // do selection
    // Chrome / Firefox

    if (typeof (tarea.selectionStart) != "undefined") {
        tarea.focus();
        tarea.selectionStart = startPos;
        tarea.selectionEnd = endPos;
        return true;
    }

    // IE
    if (document.selection && document.selection.createRange) {
        tarea.focus();
        tarea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}
function calusage () { 
    let sum=0;
    for(let i = 0; i < 16 ;i++)
    {
        sum+=Number(usage[i]);
    }
    
    return (sum/parseFloat(16)) * 100;
 }
 function calmemusage(){
    return (memusage/parseFloat(512000)*100);
 }