// Test de connexion Supabase
require('dotenv').config();

console.log('Configuration Supabase:');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configuré ✓' : 'MANQUANT ✗');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configuré ✓' : 'MANQUANT ✗');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configuré ✓' : 'MANQUANT ✗');
console.log('- DATABASE_URL:', process.env.DATABASE_URL ? 'Configuré ✓' : 'MANQUANT ✗');
console.log('- OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'Configuré ✓' : 'MANQUANT ✗');

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.log('\n⚠️  IMPORTANT: La clé SUPABASE_SERVICE_ROLE_KEY est manquante!');
  console.log('Cette clé est nécessaire pour les opérations côté serveur.');
  console.log('Récupérez-la depuis: Dashboard Supabase > Settings > API > service_role key');
}
