//<![CDATA[

//MDH_SCORM modification to support SCORM 1.2 functionality on LMS
/* JavaScript to find the SCORM API if it is available */
/* Based on a model at <http://www.claroline.net/doc/en/index.php/How_do_I_create_SCORM_content%3F> */

var API = null; /* SCORM API */

/* look up through the frameset hierarchy for the SCORM API */
function findAPI(win) {
  while (win.API == null && win.parent != null && win.parent != win) {
    win = win.parent;
  }
  API = win.API;
}

/* initialize the SCORM API */
function initAPI(win) {
  /* look for the SCORM API up in the frameset */
  findAPI(win);

  /* if we still have not found the API, look at the opener and its frameset */
  if (API == null && win.opener != null) {
    findAPI(win.opener);
  }
}

var ScormSubmitted = false; //use this to check whether LMSFinish has been called later.

function ScormStartUp() {
  initAPI(window);
  if (API != null) {
    API.LMSInitialize("");
    API.LMSSetValue("cmi.core.lesson_status", "browsed");
    API.LMSSetValue("cmi.core.score.min", 0);
    API.LMSSetValue("cmi.core.score.max", 100);
    API.LMSCommit("");
  }
}

function CheckLMSFinish() {
  if (API != null) {
    if (ScormSubmitted == false) {
      API.LMSCommit("");
      API.LMSFinish("");
      ScormSubmitted = true;
    }
  }
}

function SetScormIncomplete() {
  if (ScormSubmitted == true) {
    return;
  }
  SetScormScore();
  if (API != null) {
    API.LMSSetValue("cmi.core.lesson_status", "incomplete");
    API.LMSSetValue(
      "cmi.core.session_time",
      MillisecondsToTime(new Date().getTime() - ScormStartTime)
    );
    API.LMSCommit("");
  }
}

function SetScormComplete() {
  if (API != null) {
    API.LMSSetValue(
      "cmi.core.session_time",
      MillisecondsToTime(new Date().getTime() - ScormStartTime)
    );
    API.LMSSetValue("cmi.core.lesson_status", "completed");
    SetScormScore();
    API.LMSCommit("");
    API.LMSFinish("");
    ScormSubmitted = true;
  }
}

var ScormStartTime = new Date().getTime();

var SuspendData = "";

function SetScormTimedOut() {
  if (API != null) {
    if (ScormSubmitted == false) {
      SetScormScore();
      API.LMSSetValue("cmi.core.exit", "time-out");
      API.LMSCommit("");
      CheckLMSFinish();
    }
  }
}

//TIME RENDERING FUNCTION
function MillisecondsToTime(Seconds) {
  Seconds = Math.round(Seconds / 1000);
  var S = Seconds % 60;
  Seconds -= S;
  if (S < 10) {
    S = "0" + S;
  }
  var M = (Seconds / 60) % 60;
  if (M < 10) {
    M = "0" + M;
  }
  var H = Math.floor(Seconds / 3600);
  if (H < 10) {
    H = "0" + H;
  }
  return H + ":" + M + ":" + S;
}

//CODE FOR HANDLING NAV BUTTONS AND FUNCTION BUTTONS

function FocusAButton() {
  if (document.getElementById("CheckButton1") != null) {
    document.getElementById("CheckButton1").focus();
  } else {
    if (document.getElementById("CheckButton2") != null) {
      document.getElementById("CheckButton2").focus();
    } else {
      document.getElementsByTagName("button")[0].focus();
    }
  }
}

//CODE FOR HANDLING DISPLAY OF POPUP FEEDBACK BOX

var topZ = 1000;

function ShowMessage(Feedback) {
  var Output = Feedback + "<br /><br />";
  document.getElementById("FeedbackContent").innerHTML = Output;
  var FDiv = document.getElementById("FeedbackDiv");
  topZ++;
  FDiv.style.zIndex = topZ;
  FDiv.style.top = TopSettingWithScrollOffset(30) + "px";

  FDiv.style.display = "block";

  ShowElements(false, "input");
  ShowElements(false, "select");
  ShowElements(false, "object");
  ShowElements(true, "object", "FeedbackContent");

  //Focus the OK button
  setTimeout("document.getElementById('FeedbackOKButton').focus()", 50);

  //
}

function ShowElements(Show, TagName, ContainerToReverse) {
  // added third argument to allow objects in the feedback box to appear
  //IE bug -- hide all the form elements that will show through the popup
  //FF on Mac bug : doesn't redisplay objects whose visibility is set to visible
  //unless the object's display property is changed

  //get container object (by Id passed in, or use document otherwise)
  TopNode = document.getElementById(ContainerToReverse);
  var Els;
  if (TopNode != null) {
    Els = TopNode.getElementsByTagName(TagName);
  } else {
    Els = document.getElementsByTagName(TagName);
  }

  for (var i = 0; i < Els.length; i++) {
    if (TagName == "object") {
      //manipulate object elements in all browsers
      if (Show == true) {
        Els[i].style.visibility = "visible";
      } else {
        Els[i].style.visibility = "hidden";
      }
    }
  }
}

