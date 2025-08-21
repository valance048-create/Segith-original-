# 🎓 Segith - Academia de Belleza

Proyecto web para gestionar cursos, tareas y calificaciones de la academia **Segith**.

## 🚀 Funcionalidades
- Alumnos pueden subir archivos (tareas, fotos, PDFs).
- Maestros pueden calificar y dejar comentarios.
- Panel privado para cada alumno con sus notas.
- Página pública con información de la academia.

## 📂 Estructura
- `frontend/` → HTML, CSS y JS de la interfaz.
- `backend/` → Lógica del servidor (ejemplo: Flask).
- `db/` → Base de datos MySQL/SQLite.
- `docs/` → Documentación.

## 🛠️ Instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/tuusuario/segith.git
   cd segith
   ```

2. Instala dependencias del backend (ejemplo con Flask):
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Crea la base de datos:
   ```bash
   mysql -u usuario -p < db/schema.sql
   ```

4. Inicia el servidor:
   ```bash
   python app.py
   ```

5. Abre en navegador:
   ```
   http://localhost:5000
   ```
