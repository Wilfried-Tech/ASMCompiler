import _registers from '../assets/json/register.json'
import _instructions from '../assets/json/instruction.json'
import _keywords from '../assets/json/keywords.json'

const Keywords = [];
const Registers = _registers;
[_instructions, _keywords].forEach(arr => {
  arr.forEach(key => {
    if (Keywords.indexOf(key) == -1 || Registers.indexOf(key) == -1) {
      Keywords.push(key);
    }
  })
})
Keywords.sort();

export {
  Keywords,
  Registers
}
