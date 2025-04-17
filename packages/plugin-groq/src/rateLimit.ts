// Project: groq-plugin
// File Created: 2023-10-02

import { AgentRuntime } from '@elizaos/core';
import { groqPlugin } from './index.ts';
import dotenv from 'dotenv';

dotenv.config();

const defaultUrl = 'https://api.groq.com/';
const platform = 'platform/v1/';
const org = 'organizations/';
const userProfile = 'user/profile';

let runtime: AgentRuntime = undefined;
let config = {};
//let g = await groqPlugin.init(config, runtime)
let key = groqPlugin.config['GROQ_API_KEY'];
//$%7Borgid%7D/limits'
//"https://api.groq.com/platform/v1/organizations/org_01j5b4pz9jff492fq686vypsx6/limits"

const bearer = `Bearer ${key}`;

const res = await fetch(defaultUrl + platform + userProfile, {
  headers: {
    accept: 'application/json',
    'accept-language': 'en-US,en;q=1',
    authorization: bearer,
    'content-type': 'application/json',
    //"groq-organization": "org_01j5b4pz9jff492fq686vypsx6",
    Referer: 'https://console.groq.com/',
  },
  method: 'GET',
});
console.log(res);

// headers: {

//     authorization: `Bearer ${token}`,
//         'content-type': 'application/json',
//             priority: 'u=1, i',
//                 'x-groq-keep-alive-pings': 'true',
//                     'x-stainless-arch': 'unknown',
//                         'x-stainless-lang': 'js',
//                             'x-stainless-os': 'Unknown',
//                                 'x-stainless-package-version': '0.4.0',
//                                     'x-stainless-runtime': 'browser:chrome',
//                                         'x-stainless-runtime-version': '126.0.0',
//   },
// referrer: `https://groq.com/`,
//     body: null,
//         method: 'GET',
//             mode: 'cors',
//                 credentials: 'include',
