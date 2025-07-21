// Joc aventura Cal Blay (2024) - Resultats amb conclusions i logo

document.addEventListener('DOMContentLoaded', () => {
  const publicUrl = 'https://opuig23.github.io/adventure-quiz/';
  new QRCode(document.getElementById('qrcode-intro'), publicUrl);

  const questions = [
    { type: 'multiple', text: 'Quan cal resoldre una urgència, qui creus que reacciona més ràpid?', choices: ['Logística','Cuina','Manteniment','Serveis'], icon: '⚡' },
    { type: 'multiple', text: 'Quin departament ha millorat més aquest últim any?', choices: ['RRHH','Compres','Comercial Casaments','Transport'], icon: '⚡' },
    { type: 'multiple', text: 'A qui confiaries un projecte amb data límit crítica?', choices: ['Comercial Empresa','Producció Cuina','Restauració','I+D'], icon: '⚡' },
    { type: 'multiple', text: 'Qui creus que entén millor l’impacte econòmic del seu dia a dia?', choices: ['Comptabilitat','Compres','Restauració','Comercial Empresa'], icon: '⚡' },
    { type: 'multiple', text: 'Qui diries que està més alineat amb els objectius del bonus 2025?', choices: ['Foodlovers','Màrqueting','Cuina','Logística'], icon: '⚡' },
    { type: 'multiple', text: 'Qui creus que està innovant més (processos, serveis, idees noves)?', choices: ['I+D','Màrqueting','Foodlovers','Cuina'], icon: '💡' },
    { type: 'multiple', text: 'Quin equip s’ha adaptat millor als nous sistemes com l’ERP o CRM?', choices: ['Compres','RRHH','Comercial Empresa','Producció'], icon: '💡' },
    { type: 'multiple', text: 'A qui veus més actiu en la millora contínua del seu àmbit?', choices: ['Serveis','Qualitat','Cuina','RRHH'], icon: '💡' },
    { type: 'multiple', text: 'Qui fa millor ús de les eines digitals i noves tecnologies?', choices: ['Màrqueting','Comercial Casaments','Compres','Transport'], icon: '💡' },
    { type: 'multiple', text: 'Quin equip creus que pot marcar més la diferència aquest 2025?', choices: ['I+D','Foodlovers','Comercial Empresa','Masia Esplugues / Restauració'], icon: '💡' },
    { type: 'multiple', text: 'Amb qui és més fàcil treballar col·laborativament?', choices: ['Logística','Serveis','RRHH','Producció'], icon: '🤝' },
    { type: 'multiple', text: 'Qui transmet millor els valors de Cal Blay (equip, alegria, professionalitat…)?', choices: ['Restauració','RRHH','Comercial Casaments','Cuina'], icon: '🤝' },
    { type: 'multiple', text: 'Si haguessis de construir un nou projecte, quin departament voldries tenir al costat?', choices: ['I+D','Compres','Màrqueting','Transport'], icon: '🤝' },
    { type: 'multiple', text: 'Qui creus que té més compromís amb la sostenibilitat i el projecte “Green”?', choices: ['Cuina','Compres','Logística','Foodlovers'], icon: '🤝' },
    { type: 'multiple', text: 'Qui destaca més per la seva actitud positiva i esperit constructiu?', choices: ['Serveis','RRHH','Màrqueting','Restauració'], icon: '🤝' },
    { type: 'multiple', text: 'Qui aportarà més a assolir els objectius de facturació 2025?', choices: ['Comercial Empresa','Cuina','Foodlovers','Restauració'], icon: '🚀' },
    { type: 'multiple', text: 'Quin departament coneix millor el client final i sap què vol?', choices: ['Comercial Casaments','Restauració','Màrqueting','Serveis'], icon: '🚀' },
    { type: 'multiple', text: 'Qui contribueix més al creixement estratègic de Cal Blay?', choices: ['I+D','Comercial Empresa','Màrqueting','Producció'], icon: '🚀' },
    { type: 'multiple', text: 'A qui donaries el "Premi Cal Blay 2024"?', choices: ['RRHH','Cuina','Logística','Comercial Casaments'], icon: '🚀' },
    { type: 'multiple', text: 'Amb qui et sentiries més segur si competíssim per un premi d’excel·lència?', choices: ['Restauració','Comptabilitat','Foodlovers','Compres'], icon: '🚀' },
    { type: 'multiple', text: "Com valores el sistema d'incentius actual?", choices: [
      'Molt motivador i ben explicat',
      'Està bé però es podria personalitzar més',
      'Em costa entendre com funciona',
      'No m’afecta o no el conec prou'
    ], icon: '💰' },
    { type: 'multiple', text: 'Creus que aconseguirem els objectius d’aquest any (facturació, EBITDA…)?', choices: [
      'Sí, si seguim així','Potser, si tots ens activem més','Ho veig complicat','No, ens falta rumb'
    ], icon: '📈' },
    { type: 'multiple', text: 'Com creus que està posicionada Cal Blay respecte la competència?', choices: [
      'Som referents clars al sector','Estem al capdavant, però no ens podem relaxar',
      'Ens estan atrapant en algunes àrees','Ens falta més innovació i visibilitat'
    ], icon: '🏆' },
    { type: 'rating', text: 'Com valores el lideratge de Santi Carda com a CEO?', options: [...Array(11).keys()], icon: '⭐' },
    { type: 'multiple', text: 'Quin sentiment tens ara mateix respecte formar part de Cal Blay?', choices: [
      'Orgull i pertinença','Amb ganes de créixer amb l’empresa','Estic una mica desconnectat/da','Em plantejo canvis si no hi ha millores'
    ], icon: '😊' },
  ];

  // Estat
  let current = 0;
  let answers = [];
  let timer;
  let countdown = 20;
  let allResults = JSON.parse(localStorage.getItem('quizResults') || '[]');

  // Elements
  const startBtn = document.getElementById('start-btn');
  const qrSection = document.getElementById('qr-section');
  const quizScreen = document.getElementById('quiz-screen');
  const cardContainer = document.getElementById('card-container');
  const timerBar = document.getElementById('timer-bar');
  const timerText = document.getElementById('timer-text');
  const resultScreen = document.getElementById('result-screen');
  const resultList = document.getElementById('result-list');

  // Afegeix una barra de farciment pel temporitzador si no existeix
  if (!document.getElementById('timer-fill')) {
    const tf = document.createElement('div');
    tf.id = 'timer-fill';
    timerBar.prepend(tf);
  }
  const timerFill = document.getElementById('timer-fill');

  // Opcions a cada pregunta
  function createOptions(q) {
    const container = document.createElement('div');
    container.className = "option-list";
    if (q.type === 'rating') {
      for (let i = 1; i <= 10; i++) {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = i;
        btn.addEventListener('click', () => selectAnswer(i));
        container.appendChild(btn);
      }
    } else {
      q.choices.forEach((ch) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = ch;
        btn.addEventListener('click', () => selectAnswer(ch));
        container.appendChild(btn);
      });
    }
    return container;
  }

  // Mostra la pregunta idx
  function showCard(idx) {
    clearInterval(timer);
    cardContainer.innerHTML = '';
    timerFill.style.width = '100%'; timerText.textContent = '20s';
    let time = 20;

    const q = questions[idx];
    const card = document.createElement('div'); card.className = 'card';
    const title = document.createElement('p'); title.textContent = `Q${idx + 1}: ${q.text}`;
    card.appendChild(title); card.appendChild(createOptions(q));
    cardContainer.appendChild(card);

    timer = setInterval(() => {
      time--;
      timerFill.style.width = (time / 20 * 100) + '%';
      timerText.textContent = time + 's';
      if (time <= 0) selectAnswer(null);
    }, 1000);
  }

  // Desa resposta i avança
  function selectAnswer(value) {
    clearInterval(timer);
    answers.push(value);
    current++;
    if (current < questions.length) showCard(current);
    else showResults();
  }

  // Conclusions segons la resposta
  function getConclusion(qIdx, counts, winnerLabel) {
    // Reflexió personalitzada per a algunes preguntes:
    if (counts[winnerLabel] > (allResults.length + 1) * 0.7) {
      return `El grup té un clar consens: ${winnerLabel} destaca en aquest àmbit!`;
    } else if (counts[winnerLabel] <= 1) {
      return `Encara no hi ha prou respostes per obtenir conclusions sòlides.`;
    } else if (Object.values(counts).filter(c => c === counts[winnerLabel]).length > 1) {
      return `Resultat empatat entre diverses opcions.`;
    }
    // Missatge genèric
    return `La teva resposta coincideix amb la majoria (${winnerLabel}).`;
  }

  // Mostra resultats finals amb gràfic, conclusió i logo
  function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    // Desa resultats de l'usuari
    allResults.push(answers);
    localStorage.setItem('quizResults', JSON.stringify(allResults));

    resultList.innerHTML = "";
    questions.forEach((q, i) => {
      const card = document.createElement('div');
      card.className = "result-card";

      // Títol pregunta
      const h3 = document.createElement('h3');
      if (q.icon) {
        const em = document.createElement('span');
        em.className = "emoji";
        em.textContent = q.icon;
        h3.appendChild(em);
      }
      h3.appendChild(document.createTextNode(`P${i + 1}: ${q.text}`));
      card.appendChild(h3);

      // Recompte vots
      let counts = {};
      if (q.type === 'rating') {
        for (let n = 1; n <= 10; n++) counts[n] = 0;
      }
      allResults.forEach(r => {
        const ans = r[i];
        if (ans != null && ans !== '') counts[ans] = (counts[ans] || 0) + 1;
      });

      // Gràfic/barres
      const barCont = document.createElement('div');
      barCont.className = "result-bar-container";
      let max = 0, winner = null;
      (q.type === 'rating' ? [...Array(10).keys()].map(x => x + 1) : q.choices).forEach(label => {
        const val = counts[label] || 0;
        if (val > max) { max = val; winner = label; }
      });
      (q.type === 'rating' ? [...Array(10).keys()].map(x => x + 1) : q.choices).forEach(label => {
        const bar = document.createElement('div');
        bar.className = 'result-bar' + (counts[label] === max && max > 0 ? ' winner' : '');
        bar.style.height = (counts[label] * 18 + 36) + "px";
        bar.innerHTML = `<div class="result-bar-label">${label}</div><div class="result-votes">${counts[label] || 0} vot${(counts[label]||0)!==1?'s':''}</div>`;
        barCont.appendChild(bar);
      });
      card.appendChild(barCont);

      // Opció guanyadora
      if (winner)
        card.innerHTML += `<div style="margin-top:.5rem;"><strong>La teva resposta més votada:</strong> <span style="color:#226b3c;font-weight:600;">${winner}</span></div>`;

      // Conclusió automàtica
      card.innerHTML += `<div class="result-conclusion">${getConclusion(i, counts, winner)}</div>`;

      resultList.appendChild(card);
    });

    // Torna a posar el QR final
    new QRCode(document.getElementById('qrcode-result'), publicUrl);

    // Reset estat per si es torna a jugar
    current = 0; answers = [];
  }

  // Inicia el joc
  startBtn.addEventListener('click', () => {
    qrSection.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showCard(0);
  });
});
