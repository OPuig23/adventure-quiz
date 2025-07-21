// script.js
document.addEventListener('DOMContentLoaded', () => {
  const publicUrl = 'https://opuig23.github.io/adventure-quiz/';

  // DOM elements
  const setupSection = document.getElementById('setup-section');
  const setupBtn     = document.getElementById('setup-btn');
  const numInput     = document.getElementById('num-participants');

  const qrSection    = document.getElementById('qr-section');
  const qrcodeIntro  = document.getElementById('qrcode-intro');
  const startBtn     = document.getElementById('start-btn');

  const quizScreen   = document.getElementById('quiz-screen');
  const cardContainer= document.getElementById('card-container');

  const waitScreen   = document.getElementById('wait-screen');
  const currentCount = document.getElementById('current-count');
  const totalCount   = document.getElementById('total-count');

  const resultScreen = document.getElementById('result-screen');
  const resultList   = document.getElementById('result-list');

  let totalParticipants = 0;
  let current = 0, answers = [], timer;

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

 // 1. Setup: defineix nombre de participants
  setupBtn.onclick = () => {
    const n = parseInt(numInput.value);
    if (!n || n < 1) return alert('Introdueix un nombre vàlid de participants');
    totalParticipants = n;
    totalCount.textContent = n;

    setupSection.classList.add('hidden');
    // Generem el QR a la pantalla següent
    new QRCode(qrcodeIntro, publicUrl);
    qrSection.classList.remove('hidden');
  };

  // 2. Al click de "Comença Enquesta" (QR done)
  startBtn.onclick = () => {
    qrSection.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    showCard(0);
  };

  // 3. Funció per al timer
  function startTimer(cb) {
    const bar = document.getElementById('timer-bar');
    bar.innerHTML = '<div id="timer-fill"></div><span id="timer-text">20s</span>';
    const fill = document.getElementById('timer-fill');
    const text = document.getElementById('timer-text');
    let t = 20;
    fill.style.width = '100%';
    timer = setInterval(() => {
      t--;
      fill.style.width = (t/20*100) + '%';
      text.textContent = t + 's';
      if (t <= 0) {
        clearInterval(timer);
        cb(null);
      }
    }, 1000);
  }

  // 4. Mostrar pregunta
  function showCard(idx) {
    clearInterval(timer);
    cardContainer.innerHTML = '';
    startTimer(selectAnswer);

    const q = questions[idx];
    const card = document.createElement('div');
    card.className = 'card';

    const h3 = document.createElement('h3');
    h3.textContent = `P${idx+1}: ${q.text}`;
    card.appendChild(h3);

    const opts = document.createElement('div');
    opts.className = 'options';

    const arr = q.type === 'rating' ? q.options : q.choices;
    arr.forEach(opt => {
      const b = document.createElement('button');
      b.className = 'option-btn';
      b.textContent = opt;
      b.onclick = () => selectAnswer(opt);
      opts.appendChild(b);
    });

    card.appendChild(opts);
    cardContainer.appendChild(card);
  }

  // 5. Desa la resposta i, si és l'última, POST al servidor
  function selectAnswer(value) {
    clearInterval(timer);
    answers.push(value);
    current++;
    if (current < questions.length) {
      return showCard(current);
    }

    // Envia les respostes al backend d'Apps Script
    fetch('YOUR_WEB_APP_URL', {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ answers })
    })
    .then(() => waitForAll())
    .catch(console.error);
  }

  // 6. Pàgina d'espera fins que tothom hagi votat
  function waitForAll() {
    quizScreen.classList.add('hidden');
    waitScreen.classList.remove('hidden');

    const iv = setInterval(() => {
      fetch('YOUR_WEB_APP_URL')
        .then(res => res.json())
        .then(data => {
          currentCount.textContent = data.count;
          if (data.count >= totalParticipants) {
            clearInterval(iv);
            displayAggregated(data.aggregated);
          }
        });
    }, 2000);
  }

  // 7. Mostra resultats agregats
  function displayAggregated(agg) {
    waitScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    resultList.innerHTML = '';

    questions.forEach((q, i) => {
      const counts = agg[i] || {};
      const card = document.createElement('div');
      card.className = 'result-card';

      const h3 = document.createElement('h3');
      h3.textContent = `P${i+1}: ${q.text}`;
      card.appendChild(h3);

      // Si és rating: mitjana, moda, comentari
      if (q.type === 'rating') {
        const arr = [];
        Object.entries(counts).forEach(([k,v]) => {
          for (let j=0; j<v; j++) arr.push(Number(k));
        });
        const m = calcularMitjana(arr),
              mo = calcularModa(arr),
              c = comentariLideratge(m);

        const pm = document.createElement('div');
        pm.className = 'result-metrics';
        pm.innerHTML = `Mitjana: <b>${m}</b> · Moda: <b>${mo}</b>`;
        card.appendChild(pm);

        const cc = document.createElement('div');
        cc.className = 'comentari-ia';
        cc.textContent = c;
        card.appendChild(cc);
      }

      // Gràfica de barres
      const barcont = document.createElement('div');
      barcont.className = 'result-bars';
      const total = Object.values(counts).reduce((a,b)=>a+b,0);
      const maxV = Math.max(...Object.values(counts),0);
      const win  = Object.keys(counts).find(k=>counts[k] === maxV);

      const arr = q.type==='rating' ? q.options : q.choices;
      arr.forEach(opt => {
        const sp = document.createElement('span');
        sp.className = 'result-bar' + (counts[opt] === maxV ? ' selected' : '');
        sp.innerHTML = `${opt}<br>${counts[opt]||0} vot${(counts[opt]||0)!==1?'s':''}`;
        barcont.appendChild(sp);
      });
      card.appendChild(barcont);

      // Reflexió IA
      if (q.type === 'multiple') {
        const perc = total ? Math.round(counts[win]/total*100) : 0;
        const r = reflexioPregunta(q.text, win, perc);
        const rc = document.createElement('div');
        rc.className = 'comentari-ia';
        rc.textContent = r;
        card.appendChild(rc);
      }

      resultList.appendChild(card);
    });
  }

  // --- Funcions IA de càlcul i comentaris (ja definides abans) ---
  function calcularMitjana(a){ if(!a.length)return 0; const s=a.reduce((x,y)=>x+Number(y),0); return (s/a.length).toFixed(2);}
  function calcularModa(a){ if(!a.length)return null; const c={}; a.forEach(v=>c[v]=(c[v]||0)+1); let m=a[0],mc=c[m]; for(let k in c) if(c[k]>mc){m=k;mc=c[k];} return m;}
  function comentariLideratge(m){ m=Number(m); if(m>=8) return "Lideratge top – Santi, ja pots reservar taula per als Oscars! 🍾"; if(m>=6) return "Sòlid, però sempre hi ha marge de millora. Un cafè amb l’equip mai fa mal! ☕"; if(m>=4) return "Zona d’alerta – Potser cal una jornada d’alineació blayana! ⚠️"; if(m>0) return "Ai, ai… Necessitem feedback i un esmorzar d’equip urgent! 🍳"; return "Encara no hi ha prou respostes per obtenir conclusions sòlides."; }
  function reflexioPregunta(t,win,p){ if(t.includes("urgència")){ if(win==="Logística") return "Els camions de Cal Blya arriben abans que Amazon Prime!"; if(win==="Cuina") return "La cuina reacciona més ràpid que el microones! 👨‍🍳"; if(win==="Manteniment") return "Manteniment: més ràpids que una fuita d’aigua! 🚰"; if(win==="Serveis") return "Serveis? Hi són abans que truquis!"; } if(p>70) return "Consens claríssim! L’equip ho té molt clar. ✅"; if(p>40) return "La majoria coincideix, però hi ha debat. 🤔"; return "Opinions repartides— potser brainstorm imminent! 🧠"; }
});