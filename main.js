var code = document.querySelector('#code');


//console.log(WebASM.HighLighter.highlight);

code.innerHTML = WebASM.HighLighter.highlight({
  src: code.innerHTML,
  checkSyntax: false
})
