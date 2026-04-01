# Deploy Vercel

## Avant de déployer

Assurez-vous d'avoir:

- un projet Vercel
- les variables d'environnement prêtes
- une clé Firebase Admin valide

Important:

- remplacez la clé Firebase Admin actuelle si elle a été exposée
- ne mettez jamais `.env.local` dans Git

## Variables d'environnement à ajouter dans Vercel

Ajoutez exactement ces variables dans `Project Settings -> Environment Variables`:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `ADMIN_ACCESS_TOKEN`

## Déploiement

### Option 1: depuis l'interface Vercel

1. Créez un nouveau projet
2. Importez ce dossier ou votre dépôt Git
3. Laissez Vercel détecter `Next.js`
4. Ajoutez les variables d'environnement
5. Cliquez sur `Deploy`

### Option 2: avec la CLI Vercel

```bash
npm i -g vercel
vercel
```

Puis:

1. liez le projet
2. ajoutez les variables d'environnement dans Vercel
3. lancez le déploiement de production:

```bash
vercel --prod
```

## Variables attendues

Exemple:

```env
FIREBASE_PROJECT_ID=lavage-3c137
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@lavage-3c137.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
ADMIN_ACCESS_TOKEN=votre-secret-admin
```

## Vérifications après déploiement

1. ouvrez la page d'accueil
2. testez une réservation
3. ouvrez `/admin`
4. connectez-vous avec `ADMIN_ACCESS_TOKEN`
5. modifiez une réservation
6. testez la page `/admin/analytics`

## Si la réservation échoue en production

Vérifiez:

- Firestore Database existe bien, pas seulement Realtime Database
- la clé Firebase Admin correspond au bon projet
- `FIREBASE_PRIVATE_KEY` a bien conservé les `\n`
- `ADMIN_ACCESS_TOKEN` est présent dans Vercel
