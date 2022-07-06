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
let textSelectionInProgress = false;

// ------ General Task Function ------------

function focusOnCursor(){
    // //console.log("running")
    let codeEditorCont = document.getElementById("code-editor-cont");

    let cursorTop = (lineNumber-1)*lineHeight;
    let cursorLeft = (charNumber-1)*charSize + 35;

    let codeEditorContLeft = codeEditorCont.scrollLeft + 35;
    let codeEditorContRight = codeEditorCont.scrollLeft + codeEditorCont.clientWidth;

    let codeEditorContTop = codeEditorCont.scrollTop;
    let codeEditorContBottom = codeEditorCont.scrollTop + codeEditorCont.clientHeight - 18.2;

    // //console.log(cursorTop, codeEditorContTop, codeEditorContBottom);
    if(cursorLeft >= codeEditorContLeft && cursorLeft >= codeEditorContRight){
        // //console.log(cursorLeft - codeEditorCont.clientWidth + 10 + "px")
        codeEditorCont.scrollLeft = cursorLeft - codeEditorCont.clientWidth + 5;
    } else if(cursorLeft <= codeEditorContLeft && cursorLeft <= codeEditorContRight){
        codeEditorCont.scrollLeft = cursorLeft - 35;
    }

    if(cursorTop <= codeEditorContTop && cursorTop <= codeEditorContBottom){
        codeEditorCont.scrollTop = cursorTop
    } else if (cursorTop >= codeEditorContTop && cursorTop >= codeEditorContBottom){
        codeEditorCont.scrollTop = cursorTop - codeEditorCont.clientHeight + 18.2;
    }

    
}






function removeSelected(ReplaceChar){
    //console.log(lineStart,lineEnd)
    storeCurrentState();
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
    if(topLineInSelected.char < 0){
        topLineInSelected.char = 0;
    }
    if(bottomLineInSelected.char > codeLines[bottomLineInSelected.line-1].innerText.length+1){
        bottomLineInSelected.char = codeLines[bottomLineInSelected.line-1].innerText.length+1;
    }
    //console.log("removing",bottomLineInSelected,topLineInSelected)

    if(codeLines[bottomLineInSelected.line - 1].innerText.length < bottomLineInSelected.char){
        bottomLineInSelected.char = codeLines[bottomLineInSelected.line - 1].innerText.length;
    } else if(topLineInSelected.char < 0){
        topLineInSelected.char = 0;
    }

    let bottomLineUnSelectedText = codeLines[bottomLineInSelected.line - 1].innerText.slice(bottomLineInSelected.char, codeLines[bottomLineInSelected.line - 1].innerText.length);
    let topLineUnselectedText = codeLines[topLineInSelected.line - 1].innerText.slice(0,topLineInSelected.char);
    // //console.log(bottomLineUnSelectedText,topLineUnselectedText)
    codeLines[topLineInSelected.line -1].childNodes[0].innerHTML = "<pre>" + topLineUnselectedText + ReplaceChar + bottomLineUnSelectedText + "</pre>";

    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    
    charNumber = topLineInSelected.char > codeLines[topLineInSelected.line -1].childNodes[0].innerText.length - 1
        ? codeLines[topLineInSelected.line -1].childNodes[0].innerText.length + 2 : topLineInSelected.char + 1 + ReplaceChar.length;
    lineNumber = topLineInSelected.line;
    cursor.style.left = (charNumber-1)*charSize + 35  + "px";
    cursor.style.top = (lineNumber-1)*lineHeight  + "px";

    // for(let i = topLineInSelected.line + 1; i<= bottomLineInSelected.line; i++){
    //     // //console.log(i);
    //     removeLine(i);
    // }
    let numberOfLines = bottomLineInSelected.line - topLineInSelected.line;
    while(numberOfLines > 0){
        removeLine(topLineInSelected.line+1)
        numberOfLines = numberOfLines -1 ;
    }

    let input = document.getElementById('code_editor_cursor_input');
    input.focus();
    textSelectionInProgress = false;
}

