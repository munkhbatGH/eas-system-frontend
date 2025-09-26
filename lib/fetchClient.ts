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
        // ...options.headers
        Authorization: '',
    }

    const tok = Cookies.get(token_name);
    if (tok) {
        headers.Authorization = `Bearer ${tok}`;
    }

    const res = await fetch(url, {
        credentials: 'include', // ✅ required to receive/set cookies from server
        ...options, headers
    })

    // const setCookie = res.headers.get('set-cookie'); // ← get deviceToken here
    // console.log('Set-Cookie header:', setCookie);

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