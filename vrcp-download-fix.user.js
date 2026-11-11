// ==UserScript==
// @name        Download Fix for vrcpirate.com
// @namespace   Violentmonkey Scripts
// @match       https://vrcpirate.com/iviewer/*
// @grant       none
// @version     1.0
// @author      -
// @description 2026/11/10 14:26:04
// @updateURL   https://raw.githubusercontent.com/VRCPirate/Userscripts/refs/heads/main/vrcp-download-fix.user.js
// @run-at      document-start
// ==/UserScript==

(function () {
    'use strict';

    const win = unsafeWindow;

    const API_HOST = 'api-v3.vrcpirate.com';
    const API_PATH = '/assets/';

    function isTarget(url) {
        try {
            const u = new URL(url, location.href);
            return u.hostname === API_HOST &&
                   u.pathname.startsWith(API_PATH);
        } catch {
            return false;
        }
    }

    const originalFetch = win.fetch;
    win.fetch = async function (...args) {
        const response = await originalFetch.apply(this, args);

        const requestUrl = args[0] instanceof win.Request
            ? args[0].url
            : String(args[0]);

        if (!isTarget(requestUrl)) {
            return response;
        }

        try {
            const contentType =
                response.headers.get('content-type') || '';

            if (!contentType.includes('json')) {
                return response;
            }

            const data = await response.clone().json();
            const modified = data;
            if('downloadDisabledReason' in modified) {
              modified.downloadDisabledReason = null;
            }

            const headers = new Headers(response.headers);

            headers.delete('content-length');
            headers.delete('content-encoding');

            return new Response(
                JSON.stringify(modified),
                {
                    status: response.status,
                    statusText: response.statusText,
                    headers
                }
            );
        } catch (e) {
            console.warn('Fetch error:', e);
            return response;
        }
    };

    console.log('[VRCPirate Download Fix] Initialized');
})();
