// ----- Global Variables ---------

let lineNumber = 1;
let charNumber = 1;
let lineHeight = 18.2;
// varaible to store whether or not mouse is draged 
let drag = false;
let lineStart = {line:0,char:0};
let lineEnd = {line:0,char:0}
let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
let charSize = (testLine.clientWidth)/40;


// ------ General Task Function ------------
function removeSelected(ReplaceChar){
    let codeLines = document.getElementsByClassName("line");
    let topLineInSelected = lineStart.line > lineEnd.line ?
         lineEnd : (lineStart.line == lineEnd.line ? (lineStart.char > lineEnd.char ? lineEnd : lineStart) : lineStart);
    let bottomLineInSelected =  lineStart.line > lineEnd.line ? 
         lineStart :(lineStart.line == lineEnd.line ? (lineStart.char > lineEnd.char ? lineStart : lineEnd) : lineEnd)  ;

    if(bottomLineInSelected.line > codeLines.length){
        bottomLineInSelected.line = codeLines.length;
    }
    if(topLineInSelected.line <= 0){
        topLineInSelected.line = 1;
    }

    if(codeLines[bottomLineInSelected.line - 1].innerText.length < bottomLineInSelected.char){
        bottomLineInSelected.char = codeLines[bottomLineInSelected.line - 1].innerText.length;
    } else if(topLineInSelected.char < 0){
        topLineInSelected.char = 0;
    }

    let bottomLineUnSelectedText = codeLines[bottomLineInSelected.line - 1].innerText.slice(bottomLineInSelected.char, codeLines[bottomLineInSelected.line - 1].innerText.length);
    let topLineUnselectedText = codeLines[topLineInSelected.line - 1].innerText.slice(0,topLineInSelected.char);
    console.log(bottomLineUnSelectedText,topLineUnselectedText)
    codeLines[topLineInSelected.line -1].childNodes[0].innerHTML = "<pre>" + topLineUnselectedText + ReplaceChar + bottomLineUnSelectedText + "</pre>";

    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    
    charNumber = topLineInSelected.char+1 + ReplaceChar.length;
    lineNumber = topLineInSelected.line;
    cursor.style.left = (charNumber-1)*charSize + 35  + "px";
    cursor.style.top = (lineNumber-1)*lineHeight  + "px";

    // for(let i = topLineInSelected.line + 1; i<= bottomLineInSelected.line; i++){
    //     console.log(i);
    //     removeLine(i);
    // }
    let numberOfLines = bottomLineInSelected.line - topLineInSelected.line;
    while(numberOfLines > 0){
        removeLine(topLineInSelected.line+1)
        numberOfLines = numberOfLines -1 ;
    }

    let input = document.getElementById('code_editor_cursor_input');
    input.focus();

}

