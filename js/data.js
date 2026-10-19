/* =========================================================
   CONTENU DU PORTFOLIO — tout ce qui est à personnaliser est ici
   (remplace les textes d'exemple par les tiens)
   ========================================================= */

const PROFILE = {
  first: "Prénom",
  last: "Nom",
  name: "Prénom Nom",
  role: "Graphiste · Motion designer",
  seeking: "Alternance / stage — design graphique & motion",
  photo: "assets/avatar.svg",
  caption: "Le suspect"
};

/* ---- Planche / fiche signalétique ---- */
const INFO = {
  formation: [
    { date: "2024 – 2027", text: "Bachelor Design graphique — École / Université" },
    { date: "2021 – 2024", text: "Baccalauréat / BTS — Établissement" }
  ],
  parcours: [
    { date: "2025", text: "Stage — Agence / Entreprise : missions principales" },
    { date: "2024", text: "Projet freelance — Client : ce que tu as réalisé" }
  ],
  recherche: {
    short: "Cherche une alternance !",
    text: "Je recherche une alternance en design graphique et motion design, à partir de septembre. Prêt·e à relever un nouveau défi dans une équipe créative."
  }
};

/* ---- Post-its de qualités (3 à 5, un mot-clé chacun) ---- */
const QUALITIES = [
  { kw: "Créatif·ve",    text: "Je cherche toujours l'angle original, celui que personne n'a encore exploré." },
  { kw: "Rigoureux·se",  text: "Alignements, détails, finitions : rien ne m'échappe avant la livraison." },
  { kw: "Curieux·se",    text: "J'enquête, je teste de nouveaux outils et je creuse jusqu'à comprendre." },
  { kw: "Persévérant·e", text: "Un problème tenace ne me fait pas peur : je ne lâche pas la piste." }
];

/* ---- Projets : un dossier par affaire ----
   weapons = arme du crime (logiciels) · scene = scène de crime (visuel du rendu)
   clue = indice retenu (compétence prouvée) */
const PROJECTS = [
  {
    n: "01", tab: "Affaire 01", name: "Projet 1", color: "#e0533d", stamp: "CLASSÉ",
    weapons: ["Photoshop", "Illustrator"],
    scene: "assets/project-web.svg", sceneCaption: "scène de création",
    summary: "Décris ici le contexte, ta mission, les contraintes et le résultat final de ce projet.",
    clue: "Direction artistique & mise en page"
  },
  {
    n: "02", tab: "Affaire 02", name: "Projet 2", color: "#2f7de1", stamp: "CLASSÉ",
    weapons: ["After Effects", "Premiere Pro"],
    scene: "assets/project-app.svg", sceneCaption: "scène de création",
    summary: "Explique ce que tu as conçu, comment tu as procédé et ce que tu en as retiré.",
    clue: "Animation & montage vidéo"
  },
  {
    n: "03", tab: "Affaire 03", name: "Projet 3", color: "#d4a017", stamp: "CLASSÉ",
    weapons: ["Illustrator", "Figma"],
    scene: "assets/project-identity.svg", sceneCaption: "scène de création",
    summary: "Identité visuelle, logo, charte : présente ta démarche étape par étape.",
    clue: "Création d'identité visuelle"
  },
  {
    n: "04", tab: "Affaire bonus", name: "Affaire bonus", color: "#2e9e5b", stamp: "BONUS",
    weapons: ["Au choix"],
    scene: "assets/deco-1.svg", sceneCaption: "projet perso",
    summary: "Un petit clin d'œil pour le recruteur qui est allé jusqu'au bout de la pile : un projet perso.",
    clue: "Curiosité & envie de créer"
  }
];

/* ---- Timeline (viseur de caméra) ---- */
const TIMELINE = [
  { date: "2021", title: "Début du parcours", text: "Entrée en formation, premières bases en design et en image." },
  { date: "2022", title: "Premier projet", text: "Un premier projet concret qui confirme l'envie de faire de la création mon métier." },
  { date: "2024", title: "Bachelor", text: "Intégration du cursus Design graphique : branding, motion, UX." },
  { date: "2025", title: "Stage", text: "Mission en agence : production de visuels et d'animations pour des clients réels." },
  { date: "2026", title: "Aujourd'hui", text: "À la recherche d'une alternance pour continuer à progresser sur le terrain." }
];

/* ---- Rapport d'expertise : compétences techniques ---- */
const SKILLS = [
  { name: "Photoshop",     level: 90, note: "Retouche, photomontage, textures" },
  { name: "Illustrator",   level: 85, note: "Vectoriel, logos, illustrations" },
  { name: "After Effects", level: 75, note: "Motion design, animation" },
  { name: "Premiere Pro",  level: 70, note: "Montage vidéo" },
  { name: "Figma",         level: 70, note: "Maquettes & prototypes" },
  { name: "HTML / CSS",    level: 60, note: "Intégration web" }
];

/* ---- Contact (badge) ---- */
const CONTACT = {
  email: "prenom.nom@email.com",
  linkedin: "linkedin.com/in/prenom-nom",
  linkedinUrl: "https://www.linkedin.com/in/prenom-nom",
  phone: "+33 6 00 00 00 00"
};

/* ---- Écran final : qui suis-je ---- */
const FINAL = {
  headline: "AFFAIRE RÉSOLUE",
  bio: [
    "Voilà, tu as retrouvé la personne derrière le dossier. Je m'appelle Prénom, je suis passionné·e par le design et l'image en mouvement.",
    "Remplace ce texte par une courte présentation : ton parcours, ce qui te motive et ce que tu veux apporter à une équipe."
  ],
  facts: [
    ["Âge", "22 ans"],
    ["Ville", "Ville, France"],
    ["Recherche", "Alternance"],
    ["Signe particulier", "Toujours un café à côté"]
  ]
};

/* ---- Fils rouges : chaque paire relie deux cartes (ids des éléments) ---- */
const LINKS = [
  ["c-me", "c-info"], ["c-me", "c-q0"], ["c-me", "c-q2"], ["c-me", "c-proj"],
  ["c-me", "c-time"], ["c-me", "c-skills"],
  ["c-info", "c-q0"], ["c-q0", "c-q1"], ["c-q2", "c-q3"],
  ["c-q3", "c-proj"], ["c-proj", "c-skills"], ["c-info", "c-time"]
];
