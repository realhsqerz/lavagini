# Lavagini

Application de reservation pour un service de lavage de voiture a domicile.

## Demarrage

1. Copiez `.env.example` vers `.env.local`
2. Ajoutez les variables Firebase et `ADMIN_ACCESS_TOKEN`
3. Installez les dependances avec `npm install`
4. Lancez le serveur avec `npm run dev`

## Déploiement Vercel

Le projet est compatible avec Vercel sans configuration spéciale.

1. Importez le dossier ou le dépôt dans Vercel
2. Gardez `Next.js` comme framework détecté
3. Ajoutez les variables d'environnement de `.env.local`
4. Déployez

Voir aussi `DEPLOY_VERCEL.md`.

## Besoins externes

- Un projet Firebase avec Firestore active
- Un compte de service Firebase Admin pour lire/ecrire les reservations
- Les vraies coordonnees de contact: telephone, WhatsApp, email
- Le nom commercial definitif et le logo, si disponible

## Structure Firestore

Collection: `bookings`
# lavagini
