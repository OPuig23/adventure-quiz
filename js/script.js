ocument.addEventListener('DOMContentLoaded', () => {
  const publicUrl = 'https://opuig23.github.io/adventure-quiz/';
  // Elements
  const setupSection = document.getElementById('setup-section');
  const qrSection    = document.getElementById('qr-section');
  const quizScreen   = document.getElementById('quiz-screen');
  const waitScreen   = document.getElementById('wait-screen');
  const resultScreen = document.getElementById('result-screen');

  const numInput     = document.getElementById('num-participants');
  const setupBtn     = document.getElementById('setup-btn');
  const startBtn     = document.getElementById('start-btn');

  const totalCountEl   = document.getElementById('total-count');
  const currentCountEl = document.getElementById('current-count');

  const cardContainer = document.getElementById('card-container');
  const timerFill     = document.getElementById('timer-fill');
  const timerText     = document.getElementById('timer-text');

  const resultList    = document.getElementById('result-list');

  // Preguntes
  const questions = [ /* ... les 25 preguntes igual que abans ... */
 
    { type: 'multiple', text: 'Quan cal resoldre una urgència, qui creus que reacciona més ràpid?', choices: ['Logística','Cuina','Manteniment','Serveis'] },
    { type: 'multiple', text: 'Quin departament ha millorat més aquest últim any?', choices: ['RRHH','Compres','Comercial Casaments','Transport'] },
    { type: 'multiple', text: 'A qui confiaries un projecte amb data límit crítica?', choices: ['Comercial Empresa','Producció Cuina','Restauració','I+D'] },
    { type: 'multiple', text: 'Qui creus que entén millor l’impacte econòmic del seu dia a dia?', choices: ['Comptabilitat','Compres','Restauració','Comercial Empresa'] },
    { type: 'multiple', text: 'Qui diries que està més alineat amb els objectius del bonus 2025?', choices: ['Foodlovers','Màrqueting','Cuina','Logística'] },
    { type: 'multiple', text: 'Qui creus que està innovant més (processos, serveis, idees noves)?', choices: ['I+D','Màrqueting','Foodlovers','Cuina'] },
    { type: 'multiple', text: 'Quin equip s’ha adaptat millor als nous sistemes com l’ERP o CRM?', choices: ['Compres','RRHH','Comercial Empresa','Producció'] },
    { type: 'multiple', text: 'A qui veus més actiu en la millora contínua del seu àmbit?', choices: ['Serveis','Qualitat','Cuina','RRHH'] },
    { type: 'multiple', text: 'Qui fa millor ús de les eines digitals i noves tecnologies?', choices: ['Màrqueting','Comercial Casaments','Compres','Transport'] },
    { type: 'multiple', text: 'Quin equip creus que pot marcar més la diferència aquest 2025?', choices: ['I+D','Foodlovers','Comercial Empresa','Masia Esplugues / Restauració'] },
    { type: 'multiple', text: 'Amb qui és més fàcil treballar col·laborativament?', choices: ['Logística','Serveis','RRHH','Producció'] },
    { type: 'multiple', text: 'Qui transmet millor els valors de Cal Blay (equip, alegria, professionalitat…)?', choices: ['Restauració','RRHH','Comercial Casaments','Cuina'] },
    { type: 'multiple', text: 'Si haguessis de construir un nou projecte, quin departament voldries tenir al costat?', choices: ['I+D','Compres','Màrqueting','Transport'] },
    { type: 'multiple', text: 'Qui creus que té més compromís amb la sostenibilitat i el projecte “Green”?', choices: ['Cuina','Compres','Logística','Foodlovers'] },
    { type: 'multiple', text: 'Qui destaca més per la seva actitud positiva i esperit constructiu?', choices: ['Serveis','RRHH','Màrqueting','Restauració'] },
    { type: 'multiple', text: 'Qui aportarà més a assolir els objectius de facturació 2025?', choices: ['Comercial Empresa','Cuina','Foodlovers','Restauració'] },
    { type: 'multiple', text: 'Quin departament coneix millor el client final i sap què vol?', choices: ['Comercial Casaments','Restauració','Màrqueting','Serveis'] },
    { type: 'multiple', text: 'Qui contribueix més al creixement estratègic de Cal Blay?', choices: ['I+D','Comercial Empresa','Màrqueting','Producció'] },
    { type: 'multiple', text: 'A qui donaries el "Premi Cal Blay 2024"?', choices: ['RRHH','Cuina','Logística','Comercial Casaments'] },
    { type: 'multiple', text: 'Amb qui et sentiries més segur si competíssim per un premi d’excel·lència?', choices: ['Restauració','Comptabilitat','Foodlovers','Compres'] },
    { type: 'multiple', text: 'Com valores el sistema d’incentius actual?', choices: ['Molt motivador i ben explicat','Està bé però es podria personalitzar més','Em costa entendre com funciona','No m’afecta o no el conec prou'] },
    { type: 'multiple', text: 'Creus que aconseguirem els objectius d’aquest any (facturació, EBITDA…)?', choices: ['Sí, si seguim així','Potser, si tots ens activem més','Ho veig complicat','No, ens falta rumb'] },
    { type: 'multiple', text: 'Com creus que està posicionada Cal Blay respecte la competència?', choices: ['Som referents clars al sector','Estem al capdavant, però no ens podem relaxar','Ens estan atrapant en algunes àrees','Ens falta més innovació i visibilitat'] },
    { type: 'rating',   text: 'Com valores el lideratge de Santi Carda com a CEO?', options: [...Array(10).keys()].map(n=>n+1) },
    { type: 'multiple', text: 'Quin sentiment tens ara mateix respecte formar part de Cal Blay?', choices: ['Orgull i pertinença','Amb ganes de créixer amb l’empresa','Estic una mica desconnectat/da','Em plantejo canvis si no hi ha millores'] }
  ];

 let totalParticipants = 0;
  let responses = [];
  let timerId, currentQ = 0, timer = 20;

  // --- Funció per mostrar la pregunta actual
  function showQuestion() {
    clearInterval(timerId);
    timer = 20;
    timerFill.style.width = '100%';
    timerText.textContent = '20s';
    cardContainer.innerHTML = '';

    if (currentQ >= questions.length) {
      endQuiz();
      return;
    }

    const q = questions[currentQ];
    const card = document.createElement('div');
    card.className = 'card';
    const p = document.createElement('p');
    p.textContent = `Q${currentQ+1}: ${q.text}`;
    card.appendChild(p);

    q.choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = ch;
      btn.addEventListener('click', () => selectAnswer(ch));
      card.appendChild(btn);
    });

    cardContainer.appendChild(card);

    // Començar temporitzador
    timerId = setInterval(() => {
      timer--;
      timerFill.style.width = (timer / 20 * 100) + '%';
      timerText.textContent = timer + 's';
      if (timer <= 0) selectAnswer(null);
    }, 1000);
  }

  // --- Desa la resposta i passa al següent participant/pregunta
  function selectAnswer(ans) {
    clearInterval(timerId);
    responses.push(ans);
    currentCountEl.textContent = responses.length;

    if (responses.length < totalParticipants) {
      // Si encara falten participants, anem al wait-screen
      quizScreen.classList.add('hidden');
      waitScreen.classList.remove('hidden');
    } else {
      // Tothom ha respost: acabem
      endQuiz();
    }
  }

  // --- Quan tothom ha respost
  function endQuiz() {
    waitScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    // Renderitza resultats (simplificat)
    resultList.innerHTML = '';
    questions.forEach((q,i) => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `<strong>Q${i+1}:</strong> ${q.text}<br>
        <em>(Aquí hi anirien gràfics i conclusions)</em>`;
      resultList.appendChild(div);
    });

    // QR per tornar a començar
    new QRCode(document.getElementById('qrcode-result'), publicUrl);
  }

  // --- Setup inicial
  function init() {
    // Si la ronda ja s'ha començat (admin), saltem setup+QR
    if (localStorage.getItem('quizStarted') === 'yes') {
      totalParticipants = parseInt(localStorage.getItem('quizTotal')) || 0;
      setupSection.classList.add('hidden');
      qrSection.classList.add('hidden');
      quizScreen.classList.remove('hidden');
      showQuestion();
      return;
    }

    // Si no, mostrem formulari de configuració
    setupSection.classList.remove('hidden');
  }

  // --- Botó “Comença Enquesta” (admin)
  setupBtn.addEventListener('click', () => {
    totalParticipants = parseInt(numInput.value);
    if (!totalParticipants || totalParticipants < 1) {
      alert('Introdueix un nombre vàlid de participants.');
      return;
    }
    // Marquem que l’enquesta ha començat i enmagatzemem total
    localStorage.setItem('quizStarted', 'yes');
    localStorage.setItem('quizTotal', totalParticipants);

    setupSection.classList.add('hidden');
    qrSection.classList.remove('hidden');
    totalCountEl.textContent = totalParticipants;

    // Generem QR perquè els participants escanegin
    new QRCode(document.getElementById('qrcode-intro'), publicUrl);
  });

  // --- Botó “Comença Enquesta” (participants)
  startBtn.addEventListener('click', () => {
    qrSection.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showQuestion();
  });

  // Iniciem
  init();
});