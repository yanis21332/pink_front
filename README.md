# Pink Studio — Agenda

Application de gestion de rendez-vous pour Pink Studio, un institut de beauté et wellness à Tizi Ouzou.

## Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: styled-components
- **Language**: JavaScript (no TypeScript)
- **Fonts**: Google Fonts (Fraunces, Manrope, IBM Plex Mono)

## Structure du projet

```
pink-studio/
├── app/
│   ├── layout.js         # Layout principal avec fonts
│   └── page.js           # Page d'accueil + gestion d'état
├── components/
│   ├── Shell.js          # Wrapper layout (sidebar + main)
│   ├── SidebarComponent.js   # Navigation latérale
│   ├── Topbar.js         # Barre supérieure
│   ├── Hero.js           # Banner par service
│   ├── FiltersPanel.js   # Panneau de filtres
│   ├── Table.js          # Tableau des RDV
│   └── Modal.js          # Formulaire de création
├── lib/
│   ├── data.js           # Données des services
│   └── utils.js          # Fonctions utilitaires
├── styles/
│   └── GlobalStyle.js    # Styles globaux
├── package.json
├── next.config.js
└── .gitignore
```

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Accéder à l'app
# Ouvrir http://localhost:3000
```

## Fonctionnalités

- ✅ **Navigation par service** - 5 catégories (Hammam, Coloration, Mariées, Onglerie, Esthétique)
- ✅ **Gestion des rendez-vous** - Créer, modifier, supprimer
- ✅ **Édition inline** - Modifier client, heure, montant, commentaire directement
- ✅ **Statuts de paiement** - Payé, Impayé, Acompte (cycle au clic)
- ✅ **Filtres avancés** - Montant, heure, statut
- ✅ **Clients fidèles** - Badge automatique si > 1 RDV
- ✅ **Responsif** - Mobile-friendly avec sidebar collapsible
- ✅ **Animations fluides** - Transitions, hero banner, lignes de table
- ✅ **Design premium** - Couleurs harmonieuses, typographie soignée

## Développement

Pour modifier les styles globaux ou les tokens de couleur, éditer `/styles/GlobalStyle.js`.

Pour ajouter de nouveaux services, éditer `/lib/data.js` (SERVICES et CAT_KEYS).

Tous les composants utilisent `styled-components` pour l'isolation des styles.

## Build

```bash
npm run build
npm start
```

---

Made with ❤️ for Pink Studio