function deselectText(){
    let SelectedLines  = document.querySelectorAll(".background_selected_text");
    SelectedLines.forEach((line) => {
        line.classList.remove('background_selected_text');
    });
}

function SelectTextByMouse(){
    //console.log("selecting",lineStart,lineEnd)
    let codeLines = document.getElementsByClassName("line");
    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
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
        if(lineStart.char > codeLines[lineStart.line - 1].innerText.length){
            lineStart.char = codeLines[lineStart.line - 1].innerText.length;
        }
        //console.log(lineEnd,lineStart)
        // add the span tag around the text being selected.
        if(lineEnd.char < 0){
            lineEnd.char = 0;
        }
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
    
        
        lineNumber = lineEnd.line > codeLines.length ? codeLines.length : lineEnd.line;
        charNumber = lineEnd.char > codeLines[lineNumber - 1].innerText.length ? codeLines[lineNumber - 1].innerText.length : lineEnd.char + 1 ;
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
        cursor.style.top = (lineNumber-1)*lineHeight  + "px";
    }
    else if(lineStart.line < lineEnd.line) {
        // add the span tag around the text being selected.
        if(lineEnd.line > codeLines.length){
            lineEnd.line = codeLines.length;
        }
        if(lineEnd.char > codeLines[lineEnd.line - 1].innerText.length){
            lineEnd.char = codeLines[lineEnd.line - 1].innerText.length;
        }
        if(lineStart.char < 0){
            lineStart.char = 0;
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
        lineNumber = lineEnd.line > codeLines.length ? codeLines.length : lineEnd.line; 
        charNumber = lineEnd.char > codeLines[lineNumber - 1].innerText.length ? codeLines[lineNumber - 1].innerText.length : lineEnd.char + 1;
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
        cursor.style.top = (lineNumber-1)*lineHeight  + "px";
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

        lineNumber = lineEnd.line > codeLines.length ? codeLines.length : lineEnd.line; 
        charNumber = lineEnd.char > codeLines[lineNumber - 1].innerText.length ? codeLines[lineNumber - 1].innerText.length : lineEnd.char + 1 ;
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
        cursor.style.top = (lineNumber-1)*lineHeight  + "px";
    }

    let input = document.getElementById('code_editor_cursor_input');
    input.focus();
    focusOnCursor();
    textSelectionInProgress = true;
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
// // //console.log(lines)
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
    textSelectionInProgress = false;
    deselectText();

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
let codeEditorAutoScrollX;
let codeEditorAutoScrollY;
window.addEventListener("mouseup",(e) =>{
    mouseDown = false;
    clearInterval(codeEditorAutoScrollX);
    clearInterval(codeEditorAutoScrollY)
});

window.onload = ()=>{
    let input = document.getElementById('code_editor_cursor_input');
    input.focus();
}

window.addEventListener("mousemove",(e) => {
    if(mouseDown && drag){
        let codeEditorCont = document.getElementById("code-editor-cont");
        // //console.log(codeEditorCont.offsetLeft);
        let codeEditorContTop = codeEditorCont.offsetTop;
        let codeEditorContBottom = codeEditorCont.offsetTop + codeEditorCont.clientHeight;
        let codeEditorContLeft = codeEditorCont.offsetLeft;
        let codeEditorContRight = codeEditorCont.offsetLeft + codeEditorCont.clientWidth;
        let codeLines = document.getElementsByClassName("line");
        if(e.clientX > codeEditorContRight){
            clearInterval(codeEditorAutoScrollX);
            clearInterval(codeEditorAutoScrollY)
            codeEditorAutoScrollX = setInterval(()=>{
                codeEditorCont.scrollLeft = codeEditorCont.scrollLeft + 10;
                let noOfCharTobeSelected = Math.floor(10/charSize);
                if(lineEnd.char <= codeLines[lineEnd.line -1].innerText.length){
                    lineEnd.char = lineEnd.char + noOfCharTobeSelected ;
                    SelectTextByMouse();
                }   
                
                
            },10);
            
        }
        if(e.clientX < codeEditorContLeft){
            clearInterval(codeEditorAutoScrollX);
            clearInterval(codeEditorAutoScrollY);
            codeEditorAutoScrollX = setInterval(()=>{
                codeEditorCont.scrollLeft = codeEditorCont.scrollLeft - 10;
                let noOfCharTobeSelected = Math.floor(10/charSize);
                //console.log(lineEnd.char)
                if(lineEnd.char >= 0){
                    lineEnd.char = lineEnd.char - noOfCharTobeSelected;
                    SelectTextByMouse();
                }   
                
            },10);
            
        }
        if(e.clientY > codeEditorContBottom){
            clearInterval(codeEditorAutoScrollX);
            clearInterval(codeEditorAutoScrollY);

            codeEditorAutoScrollY = setInterval(() => {
                codeEditorCont.scrollTop = codeEditorCont.scrollTop + (18.2);
                let noOfLinesSelected = 1;
                if(lineEnd.line <= codeLines.length){
                    lineEnd.line = lineEnd.line + 1;
                    SelectTextByMouse();
                }

            },100);
            // //console.log("moving down");
        }
        if(e.clientY < codeEditorContTop){
            clearInterval(codeEditorAutoScrollX);
            clearInterval(codeEditorAutoScrollY);
            // //console.log("moving up")

            codeEditorAutoScrollY = setInterval(() => {
                codeEditorCont.scrollTop = codeEditorCont.scrollTop - (18.2);
                let noOfLinesSelected = 1;
                if(lineEnd.line > 1){
                    lineEnd.line = lineEnd.line - 1;
                    SelectTextByMouse();
                }

            },100);
        }
    }
});

codeEditor.addEventListener("mouseup",(e)=>{
    mouseDown = false;
    clearInterval(codeEditorAutoScrollX);
    clearInterval(codeEditorAutoScrollY);
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
    clearInterval(codeEditorAutoScrollX);
    clearInterval(codeEditorAutoScrollY)
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

            //console.log(lineEnd)
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
        if(!(codeEditor.clientWidth == codeEditorContLatest.scrollWidth)){
            codeEditor.style.width = codeEditorContLatest.scrollWidth+"px";
        }
        
    },500)
    
});

