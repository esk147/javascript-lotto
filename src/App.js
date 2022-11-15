const MissionUtils = require("@woowacourse/mission-utils");
const { Random, Console } = require("@woowacourse/mission-utils");
const Lotto = require('./Lotto.js');

class App {

  constructor() {
    this.money = null;
    this.lotto = []; 
    this.winNum = [];
    this.bonusNum = null;
  }   

  inputmoney() {
    const numberReg = /^[0-9]+$/;
    Console.readLine('구입금액을 입력해 주세요.\n', (num) => {
      if(!numberReg.test(num)) throw new Error('[ERROR] 숫자만 입력 가능합니다.');
      const money = parseInt(num);
      if(!(money % 1000 === 0) || money === 0) throw new Error("[ERROR] 구입 금액이 올바르지 않습니다.");
      this.money = money;
      this.buyLotto();
    });
  }

  buyLotto() {
    let getMoney = this.money
    let count = parseInt(this.money / 1000);
    while(getMoney > 0) {
      getMoney -= 1000;
      const numbers = Random.pickUniqueNumbersInRange(1, 45, 6).sort((a, b) => a - b);
      this.lotto.push(new Lotto(numbers));
    }
    Console.print(`${count}개를 구매했습니다.`);
    this.showLottoNum();
  }

  showLottoNum() {
    this.lotto.forEach((lottoArr) => {
      Console.print(lottoArr.toString());
    })
    this.inputLottoNumber();
  }

  inputLottoNumber(){
    Console.readLine('당첨 번호를 입력해 주세요.\n', (num) => {
      if (!/^(\d{1,2}[,]){5}\d{1,2}$/.test(num))
        throw new Error("[ERROR] 입력형식이 올바르지 않습니다.");
     const inputSixNumber = num.split(",").map((str) => {
      Number(str)
      return parseInt(str);
     });
     const checkArr = new Set(inputSixNumber);
     if(checkArr.size != 6) throw new Error("[ERROR] 중복번호가 포함되어 있습니다.");
      this.winNum = inputSixNumber;
      this.inputBonusLotto();
    });
  }

  inputBonusLotto(){
    Console.readLine('보너스 번호를 입력해 주세요.\n', (num) => {
     const inputBonusNumber = parseInt(num);
     this.bonusNum = inputBonusNumber;
     console.log(this.bonusNum)
     this.result();
   });
 }

compareLotto(inputSixNumber, lottos){
  let checkLength = [];
  let last = inputSixNumber.pop();
  for (let i = 0; i < lottos.length; i++) {
    checkLength[i] = inputSixNumber.filter(num => lottos[i].includes(num)).length;
  }
  this.countScore(checkLength,lottos,last);
}

countScore(checkLength,lottos,last){
  let second = 0;
  let third = 0;
  for(let i = 0; i < lottos.length; i++){
    if (lottos[i].includes(last) && checkLength[i] === 5) {
      second++;
    } else if(!lottos[i].includes(last) && checkLength[i] === 5) {
      third++;
    }
  }
  let first = checkLength.filter(num => 6 === num).length;
  let fourth = checkLength.filter(num => 4 === num).length;
  let fiveth = checkLength.filter(num => 3 === num).length;
  this.showCount(first,second,third,fourth,fiveth,lottos);
}

showCount(first, second, third, fourth, fiveth,lottos){
  Console.print("당첨 통계\n---");
  Console.print(`3개 일치 (5,000원) - ${fiveth}개`);
  Console.print(`4개 일치 (50,000원) - ${fourth}개`);
  Console.print(`5개 일치 (1,500,000원) - ${third}개`);
  Console.print(`5개 일치, 보너스 볼 일치 (30,000,000원) - ${second}개`);
  Console.print(`6개 일치 (2,000,000,000원) - ${first}개`);
  let fivethMoney = fiveth * 5000;
  let fourthMoney = fourth * 50000;
  let thirdMoney = third * 1500000;
  let secondMoney = second * 30000000;
  let firstMoney = first * 2000000000;
  this.plusRate(fivethMoney,fourthMoney,thirdMoney,secondMoney,firstMoney,lottos);
}

plusRate(first, second, third, fourth, fiveth,lottos){
  let allPlus = first + second + third + fourth + fiveth;
  let lottoLength = lottos.length;
  let returnRate = (allPlus/lottoLength)/10;
  Console.print(`총 수익률은 ${returnRate.toFixed(1)}%입니다.`);
  Console.close();
}


play() {
    this.buyLotto();
  }
}

 const app = new App();
 app.play();

module.exports = App;