import App from './lib/koa/server';

import vendors from './routes/vendors';

const app = new App(5000, [vendors]);

app.start();

export default app.instance;