function SelectTextByMouse(){
    let codeLines = document.getElementsByClassName("line");

    // remove selected text if any
    let SelectedLines  = document.querySelectorAll(".background_selected_text");
    SelectedLines.forEach((line) => {
        line.classList.remove('background_selected_text');
    });

    // user dragging or moving cursor from bottom to top
    if(lineStart.line > lineEnd.line){

        if(lineStart.line <= 0){
            lineStart.line = 1;
        }
        // add the span tag around the text being selected.
        if(codeLines[lineEnd.line - 1].innerText.length >= lineEnd.char && lineEnd.char >= 0){
            
            codeLines[lineEnd.line - 1].childNodes[0].innerHTML = "<pre>" + codeLines[lineEnd.line - 1].innerText.slice(0,lineEnd.char) +
                     "<span class='background_selected_text'>" + codeLines[lineEnd.line - 1].innerText.slice(lineEnd.char,codeLines[lineEnd.line - 1].innerText.length) 
                     +"</span>"  + "</pre>"
        }
       
        if(codeLines[lineStart.line - 1].innerText.length >= lineStart.char){
            codeLines[lineStart.line - 1].childNodes[0].innerHTML = "<pre>" + "<span class='background_selected_text'>" + codeLines[lineStart.line - 1].innerText.slice(0,lineStart.char) 
            + "</span>" + codeLines[lineStart.line - 1].innerText.slice(lineStart.char,codeLines[lineStart.line - 1].innerText.length) + "</pre>";
        } else{
            codeLines[lineStart.line - 1].childNodes[0].innerHTML = "<pre>" + "<span class='background_selected_text'>" + codeLines[lineStart.line - 1].innerText + "</span>" + "</pre>";
        }

        for(let i = lineEnd.line + 1; i< lineStart.line; i++){
            codeLines[i-1].childNodes[0].childNodes[0].classList.add("background_selected_text");
        }
    }
    else if(lineStart.line < lineEnd.line) {
        // add the span tag around the text being selected.
        if(lineEnd.line > codeLines.length){
            lineEnd.line = codeLines.length;
        }

        
        if(codeLines[lineStart.line - 1].innerText.length >= lineStart.char && lineStart.char >= 0){
            
            codeLines[lineStart.line - 1].childNodes[0].innerHTML = "<pre>" + codeLines[lineStart.line - 1].innerText.slice(0,lineStart.char) +
                     "<span class='background_selected_text'>" + codeLines[lineStart.line - 1].innerText.slice(lineStart.char,codeLines[lineStart.line - 1].innerText.length) 
                     +"</span>"  + "</pre>";
        }

        if(codeLines[lineEnd.line - 1].innerText.length >= lineEnd.char){
            codeLines[lineEnd.line - 1].childNodes[0].innerHTML = "<pre>" + "<span class='background_selected_text'>" + codeLines[lineEnd.line - 1].innerText.slice(0,lineEnd.char) 
            + "</span>" + codeLines[lineEnd.line - 1].innerText.slice(lineEnd.char,codeLines[lineEnd.line - 1].innerText.length) + "</pre>";
        } else{
            codeLines[lineEnd.line - 1].childNodes[0].innerHTML = "<pre>" + "<span class='background_selected_text'>" + codeLines[lineEnd.line - 1].innerText + "</span>" + "</pre>";
        }

        for(let i = lineStart.line + 1; i< lineEnd.line; i++){
            codeLines[i-1].childNodes[0].childNodes[0].classList.add("background_selected_text");
        }
    } 
    else if(lineStart.line == lineEnd.line){
        if(lineStart.line > codeLines.length){
            lineStart.line = codeLines.length;
            lineEnd.line = codeLines.length;
        }

        if(lineEnd.char < 0 ){
            lineEnd.char = 0;
        } 
        if(lineStart.char < 0){
            lineStart.char = 0;
        }
        let frontCharNum = lineEnd.char > lineStart.char ? lineStart.char : lineEnd.char;
        let endCharNum = lineEnd.char > lineStart.char ? lineEnd.char : lineStart.char;

        let frontNonSpanText = codeLines[lineEnd.line - 1].childNodes[0].innerText.slice(0,frontCharNum);
        let insideSpanText = codeLines[lineEnd.line - 1].childNodes[0].innerText.slice(frontCharNum,endCharNum);
        let endNonSpanText = codeLines[lineEnd.line - 1].childNodes[0].innerText.slice(endCharNum,codeLines[lineEnd.line - 1].childNodes[0].innerText.length);
        codeLines[lineEnd.line - 1].childNodes[0].innerHTML = "<pre>" + frontNonSpanText +"<span class='background_selected_text'>" + insideSpanText + "</span>" + endNonSpanText + "</pre>" ;
    }

    let input = document.getElementById('code_editor_cursor_input');
    input.focus();
}

function removeLine(lineNumberToremove){
    // removing number from number line
    let numberLines = document.getElementsByClassName('number_line');
    numberLines[numberLines.length-1].parentNode.removeChild(numberLines[numberLines.length-1])

    // removing text line
    let codeLines = document.getElementsByClassName("line");
    codeLines[lineNumberToremove - 1].parentNode.removeChild(codeLines[lineNumberToremove - 1]);
}





// document.getElementsByTagName("body")[0].style.backgroundColor = "#000000"

function changeVal(e){
  // we will process the input value add some span tags to highlight syntax, show errors and all
  e.target.parentElement.querySelector('pre').innerHTML = e.target.value
}

// let lines = document.getElementsByClassName("line");
// console.log(lines)
// lines = Array.prototype.slice.call(lines)
// lines.map((line)=>{
//     line.querySelector('input').addEventListener('focus',()=>{
//         line.classList.add('activeline');
//         line.querySelector('input').value = line.querySelector('pre').innerText;
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


