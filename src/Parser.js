/**
 * Parser for ASM codes
 * @class
 */
class Parser {
  Y='lok'
  /**
   * Check if instruction is well written
   * 
   * @param {String} line represents the instruction
   * @returns {Boolean}
   */
   checkInstructionLine(line){
     
   }
}

/**
 * Check the syntax and syntax error of asm code
 * @param {String} line
 * @returns {Boolean}
 */
function checkLine(line) {
  line = line.trim();
  var lineRegexp = /^(\w+ *: *)?[A-Z]+ [a-zA-Z0-9#\(\)\"\'\`]+(\,[a-zA-Z0-9#\(\)\"\'\`]+)+(\ *\;.*)?$/;
  if (lineRegexp.test(line)) {
    line = line.split(/\;|\:/g);
    line = line.find((v) => {
      return /[A-Z]+ [a-zA-Z0-9#\(\)\"\'\`]+(\,[a-zA-Z0-9#\(\)\"\'\`]+)+/.test(v.trim());
    }).trim();
    line = line.substring(line.indexOf(' ')).trim();
    line = line.split(',');
    // test if operand are proper
    for (let i = 0, match = false, operand = ''; i < line.length; i++) {
      operand = line[i];
      for (let pattern of [/^\w+$/, /^\#\d+$/, /^\#(["'`])\w+\1$/, /^\(\w+\)$/]) {
        if (pattern.test(operand)) {
          match = true;
          //alert(operand + ' match ' + pattern)
        }
      }
      if (!match) return false;
      match = false;
    }
    return true;
  }
  return false;
}

/**
 * highlight one line of code and return the object 
 * representation 
 * @param {String} line
 * @returns {{
   address: String,
   code: String,
   comment: String
 }}
 */
function toLineCodeObject(line) {
  var obj = {}
  line = line.trim();
  obj.label = line.substring(0, line.indexOf(':') + 1);
  line = line.replace(obj.label, '');
  obj.comment = line.substring(line.indexOf(';'));
  line = line.replace(obj.comment, '');
  obj.instruction = line.trim();
  var sortedObj = {};
  if (obj.label != '')
    AsmCodes.labels.push(obj.label.substring(0, obj.label.length - 1))
  Object.keys(obj).sort().forEach(prop => sortedObj[prop] = obj[prop])
  return highlighting(sortedObj)
}

/**
 * highlight one line of code in Object
 * representation 
 * @param {Object} obj
 * @param {String} obj.label
 * @param {String} obj.instruction
 * @param {String} obj.comment
 * @returns {{
   label: String,
   instruction: String,
   comment: String
 }}
 */
 
function highlighting(obj) {
  obj.address = wrapper({
    name: 'address',
    keyword: obj.address
  })
  obj.comment = wrapper({
    name: 'comment',
    keyword: obj.comment
  })

  return obj
}




export default Parser
