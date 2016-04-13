# chkconfig-simple-api

Simple api to interface with chkconfig.

# install

```sh
npm i @mh-cbon/chkconfig-simple-api --save
```

# usage

```js
var ChkconfigApi = require('@mh-cbon/chkconfig-simple-api');
var chapi = new ChkconfigApi(/* version */);

// chkconfig --list
chapi.list(opts={}, function (err, items) {
  err && console.log(err);
  console.log(items);
})

// chkconfig --list serviceId
chapi.list(opts={id: 'serviceId'}, function (err, items) {
  err && console.log(err);
  console.log(items);
})

// Parse chkconfig init script headers
chapi.describe('serviceId', function (err, info) {
  err && console.log(err);
  console.log(info);
})

// chkconfig serviceId on
chapi.enable('serviceId', opts={}, function (err) {
  err && console.log(err);
})

// chkconfig --levels '234' serviceId on
chapi.enable('serviceId', opts={runLevels: '234'}, function (err) {
  err && console.log(err);
})

// chkconfig serviceId off
chapi.disable('serviceId', opts={}, function (err) {
  err && console.log(err);
})

// chkconfig --levels '234' serviceId off
chapi.disable('serviceId', opts={runLevels: '234'}, function (err) {
  err && console.log(err);
})

// chkconfig serviceId reset
chapi.reset('serviceId', opts={}, function (err) {
  err && console.log(err);
})

// chkconfig --levels '234' serviceId reset
chapi.reset('serviceId', opts={runLevels: '234'}, function (err) {
  err && console.log(err);
})

// chkconfig serviceId resetpriorities
chapi.resetPriorities('serviceId', opts={}, function (err) {
  err && console.log(err);
})

// chkconfig --levels '234' serviceId resetpriorities
chapi.resetPriorities('serviceId', opts={runLevels: '234'}, function (err) {
  err && console.log(err);
})

// chkconfig --add serviceId
chapi.add('serviceId', function (err) {
  err && console.log(err);
})

// chkconfig --del serviceId
chapi.del('serviceId', function (err) {
  err && console.log(err);
})

// chkconfig --override serviceId
chapi.override('serviceId', function (err) {
  err && console.log(err);
})



// service serviceId start
chapi.start('serviceId', function (err) {
  err && console.log(err);
})

// service serviceId stop
chapi.stop('serviceId', function (err) {
  err && console.log(err);
})

// service serviceId reload
chapi.reload('serviceId', function (err) {
  err && console.log(err);
})

// service serviceId status
chapi.status('serviceId', function (err, s) {
  err && console.log(err);
  s && console.log(s)
})



```

## Install a Service

```js
// into /etc/init.d
var service = {
  override: false,
  id: 'fake',
  content: '# script content'
}
chapi.install(service, done)


// into /etc/chkconfig.d
var service = {
  override: true,
  id: 'fake',
  content: '# script content'
}
chapi.install(service, done)



// later...
// from /etc/init.d
chapi.uninstall({id: 'fake'}, done)

// from /etc/chkconfig.d
chapi.uninstall({id: 'fake', override: true}, done)
```


# read more

- http://linux.die.net/man/8/chkconfig
- https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Deployment_Guide/s2-services-chkconfig.html
