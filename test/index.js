var should = require('should');
var fs = require('fs');
var ChkconfigSimpleApi = require('../index.js');

describe('chkconfig-simple-api', function() {
  it('lists services', function(done) {
    var chapi = new ChkconfigSimpleApi();
    chapi.list({}, function (err, list) {
      err && console.error(err);
      (err===null).should.eql(true);
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
    var chapi = new ChkconfigSimpleApi();
    chapi.describe('auditd', function (err, info) {
      err && console.error(err);
      (err===null).should.eql(true);
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
    var chapi = new ChkconfigSimpleApi();
    chapi.describe('wxxwc', function (err, info) {
      err && console.error(err);
      (err===null).should.eql(false);
      done();
    })
  });

  it('stops a well known service', function(done) {
    var chapi = new ChkconfigSimpleApi();
    var c = chapi.stop('httpd', function (err) {
      err && console.error(err);
      (err===null).should.eql(true);
      done();
    });
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('starts a well known service', function(done) {
    var chapi = new ChkconfigSimpleApi();
    var c = chapi.start('httpd', function (err) {
      err && console.error(err);
      (err===null).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to start a service', function(done) {
    var chapi = new ChkconfigSimpleApi();
    var c = chapi.start('wxwcwxc', function (err) {
      err && console.error(err);
      (err===null).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to stop a service', function(done) {
    var chapi = new ChkconfigSimpleApi();
    var c = chapi.stop('wxwcwxc', function (err) {
      err && console.error(err);
      (err===null).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('restarts a well known service', function(done) {
    var chapi = new ChkconfigSimpleApi();
    var c = chapi.restart('httpd', function (err) {
      err && console.error(err);
      (err===null).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to restart a service', function(done) {
    var chapi = new ChkconfigSimpleApi();
    var c = chapi.restart('wxcwxc', function (err) {
      err && console.error(err);
      (err===null).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('reloads a well known service', function(done) {
    var chapi = new ChkconfigSimpleApi();
    var c = chapi.reload('httpd', function (err) {
      err && console.error(err);
      (err===null).should.eql(true);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('properly fails to reload a service', function(done) {
    var chapi = new ChkconfigSimpleApi();
    var c = chapi.reload('wxcwxc', function (err) {
      err && console.error(err);
      (err===null).should.eql(false);
      done();
    })
    c.stdout.pipe(process.stdout)
    c.stderr.pipe(process.stderr)
  });

  it('installs a service file', function(done) {
    var chapi = new ChkconfigSimpleApi();
    chapi.install({id: 'bs', content: '# whatever'}, function (err) {
      (err===null).should.eql(true);
      fs.access('/etc/init.d/bs', fs.R_OK|fs.X_OK|fs.W_OK, function (err) {
        (err===null).should.be.true;
        done();
      });
    })
  });

  it('uninstalls a service file', function(done) {
    var chapi = new ChkconfigSimpleApi();
    chapi.uninstall({id: 'bs'}, function (err) {
      (err===null).should.eql(true);
      fs.access('/etc/init.d/bs', fs.R_OK, function (err) {
        (err===null).should.be.false;
        done();
      });
    })
  });

});
