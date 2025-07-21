document.addEventListener('DOMContentLoaded', () => {
  const publicUrl = 'https://opuig23.github.io/adventure-quiz/';
  new QRCode(document.getElementById('qrcode-intro'), publicUrl);

  const questions = [
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
    { type: 'multiple', text: "Com valores el sistema d'incentius actual?", choices: ['Molt motivador i ben explicat','Està bé però es podria personalitzar més','Em costa entendre com funciona','No m’afecta o no el conec prou'] },
    { type: 'multiple', text: "Creus que aconseguirem els objectius d’aquest any (facturació, EBITDA…)?", choices: ['Sí, si seguim així','Potser, si tots ens activem més','Ho veig complicat','No, ens falta rumb'] },
    { type: 'multiple', text: "Com creus que està posicionada Cal Blay respecte la competència?", choices: ['Som referents clars al sector','Estem al capdavant, però no ens podem relaxar','Ens estan atrapant en algunes àrees','Ens falta més innovació i visibilitat'] },
    { type: 'rating', text: "Com valores el lideratge de Santi Carda com a CEO?", options: [1,2,3,4,5,6,7,8,9,10] },
    { type: 'multiple', text: "Quin sentiment tens ara mateix respecte formar part de Cal Blay?", choices: ['Orgull i pertinença','Amb ganes de créixer amb l’empresa','Estic una mica desconnectat/da','Em plantejo canvis si no hi ha millores'] }
  ];

  let current = 0;
  const answers = [];
  let timer;

  // DOM
  const startBtn = document.getElementById('start-btn');
  const qrSection = document.getElementById('qr-section');
  const quizScreen = document.getElementById('quiz-screen');
  const cardContainer = document.getElementById('card-container');
  const timerFill = document.getElementById('timer-fill');
  const timerText = document.getElementById('timer-text');
  const resultScreen = document.getElementById('result-screen');
  const resultList = document.getElementById('result-list');

  function createOptions(q) {
    const container = document.createElement('div');
    if (q.type === 'text') {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Escriu la resposta...';
      input.addEventListener('change', () => selectAnswer(input.value));
      container.appendChild(input);
    } else {
      const items = q.type === 'rating' ? q.options : q.choices;
      items.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = item;
        btn.addEventListener('click', () => selectAnswer(item));
        container.appendChild(btn);
      });
    }
    return container;
  }

  function showCard(idx) {
    clearInterval(timer);
    cardContainer.innerHTML = '';
    timerFill.style.width = '100%';
    timerText.textContent = '20s';

    const q = questions[idx];
    const card = document.createElement('div');
    card.className = 'card';
    const title = document.createElement('p');
    title.textContent = `Q${idx+1}: ${q.text}`;
    card.appendChild(title);
    card.appendChild(createOptions(q));
    cardContainer.appendChild(card);

    let time = 20;
    timer = setInterval(() => {
      time--;
      timerFill.style.width = (time/20*100)+'%';
      timerText.textContent = time+'s';
      if (time <= 0) selectAnswer(null);
    }, 1000);
  }

  function selectAnswer(value) {
    clearInterval(timer);
    answers.push(value);
    current++;
    if (current < questions.length) showCard(current);
    else showResults();
  }

  // Resultats amb gràfic i conclusions
  function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    resultList.innerHTML = '';

    questions.forEach((q, idx) => {
      // Simulem respostes d'altres participants (20)
      let mockAnswers = [];
      if (q.type === 'multiple') {
        mockAnswers = [answers[idx], ...Array.from({length:19}, ()=>q.choices[Math.floor(Math.random()*q.choices.length)])];
      } else if (q.type === 'rating') {
        mockAnswers = [answers[idx], ...Array.from({length:19}, ()=>Math.ceil(Math.random()*10))];
      } else {
        mockAnswers = [answers[idx]];
      }

      // Crear contenidor
      const div = document.createElement('div');
      div.className = 'result-card';
      const questionTitle = document.createElement('h4');
      questionTitle.textContent = `P${idx+1}: ${q.text}`;
      div.appendChild(questionTitle);

      // Gràfic
      const canvas = document.createElement('canvas');
      canvas.height = 120;
      div.appendChild(canvas);

      let chart, conclusion;
      if (q.type === 'multiple') {
        const data = q.choices.map(opt => mockAnswers.filter(ans => ans === opt).length);
        const maxVotes = Math.max(...data);
        const winners = q.choices.filter((_,i)=>data[i]===maxVotes);
        conclusion = `L’opció més votada: <b>${winners.join(' / ')}</b> (${maxVotes} vots)`;
        chart = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: q.choices,
            datasets: [{ data, label: 'Vots', backgroundColor: '#a493e9' }]
          },
          options: { responsive:false, plugins: { legend:{display:false} } }
        });
      } else if (q.type === 'rating') {
        const data = [1,2,3,4,5,6,7,8,9,10].map(num=>mockAnswers.filter(x=>Number(x)===num).length);
        const avg = (mockAnswers.reduce((a,b)=>a+Number(b),0)/mockAnswers.length).toFixed(1);
        conclusion = `Mitjana de valoració: <b>${avg}</b> sobre 10`;
        chart = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: [1,2,3,4,5,6,7,8,9,10],
            datasets: [{ data, label: 'Vots', backgroundColor: '#ffd77c' }]
          },
          options: { responsive:false, plugins: { legend:{display:false} } }
        });
      } else {
        conclusion = `Resposta: <b>${answers[idx] || 'No contestada'}</b>`;
      }
      const concl = document.createElement('div');
      concl.innerHTML = conclusion;
      div.appendChild(concl);

      resultList.appendChild(div);
    });

    // QR final per compartir
    document.getElementById('qrcode-result').innerHTML = "";
    new QRCode(document.getElementById('qrcode-result'), publicUrl);
  }

  startBtn.addEventListener('click', () => {
    qrSection.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showCard(0);
  });
});
