vagrant up centos
vagrant ssh centos -c "sh /vagrant/run-tests-centos.sh"
vagrant halt centos
