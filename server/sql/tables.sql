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
    abbreviation varchar(10) UNIQUE,
    PRIMARY KEY(abbreviation)
);

CREATE TABLE OWNS (
    id int,
    userId int,
    abbreviation varchar(10),
    label varchar(45),
    publicAddress varchar(200),
    amount double precision,
    PRIMARY KEY(id),
    FOREIGN KEY (userId) REFERENCES USR,
    FOREIGN KEY (abbreviation) REFERENCES CRYPTOCURRENCY
);