function handleInputChange(e){
    e.preventDefault();
    textSelectionInProgress = false;
    // //console.log(drag,e.data);
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
    focusOnCursor();
    
}



let textInputBox = document.getElementById("code_editor_cursor_input");
textInputBox.addEventListener("blur",()=>{
    console.log('inside event')
    document.getElementsByClassName('code_editor_cursor')[0].style.width = "0px";
});
textInputBox.addEventListener("focus",()=>{
    console.log('inside event')
    document.getElementsByClassName('code_editor_cursor')[0].style.width = "1px";
});
textInputBox.addEventListener("keydown",(e)=>{
    //console.log(e)
    if(e.key == "Enter"){
        createNewLine();
    } else if(e.key == "Backspace"){
        deleteCurrentLineOrLeftText();
    } else if(e.key == "Delete"){
        deleteNextLineOrRightText();
    } else if(e.key == "ArrowUp"){
        if(e.shiftKey){
            e.preventDefault();
            cursorNavigationSelectUp();
        }else {
            cursorNavigationUp();
        }
        
    } else if(e.key == "ArrowDown"){
        if(e.shiftKey){
            e.preventDefault();
            cursorNavigationSelectDown();
        }else {
            cursorNavigationDowm();
        }
        
    } else if(e.key == "ArrowLeft"){
        if(e.shiftKey){
            cursorNavigationSelectLeft();
        }else {
            cursorNavigationLeft(e);
        }
        
    } else if(e.key == "ArrowRight"){
        if(e.shiftKey){
            cursorNavigationSelectRight();
        }else {
            cursorNavigationRight();
        }
        
    } else if(e.key == "c" || e.key == "C"){
        
        if(e.ctrlKey){
            e.preventDefault();
            // we need to copy selected text
            copySelectedText();
        }
    } else if(e.key == "v" || e.key == "V"){
        
        if(e.ctrlKey){
            e.preventDefault();
            pasteCopiedText();
        }
    } else if(e.key == "z" || e.key == "Z"){
        
        if(e.ctrlKey){
            e.preventDefault();
            // we need to undo 
            performUndo();
        }
    } else if(e.key == "y" || e.key == "Y"){
        if(e.ctrlKey){
            e.preventDefault();
            performRedo();
        }
    } else if(e.key == "a" || e.key == "A"){
        if(e.ctrlKey){
            e.preventDefault();
            selectAllText();
        }
    }
});

