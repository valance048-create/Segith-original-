CREATE TABLE alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE maestros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumno_id INT,
    archivo VARCHAR(255),
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id)
);

CREATE TABLE calificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarea_id INT,
    maestro_id INT,
    nota DECIMAL(5,2),
    comentario TEXT,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id),
    FOREIGN KEY (maestro_id) REFERENCES maestros(id)
);
