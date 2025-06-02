# Configuration Supabase et Prisma

## 🚀 Fonctionnalités implémentées

- ✅ **Authentification utilisateur** : Login/logout avec Supabase Auth
- ✅ **Posts liés aux utilisateurs** : Chaque post généré est automatiquement associé à son auteur
- ✅ **Page historique** : Consultation et gestion de tous les posts générés par utilisateur
- ✅ **Base de données** : PostgreSQL avec Prisma ORM et Supabase

## 📋 Prérequis

1. Un compte Supabase (gratuit) : https://supabase.com
2. Les variables d'environnement configurées dans `.env`

## 🔧 Configuration

### 1. Créer un projet Supabase

1. Connectez-vous à [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Notez les informations suivantes :
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **Service Role Key** (SUPABASE_SERVICE_ROLE_KEY)
   - **Database URL** (DATABASE_URL)

### 2. Configurer les variables d'environnement

Copiez le fichier `.env.example` vers `.env` et remplissez les valeurs :

```bash
cp .env.example .env
```

```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database URL for Prisma
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

### 3. Exécuter les migrations de base de données

#### Option A : Via Supabase Dashboard (recommandé)

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Copiez et exécutez le contenu du fichier `supabase/schema.sql`

#### Option B : Via Prisma

```bash
# Pousser le schéma vers la base de données
npx prisma db push

# Générer le client Prisma
npx prisma generate
```

### 4. Configurer l'authentification Supabase

1. Dans le dashboard Supabase, allez dans **Authentication > Providers**
2. Assurez-vous que **Email** est activé
3. Configurez les paramètres selon vos besoins :
   - Confirmation email : activé/désactivé
   - Email templates personnalisés
   - URL de redirection : `http://localhost:3000/auth/callback` (dev) et votre domaine de production

## 🏃‍♂️ Démarrer l'application

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

## 📱 Utilisation

### Inscription/Connexion

1. Accédez à la page d'accueil
2. Créez un compte ou connectez-vous
3. Un email de confirmation sera envoyé (si activé dans Supabase)

### Générer des posts

1. Une fois connecté, téléchargez une image
2. Sélectionnez un style d'écriture
3. Générez votre post LinkedIn
4. Le post est automatiquement sauvegardé dans votre historique

### Historique des posts

1. Cliquez sur "Mes posts" dans la navigation
2. Consultez tous vos posts générés
3. Copiez ou supprimez des posts selon vos besoins

## 🔒 Sécurité

- **Row Level Security (RLS)** : Chaque utilisateur ne peut voir et modifier que ses propres données
- **Authentification JWT** : Tokens sécurisés gérés par Supabase
- **Middleware Next.js** : Protection des routes et refresh automatique des sessions

## 🛠️ Dépannage

### Erreur "Unauthorized"
- Vérifiez que vous êtes bien connecté
- Vérifiez que les clés Supabase sont correctement configurées

### Erreur de base de données
- Vérifiez que la DATABASE_URL est correcte
- Assurez-vous que les migrations ont été exécutées
- Vérifiez que les tables existent dans Supabase

### Posts non sauvegardés
- Vérifiez les logs de la console pour des erreurs
- Assurez-vous que l'utilisateur existe dans la table `users`

## 📚 Structure de la base de données

### Table `users`
- `id` : UUID (clé primaire)
- `email` : Email unique
- `name` : Nom d'affichage (optionnel)
- `avatar_url` : URL de l'avatar (optionnel)
- `created_at` : Date de création
- `updated_at` : Date de mise à jour

### Table `posts`
- `id` : UUID (clé primaire)
- `content` : Contenu du post
- `image_url` : URL de l'image source
- `platform` : Plateforme (toujours "linkedin")
- `tone` : Style d'écriture utilisé
- `target_role` : Rôle cible (optionnel)
- `user_id` : ID de l'utilisateur (clé étrangère)
- `created_at` : Date de création
- `updated_at` : Date de mise à jour
