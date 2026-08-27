#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const apiKey = process.env.RAPIDAPI_SECRET;
const host = process.env.RAPIDAPI_HOST || 'toolsapi.p.rapidapi.com';
const baseUrl = process.env.RAPIDAPI_BASE || `https://${host}`;
if (!apiKey) {
  console.error('Set RAPIDAPI_SECRET before running the sample fetcher.');
  process.exit(2);
}

const endpoints = [
  ['base64-encode', '/v1/security/base64-encode', { data: 'hello world' }],
  ['password-strength', '/v1/security/password-strength', { password: 'P@ssw0rd123!' }],
  ['hash-generate', '/v1/security/hash-generate', { algorithm: 'sha256', data: 'hello world' }],
  ['mac-address', '/v1/security/mac-address', { mac: '00:1B:44:11:3A:B7' }],
  ['crypto-address', '/v1/security/crypto-address', { address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' }],
  ['sqli-scanner', '/v1/security/sqli-scanner', { query: "SELECT * FROM users WHERE id = '1'" }],
  ['phone-validate', '/v1/security/phone-validate', { phone: '+14155552671' }],
  ['jwt-decode', '/v1/security/jwt-decode', { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' }],
  ['text-entropy', '/v1/security/text-entropy', { text: 'hello world' }],
  ['uuid-validate', '/v1/security/uuid-validate', { uuid: '550e8400-e29b-41d4-a716-446655440000' }],
  ['email-check', '/v1/security/email-check', { email: 'alice@example.com' }],
  ['cc-luhn-check', '/v1/security/cc-luhn-check', { cc: '4111111111111111' }],
  ['html-sanitize', '/v1/security/html-sanitize', { html: '<script>alert(1)</script><p>Hello</p>' }],
  ['domain-check', '/v1/security/domain-check', { domain: 'example.com' }],
  ['iban-validate', '/v1/security/iban-validate', { iban: 'GB82WEST12345698765432' }],
  ['ip-analyze', '/v1/security/ip-analyze', { ip: '8.8.8.8' }],
  ['url-analyze', '/v1/security/url-analyze', { url: 'https://example.com/test?x=1' }],
  ['base64-decode', '/v1/security/base64-decode', { data: 'aGVsbG8gd29ybGQ=' }],
  ['xss-scanner', '/v1/security/xss-scanner', { text: '<img src=x onerror=alert(1)>' }],
  ['profanity-filter', '/v1/security/profanity-filter', { text: 'this is some shitty text' }]
];

async function fetchSample([id, endpoint, body]) {
  console.log(`Fetching ${id}`);
  try {
    const response = await fetch(baseUrl + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-RapidAPI-Key': apiKey, 'X-RapidAPI-Host': host },
      body: JSON.stringify(body)
    });
    const text = await response.text();
    let result;
    try { result = JSON.parse(text); } catch { result = { raw: text }; }
    return { endpoint, sampleRequest: body, result: { status: response.status, ok: response.ok, body: result } };
  } catch (error) {
    return { endpoint, sampleRequest: body, result: { status: 0, ok: false, error: String(error) } };
  }
}

(async () => {
  const outputDir = path.join(process.cwd(), 'docs', 'samples');
  fs.mkdirSync(outputDir, { recursive: true });
  for (const endpoint of endpoints) {
    const [id] = endpoint;
    fs.writeFileSync(path.join(outputDir, `${id}.json`), JSON.stringify(await fetchSample(endpoint), null, 2) + '\n');
  }
  execFileSync('git', ['add', 'docs/samples'], { stdio: 'inherit' });
  if (execFileSync('git', ['diff', '--cached', '--quiet']).length === 0) {
    console.log('No sample changes to commit.');
    return;
  }
  execFileSync('git', ['config', 'user.name', 'github-actions[bot]']);
  execFileSync('git', ['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
  execFileSync('git', ['commit', '-m', 'chore: update API sample responses [ci]'], { stdio: 'inherit' });
  execFileSync('git', ['push'], { stdio: 'inherit' });
})();
