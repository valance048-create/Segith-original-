-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS escuela_belleza CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE escuela_belleza;

-- Tabla de usuarios (estudiantes, maestros y administradores)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_usuario VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    tipo ENUM('estudiante', 'maestro', 'administrador') NOT NULL DEFAULT 'estudiante',
    telefono VARCHAR(20),
    direccion TEXT,
    fecha_nacimiento DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    INDEX idx_tipo (tipo),
    INDEX idx_email (email)
);

-- Tabla de cursos
CREATE TABLE cursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_horas INT,
    costo DECIMAL(10, 2),
    fecha_inicio DATE,
    fecha_fin DATE,
    maestro_id INT,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (maestro_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- Tabla de inscripciones
CREATE TABLE inscripciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    curso_id INT NOT NULL,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo', 'completado', 'cancelado') DEFAULT 'activo',
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_inscripcion (estudiante_id, curso_id)
);

-- Tabla de módulos
CREATE TABLE modulos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    curso_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    orden INT NOT NULL,
    fecha_disponible DATE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE
);

-- Tabla de tareas
CREATE TABLE tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modulo_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    archivo_guia VARCHAR(255),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_limite DATE,
    peso_calificacion DECIMAL(5,2) DEFAULT 1.00,
    FOREIGN KEY (modulo_id) REFERENCES modulos(id) ON DELETE CASCADE
);

-- Tabla de entregas de tareas
CREATE TABLE entregas_tareas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tarea_id INT NOT NULL,
    estudiante_id INT NOT NULL,
    archivo VARCHAR(255) NOT NULL,
    fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comentario_estudiante TEXT,
    FOREIGN KEY (tarea_id) REFERENCES tareas(id) ON DELETE CASCADE,
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_estudiante_tarea (estudiante_id, tarea_id)
);

-- Tabla de calificaciones
CREATE TABLE calificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entrega_id INT NOT NULL,
    maestro_id INT NOT NULL,
    nota DECIMAL(5,2) CHECK (nota >= 0 AND nota <= 10),
    comentario TEXT,
    fecha_calificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entrega_id) REFERENCES entregas_tareas(id) ON DELETE CASCADE,
    FOREIGN KEY (maestro_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_calificacion (entrega_id)
);

-- Tabla de asistencias
CREATE TABLE asistencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    estudiante_id INT NOT NULL,
    curso_id INT NOT NULL,
    fecha DATE NOT NULL,
    presente BOOLEAN DEFAULT FALSE,
    justificacion TEXT,
    FOREIGN KEY (estudiante_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_asistencia (estudiante_id, curso_id, fecha)
);

-- Tabla de materiales
CREATE TABLE materiales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modulo_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    archivo VARCHAR(255),
    tipo ENUM('pdf', 'video', 'imagen', 'enlace'),
    fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visible BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (modulo_id) REFERENCES modulos(id) ON DELETE CASCADE
);

-- Insertar datos iniciales
-- Administradores
INSERT INTO usuarios (codigo_usuario, nombre, email, password, tipo, telefono) VALUES
('ADM-001', 'Administrador Principal', 'admin1@segith.com', '$2y$10$rOzZfzq3qk7b6W6Lk8qZX.Ly7q6q3q7b6W6Lk8qZX.Ly7q6q3q7b6W', 'administrador', '+1234567890'),
('ADM-002', 'Administrador Secundario', 'admin2@segith.com', '$2y$10$rOzZfzq3qk7b6W6Lk8qZX.Ly7q6q3q7b6W6Lk8qZX.Ly7q6q3q7b6W', 'administrador', '+1234567891');

-- Maestros
INSERT INTO usuarios (codigo_usuario, nombre, email, password, tipo, telefono) VALUES
('PROF-001', 'Laura Martínez', 'laura.martinez@segith.com', '$2y$10$rOzZfzq3qk7b6W6Lk8qZX.Ly7q6q3q7b6W6Lk8qZX.Ly7q6q3q7b6W', 'maestro', '+1234567892'),
('PROF-002', 'Carlos Rodríguez', 'carlos.rodriguez@segith.com', '$2y$10$rOzZfzq3qk7b6W6Lk8qZX.Ly7q6q3q7b6W6Lk8qZX.Ly7q6q3q7b6W', 'maestro', '+1234567893');

-- Cursos
INSERT INTO cursos (nombre, descripcion, duracion_horas, costo, fecha_inicio, fecha_fin, maestro_id) VALUES
('Estética Facial', 'Curso completo de estética facial y tratamientos', 120, 1200.00, '2023-09-01', '2023-12-15', 3),
('Cosmetología Avanzada', 'Técnicas avanzadas de cosmetología', 160, 1500.00, '2023-09-01', '2024-01-20', 4),
('Micropigmentación', 'Técnicas de micropigmentación facial', 80, 1000.00, '2023-10-01', '2023-12-10', 3);

-- Insertar módulos, tareas, etc. según sea necesario
