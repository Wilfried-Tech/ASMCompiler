import '../assets/styles/highlight.css'


const keywords = []

/**
 * define the object structure of error
 * @typedef {Object} ASMError
 * @property {Number} line
 * @property {String} message
 */

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
        //alert(operand)
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
function toHighLightCodeObject(line) {
  var obj = {}
  line = line.trim();
  obj.address = line.substring(0, line.indexOf(':') + 1);
  line = line.replace(obj.address, '');
  obj.comment = line.substring(line.indexOf(';'));
  line = line.replace(obj.comment, '');
  obj.code = line.trim();
  var sortedObj = {};
  Object.keys(obj).sort().forEach(prop => sortedObj[prop] = obj[prop])
  return sortedObj
}

class HighLighter {
  /**
   * highlight the asm code 
   * @param {Object} param
   * @param {String} param.src
   * @param {Boolean} [param.checkSyntax=false]
   * @returns {{
     value: String,
     errors: Array<ASMError>
   }}
   */
  static highlight(param) {
    if (typeof param != 'object' || typeof param.src != 'string')
      return null;
    var codeLines = param.src.trim().split('\n');
    var highlightedObjectArr = codeLines.map(toHighLightCodeObject);
    var output = '';
    highlightedObjectArr.forEach(line => {
      var tr = document.createElement('tr');
      for (var part in line) {
        var td = document.createElement('td');
        td.innerHTML = line[part];
        td.className = 'code-asm-' + part;
        tr.appendChild(td);
      }
      output += tr.outerHTML;
    })
    return `<table class='code-asm-struct'>${output}</table>`
  }
}

export default { HighLighter };
