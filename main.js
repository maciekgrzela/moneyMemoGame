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

const moneyMemoGame = {
  gameResult: 0,
  startingTime: 10,
  choices: [],
  freeToInvoke: true,
  timerHandler: null,
  time: null,
  addTimeFactor: 1,
  memos: [
    {
      value: 1,
      img: '/assets/img/one.png',
      color: '#4EBC5C',
      additionalTime: 1,
    },
    {
      value: 2,
      img: '/assets/img/two.png',
      color: '#D1555C',
      additionalTime: 2,
    },
    {
      value: 5,
      img: '/assets/img/five.png',
      color: '#4775A3',
      additionalTime: 5,
    },
    {
      value: 10,
      img: '/assets/img/ten.png',
      color: '#EDA576',
      additionalTime: 10,
    },
    {
      value: 20,
      img: '/assets/img/twenty.png',
      color: '#F391D2',
      additionalTime: 20,
    },
    {
      value: 50,
      img: '/assets/img/fifty.png',
      color: '#B3B38C',
      additionalTime: 50,
    },
    {
      value: 100,
      img: '/assets/img/hundred.png',
      color: '#4EBC5C',
      additionalTime: 100,
    },
    {
      value: 200,
      img: '/assets/img/two-hundred.png',
      color: '#4775A3',
      additionalTime: 200,
    },
  ],

  init: function () {
    let shuffledMemos = this.shuffleMemosData();
    this.assignToReverses(shuffledMemos);
    this.initTimer();
    this.listenOnCardsFlipping();
  },

  initTimer: function () {
    document
      .querySelector('.game-time')
      .classList.remove('game-control--hidden');
    this.time = this.startingTime;
    document.querySelector('.game-timer').innerHTML = `: ${this.time.toFixed(
      2
    )}s`;
    this.timerHandler = setInterval(() => {
      this.countdown();
    }, 1000);
  },

  shuffleMemosData: function () {
    return this.memos.concat(this.memos).shuffle();
  },

  clearFlip: function () {
    let cards = document.querySelectorAll('.card__wrapper');
    cards.forEach((card) => {
      card.classList.remove('is-flipped');
    });
  },

  assignToReverses: function (memos) {
    const reverses = Array.from(
      document.querySelectorAll('.card__surface--back')
    );

    reverses.forEach((reverse, index) => {
      this.setReverseImage(reverse, memos[index]);
    });
  },

  setReverseImage: function (reverse, memo) {
    let element = document.createElement('img');
    element.setAttribute('src', memo.img);
    element.setAttribute('money-value', memo.value);
    element.setAttribute('additional-time', memo.additionalTime);
    reverse.querySelector('div').innerHTML = '';
    reverse.querySelector('div').parentElement.style.backgroundColor =
      memo.color;
    reverse.querySelector('div').appendChild(element);
  },

  listenOnCardsFlipping: function () {
    const cards = Array.from(document.querySelectorAll('.card__wrapper'));
    cards.forEach((card) => {
      card.addEventListener('click', async (e) => {
        this.handleCardFlip(card);
      });
    });
  },

  stopListeningOnCardsFlipping: function () {
    const cards = Array.from(document.querySelectorAll('.card__wrapper'));
    cards.forEach((card) => {
      card.removeEventListener('click', async (e) => {
        this.handleCardFlip(card);
      });
    });
  },

  handleCardFlip: async function (card) {
    if (!card.classList.contains('is-flipped') && this.freeToInvoke) {
      this.freeToInvoke = false;
      card.classList.add('is-flipped');
      let img = card.querySelector('.card__surface--back img');
      this.choices.push({
        node: card,
        value: img.getAttribute('money-value'),
        additionalTime: img.getAttribute('additional-time'),
      });
      if (this.choices.length === 2) {
        if (this.choices[0].value === this.choices[1].value) {
          this.gameResult += this.choices[0].value * 2;
          document.querySelector('.game-result').innerHTML = this.gameResult;
          this.addTime(
            Number(
              (this.choices[0].additionalTime * this.addTimeFactor).toFixed(2) +
                1
            )
          );
          if (this.gameResult % 776 === 0) {
            this.nextLevel();
          }
        } else {
          await asyncTimeout(() => {
            this.choices[0].node.classList.toggle('is-flipped');
            this.choices[1].node.classList.toggle('is-flipped');
          }, 850);
        }
        this.choices = [];
      }
      this.freeToInvoke = true;
    } else {
      return;
    }
  },

  addTime: function (time) {
    clearInterval(this.timerHandler);
    this.time += time;
    this.timerHandler = setInterval(() => {
      this.countdown();
    }, 1000);
  },

  countdown: function () {
    this.time--;
    document.querySelector('.game-timer').innerHTML = `: ${this.time.toFixed(
      2
    )}s`;
    if (this.time <= 0) {
      clearInterval(this.timerHandler);
      this.end();
    }
  },

  end: function () {
    this.showResult();
    this.toggleModal();
    this.clearFlip();
  },

  showResult: function () {
    document.querySelector(
      '.modal__game-result'
    ).innerHTML = `${this.gameResult} PKT`;
  },

  reset: function () {
    this.stopListeningOnCardsFlipping();
    if (this.timerHandler !== null) {
      clearInterval(this.timerHandler);
    }
    this.showResult();
    this.clearFlip();
    this.gameResult = 0;
    this.addTimeFactor = 1;
    this.startingTime = 10;
    this.choices = [];
    this.freeToInvoke = true;
    this.timerHandler = null;
    this.time = null;
    this.toggleModal();
  },

  toggleModal: function () {
    let modal = document.querySelector('.modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
  },

  nextLevel: function () {
    this.addTimeFactor /= 2;
    this.clearFlip();
    this.choices = [];
    let shuffledMemos = this.shuffleMemosData();
    this.assignToReverses(shuffledMemos);
  },
};

(() => {
  let closeModalBtn = document.querySelector('.modal__close');
  let modalResetBtn = document.querySelector('.modal__game-reset');
  let resetBtn = document.querySelector('.game-reset');
  let startBtn = document.querySelector('.start-game');

  startBtn.addEventListener('click', () => {
    moneyMemoGame.init();
  });
  [modalResetBtn, closeModalBtn, resetBtn].forEach((btn) => {
    btn.addEventListener('click', () => {
      moneyMemoGame.reset();
      moneyMemoGame.init();
    });
  });
})();
