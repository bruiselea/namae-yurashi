const form = document.querySelector('#form');
const nameInput = document.querySelector('#name');
const result = document.querySelector('#result');

const kanaToRomajiTable = {
  'キャ':'kya','キュ':'kyu','キョ':'kyo','シャ':'sha','シュ':'shu','ショ':'sho','チャ':'cha','チュ':'chu','チョ':'cho',
  'ニャ':'nya','ニュ':'nyu','ニョ':'nyo','ヒャ':'hya','ヒュ':'hyu','ヒョ':'hyo','ミャ':'mya','ミュ':'myu','ミョ':'myo',
  'リャ':'rya','リュ':'ryu','リョ':'ryo','ギャ':'gya','ギュ':'gyu','ギョ':'gyo','ジャ':'ja','ジュ':'ju','ジョ':'jo',
  'ビャ':'bya','ビュ':'byu','ビョ':'byo','ピャ':'pya','ピュ':'pyu','ピョ':'pyo','ティ':'ti','ディ':'di','トゥ':'tu','ドゥ':'du',
  'ファ':'fa','フィ':'fi','フェ':'fe','フォ':'fo','ウィ':'wi','ウェ':'we','ウォ':'wo','シェ':'she','チェ':'che','ジェ':'je',
  'ツァ':'tsa','ツィ':'tsi','ツェ':'tse','ツォ':'tso','ヴァ':'va','ヴィ':'vi','ヴ':'vu','ヴェ':'ve','ヴォ':'vo',
  'ア':'a','イ':'i','ィ':'yi','ウ':'u','エ':'e','オ':'o','カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
  'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so','タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
  'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no','ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
  'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo','ヤ':'ya','ユ':'yu','ヨ':'yo','ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro','ワ':'wa','ヲ':'wo','ン':'n',
  'ガ':'ga','ギ':'gi','グ':'gu','ゲ':'ge','ゴ':'go','ザ':'za','ジ':'ji','ズ':'zu','ゼ':'ze','ゾ':'zo',
  'ダ':'da','ヂ':'ji','ヅ':'zu','デ':'de','ド':'do','バ':'ba','ビ':'bi','ブ':'bu','ベ':'be','ボ':'bo','パ':'pa','ピ':'pi','プ':'pu','ペ':'pe','ポ':'po'
};
const romajiToKanaTable = [
  ...Object.entries(kanaToRomajiTable),
  ['シ', 'si'], ['ジ', 'zi'], ['チ', 'ti'], ['フ', 'hu'],
].sort(([, a], [, b]) => b.length - a.length);
const loneConsonants = { b:'ブ', c:'ク', d:'ド', f:'フ', g:'グ', h:'フ', j:'ジ', k:'ク', l:'ル', m:'ム', p:'プ', q:'ク', r:'ル', s:'ス', t:'ト', v:'ヴ', w:'ウ', x:'クス', y:'イ', z:'ズ' };

function katakanaToRomaji(value) {
  let roman = '';
  for (let index = 0; index < value.length;) {
    const pair = value.slice(index, index + 2);
    if (value[index] === 'ッ') {
      const next = kanaToRomajiTable[value.slice(index + 1, index + 3)] || kanaToRomajiTable[value[index + 1]] || '';
      roman += next[0] || '';
      index++;
    } else if (value[index] === 'ー') {
      roman += '-'; index++;
    } else if (kanaToRomajiTable[pair]) {
      roman += kanaToRomajiTable[pair]; index += 2;
    } else if (kanaToRomajiTable[value[index]]) {
      roman += kanaToRomajiTable[value[index]]; index++;
    } else {
      roman += value[index]; index++;
    }
  }
  return roman;
}

function romajiToKatakana(value) {
  let kana = '';
  for (let index = 0; index < value.length;) {
    if (value[index] === '-') { kana += 'ー'; index++; continue; }
    if (index + 1 < value.length && value[index] === value[index + 1] && /[bcdfghjklmpqrstvwxyz]/i.test(value[index]) && value[index].toLowerCase() !== 'n') {
      kana += 'ッ'; index++; continue;
    }
    const found = romajiToKanaTable.find(([, roman]) => value.slice(index).toLowerCase().startsWith(roman));
    if (found) { kana += found[0]; index += found[1].length; }
    else {
      kana += loneConsonants[value[index].toLowerCase()] || value[index];
      index++;
    }
  }
  return kana;
}

function swapInitials(value) {
  const parts = value.trim().split(/[・\s]+/);
  if (parts.length < 2 || !parts[0] || !parts[1]) return '名と姓をカタカナで入力してください';
  const [first, last] = parts.map(katakanaToRomaji);
  if (!/^[a-z]/i.test(first) || !/^[a-z]/i.test(last)) return '名と姓をカタカナで入力してください';
  return `${romajiToKatakana(last[0] + first.slice(1))}・${romajiToKatakana(first[0] + last.slice(1))}`;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  result.textContent = swapInitials(nameInput.value);
});
