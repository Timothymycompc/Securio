const ENDPOINTS = [
  ['base64-encode', 'Base64 Encode', '/v1/security/base64-encode', { data: 'hello world' }],
  ['password-strength', 'Password Strength', '/v1/security/password-strength', { password: 'P@ssw0rd123!' }],
  ['hash-generate', 'Hash Generate', '/v1/security/hash-generate', { algorithm: 'sha256', data: 'hello world' }],
  ['mac-address', 'MAC Address', '/v1/security/mac-address', { mac: '00:1B:44:11:3A:B7' }],
  ['crypto-address', 'Crypto Address', '/v1/security/crypto-address', { address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e' }],
  ['sqli-scanner', 'SQLi Scanner', '/v1/security/sqli-scanner', { query: "SELECT * FROM users WHERE id = '1'" }],
  ['phone-validate', 'Phone Validate', '/v1/security/phone-validate', { phone: '+14155552671' }],
  ['jwt-decode', 'JWT Decode', '/v1/security/jwt-decode', { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' }],
  ['text-entropy', 'Text Entropy', '/v1/security/text-entropy', { text: 'hello world' }],
  ['uuid-validate', 'UUID Validate', '/v1/security/uuid-validate', { uuid: '550e8400-e29b-41d4-a716-446655440000' }],
  ['email-check', 'Email Check', '/v1/security/email-check', { email: 'alice@example.com' }],
  ['cc-luhn-check', 'CC Luhn Check', '/v1/security/cc-luhn-check', { cc: '4111111111111111' }],
  ['html-sanitize', 'HTML Sanitize', '/v1/security/html-sanitize', { html: '<script>alert(1)</script><p>Hello</p>' }],
  ['domain-check', 'Domain Check', '/v1/security/domain-check', { domain: 'example.com' }],
  ['iban-validate', 'IBAN Validate', '/v1/security/iban-validate', { iban: 'GB82WEST12345698765432' }],
  ['ip-analyze', 'IP Analyze', '/v1/security/ip-analyze', { ip: '8.8.8.8' }],
  ['url-analyze', 'URL Analyze', '/v1/security/url-analyze', { url: 'https://example.com/test?x=1' }],
  ['base64-decode', 'Base64 Decode', '/v1/security/base64-decode', { data: 'aGVsbG8gd29ybGQ=' }],
  ['xss-scanner', 'XSS Scanner', '/v1/security/xss-scanner', { text: '<img src=x onerror=alert(1)>' }],
  ['profanity-filter', 'Profanity Filter', '/v1/security/profanity-filter', { text: 'this is some shitty text' }]
];

const container = document.getElementById('list');
const search = document.getElementById('search');
const count = document.getElementById('count');

function renderEndpoints(query = '') {
  const filtered = ENDPOINTS.filter(([, title, endpoint]) => `${title} ${endpoint}`.toLowerCase().includes(query.toLowerCase()));
  count.textContent = `${filtered.length} of ${ENDPOINTS.length}`;
  container.replaceChildren();

  for (const [id, title, endpoint, request] of filtered) {
    const article = document.createElement('article');
    article.className = 'api';
    const requestBody = JSON.stringify(request).replace(/'/g, "'\\''");
    const curl = `curl -X POST https://toolsapi.p.rapidapi.com${endpoint} \\\n  -H "Content-Type: application/json" \\\n  -H "X-RapidAPI-Key: $RAPIDAPI_SECRET" \\\n  -H "X-RapidAPI-Host: toolsapi.p.rapidapi.com" \\\n  -d '${requestBody}'`;

    const header = document.createElement('div');
    header.className = 'endpoint-title';
    header.innerHTML = '<div class="endpoint-name"><span class="method">POST</span><strong></strong></div><button type="button" aria-expanded="false">View example <span>+</span></button>';
    header.querySelector('strong').textContent = title;
    article.appendChild(header);

    const path = document.createElement('div');
    path.className = 'code';
    path.textContent = endpoint;
    article.appendChild(path);
    article.insertAdjacentHTML('beforeend', '<div class="request-label">cURL request</div>');

    const requestCode = document.createElement('pre');
    requestCode.className = 'request';
    requestCode.textContent = curl;
    article.appendChild(requestCode);

    const output = document.createElement('pre');
    output.className = 'sample';
    output.textContent = 'No sample loaded.';
    article.appendChild(output);
    container.appendChild(article);

    const button = header.querySelector('button');
    button.addEventListener('click', async () => {
      button.disabled = true;
      button.setAttribute('aria-expanded', 'true');
      button.innerHTML = 'Loading <span>...</span>';
      output.classList.add('is-visible');
      output.textContent = 'Loading...';
      try {
        const response = await fetch(`samples/${id}.json`);
        if (!response.ok) throw new Error(`Sample unavailable (HTTP ${response.status}).`);
        output.textContent = JSON.stringify(await response.json(), null, 2);
      } catch (error) {
        output.textContent = `Unable to load sample. ${error.message}`;
      } finally {
        button.disabled = false;
        button.innerHTML = 'Hide sample <span>−</span>';
      }
    });
  }
}

search.addEventListener('input', () => renderEndpoints(search.value));
renderEndpoints();
