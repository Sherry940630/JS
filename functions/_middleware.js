export async function onRequest(context) {
  const { request, env, next } = context;
  const auth = request.headers.get('Authorization');

  const USERNAME = env.SITE_USER || '123';
  const PASSWORD = env.SITE_PASSWORD || '0749'; //0630+0319

  if (!auth) {
    return new Response('Authentication Required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  //解析瀏覽器傳入的 Basic Auth 標頭
  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    return new Response('Invalid Authorization', { status: 400 });
  }

  const decoded = atob(encoded);
  const [user, pass] = decoded.split(':');

  //密碼正確就吐出網站內容
  if (user === USERNAME && pass === PASSWORD) {
    return await next();
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}