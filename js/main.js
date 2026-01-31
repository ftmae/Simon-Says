const colors = ['red', 'green', 'yellow', 'blue'];
const url = new URL(window.location.href);
const difficulty = url.searchParams.get('difficulty');
let computerSequence = [];
let playerSequence = [];
let limit = 0;
let score =  JSON.parse(localStorage.getItem('score')) || {wins: 0, losses: 0};
let result;

/* 
=========================
-------FUNCTIONS---------
=========================
*/

function countdownTimer(){
  document.querySelector('.js-timer-section').classList.remove('d-none');
    return new Promise((resolve)=>{
      for (let i = 3; i >= 0; i--){
        setTimeout(()=>{
          document.querySelector('.js-timer').textContent = i;
          if(i===0)resolve();
        }, 1000*(3-i));
      }
    });
}

function displayScore(){
  document.querySelector('.js-wins').innerHTML = score.wins;
  document.querySelector('.js-losses').innerHTML = score.losses;
}

function getRandomNumber(min, max){
  return Math.floor(Math.random() * (max-min+1))+min
}

function addToSequence(sequence, color){
  sequence.push(color);
}

function displaySequence(sequence){
  return new Promise((resolve)=>{
      sequence.forEach((color, index) => {
        setTimeout(()=>{
          document.querySelector(`.js-color-${color}`).classList.add('computer-active');
          document.querySelector(`.js-color-${color}`).classList.add(`box-shadow-${color}`);
            setTimeout(()=>{
              document.querySelector(`.js-color-${color}`).classList.remove('computer-active');
              document.querySelector(`.js-color-${color}`).classList.remove(`box-shadow-${color}`);
              if (index === sequence.length - 1) {
                resolve();
              }
            }, 1000);
        }, index*1500)
      });
    });
}

async function playComputer(limit, computerSequence){
  for(let i = 0; i<=limit; i++){
    addToSequence(computerSequence, colors[getRandomNumber(0,3)]);
  }
  await displaySequence(computerSequence);
}

function waitForClick(){
  return new Promise(resolve=>{
    document.querySelectorAll('.js-color-button').forEach(button=>{
      button.addEventListener('click', ()=>{
        resolve(button.dataset.color);
      }, {once:true});
    });
  });
}

function compareSequences(sequence1, sequence2){
  if(sequence1.length !== sequence2.length){
    score.losses += 1;
    localStorage.setItem('score', JSON.stringify(score));
    return 'You Lose.';
  }
  for(let i = 0; i<=computerSequence.length; i++){
    if(computerSequence[i] !== playerSequence[i]){
      score.losses += 1;
      localStorage.setItem('score', JSON.stringify(score));
      return 'You Lose.';
    }
  }
  score.wins +=1;
  localStorage.setItem('score', JSON.stringify(score));
  return'You Win.';
}

function setTurnText(text){
  document.querySelector('.js-moves').innerHTML = text;
  document.querySelector('.js-moves').classList.remove('animate-turn-text');
  // Force reflow to restart animation
  void document.querySelector('.js-moves').offsetWidth;
  document.querySelector('.js-moves').classList.add('animate-turn-text');
}

async function playGame() {
  limit = 0;
  computerSequence = [];
  playerSequence = [];
  if(difficulty === 'Beginner'){
    limit = getRandomNumber(2, 4);
  }
  else if (difficulty === 'Intermediate'){
    limit = getRandomNumber(4, 6);
  }
  else if(difficulty === 'Hard'){
    limit = getRandomNumber(6, 12);
  }

  setTurnText("Simon's Turn.");
  await new Promise(resolve => setTimeout(resolve, 2000));
  await playComputer(limit, computerSequence);

  document.querySelectorAll('.js-color-button').forEach(button=> {
    button.disabled = false;
    button.classList.add('button-hover');
    let color = button.querySelector('.js-button-text').innerHTML;
    button.classList.add(`glow-${color.toLowerCase()}`);
  });
  setTurnText('Your Turn.');

  for(let i = 1; i<=computerSequence.length; i++){
    const clickedColor = await waitForClick();
    addToSequence(playerSequence, clickedColor);
  }
  document.querySelectorAll('.js-color-button').forEach(button=> {
    button.disabled = true;
    button.classList.remove('button-hover');
    let color = button.querySelector('.js-button-text').innerHTML;
    button.classList.remove(`glow-${color.toLowerCase()}`);
  });

  result = compareSequences(computerSequence, playerSequence);
  document.querySelector('.js-popup-text').innerHTML = result;
  document.querySelector('.js-popup').classList.remove('d-none');
  document.querySelector('.js-wins').innerHTML = score.wins;
  document.querySelector('.js-losses').innerHTML = score.losses;
}


/* 
=========================
-------MAIN CODE---------
=========================
*/

displayScore();
document.querySelectorAll('.js-color-button').forEach(button=>{
  button.disabled = true;
});
document.querySelector('.js-reset').addEventListener('click', ()=>{
  score = {wins: 0, losses: 0};
  localStorage.setItem('score', JSON.stringify(score));
  displayScore();
});
document.querySelector('.js-replay').addEventListener('click', ()=>{
  document.querySelector('.js-popup').classList.add('d-none');
  playGame()
});
document.querySelector('.js-quit').addEventListener('click', ()=>{
  window.location.href = 'index.html';
})
if (!difficulty){
  window.location.href = 'index.html';
}
countdownTimer().then(()=>{
  document.querySelector('.js-timer-section').classList.add('d-none');
  setTimeout(()=>playGame(), 700);
})
