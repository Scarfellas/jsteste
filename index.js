const btnViagem = document.getElementById('btn-viagem');
const btnOutros = document.getElementById('btn-outros');

const btnConfirmar = document.getElementById('btn-confirmar');
const btnFinalizar = document.getElementById('btn-finalizar');

const motoristaInput = document.getElementById('motorista-input');
const origemSelect = document.getElementById('origem-select');
const destinoSelect = document.getElementById('destino-select');

// Voltar (flutuante) e voltar internos
const btnVoltar = document.getElementById('btn-voltar');
const btnViagemVoltar = document.getElementById('btn-viagem-voltar');
const btnOutrosVoltar = document.getElementById('btn-outros-voltar');

const mainScreen = document.getElementById('main-screen');
const viagemScreen = document.getElementById('viagem-screen');
const outrosScreen = document.getElementById('outros-screen');
const timerScreen = document.getElementById('timer-screen');
const resumoScreen = document.getElementById('resumo-screen');
const resumoParadaScreen = document.getElementById('resumo-parada-screen');

const origemNome = document.getElementById('origem-nome');
const destinoNome = document.getElementById('destino-nome');
const paradaTitulo = document.getElementById('parada-titulo');
const paradaNomeSpan = document.getElementById('parada-nome');

const resumoMotorista = document.getElementById('resumo-motorista');
const resumoOrigem = document.getElementById('resumo-origem');
const resumoDestino = document.getElementById('resumo-destino');
const resumoTempo = document.getElementById('resumo-tempo');

const resumoParadaNome = document.getElementById('resumo-parada-nome');
const resumoParadaTempo = document.getElementById('resumo-parada-tempo');

const viagemTitulo = document.getElementById('viagem-titulo');
const timerDisplay = document.getElementById('timer');

// DMT
const btnDmtConfirmar = document.getElementById('btn-dmt-confirmar');
const btnDmtCancelar = document.getElementById('btn-dmt-cancelar');
const btnDmtFechar = document.getElementById('btn-dmt-fechar');
const dmtInput = document.getElementById('dmt-input');
const dmtModal = document.getElementById('dmt-modal');

// CONFIRMAÇÃO FINALIZAR
const confirmModal = document.getElementById('confirm-modal');
const btnConfirmYes = document.getElementById('btn-confirm-yes');
const btnConfirmNo = document.getElementById('btn-confirm-no');
const confirmText = document.getElementById('confirm-text');

// Lista de paradas
const listaParadas = document.getElementById('lista-paradas');

// ====== ESTADO ======
let timerInterval;
let startTime;
let mode = null; // 'viagem' | 'parada'
let currentOrigem = '';
let currentDestino = '';
let currentMotorista = '';
let currentParada = '';

// ====== FUNÇÕES AUXILIARES ======
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function parseTime(str) {
  const [hh, mm, ss] = str.split(':').map(Number);
  return hh * 3600 + mm * 60 + ss;
}

function startTimer() {
  startTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    timerDisplay.textContent = formatTime(elapsed);
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
}

function elapsedFormatted() {
  const elapsed = Date.now() - startTime;
  return formatTime(elapsed);
}

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

// ====== FLUXO VIAGEM ======
btnViagem.onclick = () => {
  mode = 'viagem';
  hide(mainScreen);
  show(viagemScreen);
  btnVoltar.classList.remove('hidden'); // exibe o flutuante se quiser
};

btnConfirmar.onclick = () => {
  const origem = origemSelect.value;
  const destino = destinoSelect.value;
  const motorista = motoristaInput.value.trim();

  const isOnlyNumbers = /^\d{1,6}$/.test(motorista);
  const isName = /^[a-zA-ZÀ-ÿ\s]{2,}$/.test(motorista);

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

  currentMotorista = motorista;
  currentOrigem = origem;
  currentDestino = destino;

  // Ajusta títulos para viagem
  viagemTitulo.classList.remove('hidden');
  paradaTitulo.classList.add('hidden');

  origemNome.textContent = currentOrigem;
  destinoNome.textContent = currentDestino;

  hide(viagemScreen);
  show(timerScreen);
  startTimer();
};