function createNewLine(){
    storeCurrentState();
    textSelectionInProgress = false;
    if(drag){
        let codeLines = document.getElementsByClassName("line");

        let topLineInSelected = lineStart.line > lineEnd.line ?
         lineEnd : (lineStart.line == lineEnd.line ? (lineStart.char > lineEnd.char ? lineEnd : lineStart) : lineStart);
        let bottomLineInSelected =  lineStart.line > lineEnd.line ? 
            lineStart :(lineStart.line == lineEnd.line ? (lineStart.char > lineEnd.char ? lineStart : lineEnd) : lineEnd)  ;

        if(bottomLineInSelected.line > codeLines.length){
            bottomLineInSelected.line = codeLines.length;
        } 
        if(topLineInSelected.line < 1){
            topLineInSelected.line = 1;
        }
        
        let activeline = document.getElementsByClassName("text")[topLineInSelected.line - 1];
        let textVal = activeline.innerText;
        
        

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
        
        removeSelected("");

        // creating new text line
        let codeLineDiv = document.createElement('div');
        codeLineDiv.classList.add('line');
        let codeTextDiv = document.createElement('div');
        codeTextDiv.classList.add("text");
        let codeTextP = document.createElement('pre');
        //console.log(codeLines[lineNumber - 1].innerText.slice(charNumber - 1))
        codeTextP.innerText =  codeLines[lineNumber - 1].innerText.slice(charNumber - 1);

        codeTextDiv.append(codeTextP);
        codeLineDiv.append(codeTextDiv);

        let codeLinesCont = document.getElementsByClassName('code_editor_lines_container')[0];

        codeLinesCont.insertBefore(codeLineDiv,codeLines[lineNumber]);
        
        lineNumber = lineNumber + 1;
        // change cursor position
        let cursor = document.getElementsByClassName('code_editor_cursor')[0];
        //console.log(lineNumber,(lineNumber-1)*lineHeight)
        cursor.style.top = (lineNumber-1)*lineHeight  + "px";
        cursor.style.left = 35  + "px";
        charNumber = 1;

        if(textVal.slice(0,topLineInSelected.char)){
            //console.log(textVal.slice(0,topLineInSelected.char))
            activeline.innerHTML = "<pre>" + textVal.slice(0,topLineInSelected.char) + "</pre>";
        } else {
            activeline.innerHTML = "<pre>" + "&#8203;" + "</pre>";
        }
        focusOnCursor();

        drag=false;
    } else {
        // removing any text that was to the right of cursor after enter was pressed.
        let activeline = document.getElementsByClassName("text")[lineNumber - 1];
        let textVal = activeline.innerText;
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
        codeTextP.innerText =  (charNumber > textVal.length) ? "" : textVal.slice(charNumber-1);

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

        focusOnCursor();
    }

}

