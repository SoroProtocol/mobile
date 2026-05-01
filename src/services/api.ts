const BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/v1';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, `${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export interface ApiStream {
  id:              string;
  contractStreamId:string;
  sender:          string;
  recipient:       string;
  token:           string;
  ratePerSecond:   string;
  startTime:       number;
  stopTime:        number;
  withdrawn:       string;
  status:          'active' | 'cancelled' | 'completed';
  txHash:          string;
}

export interface ApiVestingSchedule {
  id:          string;
  beneficiary: string;
  token:       string;
  totalAmount: string;
  startTime:   number;
  cliffTime:   number;
  endTime:     number;
  claimed:     string;
  revoked:     boolean;
}

export const streamsApi = {
  list:      (address?: string) =>
    request<ApiStream[]>(`/streams${address ? `?address=${encodeURIComponent(address)}` : ''}`),
  get:       (id: string) => request<ApiStream>(`/streams/${id}`),
  analytics: (address: string) =>
    request<{ total: number; active: number; cancelled: number }>(`/streams/analytics?address=${address}`),
};

export const vestingApi = {
  list: (address?: string) =>
    request<ApiVestingSchedule[]>(`/vesting${address ? `?address=${encodeURIComponent(address)}` : ''}`),
  get:  (id: string) => request<ApiVestingSchedule>(`/vesting/${id}`),
};
