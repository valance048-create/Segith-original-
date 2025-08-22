// Función genérica para subir archivos
function subirArchivo(formData, statusElementId) {
    const statusElement = document.getElementById(statusElementId);
    statusElement.innerHTML = '<div style="color: var(--dorado);">Subiendo archivo...</div>';
    
    fetch('upload.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            statusElement.innerHTML = `<div style="color: var(--verde);">✓ ${data.message}</div>`;
            // Recargar la página después de 2 segundos
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            statusElement.innerHTML = `<div style="color: var(--rojo);">✗ ${data.message}</div>`;
        }
    })
    .catch(error => {
        statusElement.innerHTML = `<div style="color: var(--rojo);">Error de conexión: ${error}</div>`;
    });
}

// Función para abrir modal de material (maestros)
function abrirModalMaterial() {
    document.getElementById('modalMaterial').style.display = 'block';
    // Cargar módulos del maestro
    cargarModulosMaestro();
}

// Función para abrir modal de tarea (alumnos)
function abrirModalTarea(tareaId, titulo, descripcion) {
    document.getElementById('modalTarea').style.display = 'block';
    document.getElementById('tareaId').value = tareaId;
    document.getElementById('tareaTitulo').textContent = titulo;
    document.getElementById('tareaDescripcion').textContent = descripcion;
}

// Función para cargar módulos del maestro
function cargarModulosMaestro() {
    fetch('api/mis_modulos.php')
        .then(response => response.json())
        .then(modulos => {
            const select = document.querySelector('select[name="modulo_id"]');
            select.innerHTML = '<option value="">Seleccionar módulo...</option>';
            
            modulos.forEach(modulo => {
                const option = document.createElement('option');
                option.value = modulo.id;
                option.textContent = modulo.titulo + ' - ' + modulo.curso;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error cargando módulos:', error);
        });
}

// Event listeners cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Para el formulario de materiales (maestros)
    if (document.getElementById('formMaterial')) {
        document.getElementById('formMaterial').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('tipo', 'material');
            formData.append('titulo', document.querySelector('#formMaterial input[name="titulo"]').value);
            formData.append('descripcion', document.querySelector('#formMaterial textarea[name="descripcion"]').value);
            formData.append('modulo_id', document.querySelector('#formMaterial select[name="modulo_id"]').value);
            formData.append('archivo', document.getElementById('fileMaterial').files[0]);
            
            subirArchivo(formData, 'uploadStatusMaterial');
        });
    }
    
    // Para el formulario de tareas (alumnos)
    if (document.getElementById('formTarea')) {
        document.getElementById('formTarea').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData();
            formData.append('tipo', 'tarea');
            formData.append('tarea_id', document.getElementById('tareaId').value);
            formData.append('comentario', document.querySelector('#formTarea textarea[name="comentario"]').value);
            formData.append('archivo', document.getElementById('fileTarea').files[0]);
            
            subirArchivo(formData, 'uploadStatusTarea');
        });
    }
    
    // Cerrar modales al hacer clic fuera
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
});