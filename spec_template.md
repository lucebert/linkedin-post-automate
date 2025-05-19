# Specification du projet

## 1. Objectif du projet

Nom : LinkedIn Post Generator

Description : 

une application web qui genere des post linkedin a partir dimage

Fonctionnalites principales
- Upload dun screenshot
- Lutilisateur peut uploader une image (drag & drop, bouton ou copier-coller).
- Generation automatique dun post LinkedIn
- Lapplication analyse limage, extrait le texte, puis genere un post inspire par ce contenu.
- Choix du style decriture
- Lutilisateur peut choisir parmi plusieurs styles (professionnel, inspirant, humoristique, etc.).
Paraphrase et inspiration
Le post genere ne recopie pas le texte du screenshot, mais sen inspire pour creer un contenu original.

---

## 2. Fonctionnalite principale 

Le projet doit se limiter seulement aux fonctionnalites les plus essentielles.

Questions a se poser :
- Quelle action principale realise lutilisateur ?
- Quelle est la contribution de lintelligence artificielle ?
- Quel est le resultat attendu ?

---

## 3. Stack Technique

Technologies recommandees :

- Frontend : Next.js + TailwindCSS  
- Backend : API Routes (Next.js)  
- Conteneurisation : Dockerfile  
- IA (optionnelle) : OpenAI gpt-4o-mini
- Vision (optionnelle): OpenAI gpt-4o-mini 
- Base de donnees (optionnelle) : prisma + Supabase

Remarques :
- Chaque composant technique doit avoir une utilite claire, sinon il doit etre supprime.
- Eviter toute complexite non justifiee

---

## 4. Interface Utilisateur

- Interface simple et intuitive
- Design epure
- Centree sur une action principale
- Responsive mobile/desktop

---

## 5. Conteneurisation

Le projet doit pouvoir etre lance via un `Dockerfile` simple :

- Installation des dependances
- Build de l'application
- Demarrage du serveur

---

## 6. Consignes d'implementation

- Prioriser la simplicite
- Creer .env file avant de creer le fichier .gitignore
- Ne pas surconcevoir
- Construire un socle fonctionnel minimal avant toute extension