function HideFeedback() {
  document.getElementById("FeedbackDiv").style.display = "none";
  ShowElements(true, "input");
  ShowElements(true, "select");
  ShowElements(true, "object");
}

//GENERAL UTILITY FUNCTIONS AND VARIABLES

//PAGE DIMENSION FUNCTIONS
function PageDim() {
  //Get the page width and height
  this.W = 600;
  this.H = 400;
  this.W = document.getElementsByTagName("body")[0].offsetWidth;
  this.H = document.getElementsByTagName("body")[0].offsetHeight;
}

var pg = null;

function GetPageXY(El) {
  var XY = { x: 0, y: 0 };
  while (El) {
    XY.x += El.offsetLeft;
    XY.y += El.offsetTop;
    El = El.offsetParent;
  }
  return XY;
}

function GetScrollTop() {
  if (typeof window.pageYOffset == "number") {
    return window.pageYOffset;
  } else {
    if (document.body && document.body.scrollTop) {
      return document.body.scrollTop;
    } else {
      if (document.documentElement && document.documentElement.scrollTop) {
        return document.documentElement.scrollTop;
      } else {
        return 0;
      }
    }
  }
}

function GetViewportHeight() {
  if (typeof window.innerHeight != "undefined") {
    return window.innerHeight;
  } else {
    if (
      typeof document.documentElement != "undefined" &&
      typeof document.documentElement.clientHeight != "undefined" &&
      document.documentElement.clientHeight != 0
    ) {
      return document.documentElement.clientHeight;
    } else {
      return document.getElementsByTagName("body")[0].clientHeight;
    }
  }
}

function TopSettingWithScrollOffset(TopPercent) {
  var T = Math.floor(GetViewportHeight() * (TopPercent / 100));
  return GetScrollTop() + T;
}

//CODE FOR AVOIDING LOSS OF DATA WHEN BACKSPACE KEY INVOKES history.back()
var InTextBox = false;

function SuppressBackspace(e) {
  if (InTextBox == true) {
    return;
  }
  thisKey = e.keyCode;

  var Suppress = false;

  if (thisKey == 8) {
    Suppress = true;
    e.preventDefault();
  }
}

window.addEventListener("keypress", SuppressBackspace, false);

function ReduceItems(InArray, ReduceToSize) {
  var ItemToDump = 0;
  var j = 0;
  while (InArray.length > ReduceToSize) {
    ItemToDump = Math.floor(InArray.length * Math.random());
    InArray.splice(ItemToDump, 1);
  }
}

function Shuffle(InArray) {
  var Num;
  var Temp = new Array();
  var Len = InArray.length;

  var j = Len;

  for (var i = 0; i < Len; i++) {
    Temp[i] = InArray[i];
  }

  for (i = 0; i < Len; i++) {
    Num = Math.floor(j * Math.random());
    InArray[i] = Temp[Num];

    for (var k = Num; k < j - 1; k++) {
      Temp[k] = Temp[k + 1];
    }
    j--;
  }
  return InArray;
}

function WriteToInstructions(Feedback) {
  document.getElementById("InstructionsDiv").innerHTML = Feedback;
}

