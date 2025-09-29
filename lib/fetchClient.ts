import Cookies from 'js-cookie';

const token_name = process.env.NEXT_PUBLIC_TOKEN || 'eas-token';
const base_url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchClient(
    endpoint: string,
    options?: any
): Promise<any> {

    const url = `${base_url}${endpoint}`
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        Authorization: '',
        // ...options.headers
    }

    const tok = Cookies.get(token_name);
    if (tok) {
        headers.Authorization = `Bearer ${tok}`;
    }

    const res = await fetch(url, {
        ...options,
        credentials: 'include', // ✅ Important for cookies
        mode: 'cors', // ✅ Explicitly set CORS mode
        headers,
    })

    if (res.status === 401) {
      Cookies.remove(token_name);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    if (!res.ok) {
        const error = await res.json()
        // throw new Error(`${res.status}: ${error?.message}`)
        throw new Error(`${error?.message}`)
    }

    return res.json()
}