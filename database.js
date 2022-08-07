var sqlite3 = require('sqlite3').verbose();

const path = require('path')
const dbPath = path.resolve(__dirname, 'billing.db')
var db = new sqlite3.Database(dbPath);

db.serialize(function() {
    db.run("CREATE TABLE admin (id integer not null constraint admin_pk primary key autoincrement,username varchar(20) not null,password varchar(20) not null,emailid varchar(40) not null,phone varchar(20) not null,lstatus char(10) default 'ACTIVE' not null)");

    db.run("create table invdtl(userid int(4) not null,invno integer not null constraint invdtl_pk primary key autoincrement, dte varchar(20) default NULL, pname varchar(40) default NULL, mob varchar(20) default NULL, address varchar(60) default NULL, price varchar(10) default NULL );");

    db.run("create table pricelist(servicename varchar(30) not null,price integer not null,servicecode integer not null constraint pricelist_pk primary key autoincrement );");

db.run("UPDATE SQLITE_SEQUENCE SET seq = 1000 WHERE name = 'pricelist'");
db.run("UPDATE SQLITE_SEQUENCE SET seq = 1000 WHERE name = 'invdtl'");

db.run("INSERT INTO admin(username,password,emailid,phone) VALUES (?,?,?,?)",["demo","demo","demo@mail.com","7518185677"],function (e){

});

});
db.close();

