#!/bin/sh
DBName="alexandriaDB"
DBUser="alexandria_user"
DBPwd="alexandria_pwd"
echo ${DBPwd}
CMD="
dropdb --if-exists ${DBName};
createdb ${DBName};
echo \"DROP ROLE IF EXISTS ${DBUser}; CREATE ROLE ${DBUser} LOGIN PASSWORD '${DBPwd}';\" | psql ${DBName};
"

sudo service postgresql start
echo "${CMD}" | sudo su -l postgres
