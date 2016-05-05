if [ ! -f /home/vagrant/node/node-v6.0.0-linux-x64.tar.gz ]; then
  mkdir -p /home/vagrant/node
  cd /home/vagrant/node/
  wget --no-check-certificate https://nodejs.org/dist/v6.0.0/node-v6.0.0-linux-x64.tar.gz
  tar -xzvf node-v6.0.0-linux-x64.tar.gz
  /home/vagrant/node/node-v6.0.0-linux-x64/bin/node /home/vagrant/node/node-v6.0.0-linux-x64/bin/npm i mocha -g
  sudo yum install httpd -y
fi
cd /vagrant/
/home/vagrant/node/node-v6.0.0-linux-x64/bin/node /home/vagrant/node/node-v6.0.0-linux-x64/bin/npm i
/home/vagrant/node/node-v6.0.0-linux-x64/bin/node /home/vagrant/node/node-v6.0.0-linux-x64/bin/mocha test/sp*
sudo /home/vagrant/node/node-v6.0.0-linux-x64/bin/node /home/vagrant/node/node-v6.0.0-linux-x64/bin/mocha test/index.js
SUDOPWD='' /home/vagrant/node/node-v6.0.0-linux-x64/bin/node --allow-natives-syntax /home/vagrant/node/node-v6.0.0-linux-x64/bin/mocha test/index.js
