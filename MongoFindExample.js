# A simple query using the find method on the collection.

var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');

var db = new Db('test', new Server('localhost', 27017));
// Establish connection to db
db.open(function(err, db) {

  // Create a collection we want to drop later
  db.createCollection('simple_query', function(err, collection) {
    assert.equal(null, err);

    // Insert a bunch of documents for the testing
    collection.insert([{a:1}, {a:2}, {a:3}], {w:1}, function(err, result) {
      assert.equal(null, err);

      // Peform a simple find and return all the documents
      collection.find().toArray(function(err, docs) {
        assert.equal(null, err);
        assert.equal(3, docs.length);

        db.close();
      });
    });
  });
});
