SET FOREIGN_KEY_CHECKS=0;

 DROP TABLE IF EXISTS  't_user';
 CREATE TABLE 't_user'(
    'id' VARCHAR (11) NOT  NULL,
    'username' VARCHAR (40) NOT  NULL,
    'password' VARCHAR (40) NOT  NULL ,
    'sex' VARCHAR (4) NOT  NULL ,
    PRIMARY  KEY ('id')
 ) ENGINE = InnoDB DEFAULT CHARSET = utf8;

 INSERT  INTO  't_user' (id, username, password, sex) VALUES ('1','xiaoming','123456','男');