function EscapeDoubleQuotes(InString) {
  return InString.replace(/"/g, "&quot;");
}

function TrimString(InString) {
  var x = 0;

  if (InString.length != 0) {
    while (
      InString.charAt(InString.length - 1) == "\u0020" ||
      InString.charAt(InString.length - 1) == "\u000A" ||
      InString.charAt(InString.length - 1) == "\u000D"
    ) {
      InString = InString.substring(0, InString.length - 1);
    }

    while (
      InString.charAt(0) == "\u0020" ||
      InString.charAt(0) == "\u000A" ||
      InString.charAt(0) == "\u000D"
    ) {
      InString = InString.substring(1, InString.length);
    }

    while (InString.indexOf("  ") != -1) {
      x = InString.indexOf("  ");
      InString =
        InString.substring(0, x) + InString.substring(x + 1, InString.length);
    }

    return InString;
  } else {
    return "";
  }
}

function FindLongest(InArray) {
  if (InArray.length < 1) {
    return -1;
  }

  var Longest = 0;
  for (var i = 1; i < InArray.length; i++) {
    if (InArray[i].length > InArray[Longest].length) {
      Longest = i;
    }
  }
  return Longest;
}

//SELECTION OBJECT FOR TYPING WITH KEYPAD
var selObj = null;

SelObj = function (box) {
  this.box = box;
  this.selStart = this.box.selectionStart;
  this.selEnd = this.box.selectionEnd;
  this.selText = this.box.value.substring(this.selStart, this.selEnd);
  return this;
};

function setSelText(newText) {
  var caretPos = this.selStart + newText.length;
  var newValue = this.box.value.substring(0, this.selStart);
  newValue += newText;
  newValue += this.box.value.substring(this.selEnd, this.box.value.length);
  this.box.value = newValue;
  this.box.setSelectionRange(caretPos, caretPos);
  this.box.focus();
}
SelObj.prototype.setSelText = setSelText;

function setSelSelectionRange(start, end) {
  this.box.setSelectionRange(start, end);
}
SelObj.prototype.setSelSelectionRange = setSelSelectionRange;

//UNICODE CHARACTER FUNCTIONS
function IsCombiningDiacritic(CharNum) {
  var Result =
    (CharNum >= 0x0300 && CharNum <= 0x370) ||
    (CharNum >= 0x20d0 && CharNum <= 0x20ff);
  Result =
    Result ||
    (CharNum >= 0x3099 && CharNum <= 0x309a) ||
    (CharNum >= 0xfe20 && CharNum <= 0xfe23);
  return Result;
}

function IsCJK(CharNum) {
  return CharNum >= 0x3000 && CharNum < 0xd800;
}

//SETUP FUNCTIONS
//BROWSER WILL REFILL TEXT BOXES FROM CACHE IF NOT PREVENTED
function ClearTextBoxes() {
  var NList = document.getElementsByTagName("input");
  for (var i = 0; i < NList.length; i++) {
    if (NList[i].id.indexOf("Guess") > -1 || NList[i].id.indexOf("Gap") > -1) {
      NList[i].value = "";
    }
    if (NList[i].id.indexOf("Chk") > -1) {
      NList[i].checked = "";
    }
  }
}

//JCROSS-SPECIFIC SCORM-RELATED JAVASCRIPT CODE

function SetScormScore() {
  //Reports the current score and any other information back to the LMS
  if (API != null) {
    API.LMSSetValue("cmi.core.score.raw", Score);

    //Now send a detailed reports on the item
    var ItemLabel = "Crossword";
    API.LMSSetValue("cmi.objectives.0.id", "obj" + ItemLabel);
    API.LMSSetValue("cmi.interactions.0.id", "int" + ItemLabel);
    if (Finished == true) {
      API.LMSSetValue("cmi.objectives.0.status", "completed");
    } else {
      API.LMSSetValue("cmi.objectives.0.status", "incomplete");
    }
    API.LMSSetValue("cmi.objectives.0.score.min", "0");
    API.LMSSetValue("cmi.objectives.0.score.max", "100");
    API.LMSSetValue("cmi.objectives.0.score.raw", Score);
    //We're not sending any student response data, so we can set this to a non-standard value
    API.LMSSetValue("cmi.interactions.0.type", "crossword");

    API.LMSCommit("");
  }
}

//JCROSS CORE JAVASCRIPT CODE

var InGap = false;
var CurrentBox = null;
var Feedback = "";
var AcrossCaption = "";
var DownCaption = "";
var Correct = "Correct! Well done.";
var Incorrect =
  "Some of your answers are incorrect. Incorrect squares have been blanked out.";
var GiveHint = "A correct letter has been added.";
var YourScoreIs = "Your score is ";
var BuiltGrid = "";
var BuiltExercise = "";
var Penalties = 0;
var Score = 0;
var InTextBox = false;
var Locked = false;
var TimeOver = false;
var CaseSensitive = false;

var InputStuff =
  '<form method="post" action="" onsubmit="return false;"><span class="ClueNum">[strClueNum]: </span>';
InputStuff +=
  '[strClue] <input autocomplete="off" onfocus="CurrentBox=this;InTextBox=true;" onblur="InTextBox=false;" id="[strBoxId]" type="edit" size="[strEditSize]" maxlength="[strMaxLength]"></input>';
InputStuff +=
  '<button class="FuncButton" onclick="EnterGuess([strParams])">Enter</button>';
InputStuff += "";
InputStuff += "</form>";

var CurrBoxElement = null;
var Finished = false;

function StartUp() {
  //Show a keypad if there is one	(added bugfix for 6.0.4.12)
  if (document.getElementById("CharacterKeypad") != null) {
    document.getElementById("CharacterKeypad").style.display = "block";
  }

  ScormStartUp();

  AcrossCaption = document.getElementById("CluesAcrossLabel").innerHTML;
  DownCaption = document.getElementById("CluesDownLabel").innerHTML;
}

function GetAnswerLength(Across, x, y) {
  Result = 0;
  if (Across == false) {
    while (x < L.length && L[x][y].length > 0) {
      Result += L[x][y].length;
      x++;
    }
    return Result;
  } else {
    while (y < L[x].length && L[x][y].length > 0) {
      Result += L[x][y].length;
      y++;
    }
    return Result;
  }
}

function GetEditSize(Across, x, y) {
  var Len = GetAnswerLength(Across, x, y);
  if (IsCJK(L[x][y].charCodeAt(0))) {
    Len *= 2;
  }
  return Len;
}

function ShowClue(ClueNum, x, y) {
  var Result = "";
  var Temp;
  var strParams;
  var Clue = document.getElementById("Clue_A_" + ClueNum);
  if (Clue != null) {
    Temp = InputStuff.replace(/\[ClueNum\]/g, ClueNum);
    Temp = Temp.replace(/\[strClueNum\]/g, AcrossCaption + " " + ClueNum);
    strParams = "true," + ClueNum + "," + x + "," + y + ",'[strBoxId]'";
    Temp = Temp.replace(/\[strParams\]/g, strParams);
    Temp = Temp.replace(/\[strBoxId\]/g, "GA_" + ClueNum + "_" + x + "_" + y);
    Temp = Temp.replace(/\[strEditSize\]/g, GetEditSize(true, x, y));
    Temp = Temp.replace(/\[strMaxLength\]/g, GetAnswerLength(true, x, y));
    Temp = Temp.replace(/\[strClue\]/g, Clue.innerHTML, Temp);
    Result += Temp;
  }
  Clue = document.getElementById("Clue_D_" + ClueNum);
  if (Clue != null) {
    Temp = InputStuff.replace(/\[ClueNum\]/g, ClueNum);
    Temp = Temp.replace(/\[strClueNum\]/g, DownCaption + " " + ClueNum);
    strParams = "false," + ClueNum + "," + x + "," + y + ",'[strBoxId]'";
    Temp = Temp.replace(/\[strParams\]/g, strParams);
    Temp = Temp.replace(/\[strBoxId\]/g, "GD_" + ClueNum + "_" + x + "_" + y);
    Temp = Temp.replace(/\[strEditSize\]/g, GetAnswerLength(false, x, y));
    Temp = Temp.replace(/\[strClue\]/g, Clue.innerHTML, Temp);
    Result += Temp;
  }
  document.getElementById("ClueEntry").innerHTML = Result;
}

function EnterGuess(Across, ClueNum, x, y, BoxId) {
  if (document.getElementById(BoxId) != null) {
    var Guess = document.getElementById(BoxId).value;
    var AnsLength = GetAnswerLength(Across, x, y);
    EnterAnswer(Guess, Across, AnsLength, x, y);
  }
}

function SplitStringToPerceivedChars(InString, PC) {
  var Temp = InString.charAt(0);
  if (InString.length > 1) {
    for (var i = 1; i < InString.length; i++) {
      if (IsCombiningDiacritic(InString.charCodeAt(i)) == true) {
        Temp += InString.charAt(i);
      } else {
        PC.push(Temp);
        Temp = InString.charAt(i);
      }
    }
  }
  PC.push(Temp);
}

function EnterAnswer(Guess, Across, AnsLength, x, y) {
  var PC = new Array();
  SplitStringToPerceivedChars(Guess, PC);

  var i = x;
  var j = y;
  var Letter = 0;
  while (Letter < AnsLength) {
    if (Letter < PC.length) {
      G[i][j] = PC[Letter];
      if (document.getElementById("L_" + i + "_" + j) != null) {
        document.getElementById("L_" + i + "_" + j).innerHTML = PC[Letter];
      }
    }
    if (Across == true) {
      j++;
    } else {
      i++;
    }
    Letter++;
  }
}

function SetGridSquareValue(x, y, Val) {
  var GridId = "L_" + x + "_" + y;
  if (document.getElementById(GridId) != null) {
    document.getElementById(GridId).innerHTML = Val;
  }
}

function ShowHint(Across, ClueNum, x, y, BoxId) {
  var i = x;
  var j = y;
  var LetterFromGuess = "";
  var LetterFromKey = "";
  var OutString = "";
  if (Across == true) {
    while (j < L[i].length) {
      if (L[i][j] != "") {
        OutString += L[i][j];
        if (CaseSensitive == true) {
          LetterFromKey = L[i][j];
          LetterFromGuess = G[i][j];
        } else {
          LetterFromKey = L[i][j].toUpperCase();
          LetterFromGuess = G[i][j].toUpperCase();
        }
        if (LetterFromGuess != LetterFromKey) {
          //				if (G[i][j] != L[i][j]){
          G[i][j] = L[i][j];
          Penalties++;
          break;
        }
      } else {
        break;
      }
      j++;
    }
  } else {
    while (i < L.length) {
      if (L[i][j] != "") {
        OutString += L[i][j];
        if (CaseSensitive == true) {
          LetterFromKey = L[i][j];
          LetterFromGuess = G[i][j];
        } else {
          LetterFromKey = L[i][j].toUpperCase();
          LetterFromGuess = G[i][j].toUpperCase();
        }
        if (LetterFromGuess != LetterFromKey) {
          //				if (G[i][j] != L[i][j]){
          G[i][j] = L[i][j];
          Penalties++;
          break;
        }
      } else {
        break;
      }
      i++;
    }
  }
  if (document.getElementById(BoxId) != null) {
    document.getElementById(BoxId).value = OutString;
  }
}

L = new Array();
L[0] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "P",
  "",
  "",
  "",
  "",
  "",
  ""
);
L[1] = new Array(
  "D",
  "I",
  "S",
  "O",
  "M",
  "I",
  "C",
  "",
  "F",
  "O",
  "N",
  "E",
  "H",
  "Y",
  "B",
  "R",
  "I",
  "D",
  "",
  "",
  "L",
  "O",
  "C",
  "U",
  "L",
  "E",
  ""
);
L[2] = new Array(
  "",
  "",
  "E",
  "",
  "",
  "",
  "H",
  "",
  "",
  "V",
  "",
  "",
  "",
  "",
  "E",
  "",
  "",
  "",
  "",
  "",
  "E",
  "",
  "",
  "",
  "",
  "",
  ""
);
L[3] = new Array(
  "",
  "",
  "E",
  "",
  "E",
  "P",
  "I",
  "S",
  "T",
  "A",
  "S",
  "I",
  "S",
  "",
  "E",
  "",
  "",
  "V",
  "A",
  "R",
  "I",
  "A",
  "N",
  "C",
  "E",
  "",
  ""
);
L[4] = new Array(
  "S",
  "",
  "D",
  "",
  "X",
  "",
  "",
  "",
  "",
  "R",
  "",
  "",
  "Y",
  "",
  "",
  "",
  "",
  "E",
  "",
  "",
  "O",
  "",
  "",
  "R",
  "",
  "",
  ""
);
L[5] = new Array(
  "P",
  "",
  "",
  "S",
  "P",
  "O",
  "R",
  "T",
  "",
  "Y",
  "",
  "A",
  "N",
  "N",
  "E",
  "A",
  "L",
  "S",
  "",
  "A",
  "T",
  "P",
  "",
  "O",
  "N",
  "E",
  ""
);
L[6] = new Array(
  "E",
  "",
  "",
  "",
  "R",
  "",
  "",
  "",
  "A",
  "",
  "",
  "",
  "G",
  "",
  "",
  "",
  "",
  "I",
  "",
  "",
  "R",
  "",
  "",
  "S",
  "",
  "",
  "H"
);
L[7] = new Array(
  "R",
  "",
  "",
  "",
  "E",
  "",
  "P",
  "E",
  "N",
  "E",
  "T",
  "R",
  "A",
  "N",
  "C",
  "E",
  "",
  "C",
  "H",
  "R",
  "O",
  "M",
  "O",
  "S",
  "O",
  "M",
  "E"
);
L[8] = new Array(
  "M",
  "A",
  "P",
  "",
  "S",
  "",
  "A",
  "",
  "T",
  "",
  "",
  "",
  "M",
  "",
  "H",
  "",
  "",
  "L",
  "",
  "",
  "P",
  "",
  "",
  "O",
  "",
  "",
  "T"
);
L[9] = new Array(
  "",
  "",
  "O",
  "",
  "S",
  "",
  "R",
  "",
  "I",
  "",
  "R",
  "A",
  "Y",
  "",
  "I",
  "",
  "",
  "E",
  "",
  "S",
  "I",
  "B",
  "",
  "V",
  "",
  "",
  "E"
);
L[10] = new Array(
  "",
  "",
  "L",
  "",
  "I",
  "",
  "T",
  "A",
  "G",
  "",
  "",
  "",
  "",
  "",
  "M",
  "",
  "C",
  "",
  "",
  "",
  "C",
  "",
  "P",
  "E",
  "G",
  "",
  "R"
);
L[11] = new Array(
  "",
  "",
  "A",
  "",
  "V",
  "",
  "H",
  "",
  "E",
  "",
  "M",
  "",
  "",
  "M",
  "E",
  "I",
  "O",
  "S",
  "I",
  "S",
  "",
  "S",
  "I",
  "R",
  "E",
  "",
  "O"
);
L[12] = new Array(
  "C",
  "A",
  "R",
  "M",
  "I",
  "N",
  "E",
  "",
  "N",
  "",
  "I",
  "",
  "",
  "",
  "R",
  "",
  "D",
  "",
  "",
  "",
  "",
  "",
  "S",
  "",
  "L",
  "",
  "Z"
);
L[13] = new Array(
  "Y",
  "",
  "",
  "",
  "T",
  "",
  "N",
  "",
  "",
  "",
  "T",
  "E",
  "T",
  "R",
  "A",
  "Z",
  "O",
  "L",
  "I",
  "U",
  "M",
  "",
  "T",
  "",
  "",
  "",
  "Y"
);
L[14] = new Array(
  "B",
  "",
  "A",
  "M",
  "Y",
  "L",
  "O",
  "",
  "",
  "",
  "O",
  "",
  "",
  "",
  "",
  "",
  "N",
  "I",
  "",
  "",
  "E",
  "X",
  "I",
  "N",
  "E",
  "",
  "G"
);
L[15] = new Array(
  "R",
  "",
  "",
  "",
  "",
  "",
  "C",
  "I",
  "S",
  "",
  "C",
  "",
  "",
  "",
  "A",
  "",
  "",
  "N",
  "",
  "",
  "T",
  "",
  "L",
  "",
  "",
  "",
  "O"
);
L[16] = new Array(
  "I",
  "",
  "",
  "M",
  "R",
  "N",
  "A",
  "",
  "",
  "C",
  "H",
  "I",
  "A",
  "S",
  "M",
  "A",
  "",
  "K",
  "",
  "",
  "A",
  "",
  "",
  "S",
  "A",
  "L",
  "T"
);
L[17] = new Array(
  "D",
  "",
  "",
  "U",
  "",
  "",
  "R",
  "",
  "",
  "",
  "O",
  "",
  "N",
  "",
  "I",
  "",
  "S",
  "E",
  "X",
  "",
  "X",
  "R",
  "A",
  "Y",
  "",
  "",
  "E"
);
L[18] = new Array(
  "",
  "",
  "",
  "T",
  "",
  "",
  "P",
  "",
  "",
  "",
  "N",
  "",
  "A",
  "",
  "N",
  "",
  "",
  "D",
  "",
  "",
  "E",
  "",
  "",
  "N",
  "",
  "",
  ""
);
L[19] = new Array(
  "",
  "P",
  "L",
  "A",
  "S",
  "M",
  "I",
  "D",
  "",
  "",
  "D",
  "I",
  "P",
  "L",
  "O",
  "I",
  "D",
  "",
  "",
  "",
  "N",
  "",
  "",
  "T",
  "",
  "",
  "T"
);
L[20] = new Array(
  "",
  "O",
  "",
  "T",
  "",
  "",
  "C",
  "",
  "",
  "",
  "R",
  "",
  "H",
  "",
  "A",
  "",
  "",
  "",
  "S",
  "",
  "I",
  "",
  "",
  "H",
  "",
  "",
  "A"
);
L[21] = new Array(
  "",
  "L",
  "",
  "E",
  "",
  "",
  "",
  "E",
  "",
  "",
  "I",
  "",
  "A",
  "",
  "C",
  "R",
  "I",
  "S",
  "P",
  "",
  "A",
  "L",
  "L",
  "E",
  "L",
  "E",
  "S"
);
L[22] = new Array(
  "",
  "L",
  "",
  "",
  "T",
  "E",
  "S",
  "T",
  "C",
  "R",
  "O",
  "S",
  "S",
  "",
  "I",
  "",
  "",
  "",
  "I",
  "",
  "",
  "",
  "",
  "T",
  "",
  "",
  "S"
);
L[23] = new Array(
  "T",
  "E",
  "S",
  "T",
  "A",
  "",
  "",
  "O",
  "",
  "",
  "N",
  "",
  "E",
  "",
  "D",
  "",
  "",
  "A",
  "N",
  "T",
  "H",
  "E",
  "S",
  "I",
  "S",
  "",
  "E"
);
L[24] = new Array(
  "",
  "N",
  "",
  "",
  "P",
  "A",
  "C",
  "H",
  "Y",
  "",
  "",
  "",
  "",
  "C",
  "",
  "",
  "G",
  "",
  "D",
  "",
  "",
  "G",
  "",
  "C",
  "E",
  "L",
  "L"
);
L[25] = new Array(
  "",
  "",
  "P",
  "",
  "E",
  "",
  "U",
  "",
  "",
  "G",
  "",
  "P",
  "",
  "D",
  "",
  "",
  "M",
  "",
  "L",
  "",
  "",
  "G",
  "A",
  "",
  "M",
  "",
  ""
);
L[26] = new Array(
  "",
  "F",
  "E",
  "R",
  "T",
  "I",
  "L",
  "I",
  "Z",
  "A",
  "T",
  "I",
  "O",
  "N",
  "",
  "T",
  "U",
  "B",
  "E",
  "",
  "S",
  "",
  "",
  "C",
  "",
  "",
  ""
);
L[27] = new Array(
  "",
  "",
  "D",
  "",
  "U",
  "",
  "T",
  "",
  "",
  "M",
  "",
  "N",
  "",
  "A",
  "",
  "R",
  "",
  "C",
  "",
  "",
  "O",
  "P",
  "",
  "L",
  "I",
  "I",
  ""
);
L[28] = new Array(
  "A",
  "",
  "I",
  "",
  "M",
  "",
  "I",
  "",
  "",
  "E",
  "",
  "",
  "",
  "",
  "",
  "I",
  "",
  "",
  "",
  "",
  "R",
  "",
  "",
  "O",
  "",
  "N",
  ""
);
L[29] = new Array(
  "P",
  "",
  "G",
  "",
  "",
  "",
  "V",
  "",
  "",
  "T",
  "E",
  "R",
  "M",
  "I",
  "N",
  "A",
  "L",
  "I",
  "Z",
  "A",
  "T",
  "I",
  "O",
  "N",
  "",
  "T",
  ""
);
L[30] = new Array(
  "O",
  "",
  "R",
  "",
  "",
  "M",
  "A",
  "P",
  "L",
  "E",
  "",
  "",
  "",
  "",
  "",
  "L",
  "",
  "",
  "Y",
  "",
  "",
  "",
  "",
  "E",
  "",
  "I",
  ""
);
L[31] = new Array(
  "M",
  "",
  "E",
  "R",
  "R",
  "O",
  "R",
  "S",
  "",
  "S",
  "E",
  "L",
  "E",
  "C",
  "T",
  "",
  "R",
  "O",
  "G",
  "U",
  "E",
  "",
  "A",
  "",
  "",
  "N",
  ""
);
L[32] = new Array(
  "I",
  "",
  "E",
  "",
  "",
  "D",
  "",
  "E",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "E",
  "",
  "O",
  "",
  "",
  "",
  "G",
  "E",
  "N",
  "E",
  ""
);
L[33] = new Array(
  "C",
  "A",
  "S",
  "T",
  "L",
  "E",
  "",
  "U",
  "",
  "",
  "",
  "I",
  "N",
  "C",
  "O",
  "M",
  "P",
  "A",
  "T",
  "I",
  "B",
  "L",
  "E",
  "",
  "I",
  "",
  ""
);
L[34] = new Array(
  "T",
  "",
  "",
  "",
  "",
  "",
  "",
  "D",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "E",
  "",
  "E",
  "",
  "",
  "",
  "N",
  "",
  "N",
  "",
  ""
);
L[35] = new Array(
  "",
  "",
  "H",
  "E",
  "T",
  "E",
  "R",
  "O",
  "S",
  "I",
  "S",
  "",
  "",
  "S",
  "T",
  "Y",
  "L",
  "E",
  "",
  "",
  "A",
  "N",
  "T",
  "H",
  "E",
  "R",
  ""
);

