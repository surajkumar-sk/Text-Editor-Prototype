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


let lineNumber = 1;
let charNumber = 1;
let lineHeight = 18.2;
// varaible to store whether or not mouse is draged 
let drag = false;
let lineStart = {line:0,char:0};
let lineEnd = {line:0,char:0}
let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
let charSize = (testLine.clientWidth)/6;

function getMousePosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left - 35;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x,
                "Coordinate y: " + y);

    let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
    let charSize = (testLine.clientWidth)/6;

    lineNumber = parseInt(y/lineHeight) +1;
    charNumber = parseInt(x/charSize)+1;

    

    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    let textlines = document.getElementsByClassName('text');
    if(!textlines[lineNumber-1]){
        lineNumber = textlines.length;
    }
    console.log(lineNumber,charNumber);
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
    console.log(charNumber , lineTextLength)
    let input = document.getElementById('code_editor_cursor_input');
    console.log(input)
    input.focus();
}


codeEditor.addEventListener("mouseup",(e)=>{
    if(!drag){
        getMousePosition(codeEditor, e);
    } if(drag){
        let rect = codeEditor.getBoundingClientRect();
        let x = e.clientX - rect.left - 35;
        let y = e.clientY - rect.top;

        let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
        let charSize = (testLine.clientWidth)/6;

        lineNumber = parseInt(y/lineHeight) +1;
        charNumber = parseInt(x/charSize)+1;

        console.log("lineNumber x: mouse up: " + lineNumber,
                "charNumber y:  mouse up : " + charNumber);

        lineEnd = {
            line:lineNumber,
            char:charNumber
        }
    }
    
});

codeEditor.addEventListener("mousedown",(e)=>{
    drag = false;
    let rect = codeEditor.getBoundingClientRect();
    let x = e.clientX - rect.left - 35;
    let y = e.clientY - rect.top;
    
    let testLine = document.getElementsByClassName('code_editor_line_measure')[0].childNodes[1];
    let charSize = (testLine.clientWidth)/6;

    lineNumber = parseInt(y/lineHeight) +1;
    charNumber = parseInt(x/charSize)+1;

    console.log("lineNumber x: mouse down: " + lineNumber,
                "charNumber y: mouse down : " + charNumber);
    lineEnd = {
        line:lineNumber,
        char:charNumber
    }
    
});

codeEditor.addEventListener("mousemove",(e)=>{
    drag = true;
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
            console.log(numberLineCont.clientWidth,codeEditorContLatest.scrollWidth+"px")
        }
        
    },500)
    
})

function handleInputChange(e){
    e.preventDefault();
    
    console.log(e);
    let activeline = document.getElementsByClassName("text")[lineNumber - 1];
    let textVal = activeline.innerText;
    console.log(textVal);
    console.log(e.data,"<pre>" + textVal.slice(0,charNumber-2) , textVal.slice(charNumber-1) + "</pre>")
    if((e.data)){
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



let textInputBox = document.getElementById("code_editor_cursor_input");

textInputBox.addEventListener("keydown",(e)=>{
    console.log(e);
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

    // change cursor position
    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    lineNumber = lineNumber + 1;
    cursor.style.top = (lineNumber-1)*lineHeight  + "px";
    cursor.style.left = 35  + "px";
    charNumber = 1;

}

function deleteCurrentLineOrLeftText(){
    let activeline = document.getElementsByClassName("text")[lineNumber - 1];
    let textVal = activeline.innerText;

    // Removing the number line number and line along with text
    if(charNumber == 1 && lineNumber != 1){

        // removing number from number line
        let numberLines = document.getElementsByClassName('number_line');
        numberLines[numberLines.length-1].parentNode.removeChild(numberLines[numberLines.length-1])

        // removing text line
        let codeLines = document.getElementsByClassName("line");

        codeLines[lineNumber-1].parentNode.removeChild(codeLines[lineNumber-1]);
        lineNumber = lineNumber - 1;
        
        // moving the cursor up  and left
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

function deleteNextLineOrRightText(){
    let activeline = document.getElementsByClassName("text")[lineNumber - 1];
    let textVal = activeline.innerText;
    let codeLines = document.getElementsByClassName("line");

    if((!(textVal.length) || charNumber == textVal.length+1) && lineNumber != codeLines.length){
        
        // removing number from number line
        let numberLines = document.getElementsByClassName('number_line');
        numberLines[numberLines.length-1].parentNode.removeChild(numberLines[numberLines.length-1])

        // copying any text the next line had and adding it to active line 
        let nextLineText = codeLines[lineNumber].innerText;
        activeline.innerHTML = "<pre>" + textVal + nextLineText + "</pre>";

        // removing text line
        
        codeLines[lineNumber].parentNode.removeChild(codeLines[lineNumber]); 
    } else {
        // removing text from right  side
        activeline.innerHTML ="<pre>" + textVal.slice(0,charNumber-1) + textVal.slice(charNumber) + "</pre>";
    }
}

function cursorNavigationUp(){
    let codeLines = document.getElementsByClassName("line");
    if(lineNumber != 1){
        let cursor = document.getElementsByClassName('code_editor_cursor')[0];
        cursor.style.top = (lineNumber - 2)*lineHeight +"px";
        lineNumber = lineNumber - 1;
        console.log(charNumber , codeLines[lineNumber-1].innerText.length)
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
        console.log(codeLines[lineNumber-1],"here");
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