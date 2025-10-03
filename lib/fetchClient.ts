import { addToast } from '@heroui/toast';
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
        headers,
    })

    if (res.status === 401) {
      Cookies.remove(token_name);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    const statusCodes = [400, 403, 404, 500]
    if (statusCodes.includes(res.status)) {
        const error = await res.json()
        addToast({
          title: `Алдаа гарлаа. ${res.status || ''}`,
          description: `${error.message || 'An unknown error occurred'}`,
          color: "danger",
        })
        throw new Error(`${error?.message}`)
    }
    if (!res.ok) {
        const error = await res.json()
        // throw new Error(`${res.status}: ${error?.message}`)
        throw new Error(`${error?.message}`)
    }

    if (res.status === 204) return null;
    return res.json()
}