function getMousePosition(canvas, event) {
    // remove selected text if any
    let SelectedLines  = document.querySelectorAll(".background_selected_text");
    SelectedLines.forEach((line) => {
        line.classList.remove('background_selected_text');
    });

    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left - 35;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x,
                "Coordinate y: " + y);

    let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
    let charSize = (testLine.clientWidth)/40;

    lineNumber = parseInt(y/lineHeight) +1;
    charNumber = parseInt(x/charSize)+1;

    

    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    let textlines = document.getElementsByClassName('text');
    if(!textlines[lineNumber-1]){
        lineNumber = textlines.length;
    }
    let lineTextLength = textlines[lineNumber-1].innerText.length;
    if(textlines[lineNumber-1].innerText == "\u200B"){
        lineTextLength = 0;
    }
    
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
    let input = document.getElementById('code_editor_cursor_input');
    input.focus();
}

let mouseDown = false;

window.addEventListener("mouseup",(e) =>{
    mouseDown = false;
})
codeEditor.addEventListener("mouseup",(e)=>{
    mouseDown = false;
    if(!drag){
        getMousePosition(codeEditor, e);
    } if(drag){
        let rect = codeEditor.getBoundingClientRect();
        let x = e.clientX - rect.left - 35;
        let y = e.clientY - rect.top;

        let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
        let charSize = (testLine.clientWidth)/40;

        lineNumber = parseInt(y/lineHeight) +1;
        charNumber = parseInt(x/charSize)+1;

        lineEnd = {
            line:lineNumber,
            char:charNumber - 1
        }
    }
    
});

codeEditor.addEventListener("mousedown",(e)=>{
    mouseDown = true;
    drag = false;
    let rect = codeEditor.getBoundingClientRect();
    let x = e.clientX - rect.left - 35;
    let y = e.clientY - rect.top;
    
    let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
    let charSize = (testLine.clientWidth)/40;

    lineNumber = parseInt(y/lineHeight) + 1 ;
    charNumber = parseInt(x/charSize);

    lineStart = {
        line:lineNumber,
        char:charNumber
    }
    
});

let MouseMoveSelection ;
codeEditor.addEventListener("mousemove",(e)=>{
    e.preventDefault();
    if(mouseDown){
        drag = true;
        clearInterval(MouseMoveSelection);
        MouseMoveSelection = setTimeout(()=>{
            let rect = codeEditor.getBoundingClientRect();
            let x = e.clientX - rect.left - 35;
            let y = e.clientY - rect.top;

            let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
            let charSize = (testLine.clientWidth)/40;

            lineNumber = parseInt(y/lineHeight) +1;
            charNumber = parseInt(x/charSize);

            lineEnd = {
                line:lineNumber,
                char:charNumber
            }

            SelectTextByMouse();
        },1)
    }
    
});


let setTimeoutforWidthInc;
let codeEditorCont = document.getElementsByClassName('editor_inner_container')[0];
codeEditorCont.addEventListener("scroll",()=>{
    
    clearInterval(setTimeoutforWidthInc);
    setTimeoutforWidthInc = setTimeout(()=>{
        const numberLineCont = document.getElementsByClassName('number_line_cont')[0];
        let codeEditorContLatest = document.getElementsByClassName('editor_inner_container')[0];
        if(!(numberLineCont.clientWidth == codeEditorContLatest.scrollWidth)){
            numberLineCont.style.width = codeEditorContLatest.scrollWidth+"px";
        }
        
    },500)
    
})

