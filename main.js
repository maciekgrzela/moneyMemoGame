let gameResult = 0;
let choices = [];
let freeToInvoke = true;
const memos = [
  {
    value: 1,
    img: '/assets/img/one.png',
  },
  {
    value: 2,
    img: '/assets/img/two.png',
  },
  {
    value: 5,
    img: '/assets/img/five.png',
  },
  {
    value: 10,
    img: '/assets/img/ten.png',
  },
  {
    value: 20,
    img: '/assets/img/twenty.png',
  },
  {
    value: 50,
    img: '/assets/img/fifty.png',
  },
  {
    value: 100,
    img: '/assets/img/hundred.png',
  },
  {
    value: 200,
    img: '/assets/img/two-hundred.png',
  },
];

Array.prototype.shuffle = function () {
  let counter = this.length - 1;

  while (counter > 0) {
    let randomIndex = Math.floor(Math.random() * counter);
    counter--;

    let temp = this[counter];
    this[counter] = this[randomIndex];
    this[randomIndex] = temp;
  }

  return this;
};

const asyncTimeout = (fn, time) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn()), time);
  });
};

const memosList = memos.concat(memos).shuffle();
const reverses = Array.from(document.querySelectorAll('.card__surface--back'));

reverses.forEach((back, index) => {
  let element = document.createElement('img');
  element.setAttribute('src', memosList[index].img);
  element.setAttribute('money-value', memosList[index].value);
  back.appendChild(element);
});

const htmlCardsElements = Array.from(
  document.querySelectorAll('.card__wrapper')
);

htmlCardsElements.forEach((card) => {
  card.addEventListener('click', async (e) => {
    if (!card.classList.contains('is-flipped') && freeToInvoke) {
      freeToInvoke = false;
      card.classList.add('is-flipped');
      let img = card.querySelector('.card__surface--back img');
      choices.push({
        node: card,
        value: img.getAttribute('money-value'),
      });
      if (choices.length === 2) {
        if (choices[0].value === choices[1].value) {
          gameResult += choices[0].value * 2;
          document.querySelector('.game-result').innerHTML = gameResult;
        } else {
          await asyncTimeout(() => {
            choices[0].node.classList.toggle('is-flipped');
            choices[1].node.classList.toggle('is-flipped');
          }, 850);
        }
        choices = [];
      }
      freeToInvoke = true;
    }
  });
});
