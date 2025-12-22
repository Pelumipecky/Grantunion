import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const envLabel = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';

// Validate required variables
const missingVars = [
	!supabaseUrl && 'NEXT_PUBLIC_SUPABASE_URL',
	!supabaseAnonKey && 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
].filter(Boolean);

// Debug logging
console.log('[supabaseConfig] Environment check:', {
	envLabel,
	supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
	supabaseAnonKey: supabaseAnonKey ? 'SET' : 'NOT SET',
	supabaseServiceKey: supabaseServiceKey ? 'SET' : 'NOT SET',
	missingVars
});

const isProductionLike = envLabel === 'production';

// Use service role key to bypass RLS issues in development
// In production, uses anon key
const useServiceRole = !isProductionLike && !!supabaseServiceKey;

let supabaseInstance = null;

// Check if we have required credentials
if (missingVars.length > 0) {
	console.error('[supabaseConfig] Missing required environment variables:', missingVars);
	// Create a dummy client that logs errors
	if (typeof window === 'undefined') {
		// Server-side: Create a no-op client
		supabaseInstance = new Proxy({}, {
			get(_, prop) {
				return async () => {
					const error = new Error(
						`Supabase not configured. Missing: ${missingVars.join(', ')}`
					);
					console.error('[supabaseConfig]', error.message);
					return { data: null, error };
				};
			}
		});
	} else {
		// Client-side: throw error
		throw new Error(
			`Supabase environment variables missing: ${missingVars.join(', ')}. ` +
			'Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
		);
	}
} else {
	try {
		const cleanUrl = supabaseUrl.trim();
		
		// Validate URL format
		const invalidUrlHints = ['supabase.com/dashboard', 'supabase.com/project'];
		if (invalidUrlHints.some((hint) => cleanUrl.includes(hint))) {
			throw new Error(
				'NEXT_PUBLIC_SUPABASE_URL must point to your project API endpoint (e.g. https://<project-ref>.supabase.co), not the dashboard URL.'
			);
		}

		// Select appropriate key
		const keyToUse = useServiceRole ? supabaseServiceKey : supabaseAnonKey;
		if (!keyToUse) {
			throw new Error(`No ${useServiceRole ? 'service role' : 'anon'} key available`);
		}

		console.log('[supabaseConfig] Initializing Supabase with:', {
			url: cleanUrl,
			keyType: useServiceRole ? 'service role' : 'anon key',
			environment: envLabel
		});

		// Initialize Supabase client
		supabaseInstance = createClient(cleanUrl, keyToUse, {
			auth: {
				persistSession: typeof window !== 'undefined'
			}
		});

		console.log('[supabaseConfig] Supabase client initialized successfully');
	} catch (error) {
		console.error('[supabaseConfig] Failed to initialize Supabase:', error);
		throw error;
	}
}

export const supabase = supabaseInstance;
export const isSupabaseConfigured = missingVars.length === 0;

// For backward compatibility, export these as undefined to prevent errors during transition
export const db = null;
export const storage = null;
export const auth = null;
const legacyDefault = null;
export default legacyDefault;