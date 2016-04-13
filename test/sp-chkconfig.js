require('should')

var fs        = require('fs');
var path      = require('path');
var split     = require('split');
var through2  = require('through2');
var spChkconfig = require('../sp-chkconfig.js');

describe('chkconfig init script headers stream parser', function() {
  it('parses headers given 1.txt', function(done) {
    var properties = []
    var k = fs.createReadStream(path.join(__dirname, '../fixtures/1.txt'));
    k.pipe(split())
    .pipe(spChkconfig())
    .pipe(through2.obj(function (d, e, c) {
      properties.push(d)
      c();
    }))
    k.on('close', function () {
      if (done) {
        properties.length.should.eql(4);
        properties[0].should.eql({ id: 'runLevels', value: '2345' });
        properties[1].should.eql({ id: 'startPriority', value: '20' });
        properties[2].should.eql({ id: 'stopPriority', value: '80' });
        properties[3].should.eql({ id: 'description', value: 'Saves and restores system entropy pool for higher quality random number generation.' });
        done();
      }
    })
    k.on('error', function (err) {
      done(err);
      done = null;
    })
  });

  it('parses headers given 2.txt', function(done) {
    var properties = []
    var k = fs.createReadStream(path.join(__dirname, '../fixtures/2.txt'));
    k.pipe(split())
    .pipe(spChkconfig())
    .pipe(through2.obj(function (d, e, c) {
      properties.push(d)
      c();
    }))
    k.on('close', function () {
      if (done) {
        properties.length.should.eql(4);
        properties[0].should.eql({ id: 'runLevels', value: '2345' });
        properties[1].should.eql({ id: 'startPriority', value: '20' });
        properties[2].should.eql({ id: 'stopPriority', value: '80' });
        properties[3].should.eql({ id: 'description', value: 'Saves and restores system entropy pool for higher quality random number generation.' });
        done();
      }
    })
    k.on('error', function (err) {
      done(err);
      done = null;
    })
  });

  it('parses headers given 3.txt', function(done) {
    var properties = []
    var k = fs.createReadStream(path.join(__dirname, '../fixtures/3.txt'));
    k.pipe(split())
    .pipe(spChkconfig())
    .pipe(through2.obj(function (d, e, c) {
      properties.push(d)
      c();
    }))
    k.on('close', function () {
      if (done) {
        properties.length.should.eql(4);
        properties[0].should.eql({ id: 'runLevels', value: '2345' });
        properties[1].should.eql({ id: 'startPriority', value: '20' });
        properties[2].should.eql({ id: 'stopPriority', value: '80' });
        properties[3].should.eql({ id: 'description', value: 'Saves and restores system entropy pool for higher quality random number generation.' });
        done();
      }
    })
    k.on('error', function (err) {
      done(err);
      done = null;
    })
  });

  it('parses headers given 4.txt', function(done) {
    var properties = []
    var k = fs.createReadStream(path.join(__dirname, '../fixtures/4.txt'));
    k.pipe(split())
    .pipe(spChkconfig())
    .pipe(through2.obj(function (d, e, c) {
      properties.push(d)
      c();
    }))
    k.on('close', function () {
      if (done) {
        properties.length.should.eql(3);
        properties[0].should.eql({ id: 'runLevels', value: '2345' });
        properties[1].should.eql({ id: 'startPriority', value: '20' });
        properties[2].should.eql({ id: 'stopPriority', value: '80' });
        done();
      }
    })
    k.on('error', function (err) {
      done(err);
      done = null;
    })
  });

});
