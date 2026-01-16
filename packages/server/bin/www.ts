#!/usr/bin/env node

import app from '../app.js';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

app.listen({ port, host: '0.0.0.0' }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});