CL = new Array();
CL[0] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[1] = new Array(
  2,
  0,
  3,
  0,
  0,
  0,
  4,
  0,
  5,
  6,
  0,
  0,
  0,
  0,
  7,
  0,
  0,
  0,
  0,
  0,
  8,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[2] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[3] = new Array(
  0,
  0,
  0,
  0,
  9,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  10,
  0,
  0,
  0,
  0,
  11,
  0,
  0,
  0,
  0,
  0,
  12,
  0,
  0,
  0
);
CL[4] = new Array(
  13,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[5] = new Array(
  0,
  0,
  0,
  14,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  15,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  16,
  0,
  0,
  0,
  17,
  0,
  0,
  0
);
CL[6] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  18,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  19
);
CL[7] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  20,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  21,
  0,
  0,
  22,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[8] = new Array(
  23,
  0,
  24,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[9] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  25,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  26,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[10] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  27,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  28,
  0,
  0,
  0,
  0,
  0,
  29,
  0,
  30,
  0,
  0
);
CL[11] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  31,
  0,
  0,
  32,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  33,
  0,
  0,
  0,
  0,
  0
);
CL[12] = new Array(
  34,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[13] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  35,
  0,
  0,
  0,
  0,
  0,
  0,
  36,
  0,
  0,
  37,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[14] = new Array(
  0,
  0,
  38,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  39,
  0,
  0,
  0,
  40,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[15] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  41,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  42,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[16] = new Array(
  0,
  0,
  0,
  43,
  0,
  0,
  0,
  0,
  0,
  44,
  0,
  0,
  45,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  46,
  0,
  0,
  0
);
CL[17] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  47,
  0,
  0,
  0,
  48,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[18] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[19] = new Array(
  0,
  49,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  50,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  51
);
CL[20] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  52,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[21] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  53,
  0,
  0,
  0,
  0,
  0,
  0,
  54,
  0,
  0,
  0,
  0,
  0,
  55,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[22] = new Array(
  0,
  0,
  0,
  0,
  56,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[23] = new Array(
  57,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  58,
  0,
  0,
  0,
  59,
  0,
  0,
  60,
  0,
  0
);
CL[24] = new Array(
  0,
  0,
  0,
  0,
  61,
  0,
  62,
  0,
  0,
  0,
  0,
  0,
  0,
  63,
  0,
  0,
  64,
  0,
  0,
  0,
  0,
  0,
  0,
  65,
  0,
  0,
  0
);
CL[25] = new Array(
  0,
  0,
  66,
  0,
  0,
  0,
  0,
  0,
  0,
  67,
  0,
  68,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  69,
  0,
  0,
  0,
  0,
  0
);
CL[26] = new Array(
  0,
  70,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  71,
  0,
  72,
  0,
  0,
  73,
  0,
  0,
  74,
  0,
  0,
  0
);
CL[27] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  75,
  0,
  0,
  76,
  0,
  77,
  0
);
CL[28] = new Array(
  78,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[29] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  79,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  80,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[30] = new Array(
  0,
  0,
  0,
  0,
  0,
  81,
  0,
  82,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[31] = new Array(
  0,
  0,
  83,
  0,
  0,
  0,
  0,
  0,
  0,
  84,
  0,
  0,
  0,
  0,
  0,
  0,
  85,
  0,
  0,
  0,
  0,
  0,
  86,
  0,
  0,
  0,
  0
);
CL[32] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  87,
  0,
  88,
  0,
  0
);
CL[33] = new Array(
  89,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  90,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[34] = new Array(
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0
);
CL[35] = new Array(
  0,
  0,
  91,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  92,
  0,
  0,
  0,
  0,
  0,
  0,
  93,
  0,
  0,
  0,
  0,
  0,
  0
);

G = new Array();
G[0] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[1] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[2] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[3] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[4] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[5] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[6] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[7] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[8] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[9] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[10] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[11] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[12] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[13] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[14] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[15] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[16] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[17] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[18] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[19] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[20] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[21] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[22] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[23] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[24] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[25] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[26] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[27] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[28] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[29] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[30] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[31] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[32] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[33] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[34] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);
G[35] = new Array(
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  ""
);

function CheckAnswers() {
  if (Locked == true) {
    return;
  }

  var AllCorrect = true;
  var TotLetters = 0;
  var CorrectLetters = 0;
  var LetterFromKey = "";
  var LetterFromGuess = "";

  //Check each letter
  for (var i = 0; i < L.length; i++) {
    for (var j = 0; j < L[i].length; j++) {
      if (L[i][j] != "") {
        TotLetters++;
        if (CaseSensitive == true) {
          LetterFromKey = L[i][j];
          LetterFromGuess = G[i][j];
        } else {
          LetterFromKey = L[i][j].toUpperCase();
          LetterFromGuess = G[i][j].toUpperCase();
        }
        if (LetterFromGuess != LetterFromKey) {
          G[i][j] = "";
          //Blank that square in the grid
          SetGridSquareValue(i, j, "");
          AllCorrect = false;
        } else {
          CorrectLetters++;
        }
      }
    }
  }

  Score = Math.floor(((CorrectLetters - Penalties) * 100) / TotLetters);
  if (Score < 0) {
    Score = 0;
  }

  //Compile the output
  var Output = "";

  if (AllCorrect == true) {
    Output = Correct + "<br />";
  }

  Output += YourScoreIs + " " + Score + "%.<br />";
  if (AllCorrect == false) {
    Output += Incorrect;
    Penalties++;
  }

  ShowMessage(Output);
  WriteToInstructions(Output);

  if (AllCorrect == true || TimeOver == true) {
    TimeOver = true;
    Locked = true;
    Finished = true;
  }

  if (AllCorrect == true) {
    SetScormComplete();
  } else {
    SetScormIncomplete();
  }
}

function TypeChars(Chars) {
  if (CurrentBox != null) {
    CurrentBox.value += Chars;
  }
}

//-->

//]]>
