import '../assets/styles/highlight.css'
import './Parser.js'

/**
 * define the object structure of error
 * @typedef {Object} ASMError
 * @property {Number} line
 * @property {String} message
 */

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
    /*AsmCodes = { labels: [], operands: [] };

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
    })*/
    return `<table class='code-asm-struct'>${output}</table>`
  }
}

export default HighLighter;
