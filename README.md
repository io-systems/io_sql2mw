# io_sql2mw
## Quick description
Transform mariadb "describe table;" result into a mediawiki table.
All options are set in the command line.
## Options
* --host= : specifies where MariaDB is hosted
* --user= : MariaDB username
* --password= : User password
* --base= : Database's name
* --table= : Table's name
## Example
```bash
$ node sql2mw.js --host=localhost --user=username --password=password --base=mydatabase
```
will show the result of "SHOW TABLES;"
```bash
$ node sql2mw.js --host=localhost --user=username --password=password --base=mydatabase --table=mytable
```
will show the result of "DESCRIBE mytable;', formatted into a MediaWiki table.
Just copy and paste the result into your MediaWiki page !
