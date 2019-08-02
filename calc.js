var lastOperatorUsed = '';
var math = '';
var errorStatus = false;
var signStatus = false;
var noteSign = false;
var initial = true;
var memory = 0;
var newNumOld = 0;
var memTriggered = false;
var mathOperator = false;
var result;
var newNum;
var oldNum = 0;
var firstTime = true;

function buttonPushed(button) {                               //runs every time when you push a button
  if (result == undefined && button != 'ON') {
    return;
  } 
  onInitialBoot();
  if (errorStatus && button != 'ON')  return;                   // if error is true, you can't do anything unless if you clear (ON/C)
  if (typeof button != 'string') {                                                          //number
    if (lastOperatorUsed == '=' && typeof button != 'string') {
      result = '';
      lastOperatorUsed = '';
    }
    if (memTriggered) {
      result = '';
      memTriggered = false;
    }
    if (result == undefined || result === 0) { 
      result = "" + button;
    } else if (math == '%') {
      result = '' + button;
      oldNum = 0; newNum = 0; lastOperatorUsed = '';
      math = '';
    } else if (lastOperatorUsed == 'MRC') {
      result = '' + button;
      lastOperatorUsed = '';
    } else if (lastOperatorUsed == '√') {
      result = '' + button;
      oldNum = 0;
      lastOperatorUsed = '';
    } else {
      if (result == '0') {
        result = '' + button;
      } else {
        result += button;
      }
    }
    newNum = parseFloat(result);
  } else if (!initial) {                                                                     // string
    if (button == '♪') {
      buttonNote();
      return;
    } else if (button == 'M+') {      // M+
      if (result == 0) { 
        display(result);
        return;
      }
      memoryLit('memLit', 'memory');
      math = '';
      memTriggered = true;
      compute('M+');
    } else if (button == 'M-') {      // M-
      memTriggered = true;
      math = '';
      compute('M-');
    } else if (button == 'MRC') {       // Memory Recall (MRC)
      checkLastOperator(button);
      compute(button);
    } else if (button == 'ON') {       // ON/C
      clearONC();
    } else if (button == '%') {       // Percentage %
      checkLastOperator(button);
      compute(button);
    } else if (button == '+-') {       // Plus/Minus +-      
      if (newNum != 0) {
        newNum = newNum * -1;
        result = '' + newNum;
      } else {
        oldNum = oldNum * -1;
        result = '' + oldNum;
      }
    } else if (button == '+') {       // Plus + 
      mathOperatorLit('plusLit', '+');    
      mathOperator = true;
      checkLastOperator(button);
      compute(button);
    } else if (button == '-') {       // Minus - 
      mathOperatorLit('minusLit', '-'); 
      mathOperator = true;
      checkLastOperator(button);
      compute(button);           
    } else if (button == 'x') {       // Multiplication x 
      mathOperatorLit('multiLit', 'x');
      mathOperator = true;
      checkLastOperator(button);
      compute(button);
    } else if (button == '÷') {       // Division ÷
      mathOperatorLit('divLit', '÷');
      mathOperator = true;
      checkLastOperator(button);
      compute(button);
    } else if (button == '√') {       // Squareroot √
      mathOperator = false;
      checkLastOperator(button);
      compute(button);
    } else if (button == '.') {       // dot/period
      if (result.includes(".")) return;   //checks if dot is already part of display
      dotLit(button);
      if (result != 0) {
        result += button;
      } else {
        result = '' + button;
      }  
    } else if (button == '=') {       // Equals =
      if (math != '') {
        checkLastOperator(button);
        mathOperatorOff();
        compute(button);
      } else {
        if (newNum != 0) oldNum = newNum;
      }
      newNumOld = newNum;
      newNum = 0;
    }
  }  
  if (errorStatus)  return; 
  checkResult(result);
  display(result);
  if (initial) result = '';
  initial = false;
  if (mathOperator) {result = ''; mathOperator = false;}
}
function displayAll() {
  document.getElementById("plusLit").innerHTML = '+';
  document.getElementById("minusLit").innerHTML = '-';
  document.getElementById("multiLit").innerHTML = 'x';
  document.getElementById("divLit").innerHTML = '÷';
  document.getElementById("calcLCD").innerHTML = '88888888888';
  document.getElementById("dotLit").innerHTML = '.';
  document.getElementById("errorLit").innerHTML = 'error';
  document.getElementById("memLit").innerHTML = 'memory';
  document.getElementById("noteLit").innerHTML = '♪';
  setTimeout(function() {
    document.getElementById("plusLit").innerHTML = '';
    document.getElementById("minusLit").innerHTML = '';
    document.getElementById("multiLit").innerHTML = '';
    document.getElementById("divLit").innerHTML = '';
    document.getElementById("calcLCD").innerHTML = '0';
    document.getElementById("dotLit").innerHTML = '.';
    document.getElementById("errorLit").innerHTML = '';
    document.getElementById("memLit").innerHTML = '';
    document.getElementById("noteLit").innerHTML = '';
    result = '0';
  }, 1000);
}
function onInitialBoot() {
  if (initial) { 
    buttonSound = document.getElementById('calcSound');
    buttonSound.play(); 
    displayAll();
    document.getElementById("dotLit").innerHTML = '.';
  }
}
function compute(sign) {
  if (sign == 'MRC') {
    result = '' + memory;
    return;
  }
  if (math == '+') {
    tempResult = oldNum + newNum;
    oldNum = tempResult
  } else if (math == '-') {
    tempResult = oldNum - newNum;
    oldNum = tempResult
  } else if (math == 'x') {
    if (newNum == 0) newNum = 1;
    tempResult = oldNum * newNum;
    oldNum = tempResult
  } else if (math == '÷') {
    if (newNum == 0) newNum = 1;
    tempResult = oldNum / newNum;
    oldNum = tempResult
  } else if (math == '√') {
    if (oldNum == undefined) oldNum = 0;
    tempResult = Math.sqrt(oldNum);
    oldNum = tempResult
  } else if (sign == 'M+') {
    if (oldNum == 0) {
      memory += newNum;
      tempResult = newNum
      newNum = 0;
    } else {
      memory += oldNum;
      if (newNum != 0) tempResult = newNum;
      oldNum = 0;
      newNum = 0;
    }
    lastOperatorUsed = '';
  } else if (sign == 'M-') {
    if (oldNum == 0) {
      memory -= newNum;
      tempResult = newNum
      newNum = 0;
    } else {
      memory -= oldNum;
    }
    lastOperatorUsed = '';
  } else if (sign == '%') {
    newNum = newNum / 100;
    tempResult = newNum;
    newNum = 0;
  } else if (sign == '=' || sign == '+'  || sign == '-' || sign == 'x' || sign == '÷' && lastOperatorUsed == '%') {
    tempResult = oldNum * newNum;
    newNum = 0; 
  } else {
    tempResult = oldNum;
    newNum = 0;
  }
  if (math != '√') tempResult = Math.round(tempResult*100)/100;
  result = '' + tempResult;
}
function checkLastOperator(button) {                                // checks last operator used, then clears number when number is pressed after equals
  if (lastOperatorUsed == '') {
    math = button;
    if (button == 'MRC') {
      oldNum = memory;
    } else { 
      oldNum = newNum;
    }
    if (button == 'x' || button == '÷') {
      newNum = 1;
    } else {
      newNum = 0;
    }
    lastOperatorUsed = button;
  } else if (lastOperatorUsed != '=' && lastOperatorUsed == button) {
    math = button;
  } else if (lastOperatorUsed != '=' && lastOperatorUsed != '%' && lastOperatorUsed != button && lastOperatorUsed != '√' && button != 'MRC' && button != '%') {
    if (lastOperatorUsed == 'MRC') {
      math = lastOperatorUsed;
      lastOperatorUsed = button;
      oldNum = newNum;
    } else if (math == '÷' && button == '=' && newNum == 0) {
      document.getElementById("errorLit").innerHTML = 'error';
      errorStatus = true;
      return;
    } else {
      math = lastOperatorUsed;
      lastOperatorUsed = button;
    }
  } else if (lastOperatorUsed == '=' && mathOperator) {
    if (oldNum != 0 && newNum != 0) {
      oldNum = newNum;
    }           
    newNum = 0;
    lastOperatorUsed = button;
    math = button;
  } else if (button == 'MRC') {
    if (lastOperatorUsed != '') {
      newNum = memory;
    } else {
      oldNum = memory;
    }
  } else if (lastOperatorUsed == '=' && button == '√') {
    if (math != '+' && math != '-' && math != 'x' && math != '÷') oldNum = newNum;
    math = button;
  } else if (button == '=' || button == '+' || button == '-' || button == 'x' || button == '÷' && lastOperatorUsed == '%') {
    newNum = tempResult;
  } else if (button == '%') {
    mathOperatorLit('multiLit', '');
    math = button;
    lastOperatorUsed = button;
  } else if (lastOperatorUsed == '√') {
    math = button;
    lastOperatorUsed = button;
  
  } else if (lastOperatorUsed == '=' && button == '=') {
    newNum = newNumOld;
  }
}
function checkResult (num) {                                   //checks results length, returns error if more than 10 digits. Also checks if integer is - or +.
  let stringConvert = parseInt(num);
  let numString = '' + stringConvert;
  if (num == undefined) return;     
  let length = numString.length;
  if (length > 10) {
    document.getElementById("errorLit").innerHTML = 'error';
    errorStatus = true;
  }
  result = result.slice(0, 11);
  if (result.includes(".")) {
    document.getElementById("dotLit").innerHTML = ''
  }
}
function checkSign() {                                         //checks if integer is negative
  if (signStatus) {
    newNum = newNum * -1;
  }
}
function display(num) {                                        // Displays results to LCD
  if (num == undefined) return; 
  document.getElementById("calcLCD").innerHTML = '';
  setTimeout(function() {
  document.getElementById("calcLCD").innerHTML = num;
  }, 100);
}
function dotLit(button) {                                     // Turns on/off period/dot
  if (button == '.') {                                         
    document.getElementById("dotLit").innerHTML = '';
  }
}
function buttonNote() {                                        // Lits Note on screen
  if (!noteSign) {
    notesLit('noteLit', '♪')
    noteSign = true;
  } else {
    notesLit('noteLit', '')
    noteSign = false;
  }
}
function mathOperatorLit(id, sign) {                          // This turn on math operators active on screen
  mathOperatorOff();
  document.getElementById(id).innerHTML = sign;
}
function mathOperatorOff() {                                  // Turns off all math operators on screen
  document.getElementById("plusLit").innerHTML = '';
  document.getElementById("minusLit").innerHTML = '';
  document.getElementById("multiLit").innerHTML = '';
  document.getElementById("divLit").innerHTML = '';
}
function memoryLit(id, memSign) {                                // Turns on or off M+ / M-
  document.getElementById("memLit").innerHTML = '';
  document.getElementById(id).innerHTML = memSign;
}
function clearONC() {                                           // Clears everything when ON-C is pressed
  result = '0';
  newNum = 0;
  oldNum = 0;
  math = '';
  memory = 0;
  lastOperatorUsed = '';
  errorStatus = false;
  signStatus = false;
  tempResult = 0;
  exit = true;
  document.getElementById("calcLCD").innerHTML = '0';
  document.getElementById("errorLit").innerHTML = '';
  document.getElementById("dotLit").innerHTML = '.';
  document.getElementById("memLit").innerHTML = '';
  mathOperatorOff();
}
function butClicked(button) {                                   // Function for pressing buttons on calc
  buttonPushed(button); 
  playButton('calcSound');
}
function playButton(audio) {                                    // Beeps when on
  if (errorStatus) return;
  if (noteSign) {
    var buttonSound = document.getElementById(audio);
    buttonSound.play();
  }
}
function notesLit(id, value) {                                  // Turns on/off ♪ 
  document.getElementById(id).innerHTML = value;
}

