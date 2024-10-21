import Cookies from 'js-cookie';

export function restoreCSRF() {
  return csrfFetch('/api/csrf/restore');
}

export async function csrfFetch(url, options = {}) {
  options.method = options.method || 'GET';
  options.headers = options.headers || {};
  
  // Only include credentials for same-origin requests
  if (url.startsWith('/')) {
    options.credentials = 'same-origin';
  }

  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    const csrfToken = Cookies.get('XSRF-TOKEN');
    console.log('CSRF Token:', csrfToken);
    options.headers['XSRF-Token'] = csrfToken;
  }

  console.log('Fetch URL:', url);
  console.log('Fetch options:', JSON.stringify(options, null, 2));

  const response = await window.fetch(url, options);

  if (response.status >= 400) {
    console.error('Fetch error:', response.status, response.statusText);
    const errorData = await response.json().catch(() => ({}));
    console.error('Error data:', errorData);
    return response; // Return the response instead of throwing
  }

  return response;
}
