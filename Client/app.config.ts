import 'dotenv/config';

export default ({ config }: { config: any }) => ({
  ...config,
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  },
});
