async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);

  const payload = {
    iss: CLIENT_ID,
    sub: SERVICE_ACCOUNT,
    iat: now,
    exp: now + 300
  };

  const privateKey = PRIVATE_KEY.includes('\\n')
    ? PRIVATE_KEY.replace(/\\n/g, '\n')
    : PRIVATE_KEY;

  const assertion = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('assertion', assertion);
  params.append('scope', 'bot.message');   // ←これを追加

  const response = await axios.post(
    'https://auth.worksmobile.com/oauth2/v2.0/token',
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return response.data.access_token;
}
