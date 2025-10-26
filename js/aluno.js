
// js/aluno.js
import { db } from './firebase-config.js';
import { ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const selectPonto = document.getElementById('selectPonto');
const btnSalvar = document.getElementById('btn-salvar');
const btnVolta = document.getElementById('btn-volta');
const btnCancela = document.getElementById('btn-cancela');
const statusEl = document.getElementById('status');
const logoutBtn = document.getElementById('btn-logout');

const matricula = localStorage.getItem('matricula');
if(!matricula){ alert('Faça login novamente'); location.href='index.html'; }

let map, vanMarker;

window.initMap = function(){
  const centro = { lat:-3.729, lng:-38.525 };
  map = new google.maps.Map(document.getElementById('map'), { center: centro, zoom: 13 });
  vanMarker = new google.maps.Marker({ position: centro, map, title: 'Van', icon: 'https://maps.google.com/mapfiles/ms/icons/bus.png' });

  const vanRef = ref(db, 'van');
  onValue(vanRef, snap => {
    const v = snap.val();
    if(v && v.latitude && v.longitude){
      const pos = { lat: v.latitude, lng: v.longitude };
      vanMarker.setPosition(pos);
      map.panTo(pos);
      statusEl.innerText = `Van a ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`;
    } else {
      statusEl.innerText = 'Aguardando localização da van...';
    }
  });
};

btnSalvar.addEventListener('click', ()=>{
  const ponto = selectPonto.value;
  if(!ponto){ alert('Selecione um ponto'); return; }
  update(ref(db, 'alunos/' + matricula), { nome: matricula, ponto: ponto, volta: false });
  alert('Ponto salvo');
});

btnVolta.addEventListener('click', ()=>{
  const ponto = selectPonto.value;
  if(!ponto){ alert('Escolha o ponto'); return; }
  update(ref(db, 'alunos/' + matricula), { nome: matricula, ponto: ponto, volta: true });
  btnVolta.style.background = '#4caf50';
  statusEl.innerText = 'Você marcou volta: ' + ponto;
});

btnCancela.addEventListener('click', ()=>{
  update(ref(db, 'alunos/' + matricula), { volta: false });
  btnVolta.style.background = '#0077cc';
  statusEl.innerText = 'Você cancelou a volta.';
});

logoutBtn.addEventListener('click', ()=>{ localStorage.removeItem('matricula'); location.href='index.html'; });
