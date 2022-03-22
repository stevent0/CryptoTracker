DROP TABLE IF EXISTS USR CASCADE;
DROP TABLE IF EXISTS CRYPTOCURRENCY CASCADE;
DROP TABLE IF EXISTS OWNS;


CREATE TABLE USR (
    userId int UNIQUE NOT NULL,
    email varchar(45) UNIQUE NOT NULL,
    password varchar(80) NOT NULL,
    name varchar(20),
    verified boolean,
    PRIMARY KEY(userId)
);

CREATE TABLE CRYPTOCURRENCY (
    cryptoName varchar(30),
    abbreviation varchar(10),
    PRIMARY KEY(cryptoName)
);

CREATE TABLE OWNS (
    userId int,
    cryptoName varchar(30),
    label varchar(45),
    amount double precision,
    PRIMARY KEY(userId, cryptoName),
    FOREIGN KEY (userId) REFERENCES USR,
    FOREIGN KEY (cryptoname) REFERENCES CRYPTOCURRENCY
);

