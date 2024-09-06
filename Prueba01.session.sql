USE Prueba01;

CREATE TABLE personas (
    id INT /*auto_increment*/ PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    age INT
);

SELECT * FROM personas;