'use strict';

const { test } = require('tap');
const Fastify = require('fastify');

const fastifyCouchbase = require('./index');

test('fastify.cb should exist', (t) => {
  t.plan(4);

  const fastify = Fastify();

  fastify.register(fastifyCouchbase, {
    url: 'couchbase://localhost/',
    bucketName: 'geoviewermobilesync',
    username: 'Administrator',
    password: 'dinakaran'
  });

  fastify.ready((err) => {
    t.error(err);
    t.ok(fastify.cb);
    t.ok(fastify.cb.cluster);
    t.ok(fastify.cb.bucket);

    fastify.close();
  });
});

test('fastify.cb.cluster should be a couchbase cluster object', (t) => {
  t.plan(2);

  const fastify = Fastify();

  fastify.register(fastifyCouchbase, {
    url: 'couchbase://localhost/',
    bucketName: 'geoviewermobilesync',
    username: 'Administrator',
    password: 'dinakaran'
  });

  fastify.ready((err) => {
    t.error(err);

    const { cluster } = fastify.cb;

    t.ok(cluster);

    fastify.close();
  });
});

test('fastify.cb.bucket should be a couchbase bucket object', (t) => {
  t.plan(2);

  const fastify = Fastify();

  fastify.register(fastifyCouchbase, {
    url: 'couchbase://localhost/',
    bucketName: 'geoviewermobilesync',
    username: 'Administrator',
    password: 'dinakaran'
  });

  fastify.ready((err) => {
    t.error(err);

    const { bucket } = fastify.cb;

    t.ok(bucket);

    fastify.close();
  });
});

