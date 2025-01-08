let words = [];

// Charger le fichier de mots
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
      showNotification('Passphrase copiée dans le presse-papiers !');
    })
    .catch(err => {
      console.error('Erreur lors de la copie :', err);
    });
}

// Fonction pour afficher une notification
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.innerText = message;
  notification.style.opacity = '1';
  
  setTimeout(() => {
    notification.style.opacity = '0';
  }, 2000); // Disparition après 2 secondes
}

// Générer une passphrase
function generatePassphrase() {
  const length = parseInt(document.getElementById('length').value) || 4;
  let passphrase = [];
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    passphrase.push(words[randomIndex]);
  }

  // Ajouter "!" et un nombre aléatoire
  const randomNumber = Math.floor(Math.random() * 100);
  passphrase.push(`!${randomNumber}`);

  const passphraseText = passphrase.join('-');
  document.getElementById('passphrase').innerText = passphraseText;

  // Copier la passphrase dans le presse-papiers
  copyToClipboard(passphraseText);
}

// Écouter les événements
document.getElementById('generate').addEventListener('click', generatePassphrase);
