import Cookies from 'js-cookie';

let csrfTokenRestored = false;

export async function restoreCSRF() {
  if (csrfTokenRestored) return; // Don't restore if already done
  
  const response = await fetch('/api/csrf/restore', {
    credentials: 'same-origin'
  });
  
  if (response.ok) {
    csrfTokenRestored = true;
    return response;
  }
  throw new Error('Failed to restore CSRF token');
}

export async function csrfFetch(url, options = {}) {
  // Ensure CSRF token is restored before making any requests
  if (!csrfTokenRestored) {
    await restoreCSRF();
  }

  options.method = options.method || 'GET';
  options.headers = options.headers || {};
  
  if (url.startsWith('/')) {
    options.credentials = 'same-origin';
  }

  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    const csrfToken = Cookies.get('XSRF-TOKEN');
    
    if (!csrfToken) {
      console.error('No CSRF token found');
      throw new Error('No CSRF token available');
    }
    
    console.log('CSRF Token:', csrfToken);
    options.headers['XSRF-Token'] = csrfToken;
  }

  console.log('Fetch URL:', url);
  console.log('Fetch options:', JSON.stringify(options, null, 2));

  try {
    const response = await window.fetch(url, options);

    if (!response.ok) {
      console.error('Fetch error:', response.status, response.statusText);
      throw response;
    }

    return response;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}
