'use strict';

const fp = require('fastify-plugin');
const couchbase = require('couchbase');

function fastifyCouchbase(fastify, options, next) {
  couchbase.connect(options.url, {
    username: options.username,
    password: options.password,
  }).then((cluster) => {
    const bucket = cluster.bucket(options.bucketName);
    const cb = {
      cluster,
      bucket,
    };
    fastify
      .decorate('cb', cb)
      .addHook('onClose', close);
    return next();
  }).catch((err) => {
    if (err) {
      return next(err);
    }
  });
}

function close(fastify, done) {
  fastify.cb.cluster.close().then(() => done()).catch(() => done());
}

module.exports = fp(fastifyCouchbase, '>=3.2.3');
