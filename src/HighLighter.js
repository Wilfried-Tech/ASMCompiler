import '../assets/styles/highlight.css'


var AsmCodes = { labels: [], operands: [] };

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

  var

  return obj
}

/**
 * cree an Asm code part wrapper
 * @param {Object} param
 * @param {String} param.keyword
 * @param {String} param.name
 * @returns {String}
 */
function wrapper(param) {
  var span = document.createElement('span');
  span.className = `asm-${param.name}`;
  span.textContent = param.keyword;
  return span.outerHTML;
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
    AsmCodes = { labels: [], operands: [] };

    var codeLines = param.src.trim().split('\n');
    var highlightedObjectArr = codeLines.map(toLineCodeObject);
    var output = '';
    console.log(AsmCodes);
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

export default HighLighter;