/*
stream parser for chkconfig init script headers

# chkconfig: 2345 20 80
# description: Saves and restores system entropy pool for \
#              higher quality random number generation.

*/

var through2 = require('through2')

function spChkconfig ( ){

  var started = false;
  var current;
  var found;

  var fnTransform = function (chunk, enc, callback) {

    chunk = chunk.toString();

    if (!started && chunk.match(/^\s*#\s+chkconfig:\s+/i)) {
      started = true;

      found = []
      var k = chunk.match(/^\s*#\s+chkconfig:\s+([0-9]+)/i)
      var runLevels = k && k[1]
      k = chunk.match(/^\s*#\s+chkconfig:\s+[0-9]+\s+([0-9]+)/i)
      var startPriority = k && k[1]
      k = chunk.match(/^\s*#\s+chkconfig:\s+[0-9]+\s+[0-9]+\s+([0-9]+)/i)
      var stopPriority = k && k[1]

      if(runLevels) this.push({id:'runLevels', value: runLevels})
      if(startPriority) this.push({id:'startPriority', value: startPriority})
      if(stopPriority) found = {id: 'stopPriority', value: stopPriority}

    } else if (started && chunk.match(/^\s*#\s*description:\s*/i)) {
      // # description:          puppet
      var parsed = chunk.match(/^\s*#\s*description:\s*(.+)/);
      if (parsed) {
        current = {
          id: 'description',
          value: parsed[1] && parsed[1].replace(/\\\s*$/, '').replace(/\s+$/, '')
        }
      }

    } else if (started && current && current.id==='description' && chunk.match(/^\s*#\s*(.+)/i)) {
      var k = chunk.match(/^\s*#\s*(.+)/i)[1].replace(/\\\s*$/, '').replace(/\s+$/, '');
      current.value += k ? ' ' + k : '';

    }else if (started && chunk.match(/^\s*#\s*$/i) || !chunk.match(/^\s*#/)) {
      started = false;
      if(current) {
        found = current;
        current = null
      }
    }

    callback(null, found);
    found = null;
  }

  var fnFlush = function (cb) {
    if (current) this.push(current);
    cb();
  }

  return through2.obj(fnTransform, fnFlush)
}

module.exports = spChkconfig;
