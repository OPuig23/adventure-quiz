// Paràmetres URL
const params    = new URLSearchParams(window.location.search);
let sessionId   = params.get("session");
const isAdmin   = !sessionId;

// DOM
const setupSec  = document.getElementById("setup-section");
const qrSec     = document.getElementById("qr-section");
const waitSec   = document.getElementById("wait-section");
const quizSec   = document.getElementById("quiz-screen");
const resultSec = document.getElementById("result-screen");

const setupBtn  = document.getElementById("setup-btn");
const startBtn  = document.getElementById("start-btn");
const qrcodeEl  = document.getElementById("qrcode-intro");
const timerBar  = document.getElementById("timer-bar");
const timerTxt  = document.getElementById("timer-text");
const cardCont  = document.getElementById("card-container");
const resultUL  = document.getElementById("result-list");

let participants=0, current=0, timer;

// Preguntes
const questions = [
  { text: "Quan cal resoldre una urgència, qui creus que reacciona més ràpid?",     choices: ['Logística','Cuina','Manteniment','Serveis'    ] },
  { text: "Quin departament ha millorat més aquest últim any?",                      choices: ['RRHH','Compres','Comercial Casaments','Transport'] },
  { text: "A qui confiaries un projecte amb data límit crítica?",                    choices: ['Comercial Empresa','Producció Cuina','Restauració','I+D'] },
  { text: "Qui creus que entén millor l’impacte econòmic del seu dia a dia?",       choices: ['Comptabilitat','Compres','Restauració','Comercial Empresa'] },
  { text: "Qui diries que està més alineat amb els objectius del bonus 2025?",      choices: ['Foodlovers','Màrqueting','Cuina','Logística'] },
  { text: " Qui creus que està innovant més (processos, serveis, idees noves)?",     choices: ['I+D','Màrqueting','Foodlovers','Cuina'] },
  { text: "Quin equip s’ha adaptat millor als nous sistemes com l’ERP o CRM?",       choices: ['Compres','RRHH','Comercial Empresa','Producció'] },
  { text: "A qui veus més actiu en la millora contínua del seu àmbit?",             choices: ['Serveis','Qualitat','Cuina','RRHH'] },
  { text: "Qui fa millor ús de les eines digitals i noves tecnologies?",            choices: ['Màrqueting','Comercial Casaments','Compres','Transport'] },
  { text: "Quin equip creus que pot marcar més la diferència aquest 2025?",         choices: ['I+D','Foodlovers','Comercial Empresa','Masia Esplugues'] },
  { text: "Amb qui és més fàcil treballar col·laborativament?",                      choices: ['Logística','Serveis','RRHH','Producció'] },
  { text: "Qui transmet millor els valors de Cal Blay (equip, alegria…)?",           choices: ['Restauració','RRHH','Comercial Casaments','Cuina'] },
  { text: "Si haguessis de construir un nou projecte, quin departament voldries?", choices: ['I+D','Compres','Màrqueting','Transport'] },
  { text: "Qui creus que té més compromís amb la sostenibilitat i “Green”?",         choices: ['Cuina','Compres','Logística','Foodlovers'] },
  { text: "Qui destaca més per la seva actitud positiva i esperit constructiu?",     choices: ['Serveis','RRHH','Màrqueting','Restauració'] },
  { text: "Qui aportarà més a assolir els objectius de facturació 2025?",           choices: ['Comercial Empresa','Cuina','Foodlovers','Restauració'] },
  { text: "Quin dept coneix millor el client final i sap què vol?",                  choices: ['Comercial Casaments','Restauració','Màrqueting','Serveis'] },
  { text: "Qui contribueix més al creixement estratègic de Cal Blay?",              choices: ['I+D','Comercial Empresa','Màrqueting','Producció'] },
  { text: "A qui donaries el “Premi Cal Blay 2024”?",                               choices: ['RRHH','Cuina','Logística','Comercial Casaments'] },
  { text: "Amb qui et sentiries més segur per un premi d’excel·lència?",            choices: ['Restauració','Comptabilitat','Foodlovers','Compres'] },
  { text: "Com valores el sistema d’incentius actual?",                            choices: ['Molt motivador','Podria millorar','Em costa entendre','No el conec'] },
  { text: "Creus que aconseguirem els objectius d’aquest any?",                     choices: ['Sí','Potser','Ho veig complicat','No'] },
  { text: "Com està posicionada Cal Blay respecte la competència?",                 choices: ['Som líders','Estem ben situats','Ens estan atrapant','Cal innovar més'] },
  { text: "Com valores el lideratge de Santi Carda com a CEO? (1–10)",              choices: [1,2,3,4,5,6,7,8,9,10] },
  { text: "Quin sentiment tens sobre formar part de Cal Blay?",                     choices: ['Orgull','Amb ganes','Una mica desconnectat','Em plantejo canvis'] }
];

