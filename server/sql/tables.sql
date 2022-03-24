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
    cryptoId text,
    cryptoName text,
    abbreviation text,
    usdPrice double precision,
    logoUrl text,
    PRIMARY KEY(cryptoId)
);

CREATE TABLE OWNS (
    id int,
    userId int,
    cryptoId varchar(30),
    label varchar(45),
    publicAddress varchar(200),
    amount double precision,
    PRIMARY KEY(id),
    FOREIGN KEY (userId) REFERENCES USR,
    FOREIGN KEY (cryptoId) REFERENCES CRYPTOCURRENCY
);

