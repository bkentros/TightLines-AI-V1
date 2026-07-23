import { getValidAccessToken } from './supabase';
import type {
  RiverRunCatalogResponse,
  RiverRunSnapshotResponse,
} from './riverRunContracts';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

type RiverRunSnapshotParams = {
  riverId: string;
  runId: string;
};

export async function fetchRiverRunCatalog(): Promise<RiverRunCatalogResponse> {
  return riverRunGet<RiverRunCatalogResponse>('rivers');
}

export async function fetchRiverRunSnapshot(
  params: RiverRunSnapshotParams,
): Promise<RiverRunSnapshotResponse> {
  return riverRunGet<RiverRunSnapshotResponse>('snapshot', params, {
    requireAuth: true,
  });
}

async function riverRunGet<TResponse>(
  path: 'rivers' | 'snapshot',
  params?: Record<string, string>,
  options: { requireAuth?: boolean } = {},
): Promise<TResponse> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase configuration for River Run.');
  }

  const url = new URL(`${supabaseUrl}/functions/v1/river-run/${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    url.searchParams.set(key, value);
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
  };

  if (options.requireAuth) {
    headers['x-user-token'] = await getValidAccessToken();
  }

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });
  const text = await response.text();
  const parsed = parseJsonOrText(text);

  if (!response.ok) {
    throw new Error(readErrorMessage(parsed, response.status));
  }

  return parsed as TResponse;
}

function parseJsonOrText(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function readErrorMessage(parsed: unknown, status: number): string {
  if (typeof parsed === 'string' && parsed.length > 0) return parsed;
  if (parsed && typeof parsed === 'object') {
    const body = parsed as { message?: unknown; error?: unknown };
    if (typeof body.message === 'string' && body.message.length > 0) {
      return body.message;
    }
    if (typeof body.error === 'string' && body.error.length > 0) {
      return body.error;
    }
  }
  return `River Run request failed with status ${status}.`;
}
