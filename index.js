
var pkg           = require('./package.json')
var spawn         = require('child_process').spawn;
var split         = require('split');
var path          = require('path');
var fs            = require('fs');
var through2      = require('through2');
var spChkconfig   = require('./sp-chkconfig.js');


function chkconfigSimpleApi (version) {

  this.list = function (opts, then) {
    var services = {};

    var cmd = 'LANG=en_US.utf8 chkconfig --list';
    if (opts.id) cmd += ' ' + opts.id;

    var c = spawn('sh', ['-c', cmd]);
    c.stdout
    .pipe(split())
    .pipe(through2(function (chunk, enc, callback) {
      // auditd         	0:off	1:off	2:on	3:on	4:on	5:on	6:off
      var k = chunk.toString().split(/^([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)/g);
      if (k && k[1]) {
        var runLevels = {
          1: k[2].match(/:on/) ? 'on' : 'off',
          2: k[3].match(/:on/) ? 'on' : 'off',
          3: k[4].match(/:on/) ? 'on' : 'off',
          4: k[5].match(/:on/) ? 'on' : 'off',
          5: k[6].match(/:on/) ? 'on' : 'off',
          6: k[7].match(/:on/) ? 'on' : 'off',
          7: k[8].match(/:on/) ? 'on' : 'off',
        };
        services[k[1]] = {
          id:         k[1],
          runLevels:  runLevels,
        }
      }
      callback(null, chunk)
    }));

    c.on('close', function (code) {
      then(code>0?'error':null, services)
    })

    c.on('error', then)

    return c;
  }

  this.describe = function (serviceId, then) {
    var properties = {}
    fs.createReadStream('/etc/init.d/' + serviceId)
    .on('error', then)
    .pipe(split())
    .pipe(spChkconfig())
    .on('error', then)
    .pipe(through2.obj(function (chunk, enc, cb) {
      properties[chunk.id] = chunk.value;
      cb();
    }, function (cb) {
      then(null, properties)
      cb()
    }))
  }

  var initConfigExec = function (ctl, serviceId, opts, then) {
    var args = [];

    if (opts.runLevels) args = args.concat(['--level', opts.runLevels])
    if (opts.type) args = args.concat(['--type', opts.type])

    args = args.concat([serviceId, ctl])

    var c = spawn('chkconfig', args, {stdio: 'pipe'})
    .on('close', function (code){
      then(code>0 ? stdout+stderr : null)
    })
    .on('error', then)
    var stdout = '';
    c.stdout.on('data', function (d) {
      stdout += d.toString()
    })
    var stderr = '';
    c.stderr.on('data', function (d) {
      stderr += d.toString()
    })
    return c
  }
  this.enable = function (serviceId, opts, then) {
    return initConfigExec('on', serviceId, opts, then)
  }
  this.disable = function (serviceId, opts, then) {
    return initConfigExec('off', serviceId, opts, then)
  }
  this.reset = function (serviceId, opts, then) {
    return initConfigExec('reset', serviceId, opts, then)
  }
  this.resetPriorities = function (serviceId, opts, then) {
    return initConfigExec('resetpriorities', serviceId, opts, then)
  }


  var manageExec = function (ctl, serviceId, then) {
    var args = ['--' + ctl, serviceId];

    var c = spawn('chkconfig', args, {stdio: 'pipe'})
    .on('close', function (code){
      then(code>0 ? stdout+stderr : null)
    })
    .on('error', then)
    var stdout = '';
    c.stdout.on('data', function (d) {
      stdout += d.toString()
    })
    var stderr = '';
    c.stderr.on('data', function (d) {
      stderr += d.toString()
    })
    return c
  }
  this.add = function (serviceId, then) {
    return manageExec('add', serviceId, then)
  }
  this.del = function (serviceId, then) {
    return manageExec('del', serviceId, then)
  }
  this.override = function (serviceId, then) {
    return manageExec('override', serviceId, then)
  }


  var CtlExec = function (ctl, serviceId, then) {
    var cmd = 'LANG=en_US.utf8 service ' + serviceId + ' ' + ctl;
    var c = spawn('sh', ['-c', cmd], {stdio: 'pipe'})
    .on('close', function (code){
      var hasFailed = code>0;
      if(!hasFailed && (stdout+stderr).match(serviceId + ': unrecognized')) hasFailed = true;
      then(hasFailed ? stdout+stderr : null)
    })
    .on('error', then)
    var stdout = '';
    c.stdout.on('data', function (d) {
      stdout += d.toString()
    })
    var stderr = '';
    c.stderr.on('data', function (d) {
      stderr += d.toString()
    })
    return c;
  }
  this.start = function (serviceId, then) {
    return CtlExec('start', serviceId, then)
  }
  this.stop = function (serviceId, then) {
    return CtlExec('start', serviceId, then)
  }
  this.restart = function (serviceId, then) {
    return CtlExec('restart', serviceId, then)
  }
  this.reload = function (serviceId, then) {
    return CtlExec('reload', serviceId, then)
  }
  this.status = function (serviceId, then) {

    var stdout = '';
    var stderr = '';

    var c = spawn('service', ['status', serviceId])
    c.stdout.on('data', function (d) {
      stdout += d.toString()
    })
    c.stderr.on('data', function (d) {
      stderr += d.toString()
    })

    c.on('error', then)
    c.on('close', function (code) {
      if (code>0) return then(stdout+sterr)
      var pid = (stdout+stderr).match(/\(\s*pid\s+([0-9]+)\s*\)/)
      var status = (stdout+stderr).match(/\s+is\s+([^\s+])$/)
      then(null, {
        pid: pid && pid[1],
        status: status && status[1]
      })
    })

    return c;
  }

  this.install = function (opts, then) {
    var fPath = path.join("/etc/init.d/", opts.id)
    if (opts.override) fPath = path.join("/etc/chkconfig.d/", opts.id)
    fs.writeFile(fPath, opts.content, function (err){
      if (err) return then(err);
      fs.chmod(fPath, opts.mod || 0755, then)
    })
  }

  this.uninstall = function (opts, then) {
    var fPath = path.join("/etc/init.d/", opts.id)
    if (opts.override) fPath = path.join("/etc/chkconfig.d/", opts.id)
    fs.unlink(fPath, then)
  }

}

module.exports = chkconfigSimpleApi;
