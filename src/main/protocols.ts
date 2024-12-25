import { protocol, net } from 'electron';
import path from 'node:path';

import util from 'node:util';
import { appStaticAbsolutePath } from '../paths';
import { createHash } from 'node:crypto';
const debugAppStatic = util.debuglog('protocol-app-static');
const debugFile = util.debuglog('protocol-file');

const appStaticFileUrl = 'file://' + appStaticAbsolutePath.replaceAll(/\\/g, '/');

export function registerProtocolSchemes() {
  protocol.registerSchemesAsPrivileged([
    { 
      scheme: 'app-static', 
      privileges: {
        standard: true,
        secure: true,
        supportFetchAPI: true,
        corsEnabled: true,
        allowServiceWorkers: true,
        codeCache: true,
      }
    },
  ]);
}

const appStaticCspAllowPaths = new Set([
  '/index.html'
]);

const cspCache = new Map<string, string>();

export function registerProtocolHandlers() {
  protocol.handle('app-static', async req => {
    const { url } = req;

    const parsed = new URL(url); // may throw
    if(parsed.protocol !== 'app-static:') throw new Error("unexpected protocol");

    // host is required for "standard" protocols (RFC 3986 "generic URI syntax")
    if(parsed.host !== 'local') throw new Error('app-static:// only supports host "local"!');

    let requestUrlPath = parsed.pathname; // always starts with a '/'
    if(requestUrlPath.endsWith('/')) requestUrlPath += 'index.html';

    const resolvedRequestPath = path.resolve(appStaticAbsolutePath, requestUrlPath.substring(1));
    if(!resolvedRequestPath.startsWith(appStaticAbsolutePath)) {
      debugAppStatic("Protocol app-static: Preventing directory traversal [%s] (%s)", url, resolvedRequestPath);
      throw new Error("Cannot traverse outside of app static directory.");
    }

    const fileUrl = appStaticFileUrl + requestUrlPath;
    debugAppStatic("Protocol request [%s] -> %s", url, fileUrl);

    const response = await net.fetch(fileUrl, { bypassCustomProtocolHandlers: true });
    if(!response.ok) return Response.error();

    let csp = "default-src 'none'";
    let body: ReadableStream<Uint8Array<ArrayBufferLike>> | string | null = response.body;
    if(body && appStaticCspAllowPaths.has(requestUrlPath)) {
      const cachedCsp = cspCache.get(requestUrlPath);
      if(cachedCsp) {
        csp = cachedCsp;
      }else{
        const text = await response.text(); // may throw if binary?

        const hashBase = createHash('sha256');
        const scriptHashes = [...text.matchAll(/<script[^>]*>(.*?)<\/script>/gi)]
          .map(x => x[1])
          .filter(Boolean)
          .map(x => {
            const hash = hashBase.copy();
            hash.update(x);
            return hash.digest('base64');
          });

        body = text;
        csp = `default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src ${scriptHashes.map(x => `'sha256-${x}'`).join(' ')} 'strict-dynamic'`;
        cspCache.set(requestUrlPath, csp);
      }
      debugAppStatic("[CSP] Protocol request [%s] is a CSP-whitelisted route, generated CSP: %s", requestUrlPath, csp);
    }

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries([
        ...response.headers.entries(),
        ['Content-Security-Policy', csp]
      ]),
    })
  });

  protocol.handle('file', (req) => {
    debugFile("Protocol request blocked [%s]", req.url);
    return Response.error(); // disallow file protocol

    // implement some jailing logic if needed
    /*
    const dirnameUrl = projectRootAbsolutePath.replaceAll(/\\/g, '/');
    const url = req.url.replaceAll(/\\/g, '/');

    if(url.indexOf(dirnameUrl) === -1) { // insecure
      const rest = url.replace(/file:\/\/\/?(?:.*:)?\/?/i, '');
      const fileUrl = projectRootAbsolutePath + '/' + rest;
      debugFile("Protocol request rewritten [%s] -> %s", url, fileUrl);
      return net.fetch(url, { ...req, bypassCustomProtocolHandlers: true });
    }

    debugFile("Protocol request not filtered [%s]", url);
    return net.fetch(req, { bypassCustomProtocolHandlers: true });
    */
  });
}
