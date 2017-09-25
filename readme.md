 + ### How to install
 +
 + Create your own file with config of database
 +
 +    cp rest/config/db.dist.php rest/config/db.php
 +
 + And paste there your own parameters of connection with database.
 +
 + Load database
 +
 +    mysql -u root < stage_1_backup.sql
 +    mysql -u root < stage_2_backup.sql
 +    mysql -u root < stage_3_backup.sql
 +
 +Set  server and start browser
 +
 +    php -S localhost:8050 && firefox localhost:8050/frontend/index.php
 +    