function handleInputChange(e){
    e.preventDefault();
    console.log(drag,e.data);
    if(drag){
        if(e.data.length){
            removeSelected(e.data);
        } else {
            removeSelected("");
        }
        
        drag = false;
        e.target.value = "";
    } else {
        let activeline = document.getElementsByClassName("text")[lineNumber - 1];
        let textVal = activeline.innerText;
        if((e.data.length)){
            // remove ZeroWhiteSpace and add the text.
            if(textVal == "\u200B"){
                activeline.innerHTML ="<pre>" +  e.data + "</pre>";
            } else{
                activeline.innerHTML ="<pre>" + textVal.slice(0,charNumber-1) + e.data + textVal.slice(charNumber-1) + "</pre>";
            }
            
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
    
    
}



let textInputBox = document.getElementById("code_editor_cursor_input");

textInputBox.addEventListener("keydown",(e)=>{
    
    if(e.key == "Enter"){
        createNewLine();
    } else if(e.key == "Backspace"){
        deleteCurrentLineOrLeftText();
    } else if(e.key == "Delete"){
        deleteNextLineOrRightText();
    } else if(e.key == "ArrowUp"){
        cursorNavigationUp();
    } else if(e.key == "ArrowDown"){
        cursorNavigationDowm();
    } else if(e.key == "ArrowLeft"){
        cursorNavigationLeft(e);
    } else if(e.key == "ArrowRight"){
        cursorNavigationRight();
    }
});

function createNewLine(){
    let activeline = document.getElementsByClassName("text")[lineNumber - 1];
    let textVal = activeline.innerText;

    // removing any text that was to the right of cursor after enter was pressed.
    
    if(textVal.slice(0,charNumber-1)){
        activeline.innerHTML = "<pre>" + textVal.slice(0,charNumber-1) + "</pre>";
    } else {
        activeline.innerHTML = "<pre>" + "&#8203;" + "</pre>";
    }
    // create a new number in number line
    let numberLineCont = document.getElementsByClassName('number_line_cont')[0];
    let numberLines = document.getElementsByClassName('number_line');
    let numberLine = document.createElement('div');
    numberLine.classList.add("number_line");
    let numberLineP = document.createElement('pre');
    // because the number in HTML starts from 0. we just make the next line value to length
    numberLineP.innerText = numberLines.length;
    numberLine.append(numberLineP);
    numberLineCont.appendChild(numberLine);

    // creating new text line

    let codeLines = document.getElementsByClassName("line");

    let codeLineDiv = document.createElement('div');
    codeLineDiv.classList.add('line');
    let codeTextDiv = document.createElement('div');
    codeTextDiv.classList.add("text");
    let codeTextP = document.createElement('pre');
    codeTextP.innerHTML =  (charNumber > textVal.length) ? "" : textVal.slice(charNumber-1);

    codeTextDiv.append(codeTextP);
    codeLineDiv.append(codeTextDiv);

    let codeLinesCont = document.getElementsByClassName('code_editor_lines_container')[0];

    codeLinesCont.insertBefore(codeLineDiv,codeLines[lineNumber])
    lineNumber = lineNumber + 1;

    // change cursor position
    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    
    cursor.style.top = (lineNumber-1)*lineHeight  + "px";
    cursor.style.left = 35  + "px";
    charNumber = 1;

}

function deleteCurrentLineOrLeftText(){
    let activeline = document.getElementsByClassName("text")[lineNumber - 1];
    let textVal = activeline.innerText;
    if(drag){
        removeSelected("");
        drag = false;
    } else {
        // Removing the number line number and line along with text
        if(charNumber == 1 && lineNumber != 1){

            removeLine(lineNumber);
            
            // moving the cursor up  and left
            lineNumber = lineNumber - 1;
            let cursor = document.getElementsByClassName('code_editor_cursor')[0];
            activeline = document.getElementsByClassName("text")[lineNumber-1];
            cursor.style.top = (lineNumber-1)*lineHeight  + "px";
            cursor.style.left = (activeline.innerText.length)*charSize + 35  + "px";
            charNumber = activeline.innerText.length + 1;

            //adding any text the deleted line had into current active line

            activeline.innerHTML ="<pre>" + activeline.innerText.slice(0,activeline.innerText.length) + textVal + "</pre>";

        } else{
            if(charNumber ==1){
                return;
            }
            // removing text from left side
            activeline.innerHTML ="<pre>" + textVal.slice(0,charNumber-2) + textVal.slice(charNumber-1) + "</pre>";
            // moving the cursor left
            let cursor = document.getElementsByClassName('code_editor_cursor')[0];
            cursor.style.left = (charNumber-2)*charSize + 35  + "px";
            charNumber = charNumber-1;
        }
    }
    
    
}

function deleteNextLineOrRightText(){
    let activeline = document.getElementsByClassName("text")[lineNumber - 1];
    let textVal = activeline.innerText;
    let codeLines = document.getElementsByClassName("line");

    if(drag){
        removeSelected("");
        drag = false;
    } else {
        if((!(textVal.length) || charNumber == textVal.length+1) && lineNumber != codeLines.length){
        
            removeLine(lineNumber+1);
            // copying any text the next line had and adding it to active line 
            let nextLineText = codeLines[lineNumber].innerText;
            activeline.innerHTML = "<pre>" + textVal + nextLineText + "</pre>";
    
            
        } else {
            // removing text from right  side
            activeline.innerHTML ="<pre>" + textVal.slice(0,charNumber-1) + textVal.slice(charNumber) + "</pre>";
        }
    }

    
}

function cursorNavigationUp(){
    let codeLines = document.getElementsByClassName("line");
    if(lineNumber != 1){
        let cursor = document.getElementsByClassName('code_editor_cursor')[0];
        cursor.style.top = (lineNumber - 2)*lineHeight +"px";
        lineNumber = lineNumber - 1;
        if(charNumber > codeLines[lineNumber-1].innerText.length ){
            // if innerText is ZeroWidthSpace then cursor should be at the beginning
            if(codeLines[lineNumber-1].innerText == "\u200B"){
                charNumber = 1;
                cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            } else {
                charNumber = codeLines[lineNumber-1].innerText.length + 1;
                cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            }
           
        }
    }
    let input = document.getElementById('code_editor_cursor_input');
    input.scrollIntoView();
}
function cursorNavigationDowm(){
    let codeLines = document.getElementsByClassName("line");
    let numberLines = document.getElementsByClassName('number_line');
    if(lineNumber < numberLines.length -1){
        let cursor = document.getElementsByClassName('code_editor_cursor')[0];
        cursor.style.top = (lineNumber)*lineHeight +"px";
        lineNumber = lineNumber + 1;
        if(lineNumber < codeLines.length && charNumber > codeLines[lineNumber].innerText.length ){
            // if innerText is ZeroWidthSpace then cursor should be at the beginning
            if(codeLines[lineNumber-1].innerText == "\u200B"){
                charNumber = 1;
                cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            } else {
                charNumber = codeLines[lineNumber].innerText.length + 1;
                cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            }
            
            
        }
    }
    let input = document.getElementById('code_editor_cursor_input');
    input.scrollIntoView(   );
}

function cursorNavigationLeft(e){
    let codeLines = document.getElementsByClassName("line");
    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    if(e.shiftKey){
        // createSelection(codeLines[lineNumber-1].childNodes[1],1,2)
    } 

    if(charNumber > 1){
        charNumber = charNumber - 1;
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
    } else if(charNumber == 1 && lineNumber != 1){
        if(codeLines[lineNumber-2].innerText == "\u200B"){
            charNumber = 1;

        } else {
            charNumber = codeLines[lineNumber-2].innerText.length + 1;
        }        
        lineNumber = lineNumber - 1;
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
        cursor.style.top = (lineNumber-1)*lineHeight +"px";
    }
    
    
}

function cursorNavigationRight(){
    let codeLines = document.getElementsByClassName("line");
    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    if(charNumber <= codeLines[lineNumber-1].innerText.length){
        if(codeLines[lineNumber-1].innerText == "\u200B" && lineNumber != codeLines.length) {
            charNumber = 1;
            lineNumber = lineNumber + 1;
            cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            cursor.style.top = (lineNumber-1)*lineHeight +"px";
        } else {
            charNumber = charNumber + 1;
            cursor.style.left = (charNumber-1)*charSize + 35  + "px";
        }
       
    } else if(charNumber == codeLines[lineNumber-1].innerText.length+1 && lineNumber != codeLines.length){
        charNumber = 1;
        lineNumber = lineNumber + 1;
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
        cursor.style.top = (lineNumber-1)*lineHeight +"px";
    }
}


// for initaiting the selection, rest of the future selection movement with shift
// will be handled by browser
function createSelection(field, start, end) {
    if( field.createTextRange ) {
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end-start);
        selRange.select();
    } else if( field.setSelectionRange ) {
        field.setSelectionRange(start, end);
        field.focus();
    } else if( field.selectionStart ) {
        field.selectionStart = start;
        field.selectionEnd = end;
        field.focus();
    }
    field.focus();
} 