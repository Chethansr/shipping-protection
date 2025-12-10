Act as a senior technical writer. Your task is to generate a comprehensive, professional, and concise step-by-step technical guide for integrating Narvar's Shipping Protection offering. The guide must be optimized for readability on developer documentation platforms (e.g., Readme.io). Do not use verbose code examples, emojis, or symbols. The overall tone must be professional and technical.

- Target Persona using this documentation is Senior Engineers to integrate Narvar's shipping protection offering into their ecommerce website.
- Examples
  -  https://docs.stripe.com/js - for integrating stripe.js on web
  - Mobile react native - https://docs.stripe.com/payments/accept-a-payment?platform=react-native&ui=payment-sheet

Document structure
- High level architecture
  - Ascii flow diagram
    - User on cart -> opts-in to protection -> checkout -> Narvar server side quote + signature + Merchant verifies the signature using public keys
- Web (desktop and mobile) 
  - Use https://narvar.atlassian.net/wiki/spaces/DP/pages/4321181804/Frontend jira mcp to get the latest context on the integration.
  - Include a section on how to work with css
- Mobile (React Native)
  - Since Narvar shipping protection does not use any native api calls, idea is to use a webview to host a html that includes shipping protection.js
  - Include samples from webview /Users/chethansindhie/dev/Narvar/narvar_shipping_protection/mobile/webview

- Quote verification and Order api requirement
(1) decode the key info from the JWS:
echo eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVJN2Y5TThrOUZmc2FaRU1tbFVrcERSQy1Lc2V2ZDloVDBIOXV6WGxGRXMifQ | base64 -d | jq .
{
  "alg": "ES256",
  "typ": "JWT",
  "kid": "5I7f9M8k9FfsaZEMmlUkpDRC-Ksevd9hT0H9uzXlFEs"
}
(2) call the jwks endpoint:
curl -s https://edge-compute-f.dp.domain-ship.qa20.narvar.qa/.well-known/jwks.json | jq .
{
  "keys": [
    {
      "kty": "EC",
      "crv": "P-256",
      "x": "mJNS6ODdsN0LmTyX26sxnz_1z4PXx2v9sClDlxbCVT4",
      "y": "8Lcrlh9n60DSVbMl6IB5yP8irD7jxOhvDSf_yfP2ff0",
      "use": "sig",
      "alg": "ES256",
      "kid": "piK46w798KJCOss2Z3jsy17rlwyIz6X6SO8sB9XWov0"
    },
    {
      "kty": "EC",
      "crv": "P-256",
      "x": "tWk1GKzpNU1S-mmq44u41xUywD6com-RlzRe6PicA5E",
      "y": "pIC985uRWFQYpw9D6dx5lA5tmRwP7sdSmPAQ-aVL8_k",
      "use": "sig",
      "alg": "ES256",
      "kid": "5I7f9M8k9FfsaZEMmlUkpDRC-Ksevd9hT0H9uzXlFEs"
    }
  ]
}
(3)
select the key with keyid = 5I7f9M8k9FfsaZEMmlUkpDRC-Ksevd9hT0H9uzXlFEs (this key id we got from the step 2):
    {
      "kty": "EC",
      "crv": "P-256",
      "x": "tWk1GKzpNU1S-mmq44u41xUywD6com-RlzRe6PicA5E",
      "y": "pIC985uRWFQYpw9D6dx5lA5tmRwP7sdSmPAQ-aVL8_k",
      "use": "sig",
      "alg": "ES256",
      "kid": "5I7f9M8k9FfsaZEMmlUkpDRC-Ksevd9hT0H9uzXlFEs"
    }
(4) use this key to verify jws:
eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVJN2Y5TThrOUZmc2FaRU1tbFVrcERSQy1Lc2V2ZDloVDBIOXV6WGxGRXMifQ.eyJpYXQiOjE3NjUzMDI2NDksImV4cCI6MTc2NTU2MTg0OSwiaXNzIjoiZGVsaXZlcnktcHJvdGVjdGlvbi1lZGdlIiwic3ViIjoicXVvdGUiLCJlbGlnaWJsZSI6dHJ1ZSwicXVvdGUiOnsib3JkZXJfaXRlbXMiOlt7ImVsaWdpYmxlIjp0cnVlLCJpbnN1cmVkX3ZhbHVlIjoxMDg1MCwic2t1IjoiU0tVLTAwMSJ9XSwicHJlbWl1bV92YWx1ZSI6MjE4LCJydWxlc192ZXJzaW9uIjozMCwidG90YWxfaW5zdXJlZF92YWx1ZSI6NDQzNSwidG90YWxfbm90X2luc3VyZWRfdmFsdWUiOjAsInZhbGlkX3VudGlsIjoiMjAyNS0xMi0zMFQxNzo1MDo0OVoifX0.FWM5SSzwn5G8w8yGercB60LBt1X_kwcTZyHdIemqbqJ0pf26psyjn37AUJjO44iOHfABuVq4mp9i1Y9sppWCeg

(5) Send the signature in 
  - Orderapi order.attributes[].quote_signature

Additionally quote can also be requested from server. Note the js/sdk getQuote will give a server side create quote with signature
 get quote
curl -s -X 'POST' \
  'https://edge-compute-f.dp.domain-ship.qa20.narvar.qa/v1/quote' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "currency": "USD",
  "discount": 7500,
  "locale": "en-US",
  "order_items": [
    {
      "line_price": 10000,
      "quantity": 2,
      "sku": "SKU-001",
      "total_tax": 850
    }
  ],
  "ship_to": "US",
  "shipping_fee": 1000,
  "shipping_fee_tax": 85,
  "retailer_moniker": "dp"
}' | jq .
{
  "eligible": "eligible",
  "quote": {
    "premium_value": 218
  },
  "signature": {
    "jws": "eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjVJN2Y5TThrOUZmc2FaRU1tbFVrcERSQy1Lc2V2ZDloVDBIOXV6WGxGRXMifQ.eyJpYXQiOjE3NjUzMDI2NDksImV4cCI6MTc2NTU2MTg0OSwiaXNzIjoiZGVsaXZlcnktcHJvdGVjdGlvbi1lZGdlIiwic3ViIjoicXVvdGUiLCJlbGlnaWJsZSI6dHJ1ZSwicXVvdGUiOnsib3JkZXJfaXRlbXMiOlt7ImVsaWdpYmxlIjp0cnVlLCJpbnN1cmVkX3ZhbHVlIjoxMDg1MCwic2t1IjoiU0tVLTAwMSJ9XSwicHJlbWl1bV92YWx1ZSI6MjE4LCJydWxlc192ZXJzaW9uIjozMCwidG90YWxfaW5zdXJlZF92YWx1ZSI6NDQzNSwidG90YWxfbm90X2luc3VyZWRfdmFsdWUiOjAsInZhbGlkX3VudGlsIjoiMjAyNS0xMi0zMFQxNzo1MDo0OVoifX0.FWM5SSzwn5G8w8yGercB60LBt1X_kwcTZyHdIemqbqJ0pf26psyjn37AUJjO44iOHfABuVq4mp9i1Y9sppWCeg",
    "created_at": 1765302649,
    "expires_at": 1765561849
  }
}

 - Webhooks for Claim Status
   - Will add content later

General guidelines
- Do not write very verbose code examples, keep it simple
- should be professional and kept clear and concise
- Narvar uses readme.io to host all public facing documentation. See if you can optimize for it
- Do not include any emojis , symbols. Keep it professional. 
- Use Jira mcp for jira links
- use websearch for stripe public documents to influence the structure and tone of writing the document