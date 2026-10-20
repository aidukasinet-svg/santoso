/**
 * =========================================================================
 * CLOUDFLARE PAGES WORKER PROXY — SANTOSO DIGITAL IDENTITY
 * =========================================================================
 * File: _worker.js
 * Fungsi: Reverse proxy untuk menghilangkan CORS error dari Google Apps Script
 * Diadaptasi dari pola proyek Omega Plus (aidukasi.net)
 * =========================================================================
 */

const DEFAULT_GAS_URL = "https://script.google.com/macros/s/AKfycbwBU6IumXIHOpIS_kw3bINs2HpIpn5dyqIWw8olQafiUS-LfNyYYY2xKnAZ1ajTE_sVsw/exec"; // Ganti setelah deploy Apps Script

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const gasUrl = (env && env.GAS_URL) ? env.GAS_URL : DEFAULT_GAS_URL;

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Admin-Key',
      'Access-Control-Max-Age': '86400',
    };

    // Preflight OPTIONS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Jika Request API (/api)
    if (url.pathname.startsWith('/api')) {
      const action = url.searchParams.get('action') || '';
      const targetUrl = new URL(gasUrl);

      url.searchParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value);
      });

      // Edge caching untuk GET public yang aman
      const isCacheableGet = (
        request.method === 'GET' &&
        ['getAll', 'getOne', 'ping', 'getProfile'].includes(action)
      );
      const cache = caches.default;
      const cacheKey = new Request(targetUrl.toString(), { method: 'GET', headers: { 'Accept': 'application/json' } });

      if (isCacheableGet) {
        const cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
          const newHeaders = new Headers(cachedResponse.headers);
          Object.keys(corsHeaders).forEach(k => newHeaders.set(k, corsHeaders[k]));
          newHeaders.set('X-Edge-Cache', 'HIT');
          return new Response(cachedResponse.body, { status: cachedResponse.status, headers: newHeaders });
        }
      }

      // Siapkan Request ke Apps Script
      const fetchOptions = {
        method: request.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': request.headers.get('content-type') || 'application/json',
        },
        redirect: 'follow',
      };

      if (request.method === 'POST') {
        try { fetchOptions.body = await request.text(); } catch (e) {}
      }

      try {
        const gasResponse = await fetch(targetUrl.toString(), fetchOptions);
        const responseData = await gasResponse.text();

        const responseHeaders = {
          ...corsHeaders,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': isCacheableGet ? 'public, max-age=30, s-maxage=60' : 'no-store, no-cache',
          'X-Edge-Cache': 'MISS',
        };

        const finalResponse = new Response(responseData, {
          status: gasResponse.status,
          headers: responseHeaders,
        });

        if (isCacheableGet && gasResponse.status === 200) {
          ctx.waitUntil(cache.put(cacheKey, finalResponse.clone()));
        }

        return finalResponse;
      } catch (err) {
        return new Response(JSON.stringify({
          status: 'error',
          message: 'Gagal terhubung ke Apps Script: ' + err.message,
        }), {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
    }

    // Default: Sajikan aset statis Cloudflare Pages
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return fetch(request);
  },
};
