
// js/motorista.js
import { db } from './firebase-config.js';
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const btnShare = document.getElementById('btn-share');
const btnStop = document.getElementById('btn-stop');
const listaAlunos = document.getElementById('lista-alunos');
const logoutBtn = document.getElementById('btn-logout');

let watchId = null;
let map, marker;

window.initMap = function(){
  const centro = { lat:-3.729, lng:-38.525 };
  map = new google.maps.Map(document.getElementById('map'), { center: centro, zoom: 13 });
  marker = new google.maps.Marker({ position: centro, map, title: 'Você (van)', icon: 'https://maps.google.com/mapfiles/ms/icons/bus.png' });
};

function startSharing(){
  if(!navigator.geolocation){ alert('Geolocation não suportada'); return; }
  watchId = navigator.geolocation.watchPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    set(ref(db, 'van'), { latitude: lat, longitude: lng, timestamp: Date.now() });
    marker.setPosition({ lat, lng });
    map.panTo({ lat, lng });
  }, err => { console.error(err); alert('Erro ao acessar GPS'); }, { enableHighAccuracy:true, maximumAge:2000, timeout:5000 });
}

function stopSharing(){
  if(watchId !== null){ navigator.geolocation.clearWatch(watchId); watchId = null; }
}

btnShare.addEventListener('click', ()=>{ startSharing(); btnShare.disabled=true; btnStop.disabled=false; });
btnStop.addEventListener('click', ()=>{ stopSharing(); btnShare.disabled=false; btnStop.disabled=true; });

logoutBtn.addEventListener('click', ()=>{ localStorage.removeItem('matricula'); location.href='index.html'; });

// Lista alunos que marcaram volta
const alunosRef = ref(db, 'alunos');
onValue(alunosRef, snap => {
  const data = snap.val() || {};
  listaAlunos.innerHTML = '';
  let any=false;
  Object.entries(data).forEach(([id, info])=>{
    if(info && info.volta){
      any=true;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${info.nome || id}</td><td>${info.ponto || '-'}</td>`;
      listaAlunos.appendChild(tr);
    }
  });
  if(!any) listaAlunos.innerHTML = '<tr><td colspan="2">Nenhum aluno marcou volta</td></tr>';
});