// ADMIN
if(isAdmin){
  setupSec.classList.remove("hidden");
  setupBtn.onclick = async ()=>{
    participants = parseInt(document.getElementById("num-participants").value)||0;
    if(participants<1) return alert("Almenys 1 participant");
    const ref = db.collection("sessions").doc();
    await ref.set({
      count: participants,
      state:"waiting",
      created: firebase.firestore.FieldValue.serverTimestamp(),
      responses: []
    });
    sessionId = ref.id;
    new QRCode(qrcodeEl, `${location.origin+location.pathname}?session=${sessionId}`);
    setupSec.classList.add("hidden");
    qrSec.classList.remove("hidden");
    startBtn.onclick = async ()=>{
      await ref.update({ state:"started", started: firebase.firestore.FieldValue.serverTimestamp() });
      qrSec.classList.add("hidden");
      resultSec.classList.remove("hidden");
      listenResults(ref);
    };
  };
}
// PARTICIPANT
else {
  setupSec.classList.add("hidden");
  const ref = db.collection("sessions").doc(sessionId);
  ref.update({ joined: firebase.firestore.FieldValue.arrayUnion(firebase.firestore.FieldValue.serverTimestamp()) });
  onSnapshot(ref, snap=>{
    const data = snap.data();
    if(data.state==="started"){
      waitSec.classList.add("hidden");
      quizSec.classList.remove("hidden");
      showQuestion(0, ref);
    }
  });
  waitSec.classList.remove("hidden");
}

// PARTICIPANT functions
function showQuestion(idx, ref){
  clearInterval(timer);
  if(idx>=questions.length) return;
  current = idx;
  cardCont.innerHTML = "";
  const q = questions[idx];
  const card = document.createElement("div"); card.className="card";
  const p = document.createElement("p"); p.textContent=`P${idx+1}: ${q.text}`;
  card.appendChild(p);
  q.choices.forEach(opt=>{
    const b=document.createElement("button");
    b.className="option-btn"; b.textContent=opt;
    b.onclick=()=>submitAnswer(ref, idx+1, opt);
    card.appendChild(b);
  });
  cardCont.appendChild(card);
  let t=20;
  timerTxt.textContent=`20s`; timerBar.style.setProperty("--fill","100%");
  timer = setInterval(()=>{
    t--; timerTxt.textContent=`${t}s`;
    timerBar.style.width=(t/20*100)+"%";
    if(t<=0) submitAnswer(ref, idx+1, null);
  },1000);
}

async function submitAnswer(ref, qnum, ans){
  clearInterval(timer);
  await ref.update({ responses: firebase.firestore.FieldValue.arrayUnion({ q:qnum, a:ans })});
  showQuestion(current+1, ref);
}

// ADMIN results
function listenResults(ref){
  onSnapshot(ref, snap=>{
    const data = snap.data();
    const resps = data.responses||[];
    if(resps.length >= participants*questions.length){
      renderResults(resps);
    }
  });
}

function renderResults(resps){
  resultUL.innerHTML="";
  questions.forEach((q,i)=>{
    const votes = resps.filter(r=>r.q===i+1).map(r=>r.a);
    const counts = {};
    votes.forEach(v=> counts[v]=(counts[v]||0)+1 );
    const top = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]||["-",0];
    const li = document.createElement("li");
    li.innerHTML = `
      <p><strong>P${i+1}:</strong> ${q.text}</p>
      <div class="chart">
        ${Object.entries(counts).map(([opt,c])=>`<span class="bar" style="width:${c*15}px">${opt}: ${c}</span>`).join("")}
      </div>
      <p class="concl">Opció més votada: <em>${top[0]} (${top[1]} vots)</em></p>
    `;
    resultUL.appendChild(li);
  });
}