function deleteCurrentLineOrLeftText(){
    textSelectionInProgress = false
    let activeline = document.getElementsByClassName("text")[lineNumber - 1];
    let textVal = activeline.innerText;
    if(drag){
        removeSelected("");
        drag = false;
    } else {
        // Removing the number line number and line along with text
        if(charNumber == 1 && lineNumber != 1){
            storeCurrentState();
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
    focusOnCursor()
    
}

function deleteNextLineOrRightText(){
    textSelectionInProgress =false;
    let activeline = document.getElementsByClassName("text")[lineNumber - 1];
    let textVal = activeline.innerText;
    let codeLines = document.getElementsByClassName("line");

    if(drag){
        //console.log('inside drag')
        removeSelected("");
        drag = false;
    } else {
        if((!(textVal.length) || charNumber == textVal.length+1) && lineNumber != codeLines.length){
            storeCurrentState();
            let nextLineText = codeLines[lineNumber].innerText;
            removeLine(lineNumber+1);
            // copying any text the next line had and adding it to active line 
            activeline.innerHTML = "<pre>" + textVal + nextLineText + "</pre>";
    
            
        } else {
            // removing text from right  side
            activeline.innerHTML ="<pre>" + textVal.slice(0,charNumber-1) + textVal.slice(charNumber) + "</pre>";
        }
    }
    focusOnCursor()
    
}

function cursorNavigationUp(){
    deselectText();
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
    textSelectionInProgress = false
    focusOnCursor();
}
function cursorNavigationDowm(){
    deselectText();
    textSelectionInProgress = false
    let codeLines = document.getElementsByClassName("line");
    let numberLines = document.getElementsByClassName('number_line');
    if(lineNumber < numberLines.length -1){
        let cursor = document.getElementsByClassName('code_editor_cursor')[0];
        cursor.style.top = (lineNumber)*lineHeight +"px";
        
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
        lineNumber = lineNumber + 1;
    }
    focusOnCursor();
}

function cursorNavigationLeft(e){
    deselectText();
    textSelectionInProgress = false
    let codeLines = document.getElementsByClassName("line");
    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    

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

    focusOnCursor();
    
    
}

function cursorNavigationRight(){
    deselectText();
    textSelectionInProgress = false
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
    focusOnCursor();
}

async function copySelectedText(){
    let selectedLines = document.getElementsByClassName("background_selected_text");
    let textToBeCopied = "";
    for(let i =0; i<selectedLines.length;i++){
        if(selectedLines[i].innerText == "\u200B"){
            textToBeCopied +=  "\n" ;
        } else{
            textToBeCopied +=  selectedLines[i].innerText + "\n" ;
        }
    }
    //console.log(textToBeCopied);
    await navigator.clipboard.writeText(textToBeCopied);
}

async function pasteCopiedText(){
    storeCurrentState();
    textSelectionInProgress = false;
    let codeLines = document.getElementsByClassName("line");
    let selectedLines = document.getElementsByClassName("background_selected_text");
    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    if(selectedLines.length){
        removeSelected("");
    }
    let copiedText = await navigator.clipboard.readText();
    
    // splitting copied text at line break so i can insert it into different lines.
    let copiedTextArray = copiedText.split("\n");
    // remove the last empty character element because one \n will be in the end resulting in empty element
    // if array has no elements that means nothing has been copied
    if(!copiedTextArray.length){
        return;
    }
    console.log(copiedText,copiedTextArray)
    // for single line copy adding the text at the position of cursor;
    //console.log(copiedTextArray)
    if(copiedTextArray.length == 1){
        if(copiedTextArray[0] == "\n"){
            return;
        }
        let beforeCursorText =codeLines[lineNumber -1].innerText.slice(0,charNumber-1);
        let afterCursorText = codeLines[lineNumber - 1].innerText.slice(charNumber - 1, codeLines[lineNumber - 1].innerText.length);
        codeLines[lineNumber-1].childNodes[0].innerHTML = "<pre>" + beforeCursorText + copiedTextArray[0].replaceAll('\r','') + afterCursorText + "</pre>"
        charNumber = beforeCursorText.length + copiedTextArray[0].length + 1;
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
        
    } else {
        if(copiedTextArray[copiedTextArray.length] == "\n" || copiedTextArray[copiedTextArray.length] == ""){
            copiedTextArray.pop();
        }
        let beforeCursorText =codeLines[lineNumber -1].innerText.slice(0,charNumber-1);
        let afterCursorText = codeLines[lineNumber - 1].innerText.slice(charNumber - 1, codeLines[lineNumber - 1].innerText.length);
        // adding first line of copied text along with text before the cursor into first line
        codeLines[lineNumber-1].childNodes[0].innerHTML = "<pre>" + beforeCursorText + copiedTextArray[0].replaceAll('\r','') + "</pre>";
        // creating new new lines and adding copied text into the lines until last second line
        let numberLineCont = document.getElementsByClassName('number_line_cont')[0];
        let numberLines = document.getElementsByClassName('number_line');
        let codeLinesCont = document.getElementsByClassName('code_editor_lines_container')[0];
        for(let i = 1; i<copiedTextArray.length -1; i++){
            // create a new number in number line
            
            let numberLine = document.createElement('div');
            numberLine.classList.add("number_line");
            let numberLineP = document.createElement('pre');
            // because the number in HTML starts from 0. we just make the next line value to length
            numberLineP.innerText = numberLines.length;
            numberLine.append(numberLineP);
            numberLineCont.appendChild(numberLine);

            // creating new text line
            
            let codeLineDiv = document.createElement('div');
            codeLineDiv.classList.add('line');
            let codeTextDiv = document.createElement('div');
            codeTextDiv.classList.add("text");
            let codeTextP = document.createElement('pre');
            codeTextP.innerText =  copiedTextArray[i].replaceAll('\r','');

            codeTextDiv.append(codeTextP);
            codeLineDiv.append(codeTextDiv);

            
            codeLinesCont.insertBefore(codeLineDiv,codeLines[lineNumber])
            lineNumber = lineNumber + 1;
        }

        // create a new number in number line
            
        let numberLine = document.createElement('div');
        numberLine.classList.add("number_line");
        let numberLineP = document.createElement('pre');
        // because the number in HTML starts from 0. we just make the next line value to length
        numberLineP.innerText = numberLines.length;
        numberLine.append(numberLineP);
        numberLineCont.appendChild(numberLine);

        // creating new text line
        
        let codeLineDiv = document.createElement('div');
        codeLineDiv.classList.add('line');
        let codeTextDiv = document.createElement('div');
        codeTextDiv.classList.add("text");
        let codeTextP = document.createElement('pre');
        codeTextP.innerText =  copiedTextArray[copiedTextArray.length - 1].replaceAll('\r','') + afterCursorText;

        codeTextDiv.append(codeTextP);
        codeLineDiv.append(codeTextDiv);


        codeLinesCont.insertBefore(codeLineDiv,codeLines[lineNumber])
        lineNumber = lineNumber + 1;
        let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    
        charNumber = copiedTextArray[copiedTextArray.length - 1].length;
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
        cursor.style.top = (lineNumber-1)*lineHeight  + "px";

    }
    focusOnCursor();

    
    
    //  creating final line adding last line of copied text along with text that was after the cursor in first line.

}

let undoStore = [];
let redoStore = []

function performUndo(){
    textSelectionInProgress = false;
    let codeLinesCont = document.getElementsByClassName("code_editor_lines_container")[0];
    let numberLineCont = document.getElementsByClassName("number_line_cont")[0];
    if(undoStore.length){    
        redoStore.push({
            lineNumber:lineNumber,
            charNumber:charNumber,
            lineEnd:lineEnd,
            lineStart:lineStart,
            data:codeLinesCont.innerHTML,
            numberLineData:numberLineCont.innerHTML
        });
        if(undoStore.length){
            lineNumber = undoStore[undoStore.length - 1].lineNumber;
            charNumber = undoStore[undoStore.length - 1].charNumber;
            lineEnd = undoStore[undoStore.length - 1].lineEnd;
            lineStart = undoStore[undoStore.length - 1].lineStart;
            codeLinesCont.innerHTML = undoStore[undoStore.length - 1].data;
            numberLineCont.innerHTML = undoStore[undoStore.length - 1].numberLineData;
            let cursor = document.getElementsByClassName('code_editor_cursor')[0];
            cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            cursor.style.top = (lineNumber-1)*lineHeight  + "px";
        }
        
        undoStore.pop();
        focusOnCursor();
    }
}

function performRedo(){
    textSelectionInProgress = false;
    let codeLinesCont = document.getElementsByClassName("code_editor_lines_container")[0];
    let numberLineCont = document.getElementsByClassName("number_line_cont")[0];
    if(redoStore.length){    
        undoStore.push({
            lineNumber:lineNumber,
            charNumber:charNumber,
            lineEnd:lineEnd,
            lineStart:lineStart,
            data:codeLinesCont.innerHTML,
            numberLineData:numberLineCont.innerHTML
        });
        if(redoStore.length){
            lineNumber = redoStore[redoStore.length - 1].lineNumber;
            charNumber = redoStore[redoStore.length - 1].charNumber;
            lineEnd = redoStore[redoStore.length - 1].lineEnd;
            lineStart = redoStore[redoStore.length - 1].lineStart;
            codeLinesCont.innerHTML = redoStore[redoStore.length - 1].data;
            numberLineCont.innerHTML = redoStore[redoStore.length - 1].numberLineData;
            let cursor = document.getElementsByClassName('code_editor_cursor')[0];
            cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            cursor.style.top = (lineNumber-1)*lineHeight  + "px";
        }

        redoStore.pop();
        focusOnCursor();
    }
    
    
}

function storeCurrentState(){
    let codeLinesCont = document.getElementsByClassName("code_editor_lines_container")[0];
    let numberLineCont = document.getElementsByClassName("number_line_cont")[0];
    redoStore = [];
    if(undoStore.length > 20){
        undoStore.shift();
        undoStore.push({
            lineNumber:lineNumber,
            charNumber:charNumber,
            lineEnd:lineEnd,
            lineStart:lineStart,
            data:codeLinesCont.innerHTML,
            numberLineData:numberLineCont.innerHTML
        })
    } else {
        undoStore.push({
            lineNumber:lineNumber,
            charNumber:charNumber,
            lineEnd:lineEnd,
            lineStart:lineStart,
            data:codeLinesCont.innerHTML,
            numberLineData:numberLineCont.innerHTML
        });
    }     
}

function cursorNavigationSelectUp(){
    let codeLines = document.getElementsByClassName("line");
    
    if(lineNumber != 1){
        let cursor = document.getElementsByClassName('code_editor_cursor')[0];
        cursor.style.top = (lineNumber - 2)*lineHeight +"px";
        if(textSelectionInProgress){
            lineEnd.line = lineEnd.line - 1
        } else {
            lineStart={
                line : lineNumber,
                char:charNumber - 1 
            }
            lineEnd={
                line : lineNumber - 1,
                char:charNumber - 1
            }
            textSelectionInProgress = true;
        }
        lineNumber = lineNumber - 1;
        if(charNumber > codeLines[lineNumber-1].innerText.length ){
            // if innerText is ZeroWidthSpace then cursor should be at the beginning
            if(codeLines[lineNumber-1].innerText == "\u200B"){
                charNumber = 1;
                lineEnd.char = 1;
                cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            } else {
                charNumber = codeLines[lineNumber-1].innerText.length + 1;
                lineEnd.char = codeLines[lineNumber-1].innerText.length ;
                cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            }
           
        }
        console.log(lineNumber)
        drag = true;
        focusOnCursor();
        SelectTextByMouse();
        console.log(lineNumber)
    }
    
}

function cursorNavigationSelectDown(){
    
    let codeLines = document.getElementsByClassName("line");
    let numberLines = document.getElementsByClassName('number_line');
    console.log('working',numberLines.length, lineNumber)
    if(lineNumber < numberLines.length -1){
        
        let cursor = document.getElementsByClassName('code_editor_cursor')[0];
        cursor.style.top = (lineNumber)*lineHeight +"px";
        if(textSelectionInProgress){
            lineEnd.line = lineEnd.line + 1
        } else {
            lineStart={
                line : lineNumber,
                char:charNumber - 1 
            }
            lineEnd={
                line : lineNumber + 1,
                char:charNumber - 1
            }
            textSelectionInProgress = true;
        }
        if(lineNumber < codeLines.length && charNumber > codeLines[lineNumber].innerText.length ){
            // if innerText is ZeroWidthSpace then cursor should be at the beginning
            if(codeLines[lineNumber].innerText == "\u200B"){
                charNumber = 1;
                lineEnd.char = 0;
                cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            } else {
                charNumber = codeLines[lineNumber].innerText.length + 1;
                lineEnd.char = codeLines[lineNumber].innerText.length;
                cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            }            
        }
        lineNumber = lineNumber + 1;
        drag = true;
        focusOnCursor();
        SelectTextByMouse();
    }   
    
}
function cursorNavigationSelectRight(){
    let codeLines = document.getElementsByClassName("line");
    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    if(charNumber <= codeLines[lineNumber-1].innerText.length){
        if(!textSelectionInProgress){
            lineStart={
                line : lineNumber,
                char:charNumber - 1 
            }
            lineEnd={
                line : lineNumber,
                char:charNumber - 1
            }
            textSelectionInProgress = true;
        }
        if(codeLines[lineNumber-1].innerText == "\u200B" && lineNumber != codeLines.length) {
            charNumber = 1;
            lineEnd.char = 1;
            lineNumber = lineNumber + 1;
            lineEnd.line = lineEnd.line + 1;
            cursor.style.left = (charNumber-1)*charSize + 35  + "px";
            cursor.style.top = (lineNumber-1)*lineHeight +"px";
        } else {
            charNumber = charNumber + 1;
            lineEnd.char = lineEnd.char + 1;
            cursor.style.left = (charNumber-1)*charSize + 35  + "px";
        }
       
    } else if(charNumber == codeLines[lineNumber-1].innerText.length+1 && lineNumber != codeLines.length){
        charNumber = 1;
        lineEnd.char = 1;
        lineNumber = lineNumber + 1;
        lineEnd.line = lineEnd.line + 1;
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
        cursor.style.top = (lineNumber-1)*lineHeight +"px";
    }
    drag = true;
    focusOnCursor();
    SelectTextByMouse();
}
function cursorNavigationSelectLeft(){
    let codeLines = document.getElementsByClassName("line");
    let cursor = document.getElementsByClassName('code_editor_cursor')[0];
    if(!textSelectionInProgress){
        lineStart={
            line : lineNumber,
            char:charNumber - 1 
        }
        lineEnd={
            line : lineNumber,
            char:charNumber - 1
        }
        textSelectionInProgress = true;
    }
    if(charNumber > 1){
        charNumber = charNumber - 1;
        lineEnd.char = charNumber - 1;
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
    } else if(charNumber == 1 && lineNumber != 1){
        if(codeLines[lineNumber-2].innerText == "\u200B"){
            charNumber = 1;
            lineEnd.char = 1;
        } else {
            charNumber = codeLines[lineNumber-2].innerText.length + 1;
            lineEnd.char = codeLines[lineNumber-2].innerText.length;
        }        
        lineNumber = lineNumber - 1;
        lineEnd.line = lineEnd.line - 1;
        cursor.style.left = (charNumber-1)*charSize + 35  + "px";
        cursor.style.top = (lineNumber-1)*lineHeight +"px";
    }

    drag = true;
    focusOnCursor();
    SelectTextByMouse();
}

function selectAllText(){
    let codeLines = document.getElementsByClassName("line");
    for(let i=0;i<codeLines.length;i++){
        let textCont = codeLines[i].childNodes[0].childNodes[0];
        textCont.classList.add("background_selected_text");
    }
    
    lineStart = {
        line:1,
        char:0,
    };
    lineEnd = {
        line:codeLines.length,
        char:codeLines[codeLines.length - 1].innerText.length
    }
    drag = true;
}
