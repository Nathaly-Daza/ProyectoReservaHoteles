/*USE Prueba01;

CREATE TABLE personas (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    age INT
);

SELECT * FROM personas;

CREATE TABLE Tipo_Persona (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL
);

ALTER TABLE personas
ADD COLUMN tipo_persona_id INT,
ADD FOREIGN KEY (tipo_persona_id) REFERENCES Tipo_Persona(id);
*/