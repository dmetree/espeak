// import { currenciesFluidtokens } from "@/components/lib/Lucid/utils";

export const minifyAddress = (address, length) =>
  address?.slice(0, length) +
  "..." +
  address?.slice(address?.length - length - 1, address?.length);

export function hex2a(hexx) {
  if (!hexx) return;
  var hex = hexx.toString(); //force conversion
  var str = "";
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export function toHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

export function hexToBytes(hex) {
  let bytes = [];
  for (let c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

export function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text);
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

export function getFluidBaseNFT(role, tx, rate, amount, duration) {
  let baseNFT = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-300 -100 700 1000">
      <rect x="-290" y="-90" width="690" height="990" stroke="blue" strokeWidth="2px" fill="white"/>
      <path d="M 0 0 C 0 0 0 0 0 0 C 0 -50 50 -40 90 -40 C 120 -40 120 0 90 0 L 30 0 C 10 0 0 0 0 30" fill="#50d1b3"/>
      <path d="M 20 100 C -10 30 -10 0 100 10 C 60 10 50 20 50 30 C 50 40 50 60 60 90 C 70 120 30 130 20 100 Z" fill="#1b9ee6"/>
      <text x="0" y="50" font-size="60" dy="0" font-family="Sans Serif" fill="#000000">
        <tspan x="5%" dy="1.8em" dominant-baseline="middle" text-anchor="middle">FLUID BOND</tspan>
        <tspan x="5%" dy="1.2em" dominant-baseline="middle" text-anchor="middle" font-size="48">${role}</tspan>
        <tspan x="5%" dy="1.2em" dominant-baseline="middle" text-anchor="middle">Bond id:</tspan>
        <tspan x="5%" dy="2.4em" dominant-baseline="middle" text-anchor="middle" font-size="20">${tx}</tspan>
      </text>
    </svg>
    `;
  return baseNFT;
}

export const time_remaining = (endtime) => {
  const t = Date.parse(endtime) - Date.parse(new Date());
  let days = Math.floor(t / (1000 * 60 * 60 * 24));
  let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let seconds = Math.floor((t / 1000) % 60);
  let minutes = Math.floor((t / 1000 / 60) % 60);
  hours = hours > 9 ? hours : "0" + hours;
  minutes = minutes > 9 ? minutes : "0" + minutes;
  seconds = seconds > 9 ? seconds : "0" + seconds;
  if (t > 0)
    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      total: t,
    };
  else return { days: 0, hours: "0", minutes: "0", seconds: "0", total: 0 };
};

export function convertStats(labelValue, decimal = 2) {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(decimal) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(decimal) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(decimal) + "K"
    : Math.abs(Number(labelValue));
}

// export const getCurrencyByPolicyID = (policyId) => {
//     let resCurrency = {
//         name: "ADA",
//         multiplier: 1e6
//     };
//     if (policyId) {
//         Object.keys(currenciesFluidtokens).map(currency => {
//             if (currenciesFluidtokens[currency]?.mainnet?.policy + currenciesFluidtokens[currency]?.mainnet?.assetname === policyId) {
//                 resCurrency = {
//                     name: currency,
//                     multiplier: currenciesFluidtokens[currency]?.mainnet?.multiplier
//                 };
//             }
//         })
//     }
//     return resCurrency;
// }

export const countDecimals = function (value) {
  if (value % 1 != 0) return value.toString().split(".")[1].length;
  return 0;
};
