"use strict";
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ contactPoints: ['127.0.0.1']});
client.connect()
  .then(function () {
    console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys());
    console.log('Keyspaces: %j', Object.keys(client.metadata.keyspaces));
    console.log('Shutting down');
    const query = 'SELECT cluster_name, listen_address FROM system.local';
    client.execute(query)
      .then(result => console.log('System info %s', result.rows[0]));
    return client.shutdown();
  })
  .catch(function (err) {
    console.error('There was an error when connecting', err);
    return client.shutdown();
  });

/*
const cassandra = require('cassandra-driver');
const client = new cassandra.Client({ contactPoints: ['h1', 'h2'], keyspace: 'ks1' });

const query = 'SELECT cluster_name, listen_address FROM system.local';
client.execute(query)
  .then(result => console.log('System info %s', result.rows[0]));
*/
