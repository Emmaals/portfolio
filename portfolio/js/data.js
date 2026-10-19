/* =========================================================
   CONTENU DU PORTFOLIO — c'est ici que tu personnalises tout
   ========================================================= */

const DATA = {
  me: {
    title: "Prénom Nom",
    sub: "Sujet principal de l'enquête",
    body: [
      "Bienvenue dans mon dossier. Ici, chaque pièce est reliée aux autres : mon parcours, mes projets et mes compétences forment un tout cohérent.",
      "Remplace ce texte par ta présentation personnelle."
    ],
    tags: ["Développeur·se", "Créatif·ve", "Curieux·se"]
  },
  about: {
    title: "Profil",
    sub: "Qui suis-je ?",
    body: ["Décris ici qui tu es, ce qui te motive et ce que tu recherches (stage, alternance, emploi, missions freelance…)."],
    tags: ["Rigueur", "Créativité", "Autonomie"]
  },
  p1: {
    title: "Projet 1 — Site web",
    sub: "Pièce à conviction n°1",
    body: ["Décris le contexte, ton rôle, les défis rencontrés et le résultat obtenu."],
    tags: ["HTML", "CSS", "JavaScript"],
    link: { label: "Voir le projet", href: "#" }
  },
  p2: {
    title: "Projet 2 — Application",
    sub: "Pièce à conviction n°2",
    body: ["Décris ce projet : objectifs, technologies, ce que tu en as appris."],
    tags: ["React", "API", "UX"],
    link: { label: "Voir le projet", href: "#" }
  },
  p3: {
    title: "Projet 3 — Identité visuelle",
    sub: "Pièce à conviction n°3",
    body: ["Logo, charte graphique, maquettes… présente ton travail de design."],
    tags: ["Figma", "Branding", "Illustration"],
    link: { label: "Voir le projet", href: "#" }
  },
  skills: {
    title: "Compétences",
    sub: "Dossier classé secret",
    body: [
      "Techniques : HTML, CSS, JavaScript, Git.",
      "Design : Figma, UX/UI, typographie.",
      "Humaines : communication, travail en équipe, gestion du temps."
    ],
    tags: ["Front-end", "Design", "Équipe"]
  },
  exp: {
    title: "Expériences",
    sub: "Historique des opérations",
    body: [
      "2025 — Poste / Entreprise : ce que tu y as fait.",
      "2024 — Stage / Entreprise : missions principales.",
      "Ajoute autant de lignes que nécessaire."
    ],
    tags: ["Stage", "Freelance"]
  },
  edu: {
    title: "Formation",
    sub: "Antécédents",
    body: ["2023–2026 — Diplôme / École.", "2020–2023 — Diplôme / Établissement."],
    tags: ["Diplômes", "Certifications"]
  },
  contact: {
    title: "Contact",
    sub: "Me joindre discrètement",
    body: [
      "Email : <a href='mailto:ton.email@exemple.fr'>ton.email@exemple.fr</a>",
      "LinkedIn : <a href='#'>linkedin.com/in/ton-profil</a>",
      "GitHub : <a href='#'>github.com/ton-profil</a>"
    ],
    tags: ["Disponible"]
  },
  hobby: {
    title: "Hors-dossier",
    sub: "Centres d'intérêt",
    body: ["Photo, musique, sport, lecture… montre un peu de ta personnalité."],
    tags: ["Cinéma", "Voyages", "Jeux"]
  }
};

/* Fils rouges : chaque paire relie deux éléments (ids de DATA) */
const LINKS = [
  ["me", "about"], ["me", "p1"], ["me", "p2"], ["me", "p3"], ["me", "skills"], ["me", "exp"],
  ["about", "exp"], ["exp", "skills"], ["skills", "p3"], ["p1", "edu"], ["edu", "me"],
  ["p1", "contact"], ["p2", "contact"], ["p2", "p3"], ["hobby", "skills"], ["hobby", "p3"]
];
