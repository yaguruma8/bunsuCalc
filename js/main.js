'use strict';
{
  console.log('hello, world!');
  // 変数
  let operand1 = null;
  let operand2 = null;
  let operator = null;
  let answer = null;

  // 関数
  const id = id => {
    return document.getElementById(id);
  };
  const classes = classes => {
    return document.getElementsByClassName(classes);
  };

  const createBunsuBox = operand => {
    const bunsuBox = document.createElement('div');
    bunsuBox.classList.add('bunsuBox');
    if (operand[0] !== 0) {
      const seisu = document.createElement('div');
      seisu.classList.add('seisu');
      seisu.textContent = operand[0];
      bunsuBox.appendChild(seisu);
    }
    if (!((operand[1] === 1) & (operand[2] === 1))) {
      const bunbo = document.createElement('div');
      bunbo.classList.add('bunbo');
      bunbo.textContent = operand[1];
      bunsuBox.appendChild(bunbo);
      const bunshi = document.createElement('div');
      bunshi.classList.add('bunshi');
      bunshi.textContent = operand[2];
      bunsuBox.appendChild(bunshi);
    }
    return bunsuBox;
  };

  const createOperatorBox = operator => {
    const opBox = document.createElement('div');
    opBox.classList.add('operatorBox');
    switch (operator) {
      case 'add':
        opBox.textContent = '＋';
        break;
      case 'sub':
        opBox.textContent = '−';
        break;
      case 'mul':
        opBox.textContent = '×';
        break;
      case 'div':
        opBox.textContent = '÷';
        break;
      case 'equal':
        opBox.textContent = '=';
        break;
    }
    return opBox;
  };

  const isProperInput = str => {
    if (
      /^\d{1,4}$/.test(str) ||
      /^\d{1,4}分の\d{1,4}$/.test(str) ||
      /^[0-9]{1,4}と[0-9]{1,4}分の[0-9]{1,4}$/.test(str)
    ) {
      return true;
    } else {
      return false;
    }
  };
  const changeInputStrToArr = str => {
    // 「AとB分のC」に直す
    let normaliseStr = str;
    if (/^\d{1,4}$/.test(normaliseStr)) {
      normaliseStr = `${normaliseStr}と1分の1`;
    } else if (/^\d{1,4}分の\d{1,4}$/.test(normaliseStr)) {
      normaliseStr = `0と${normaliseStr}`;
    }
    // 「A, B, C」に直す
    let changeStr = normaliseStr.replace('と', ',');
    changeStr = changeStr.replace('分の', ',');
    // カンマ文字列->文字列の配列->数値の配列
    const strArr = changeStr.split(',');
    const numArr = strArr.map(v => Number.parseInt(v));
    return numArr;
  };

  // ------------------------------------------
  // イベントリスナー
  // ------------------------------------------

  // number 0
  id('n0').addEventListener('click', function(e) {
    e.preventDefault();
    if (this.classList.contains('disabled')) {
      return;
    }
    id('inputDisplay').textContent += '0';
  });

  // number 1〜9
  for (let i = 1; i < 10; i++) {
    id(`n${i}`).addEventListener('click', function(e) {
      e.preventDefault();
      if (this.classList.contains('disabled')) {
        return;
      }
      id('inputDisplay').textContent += i;
      // 2文字目以降は0入力を可能にする
      if (id('n0').classList.contains('disabled')) {
        id('n0').classList.remove('disabled');
      }
    });
  }

  // and (「と」) 、par(「分の」)
  id('and').addEventListener('click', function(e) {
    e.preventDefault();
    if (this.classList.contains('disabled')) {
      return;
    }
    id('inputDisplay').textContent += 'と';
    // 1文字目の数字に0を入力できないようにする
    id('n0').classList.add('disabled');
  });
  id('par').addEventListener('click', function(e) {
    e.preventDefault();
    if (this.classList.contains('disabled')) {
      return;
    }
    id('inputDisplay').textContent += '分の';
    id('n0').classList.add('disabled');
  });

  // allclear
  id('allclear').addEventListener('click', function(e) {
    e.preventDefault();
    // 入力を空にする
    while (id('result').firstChild) {
      id('result').removeChild(id('result').firstChild);
    }
    id('inputDisplay').textContent = '';
    // 変数をnullにする
    operand1 = null;
    operand2 = null;
    operator = null;
    answer = null;
    // 0と＝は入力不可、それ以外は入力可
    const btns = classes('btn');
    for (let i = 0; i < btns.length; i++) {
      if (btns[i].classList.contains('disabled')) {
        btns[i].classList.remove('disabled');
      }
    }
    id('n0').classList.add('disabled');
    id('equal').classList.add('disabled');
  });

  // clear
  id('clear').addEventListener('click', function(e) {
    e.preventDefault();
    id('inputDisplay').textContent = '';
    id('n0').classList.add('disabled');
  });

  // 演算子
  // add, sub, mul, div
  const operators = ['add', 'sub', 'mul', 'div'];
  for (const value of operators) {
    id(value).addEventListener('click', function(e) {
      e.preventDefault();
      if (this.classList.contains('disabled')) {
        return;
      }
      const input = id('inputDisplay').textContent;
      // inputDisplayのテキストを検査してfalseならerrorWindow出してreturn
      if (!isProperInput(input)) {
        console.log('不正な入力:エラーウインドウを出す')
        return;
      }
      // trueなら形式を整えて分数を配列化してoperand1に代入
      operand1 = changeInputStrToArr(input);
      // operatorに自分の演算子を代入する
      operator = value;
      // #resultに分数boxと演算子boxを追加
      id('result').appendChild(createBunsuBox(operand1));
      id('result').appendChild(createOperatorBox(operator));
      // inputDisplayのテキストをクリア
      id('inputDisplay').textContent = '';
      // ２回目の入力では演算子は＝以外押せないようにする
      const opBtns = classes('op');
      for (let i = 0; i < opBtns.length; i++) {
        opBtns[i].classList.add('disabled');
      }
      id('equal').classList.remove('disabled');
      // 0を入力不可にする
      id('n0').classList.add('disabled');
    });
  }
  // equal
  id('equal').addEventListener('click', function(e) {
    e.preventDefault();
    if (this.classList.contains('disabled')) {
      return;
    }
    const input = id('inputDisplay').textContent;
    if (!isProperInput(input)) {
      console.log('不正な入力:エラーウインドウを出す')
      return;
    }
    operand2 = changeInputStrToArr(input);
    // #resultにbox追加
    id('result').appendChild(createBunsuBox(operand2));
    id('result').appendChild(createOperatorBox('equal'));
    // inputDisplayをクリア
    id('inputDisplay').textContent = '';
    // 計算
    console.log(operand1, operand2, operator);
    // answerに答えを代入
    // #resultにanswerの分数boxを追加
    // AC以外押せないようにする
    const btns = classes('btn');
    for (let i = 0; i < btns.length; i++) {
      if (!btns[i].classList.contains('disabled')) {
        btns[i].classList.add('disabled');
      }
    }
    id('allclear').classList.remove('disabled');
  });
}
