const btnViagem = document.getElementById('btn-viagem');
const btnConfirmar = document.getElementById('btn-confirmar');
const btnFinalizar = document.getElementById('btn-finalizar');
const origemSelect = document.getElementById('origem-select');
const destinoSelect = document.getElementById('destino-select');
const btnVoltar = document.getElementById('btn-voltar');
const motoristaInput = document.getElementById('motorista-input');

const mainScreen = document.getElementById('main-screen');
const viagemScreen = document.getElementById('viagem-screen');
const timerScreen = document.getElementById('timer-screen');
const resumoScreen = document.getElementById('resumo-screen');

const origemNome = document.getElementById('origem-nome');
const destinoNome = document.getElementById('destino-nome');

const resumoOrigem = document.getElementById('resumo-origem');
const resumoDestino = document.getElementById('resumo-destino');
const resumoTempo = document.getElementById('resumo-tempo');
const timerDisplay = document.getElementById('timer');

const btnDmtConfirmar = document.getElementById('btn-dmt-confirmar');
const btnDmtCancelar = document.getElementById('btn-dmt-cancelar');
const btnDmtFechar = document.getElementById('btn-dmt-fechar');
const dmtInput = document.getElementById('dmt-input');
const dmtModal = document.getElementById('dmt-modal');


// Variáveis de controle
let timerInterval;
let startTime;
let currentOrigem = '';
let currentDestino = '';

// Funções auxiliares
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function parseTime(str) {
  const [hh, mm, ss] = str.split(":").map(Number);
  return hh * 3600 + mm * 60 + ss;
}

// Ações dos botões
btnViagem.onclick = () => {
  mainScreen.classList.add('hidden');
  viagemScreen.classList.remove('hidden');
  btnVoltar.classList.remove('hidden');
};

btnConfirmar.onclick = () => {
  const origem = origemSelect.value;
  const destino = destinoSelect.value;
  const motorista = motoristaInput.value.trim();
  const isOnlyNumbers = /^\d{1,6}$/.test(motorista);
  const isName = /^[a-zA-ZÀ-ÿ\s]{2,}$/.test(motorista);
  document.getElementById('resumo-motorista').textContent = motorista;
  if (!motorista || (!isOnlyNumbers && !isName)) {
  alert('Por favor, insira um NOME válido ou até 6 números para o motorista.');
  return;
}

  if (!origem) {
    alert('Por favor, selecione uma ORIGEM!');
    return;
  }
  if (!destino) {
    alert('Por favor, selecione um DESTINO!');
    return;
  }

  currentOrigem = origem;
  currentDestino = destino;

  viagemScreen.classList.add('hidden');
  timerScreen.classList.remove('hidden');

  origemNome.textContent = currentOrigem;
  destinoNome.textContent = currentDestino;

  btnVoltar.classList.remove('hidden');

  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    timerDisplay.textContent = formatTime(elapsed);
  }, 1000);
};

btnFinalizar.onclick = () => {
  clearInterval(timerInterval);
  dmtInput.value = "";
  dmtModal.classList.remove('hidden');
  dmtInput.focus();
};

btnDmtConfirmar.onclick = () => {
  const raw = String(dmtInput.value).trim();
  const dmtValue = parseFloat(raw);
  const oneDecimal = /^\d{1,2}(\.\d)?$/.test(raw);

  if (isNaN(dmtValue) || dmtValue < 0 || dmtValue > 10 || !oneDecimal) {
    alert('Insira um DMT válido entre 0.0 e 10.0 com UMA casa decimal.');
    return;
  }

  dmtModal.classList.add('hidden');

  const elapsed = Date.now() - startTime;
  const formattedTime = formatTime(elapsed);

  timerScreen.classList.add('hidden');
  resumoScreen.classList.remove('hidden');

  resumoOrigem.textContent = currentOrigem || 'Não informada';
  resumoDestino.textContent = currentDestino;
  resumoTempo.textContent = `${formattedTime} | DMT: ${dmtValue.toFixed(1)}`;

  btnVoltar.classList.add('hidden');
};

btnDmtCancelar.onclick = btnDmtFechar.onclick = () => {
  dmtModal.classList.add('hidden');
  dmtInput.value = "";
  startTime = Date.now() - (parseTime(timerDisplay.textContent) * 1000);
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    timerDisplay.textContent = formatTime(elapsed);
  }, 1000);
};

btnVoltar.onclick = () => {
  if (!viagemScreen.classList.contains('hidden')) {
    viagemScreen.classList.add('hidden');
    mainScreen.classList.remove('hidden');
    btnVoltar.classList.add('hidden');
  } else if (!timerScreen.classList.contains('hidden')) {
    clearInterval(timerInterval);
    timerScreen.classList.add('hidden');
    viagemScreen.classList.remove('hidden');
  }
};