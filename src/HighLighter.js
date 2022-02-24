import '../assets/styles/highlight.css'
import Parser from './Parser.js'

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


/**
 * highlight parsed instruction into a string
 * representation 
 * @param {Object} parsed
 * @param {Object} parsed.label
 * @param {String} parsed.label.value
 * @param {String} parsed.label.type
 * @param {Object} parsed.instruct
 * @param {String} parsed.instruct.optCode
 * @param {Array<String>} parsed.instruct.operands
 * @param {String} parsed.instruct.operands.type
 * @param {String} parsed.instruct.operands.value
 * @param {String} parsed.comment
 * @returns {{
   label: String,
   instruction: String,
   comment: String
 }}
 */
function highlighting(parsed) {
  parsed.label = wrapper({
    name: parsed.label.type,
    keyword: parsed.label.value
  })
  parsed.comment = wrapper({
    name: 'comment',
    keyword: parsed.comment
  })

  var instruct = parsed.instruct;
  parsed.instruct = wrapper({
    name: 'opt-code',
    keyword: instruct.optCode
  });

  instruct.operands.forEach((operand, i) => {
    parsed.instruct += ((i == 0) ? '' : ',');
    parsed.instruct += wrapper({
      name: operand.type,
      keyword: operand.value
    })
  })
  return parsed
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
    var parser = new Parser();

    var parsedObjectArr = parser.parse(param.src);
    var output = '';
    parsedObjectArr.forEach(obj => {
      obj = highlighting(obj);
      var tr = document.createElement('tr');
      for (var part of ['label', 'instruct', 'comment']) {
        var td = document.createElement('td');
        td.innerHTML = obj[part];
        td.className = 'code-asm-' + part;
        tr.appendChild(td);
      }
      output += tr.outerHTML;
    })
    return `<table class='code-asm-struct'>${output}</table>`
  }
}

export default HighLighter;