// ====== VOLTAR ESPECÍFICO DAS TELAS (IDs diferentes) ======
btnViagemVoltar.onclick = () => {
  hide(viagemScreen);
  show(mainScreen);
  btnVoltar.classList.add('hidden');
};

btnOutrosVoltar.onclick = () => {
  hide(outrosScreen);
  show(mainScreen);
  btnVoltar.classList.add('hidden');
};

// ====== FLUXO OUTRAS PARADAS ======
btnOutros.onclick = () => {
  mode = 'parada';
  hide(mainScreen);
  show(outrosScreen);
  btnVoltar.classList.remove('hidden');
};

// Clique em um item da lista de paradas
listaParadas.onclick = (e) => {
  const btn = e.target.closest('button[data-parada]');
  if (!btn) return;
  currentParada = btn.dataset.parada;

  // Ajusta títulos para parada
  viagemTitulo.classList.add('hidden');
  paradaTitulo.classList.remove('hidden');
  paradaNomeSpan.textContent = currentParada;

  hide(outrosScreen);
  show(timerScreen);
  startTimer();
};

// ====== FINALIZAR (COM CONFIRMAÇÃO) ======
btnFinalizar.onclick = () => {
  pauseTimer(); // pausa enquanto decide
  confirmText.textContent =
    mode === 'viagem'
      ? 'Deseja finalizar a viagem agora?'
      : `Deseja finalizar a parada "${currentParada}" agora?`;
  show(confirmModal);
};

btnConfirmNo.onclick = () => {
  hide(confirmModal);
  // retoma o timer
  startTime = Date.now() - parseTime(timerDisplay.textContent) * 1000;
  startTimer();
};

btnConfirmYes.onclick = () => {
  hide(confirmModal);
  if (mode === 'viagem') {
    // abre modal DMT
    dmtInput.value = '';
    show(dmtModal);
    dmtInput.focus();
  } else {
    // finaliza parada
    const formattedTime = elapsedFormatted();
    hide(timerScreen);
    show(resumoParadaScreen);
    resumoParadaNome.textContent = currentParada;
    resumoParadaTempo.textContent = formattedTime;
    btnVoltar.classList.add('hidden');
  }
};

// ====== DMT (somente viagem) ======
btnDmtConfirmar.onclick = () => {
  const raw = String(dmtInput.value).trim();
  const dmtValue = parseFloat(raw);
  const oneDecimal = /^\d{1,2}(\.\d)?$/.test(raw);

  if (isNaN(dmtValue) || dmtValue < 0 || dmtValue > 10 || !oneDecimal) {
    alert('Insira um DMT válido entre 0.0 e 10.0 com UMA casa decimal.');
    return;
  }

  hide(dmtModal);
  const formattedTime = elapsedFormatted();

  hide(timerScreen);
  show(resumoScreen);

  resumoMotorista.textContent = currentMotorista;
  resumoOrigem.textContent = currentOrigem || 'Não informada';
  resumoDestino.textContent = currentDestino;
  resumoTempo.textContent = `${formattedTime} | DMT: ${dmtValue.toFixed(1)}`;

  btnVoltar.classList.add('hidden');
};

btnDmtCancelar.onclick = btnDmtFechar.onclick = () => {
  hide(dmtModal);
  dmtInput.value = '';
  // retoma o timer
  startTime = Date.now() - parseTime(timerDisplay.textContent) * 1000;
  startTimer();
};

// ====== VOLTAR FLUTUANTE (funciona nas telas de timer) ======
btnVoltar.onclick = () => {
  if (!viagemScreen.classList.contains('hidden')) {
    hide(viagemScreen);
    show(mainScreen);
    btnVoltar.classList.add('hidden');
  } else if (!outrosScreen.classList.contains('hidden')) {
    hide(outrosScreen);
    show(mainScreen);
    btnVoltar.classList.add('hidden');
  } else if (!timerScreen.classList.contains('hidden')) {
    pauseTimer();
    hide(timerScreen);
    if (mode === 'viagem') show(viagemScreen);
    if (mode === 'parada') show(outrosScreen);
  }
};