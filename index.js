'use strict';

const fp = require('fastify-plugin');
const couchbase = require('couchbase');

async function fastifyCouchbase(fastify, cBOptions, next) {
  try {
    const { options = {}, settings = {} } = cBOptions;
    const cluster = await couchbase.connect(options.url, {
      ...options
    });

    // Sets a pre-configured profile called "wanDevelopment" to help avoid latency issues
    // when accessing Capella from a different Wide Area Network
    // or Availability Zone (e.g. your laptop).
    if (settings.applyProfile) cluster.applyProfile('wanDevelopment');
    const bucket = cluster.bucket(settings.bucketName);
    const collection = bucket.scope(settings.scope || '_default').collection(settings.collection || '_default');
    const cb = { bucket, collection, cluster };
    fastify
      .decorate('cb', cb)
      .addHook('onClose', close);
    return next();
  } catch (e) {
    return next(e);
  }
}

function close(fastify, done) {
  fastify.cb.cluster.close().then(() => done()).catch(() => done());
}

module.exports = fp(fastifyCouchbase, '>=3.2.3');
