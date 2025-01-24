let keyRow = rowToList(L[row]);
let guessRow = rowToList(G[row]);

keyRow.forEach((word) => {
  guessRow.forEach((guessedWord) => {
    if (word === guessedWord) {
      correctWords++;
    }
  });
});

let keyCol = colToList(L, column);
let guessCol = colToList(G, column);

keyCol.forEach((word) => {
  guessCol.forEach((guessedWord) => {
    if (word === guessedWord) {
      correctWords++;
    }
  });
});

//   function columnToList() {
//     curList = [];
//   }

let L = new Array();
// prettier-ignore
L[0] = new Array('','','','','','','','','','','','','','','','','','','','','P','','','','','','');
// prettier-ignore
L[1] = new Array('D','I','S','O','M','I','C','','F','O','N','E','H','Y','B','R','I','D','','','L','O','C','U','L','E','');
// prettier-ignore
L[2] = new Array('','','E','','','','H','','','V','','','','','E','','','','','','E','','','','','','');
// prettier-ignore
L[3] = new Array('','','E','','E','P','I','S','T','A','S','I','S','','E','','','V','A','R','I','A','N','C','E','','');
// prettier-ignore
L[4] = new Array('S','','D','','X','','','','','R','','','Y','','','','','E','','','O','','','R','','','');
// prettier-ignore
L[5] = new Array('P','','','S','P','O','R','T','','Y','','A','N','N','E','A','L','S','','A','T','P','','O','N','E','');
// prettier-ignore
L[6] = new Array('E','','','','R','','','','A','','','','G','','','','','I','','','R','','','S','','','H');
// prettier-ignore
L[7] = new Array('R','','','','E','','P','E','N','E','T','R','A','N','C','E','','C','H','R','O','M','O','S','O','M','E');
// prettier-ignore
L[8] = new Array('M','A','P','','S','','A','','T','','','','M','','H','','','L','','','P','','','O','','','T');
// prettier-ignore
L[9] = new Array('','','O','','S','','R','','I','','R','A','Y','','I','','','E','','S','I','B','','V','','','E');
// prettier-ignore
L[10] = new Array('','','L','','I','','T','A','G','','','','','','M','','C','','','','C','','P','E','G','','R');
// prettier-ignore
L[11] = new Array('','','A','','V','','H','','E','','M','','','M','E','I','O','S','I','S','','S','I','R','E','','O');
// prettier-ignore
L[12] = new Array('C','A','R','M','I','N','E','','N','','I','','','','R','','D','','','','','','S','','L','','Z');
// prettier-ignore
L[13] = new Array('Y','','','','T','','N','','','','T','E','T','R','A','Z','O','L','I','U','M','','T','','','','Y');
// prettier-ignore
L[14] = new Array('B','','A','M','Y','L','O','','','','O','','','','','','N','I','','','E','X','I','N','E','','G');
// prettier-ignore
L[15] = new Array('R','','','','','','C','I','S','','C','','','','A','','','N','','','T','','L','','','','O');
// prettier-ignore
L[16] = new Array('I','','','M','R','N','A','','','C','H','I','A','S','M','A','','K','','','A','','','S','A','L','T');
// prettier-ignore
L[17] = new Array('D','','','U','','','R','','','','O','','N','','I','','S','E','X','','X','R','A','Y','','','E');
// prettier-ignore
L[18] = new Array('','','','T','','','P','','','','N','','A','','N','','','D','','','E','','','N','','','');
// prettier-ignore
L[19] = new Array('','P','L','A','S','M','I','D','','','D','I','P','L','O','I','D','','','','N','','','T','','','T');
// prettier-ignore
L[20] = new Array('','O','','T','','','C','','','','R','','H','','A','','','','S','','I','','','H','','','A');
// prettier-ignore
L[21] = new Array('','L','','E','','','','E','','','I','','A','','C','R','I','S','P','','A','L','L','E','L','E','S');
// prettier-ignore

L[22] = new Array('','L','','','T','E','S','T','C','R','O','S','S','','I','','','','I','','','','','T','','','S');
// prettier-ignore
L[23] = new Array('T','E','S','T','A','','','O','','','N','','E','','D','','','A','N','T','H','E','S','I','S','','E');
// prettier-ignore
L[24] = new Array('','N','','','P','A','C','H','Y','','','','','C','','','G','','D','','','G','','C','E','L','L');
// prettier-ignore
L[25] = new Array('','','P','','E','','U','','','G','','P','','D','','','M','','L','','','G','A','','M','','');
// prettier-ignore
L[26] = new Array('','F','E','R','T','I','L','I','Z','A','T','I','O','N','','T','U','B','E','','S','','','C','','','');
// prettier-ignore
L[27] = new Array('','','D','','U','','T','','','M','','N','','A','','R','','C','','','O','P','','L','I','I','');
// prettier-ignore
L[28] = new Array('A','','I','','M','','I','','','E','','','','','','I','','','','','R','','','O','','N','');
// prettier-ignore
L[29] = new Array('P','','G','','','','V','','','T','E','R','M','I','N','A','L','I','Z','A','T','I','O','N','','T','');
// prettier-ignore
L[30] = new Array('O','','R','','','M','A','P','L','E','','','','','','L','','','Y','','','','','E','','I','');
// prettier-ignore
L[31] = new Array('M','','E','R','R','O','R','S','','S','E','L','E','C','T','','R','O','G','U','E','','A','','','N','');
// prettier-ignore
L[32] = new Array('I','','E','','','D','','E','','','','','','','','','E','','O','','','','G','E','N','E','');
// prettier-ignore
L[33] = new Array('C','A','S','T','L','E','','U','','','','I','N','C','O','M','P','A','T','I','B','L','E','','I','','');
// prettier-ignore
L[34] = new Array('T','','','','','','','D','','','','','','','','','E','','E','','','','N','','N','','');
// prettier-ignore
L[35] = new Array('','','H','E','T','E','R','O','S','I','S','','','S','T','Y','L','E','','','A','N','T','H','E','R','');

console.log(colToList(L, 2));
