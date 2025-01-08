let words = [];
let history = [];

// Charger le fichier de mots pour les passphrases
fetch(chrome.runtime.getURL('wordlist.txt'))
  .then(response => response.text())
  .then(text => {
    words = text.split('\n').map(line => line.split(' ')[1]).filter(word => word);
  })
  .catch(error => console.error('Erreur de chargement du fichier de mots :', error));

// Fonction pour copier dans le presse-papiers
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      showNotification('Copié dans le presse-papiers !');
    })
    .catch(err => console.error('Erreur lors de la copie :', err));
}

// Fonction pour afficher une notification
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.innerText = message;
  notification.style.opacity = '1';
  setTimeout(() => {
    notification.style.opacity = '0';
  }, 2000);
}

// Générer une passphrase
function generatePassphrase() {
  const length = parseInt(document.getElementById('length-slider').value) || 4;
  let passphrase = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    passphrase.push(words[randomIndex]);
  }
  passphrase.push(`!${Math.floor(Math.random() * 100)}`);
  const passphraseText = passphrase.join('-');
  document.getElementById('passphrase').innerText = passphraseText;
  copyToClipboard(passphraseText);
  addToHistory(passphraseText);
}

// Générer un mot de passe
function generatePassword() {
  const length = parseInt(document.getElementById('password-length-slider').value) || 12;
  const includeNumbers = document.getElementById('include-numbers').checked;
  const includeSpecial = document.getElementById('include-special').checked;

  let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) charset += '0123456789';
  if (includeSpecial) charset += '!@#$%&*()-_=+;:,.<>?';

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  document.getElementById('passphrase').innerText = password;
  copyToClipboard(password);
  addToHistory(password);
}

// Ajouter à l'historique
function addToHistory(item) {
  history.unshift(item); // Ajoute au début de la liste
  if (history.length > 10) {
    history.pop(); // Garde seulement les 10 derniers éléments
  }
}

// Afficher l'historique
function showHistory() {
  const historyList = document.getElementById('history-list');
  historyList.innerHTML = ''; // Vide la liste actuelle
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    historyList.appendChild(li);
  });
  document.getElementById('history').style.display = 'block';
}

// Basculer entre les options
function toggleOptions() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  document.getElementById('passphrase-options').style.display = mode === 'passphrase' ? 'block' : 'none';
  document.getElementById('password-options').style.display = mode === 'password' ? 'block' : 'none';
}

// Mettre à jour les valeurs des sliders
document.getElementById('length-slider').addEventListener('input', () => {
  document.getElementById('length-value').innerText = document.getElementById('length-slider').value;
});

document.getElementById('password-length-slider').addEventListener('input', () => {
  document.getElementById('password-length-value').innerText = document.getElementById('password-length-slider').value;
});

// Écouteurs d'événements
document.getElementById('generate').addEventListener('click', () => {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (mode === 'passphrase') {
    generatePassphrase();
  } else {
    generatePassword();
  }
});

document.getElementById('show-history').addEventListener('click', showHistory);

document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener('change', toggleOptions);
});

// Synchroniser les sliders avec les valeurs affichées
document.getElementById('length-slider').addEventListener('input', () => {
  document.getElementById('length-value').innerText = document.getElementById('length-slider').value;
});

document.getElementById('password-length-slider').addEventListener('input', () => {
  document.getElementById('password-length-value').innerText = document.getElementById('password-length-slider').value;
});