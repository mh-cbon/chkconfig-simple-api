var should = require('should');
var fs = require('fs');
var ChkconfigSimpleApi = require('../index.js');

describe('chkconfig-simple-api', function() {
  var chapi = new ChkconfigSimpleApi();

  this.timeout(5000);

  if ('yasudo' in process.env) chapi.enableElevation('');

  it('lists services', function(done) {
    chapi.list({}, function (err, list) {
      err && console.error(err);
      (!err).should.eql(true);
      Object.keys(list).length.should.eql(30);
      list['auditd'].should.eql({
        id: 'auditd',
        runLevels: {
          '1': 'off',
          '2': 'off',
          '3': 'on',
          '4': 'on',
          '5': 'on',
          '6': 'on',
          '7': 'off'
        }
      });
      done();
    })
  });

  it('describes a service', function(done) {
    chapi.describe('auditd', function (err, info) {
      err && console.error(err);
      (!err).should.eql(true);
      info.should.eql({
        description: 'This starts the Linux Auditing System Daemon, which collects security related events in a dedicated audit log. If this daemon is turned off, audit events will be sent to syslog.',
        runLevels: '2345',
        startPriority: '11',
        stopPriority: '88'

      })
      done();
    })
  });

  it('properly fails to describe a service', function(done) {
    chapi.describe('wxxwc', function (err, info) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
  });

  it('stops a well known service', function(done) {
    var c = chapi.stop('httpd', function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    });
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('starts a well known service', function(done) {
    var c = chapi.start('httpd', function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to start a service', function(done) {
    var c = chapi.start('wxwcwxc', function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to stop a service', function(done) {
    var c = chapi.stop('wxwcwxc', function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('restarts a well known service', function(done) {
    var c = chapi.restart('httpd', function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to restart a service', function(done) {
    var c = chapi.restart('wxcwxc', function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('reloads a well known service', function(done) {
    var c = chapi.reload('httpd', function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to reload a service', function(done) {
    var c = chapi.reload('wxcwxc', function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('enables a service', function(done) {
    var c = chapi.enable('httpd', {}, function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('enables a service with run levels', function(done) {
    var c = chapi.enable('httpd', {runLevels: '235'}, function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to enable a service', function(done) {
    var c = chapi.enable('wxcxwxc', {}, function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to enable a service with wrong run levels', function(done) {
    var c = chapi.enable('httpd', {runLevels: '9999'}, function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('disables a service', function(done) {
    var c = chapi.disable('httpd', {}, function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('disables a service with run levels', function(done) {
    var c = chapi.disable('httpd', {runLevels: '235'}, function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to disable a service', function(done) {
    var c = chapi.disable('wxcxwxc', {}, function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to disable a service with wrong run levels', function(done) {
    var c = chapi.disable('httpd', {runLevels: '9999'}, function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('resets a service', function(done) {
    var c = chapi.reset('httpd', {}, function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('resets a service with run levels', function(done) {
    var c = chapi.reset('httpd', {runLevels: '235'}, function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to reset a service', function(done) {
    var c = chapi.reset('wxcxwxc', {}, function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to reset a service with wrong run levels', function(done) {
    var c = chapi.reset('httpd', {runLevels: '9999'}, function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('resets priorities of a service', function(done) {
    var c = chapi.resetPriorities('httpd', {}, function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('resets priorities of a service with run levels', function(done) {
    var c = chapi.resetPriorities('httpd', {runLevels: '235'}, function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to reset priorities of a service', function(done) {
    var c = chapi.resetPriorities('wxcxwxc', {}, function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to reset priorities of a service with wrong run levels', function(done) {
    var c = chapi.resetPriorities('httpd', {runLevels: '9999'}, function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('deletes a service', function(done) {
    var c = chapi.del('httpd', function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to delete a service', function(done) {
    var c = chapi.del('wxcwxc', function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('adds a service', function(done) {
    var c = chapi.add('httpd', function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to add a service', function(done) {
    var c = chapi.add('wxcwxc', function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  // chkconfig --override some # will never return code>0, or show an error on sdtio
  // it won t work properly that way..
  it.skip('properly fails to override a service', function(done) {
    var c = chapi.override('wxcwxc', function (err) {
      err && console.error(err);
      (!err).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('installs a service file', function(done) {
    chapi.install({id: 'bs', content: '# whatever'}, function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
  });

  it('installs an override service file', function(done) {
    chapi.install({id: 'httpd', content: '# whatever', override: true}, function (err) {
      err && console.error(err);
      (!err).should.eql(true);
      done();
    })
  });

  it('overrides a service', function(done) {
    var c = chapi.override('httpd', function (err) {
      err && console.error(err);
        (!err).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('uninstalls a service file', function(done) {
    chapi.uninstall({id: 'bs'}, function (err) {
      (!err).should.eql(true);
      done();
    })
  });

  it('uninstalls an override service file', function(done) {
    chapi.uninstall({id: 'httpd', override: true}, function (err) {
      (!err).should.eql(true);
      done();
    })
  });

});
