# Jeu de Memory

> Jeu de Memory interactif développé en **Vanilla JavaScript (ES6)**, HTML5 et CSS3, sans framework ni bibliothèque externe.

**Jouer en ligne : [https://VOTRE-PSEUDO.github.io/js-memory-game/](https://VOTRE-PSEUDO.github.io/js-memory-game/)**

(Projet réalisé dans le cadre du TD JavaScript - BUT Informatique 2A, ressource R3.01.)

---

## Sommaire

- [Présentation](#présentation)
- [Technologies utilisées](#technologies-utilisées)
- [Fonctionnalités](#fonctionnalités)
- [Règles du jeu](#règles-du-jeu)
- [Structure du projet](#structure-du-projet)
- [Lancer le projet en local](#lancer-le-projet-en-local)
- [Fonctionnement du code](#fonctionnement-du-code)
- [Déploiement sur GitHub Pages](#déploiement-sur-github-pages)
- [Pistes d'amélioration](#pistes-damélioration)
- [Auteur](#auteur)

---

## Présentation

Le but du jeu est de retrouver toutes les paires d'images identiques en retournant les cartes deux par deux, avec le moins de coups et le moins de temps possible.

Le plateau contient **16 cartes** (8 paires) disposées sur une grille 4 x 4. Les images sont récupérées via l'API [Lorem Picsum](https://picsum.photos/) et **changent à chaque rechargement de la page** grâce à un point de départ aléatoire.

Le projet sépare la **logique algorithmique** (tableau de cartes, mélange, vérification des paires) de l'**interface graphique** (manipulation du DOM).

---

## Technologies utilisées

| Technologie | Utilisation |
|---|---|
| **HTML5** | Structure de la page (en-tête, plateau, zone de résultat) |
| **CSS3 (CSS Grid, Flexbox)** | Mise en page du plateau, statistiques, effet au survol, design responsive |
| **JavaScript ES6 (Vanilla)** | Logique du jeu, manipulation du DOM, gestion des événements, asynchronisme |
| **API Lorem Picsum** | Source des images des cartes |
| **Git / GitHub Pages** | Versionnage et hébergement public |

Notions ES6 mises en oeuvre : littéraux de gabarit, *spread operator*, affectation par décomposition (déstructuration), fonctions fléchées, `let` / `const`.

---

## Fonctionnalités

- **Plateau généré dynamiquement** : les cartes sont créées en JavaScript à partir d'un tableau d'URL.
- **Mélange équitable** grâce à l'algorithme de **Fisher-Yates**.
- **Images différentes à chaque partie** (paramètre `imgStart` tiré au hasard entre 1 et 100).
- **Chronomètre** au format `mm:ss`, démarré à chaque nouvelle partie.
- **Compteur de coups** mis à jour en temps réel.
- **Protections contre les actions illégales** (double clic sur la même carte, carte déjà trouvée, plateau verrouillé, carte déjà retournée).
- **Asynchronisme** avec `setTimeout` : les cartes non identiques restent visibles 800 ms avant de se cacher.
- **Cartes trouvées mises en évidence** (contour vert).
- **Message de victoire** affichant le nombre de coups et le temps final.
- **Bouton "Rejouer"** : réinitialise entièrement la partie (compteurs, chronomètre, plateau, mélange).
- **Accessibilité (A11y)** : chaque carte porte les attributs `role="button"` et `tabindex="0"`, et les images ont un texte alternatif (`alt`).
- **Responsive** : la taille des cartes s'adapte aux écrans de moins de 700 px.

---

## Règles du jeu

1. Cliquez sur une première carte pour la retourner.
2. Cliquez sur une seconde carte.
3. Si les deux images sont **identiques**, la paire est validée et reste visible.
4. Sinon, les deux cartes se retournent après 0,8 seconde : mémorisez leur position !
5. La partie est gagnée quand les **8 paires** ont été trouvées.

Chaque tentative de deux cartes compte pour **1 coup**.

---

## Structure du projet

```
js-memory-game/
|-- index.html      # Structure de la page
|-- style.css       # Mise en forme (grille, cartes, responsive)
|-- memory.js       # Logique du jeu et manipulation du DOM
|-- favicon.png     # Icône de l'onglet
`-- README.md       # Documentation du projet
```

---

## Lancer le projet en local

### Prérequis

- Un navigateur web récent (Chrome, Firefox, Edge, Safari...)
- Une **connexion Internet** (les images sont chargées depuis `picsum.photos`)
- (Optionnel) [Visual Studio Code](https://code.visualstudio.com/) avec l'extension **Live Server**

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/VOTRE-PSEUDO/js-memory-game.git

# 2. Se placer dans le dossier
cd js-memory-game
```

### Lancement

**Option A - Directement dans le navigateur**
Double-cliquez sur `index.html`.

**Option B - Avec Live Server (recommandé)**
1. Ouvrez le dossier dans VS Code.
2. Clic droit sur `index.html`, puis **Open with Live Server**.
3. La page s'ouvre sur `http://127.0.0.1:5500` et se recharge automatiquement à chaque modification.

Astuce : ouvrez la console du navigateur (`F12`) pour déboguer.

---

## Fonctionnement du code

### 1. Variables globales

| Variable | Rôle |
|---|---|
| `dimension` | Taille (en px) des images demandées à Picsum (150) |
| `imgStart` | Entier aléatoire (1 à 100) servant de point de départ pour les images |
| `cards` | Tableau des 16 URL (8 images dupliquées) |
| `firstCard` / `secondCard` | Cartes retournées pendant le tour en cours |
| `lockBoard` | Verrouille le plateau pendant la vérification d'une paire |
| `moves` | Nombre de coups joués |
| `matchedCount` | Nombre de cartes déjà appariées |
| `seconds` / `timerInterval` | Temps écoulé et identifiant du `setInterval` du chronomètre |

### 2. Création du paquet de cartes

```js
const images = [];
for (let i = imgStart; i <= imgStart + 7; i++) {
  images.push(`https://picsum.photos/seed/${i}/${dimension}/${dimension}`);
}
cards = [...images, ...images]; // duplication avec le spread operator
```

### 3. Mélange de Fisher-Yates

On parcourt le tableau à l'envers et on échange chaque élément avec un élément d'indice aléatoire inférieur ou égal.

```js
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
```

### 4. Fonctions principales

| Fonction | Rôle |
|---|---|
| `initGame()` | Démarre ou redémarre une partie : remise à zéro des compteurs, vidage du plateau, mélange, création des cartes, relance du chronomètre |
| `handleCardClick(card)` | Gère un clic : applique les 4 barrières de sécurité, révèle la carte, enregistre la première ou la seconde carte |
| `revealCard(card)` | Crée la balise `<img>` et l'insère dans la carte |
| `checkMatch()` | Compare les valeurs (`dataset.value`) des deux cartes : validation de la paire ou masquage différé après 800 ms |
| `resetTurn()` | Réinitialise `firstCard`, `secondCard` et `lockBoard` |
| `checkVictory()` | Détecte la fin de partie, arrête le chronomètre et affiche le score |
| `startTimer()` / `stopTimer()` | Lancent et arrêtent le chronomètre (`setInterval` / `clearInterval`) |
| `formatTime(sec)` | Convertit des secondes en chaîne `mm:ss` avec `padStart` |

### 5. Les 4 barrières de sécurité du clic

```js
if (lockBoard || card.classList.contains("matched") || card === firstCard || card.firstChild) {
  return;
}
```

| Condition | Rôle |
|---|---|
| `lockBoard` | Ignore les clics pendant l'affichage de deux cartes différentes |
| `classList.contains("matched")` | Empêche d'interagir avec une carte déjà trouvée |
| `card === firstCard` | Évite de valider une paire avec deux clics sur la même carte |
| `card.firstChild` | Ignore une carte déjà face visible (elle contient déjà une image) |

### 6. Principe de la carte cachée

Chaque carte est un `<div class="card">` vide. L'URL de son image est stockée dans `card.dataset.value` (attribut `data-value`). Retourner une carte revient à insérer une balise `<img>` dans le `<div>` ; la cacher revient à vider son contenu (`innerHTML = ""`).

---

## Déploiement sur GitHub Pages

1. Créer un dépôt **public** nommé `js-memory-game` sur GitHub.
2. Lier le dépôt local et pousser le code :
   ```bash
   git remote add origin https://github.com/VOTRE-PSEUDO/js-memory-game.git
   git branch -M main
   git add .
   git commit -m "feat: implement timer lifecycle, complete application deployment and readme documentation"
   git push -u origin main
   ```
3. Sur GitHub, aller dans **Settings > Pages**.
4. Dans *Build and deployment*, choisir **Deploy from a branch**, sélectionner la branche `main` et le dossier `/ (root)`, puis valider.
5. Après quelques instants, le jeu est accessible à l'adresse :
   `https://VOTRE-PSEUDO.github.io/js-memory-game/`

---

## Pistes d'amélioration

- Activer le retournement des cartes au clavier (touches `Entrée` / `Espace`) pour compléter l'accessibilité.
- Animation de retournement des cartes en 3D (CSS `transform` / `perspective`).
- Choix de la difficulté (nombre de paires) et de la taille du plateau.
- Sauvegarde du meilleur score avec `localStorage`.
- Ajout d'un dos de carte illustré et de sons.

---

## Auteur

**VOTRE NOM Prénom**
BUT Informatique 2A - R3.01 - TD JavaScript
Enseignant : Christophe Vallot

---

Les images sont fournies par [Lorem Picsum](https://picsum.photos/) (photos issues d'[Unsplash](https://unsplash.com/)).