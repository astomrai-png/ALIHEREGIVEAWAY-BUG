/**
 * PROXY MANAGER — BAHIRAVA BUG BOT
 * ─────────────────────────────────────────────
 * Assigns a different proxy IP to each WhatsApp
 * session. Prevents WhatsApp from rate-limiting
 * or flagging all bug messages from one IP.
 *
 * Supports: socks5://, socks4://, http://, https://
 * Add proxies in config.js → proxies: [ ... ]
 *
 * Free SOCKS5 proxy lists:
 *   https://www.proxy-list.download/SOCKS5
 *   https://spys.one/free-proxy-list/
 */

let SocksProxyAgent, HttpsProxyAgent, HttpProxyAgent;
try { ({ SocksProxyAgent } = require('socks-proxy-agent')); } catch (_) {}
try { ({ HttpsProxyAgent } = require('https-proxy-agent')); } catch (_) {}
try { ({ HttpProxyAgent  } = require('http-proxy-agent'));  } catch (_) {}

function makeAgent(proxyUrl) {
    if (!proxyUrl) return null;
    const url = proxyUrl.trim();
    try {
        if (/^socks[45]?:\/\//i.test(url)) {
            if (!SocksProxyAgent) throw new Error('socks-proxy-agent not installed — run: npm install socks-proxy-agent');
            return new SocksProxyAgent(url);
        }
        if (url.startsWith('https://')) {
            if (!HttpsProxyAgent) throw new Error('https-proxy-agent not installed');
            return new HttpsProxyAgent(url);
        }
        if (url.startsWith('http://')) {
            if (!HttpProxyAgent) throw new Error('http-proxy-agent not installed');
            return new HttpProxyAgent(url);
        }
        // no scheme → assume socks5
        if (!SocksProxyAgent) throw new Error('socks-proxy-agent not installed');
        return new SocksProxyAgent('socks5://' + url);
    } catch (e) {
        console.warn(`[PROXY] Cannot create agent for "${url}": ${e.message}`);
        return null;
    }
}

class ProxyPool {
    constructor(list = []) {
        this.list   = list.filter(Boolean);
        this.agents = this.list.map(makeAgent).filter(Boolean);
        this._idx   = 0;
        if (this.agents.length) {
            console.log(`\x1b[32m[PROXY]\x1b[0m ${this.agents.length} proxy(ies) loaded — each session gets its own IP`);
        } else {
            console.log(`\x1b[33m[PROXY]\x1b[0m No proxies configured (add in config.js for faster bugs)`);
        }
    }
    next()          { return this.agents.length ? this.agents[(this._idx++) % this.agents.length] : null; }
    forSession(idx) { return this.agents.length ? this.agents[idx % this.agents.length] : null; }
    get enabled()   { return this.agents.length > 0; }
    get count()     { return this.agents.length; }
}

module.exports = { ProxyPool, makeAgent };
