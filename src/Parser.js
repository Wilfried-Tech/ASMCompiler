import { Keywords, Registers } from './Constants.js'


/**
 * Parser for ASM codes
 * @class
 */
class Parser {
  /**
   * Check if instruction is well written
   * 
   * @param {String} strInstruct represents the string instruction
   * @returns {Boolean}
   */
  checkInstructionSyntax(strInstruct) {
    strInstruct = strInstruct.trim();
    var label;
    var instructRegexp = /^(\w+ *: *)?([A-Z0-9]+ [a-zA-Z0-9#\(\)\"\'\`]+(\,[a-zA-Z0-9#\(\)\"\'\`]+)*)?(\ *\;.*)?$/;
    if (instructRegexp.test(strInstruct)) {
      label = strInstruct.substring(0, strInstruct.indexOf(':') + 1);
      strInstruct = strInstruct.split(/(\;|\:)/g);
      strInstruct = strInstruct.find((v) => {
        return /([A-Z0-9]+ [a-zA-Z0-9#\(\)\"\'\`]+(\,[a-zA-Z0-9#\(\)\"\'\`]+)*)/.test(v.trim());
      });
      if (!strInstruct) {
        return true
      } else {
        strInstruct = strInstruct.trim();
      }
      strInstruct = strInstruct.substring(strInstruct.indexOf(' ')).trim();
      var operands = strInstruct.split(',');

      // test if operand are proper 
      for (let i = 0, match = false, operand = ''; i < operands.length; i++) {
        operand = operands[i];
        for (let pattern of [/^\w+$/, /^\#\d+$/, /^\#(["'`])\w+\1$/, /^\(\w+\)$/]) {
          if (pattern.test(operand)) {
            match = true;
          }
        }
        if (!match) return false;
        match = false;
        if (Keywords.indexOf(operand.toUpperCase()) != -1 || Keywords.indexOf(label.toUpperCase()) != -1 || Registers.indexOf(label.toUpperCase()) != -1) {
          return false;
        }
      }
      return true
    }
    return false;
  }

  /**
   * parse instruction string instruction into an object
   * @param {String} strInstruct
   * @returns {{
      label: String,
      instruct: {
        optCode: String,
        operands: Array<{
          type: String,
          value: String
        }>
      },
      comment: String
   }}
 */
  parseLine(strInstruct) {
    if (!this.checkInstructionSyntax(strInstruct))
      return null;
    var parsed = {}
    strInstruct = strInstruct.trim();
    parsed.label = strInstruct.substring(0, strInstruct.indexOf(':') + 1);
    strInstruct = strInstruct.replace(parsed.label, '');
    parsed.comment = strInstruct.substring(strInstruct.indexOf(';'));
    strInstruct = strInstruct.replace(parsed.comment, '');
    parsed.instruct = {};
    var instruction = strInstruct.trim();
    parsed.instruct.optCode = instruction.substring(0, instruction.indexOf(' ') + 1);
    instruction = instruction.replace(parsed.instruct.optCode, '').trim();
    var operands = instruction.split(',');
    //delete instruct, strInstruct;
    parsed.instruct.operands = operands.map(op => {
      return {
        type: '',
        value: op.trim()
      }
    });
    return parsed;
  }

  /**
   * parse a whole code string instruction into an array of object
   * @param {String} code
   * @returns {Array<{
      label: String,
      instruct: {
        optCode: String,
        operands: Array<{
          type: String,
          value: String
        }>
      },
      comment: String
    }>}
 */
  parse(code) {
    var _ = this;
    var parsedObjects = code.trim().split('\n').map((line) => {
      return _.parseLine(line);
    })
    var labels = parsedObjects.map(obj => obj.label.replace(':', '')).filter(label => label)
    parsedObjects.forEach(obj => {
      obj.instruct.operands.forEach(operand => {
        if (['LDB', 'LDS', 'LDSW', 'LDH', 'LDW'].indexOf(obj.instruct.optCode) != -1) {
          operand.type = 'variable';
        } else if (labels.indexOf(operand.value) != -1) {
          operand.type = 'label';
        } else if (Registers.indexOf(operand.value.toUpperCase()) != -1) {
          operand.type = 'register';
        } else if (operand.value.startsWith('#')) {
          operand.type = 'direct-value'
        } else{
          operand.type = 'unknown'
        }
      })
    })
    console.log(parsedObjects);
    return parsedObjects;
  }

  /**
   * @constructor
   */
  constructor() {}

}


export default Parser
