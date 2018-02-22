"use strict";
const cassandra = require('cassandra-driver')
const async = require('async')

const client = new cassandra.Client({ contactPoints: ['127.0.0.1'] })
const id = cassandra.types.Uuid.random()

async.series([
  function connect(next) {
    client.connect(next)
  },
  function createKeyspace(next) {
    const query = "CREATE KEYSPACE IF NOT EXISTS ken WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1' }"
    client.execute(query, next)
  },
  function createTable(next) {
    const query = "CREATE TABLE IF NOT EXISTS ken.basic (id uuid, txt text, val int, PRIMARY KEY(id))"
    client.execute(query, next)
  },
  function select(next) {
    const query = 'SELECT id, txt, val FROM ken.basic'
    client.execute(query, { prepare: true}, function (err, result) {
      if (err) return next(err)
      for (let row of result) {
        console.log(row['id'], row['txt'], row['val'])
      }
      const row = result.first()
      const len = result.rowLength
      console.log('First row: ', row)
      console.log('Total rows: ', len)
      console.log('Full results object: ', JSON.stringify(result))
      next()
    })
  }
  /*
  function insert(next) {
    const query = 'INSERT INTO ken.basic (id, txt, val) VALUES (?, ?, ?)'
    client.execute(query, [ id, 'Howdy!', 400 ], { prepare: true}, next)
  },
  function select(next) {
    const query = 'SELECT id, txt, val FROM ken.basic WHERE id = ?'
    client.execute(query, [ id ], { prepare: true}, function (err, result) {
      if (err) return next(err)
      const row = result.first()
      console.log('Obtained row: ', row)
      next()
    })
  }
  */
], (err) => {
  if (err) {
    console.error('There was an error', err.message, err.stack)
  }
  console.log('Shutting down')
  client.shutdown()
})