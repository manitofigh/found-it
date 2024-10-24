export default {
  expo: {
    name: "found-it",
    slug: "found-it",
    // ... later
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};
