"use strict";
const cassandra = require('cassandra-driver')
const async = require('async')
const assert = require('assert')

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'] })
const id = cassandra.types.Uuid.random()

client.connect()
  .then( () => {
    console.log('Connected to cluster with %d host(s): %j', client.hosts.length, client.hosts.keys())
    const createKeyspace = "CREATE KEYSPACE IF NOT EXISTS ken WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1' }"
    client.execute(createKeyspace)
      .then()
      .catch( (error) => {
        console.error('Error with create keyspace %s', error)
        return process.exit()
      })
    console.log('Keyspaces: %j', Object.keys(client.metadata.keyspaces))
    const createTable = "create table if not exists ken.user (userid text primary key, name text, email text, birthdate Date)"
    client.execute(createTable)
      .then()
      .catch( (error) => {
        console.error('Error with create table %s', error)
        return process.exit()
      })
    console.log('Keyspaces: %j', Object.keys(client.metadata.keyspaces))
    const query = 'SELECT cluster_name, listen_address FROM system.local'
    client.execute(query)
      .then(result => {
        let row = result.first()
        console.log('System info %s %s', row.cluster_name, row.listen_address )
        console.log('Full info: %s', JSON.stringify(result))
      })
    /*
    const insert = 'INSERT INTO ken.user (userid, name, email, birthdate) VALUES (?, ?, ?)';
    const params = ['mick-jagger', 'Sir Mick Jagger', 'mick@rollingstones.com', new Date(1943, 6, 26)];
    client.execute(insert, params, { prepare: true })
      .then( () => {
        console.log('Completed insert')
        return process.exit()
      })
      .catch( (error) => {
        console.error('Error with insert %s', error)
        return process.exit()
      })
     */
  })
  .catch( (err) => {
    console.error('There was an error %s', err)
    return process.exit()
  })

