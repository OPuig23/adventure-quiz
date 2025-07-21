js
const questions = [
  "Descriu la teva gesta més valenta.",
  "Quin grau de misteri té el bosc antic?",
  // ... afegeix fins a 20 preguntes en català ...
  "Quina llegenda deixaràs per a la posteritat?"
];
let current = 0;
const answers = [];

// Elements
const qrSection = document.getElementById('qr-section');
const startBtn = document.getElementById('start-btn');
const quizScreen = document.getElementById('quiz-screen');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const resultScreen = document.getElementById('result-screen');
const resultList = document.getElementById('result-list');

// Genera opcions 0-10
function createOptions() {
  optionsDiv.innerHTML = '';
  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = i;
    btn.addEventListener('click', () => selectOption(i));
    optionsDiv.appendChild(btn);
  }
}

function showQuestion(idx) {
  questionText.textContent = `Q${idx+1}: ${questions[idx]}`;
  createOptions();
}

function selectOption(value) {
  answers.push(value);
  current++;
  if (current < questions.length) {
    showQuestion(current);
  } else {
    showResults();
  }
}

function showResults() {
  quizScreen.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  answers.forEach((val, idx) => {
    const li = document.createElement('li');
    li.textContent = `Q${idx+1}: ${val}`;
    resultList.appendChild(li);
  });
  // QR final
   // Després
const publicUrl = 'https://OPuig23.github.io/adventure-quiz/';
new QRCode(document.getElementById('qrcode-result'), publicUrl);

}

// Start
startBtn.addEventListener('click', () => {
  qrSection.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  showQuestion(0);
});