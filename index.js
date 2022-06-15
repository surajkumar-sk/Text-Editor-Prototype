// document.getElementsByTagName("body")[0].style.backgroundColor = "#000000"

function changeVal(e){
  // we will process the input value add some span tags to highlight syntax, show errors and all
  e.target.parentElement.querySelector('p').innerHTML = e.target.value
}

// let lines = document.getElementsByClassName("line");
// console.log(lines)
// lines = Array.prototype.slice.call(lines)
// lines.map((line)=>{
//     line.querySelector('input').addEventListener('focus',()=>{
//         line.classList.add('activeline');
//         line.querySelector('input').value = line.querySelector('p').innerText;
//     });
//     line.querySelector('input').addEventListener('blur',()=>{
//         line.classList.remove('activeline');
//         line.querySelector('input').value = '';
//     });
    
// });


// let codeEditorCont = document.getElementById("code-editor-cont");
// codeEditorCont.addEventListener("scroll",(e)=>{
//     let lineContainer = document.getElementsByClassName('number_line_container')[0];
    
//     lineContainer.style.left = codeEditorCont.scrollLeft + "px";
// });

let codeEditor = document.getElementsByClassName('code_editor_lines_container')[0];

let cursorVisible = true;
setInterval(()=>{
    let cursor = document.getElementsByClassName('code_editor_cursor_blink')[0];
    cursorVisible ? cursor.style.visibility = "hidden" : cursor.style.visibility = "visible";
    cursorVisible ? cursorVisible = false : cursorVisible = true;
    
},500)


let lineNumber = 1;
let charNumber = 1;

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left - 35;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x,
                "Coordinate y: " + y);

    let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
    let charSize = (testLine.clientWidth)/6;

    let lineHeight = 18.2
    lineNumber = parseInt(y/lineHeight) +1;
    charNumber = parseInt(x/charSize)+1;

    console.log(lineNumber,charNumber);

    let cursor = document.getElementsByClassName('code_editor_cursor')[0];

    let lineTextLength = document.getElementsByClassName('text')[lineNumber-1].innerText.length;

    
    if(charNumber > lineTextLength){
        cursor.style.left = (lineTextLength)*charSize + 35  + "px";
        charNumber = lineTextLength+1;
    } else if(charNumber < 1) {
        cursor.style.left = 35  + "px";
        charNumber = 1;
    } else {
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
    }
    cursor.style.top = (lineNumber-1)*lineHeight  + "px";
    console.log(charNumber , lineTextLength)
    let input = document.getElementById('code_editor_cursor_input');
    console.log(input)
    input.focus();
}

let drag = false;
codeEditor.addEventListener("mouseup",(e)=>{
    if(!drag){
        getMousePosition(codeEditor, e);
    }
    
});
codeEditor.addEventListener("mousedown",(e)=>{
    drag = false;
});
codeEditor.addEventListener("mousemove",(e)=>{
    drag = true;
});


let textInputBox = document.getElementById("code_editor_cursor_input");

textInputBox.addEventListener("keydown",(e)=>{
    console.log(e);
});





function handleInputChange(e){
    e.preventDefault();
    let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
    let charSize = (testLine.clientWidth)/6;
    console.log(e);
    let activeline = document.getElementsByClassName("text")[lineNumber - 1];
    let textVal = activeline.innerText;
    console.log(e.data,"<p>" + textVal.slice(0,charNumber-2) , textVal.slice(charNumber-1) + "</p>")
    if(!(e.data)){
        
        activeline.innerHTML ="<p>" + textVal.slice(0,charNumber-2) + textVal.slice(charNumber-1) + "</p>";
        charNumber = charNumber - 1;
    } else {
        activeline.innerHTML ="<p>" + textVal.slice(0,charNumber-1) + e.data + textVal.slice(charNumber-1) + "</p>";
        charNumber = charNumber + 1;
    }
    
    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    if(charNumber > activeline.innerText.length){
        cursor.style.left = (activeline.innerText.length)*charSize + 35  + "px";
    } else {
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
    }
    e.target.value = "";
}

let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
let charSize = (testLine.clientWidth)/6;

