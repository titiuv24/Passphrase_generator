let words = [];

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
  const length = parseInt(document.getElementById('length').value) || 4;
  let passphrase = [];
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    passphrase.push(words[randomIndex]);
  }
  passphrase.push(`!${Math.floor(Math.random() * 100)}`);
  const passphraseText = passphrase.join('-');
  document.getElementById('passphrase').innerText = passphraseText;
  copyToClipboard(passphraseText);
}

// Générer un mot de passe
function generatePassword() {
  const length = parseInt(document.getElementById('password-length').value) || 12;
  const includeNumbers = document.getElementById('include-numbers').checked;
  const includeSpecial = document.getElementById('include-special').checked;

  let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) charset += '0123456789';
  if (includeSpecial) charset += '!@#$%^&*()-_=+[]{}|;:,.<>?';

  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  document.getElementById('passphrase').innerText = password;
  copyToClipboard(password);
}

// Basculer entre les options
function toggleOptions() {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (mode === 'passphrase') {
    document.getElementById('passphrase-options').style.display = 'block';
    document.getElementById('password-options').style.display = 'none';
  } else {
    document.getElementById('passphrase-options').style.display = 'none';
    document.getElementById('password-options').style.display = 'block';
  }
}

// Écouteurs d'événements
document.getElementById('generate').addEventListener('click', () => {
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (mode === 'passphrase') {
    generatePassphrase();
  } else {
    generatePassword();
  }
});
document.querySelectorAll('input[name="mode"]').forEach(radio => {
  radio.addEventListener('change', toggleOptions);
});
