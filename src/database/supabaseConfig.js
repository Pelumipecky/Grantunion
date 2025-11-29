import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const envLabel = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
const missingVars = [
	!supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
	!supabaseAnonKey && 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
].filter(Boolean);

// Debug logging
console.log('[supabaseConfig] Environment check:', {
	envLabel,
	supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
	supabaseAnonKey: supabaseAnonKey ? 'SET' : 'NOT SET',
	missingVars
});
const isProductionLike = envLabel === 'production';

const createNoopClient = () => new Proxy({}, {
	get(_, prop) {
		// Only throw error if we're actually trying to use the client in production
		if (isProductionLike) {
			throw new Error(
				`Supabase client is unavailable (${missingVars.join(', ') || 'unknown missing vars'}). ` +
				'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to use this API.'
			);
		}
		// In development/build, return a noop function
		return () => {};
	}
});

let supabaseInstance = null;

if (missingVars.length) {
	// Always use noop client when vars are missing - errors will be thrown when methods are called
	console.warn(
		`[supabaseConfig] Supabase environment variables missing: ${missingVars.join(', ')}. Using noop client.`
	);
	supabaseInstance = createNoopClient();
} else {
	const maskedSupabaseUrl = supabaseUrl.trim();
	const invalidUrlHints = ['supabase.com/dashboard', 'supabase.com/project'];
	if (invalidUrlHints.some((hint) => maskedSupabaseUrl.includes(hint))) {
		throw new Error('NEXT_PUBLIC_SUPABASE_URL must point to your project API endpoint (e.g. https://<project-ref>.supabase.co), not the dashboard URL.');
	}
	supabaseInstance = createClient(maskedSupabaseUrl, supabaseAnonKey);
}

export const supabase = supabaseInstance;
export const isSupabaseConfigured = missingVars.length === 0;

// For backward compatibility, export these as undefined to prevent errors during transition
export const db = null;
export const storage = null;
export const auth = null;
const legacyDefault = null;
export default legacyDefault;