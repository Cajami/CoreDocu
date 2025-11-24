# 📘 CoreDocu

**CoreDocu** es un sistema diseñado para crear documentación técnica de proyectos de forma rápida, divertida y estructurada. Permite redactar contenido en formato Markdown, subir archivos adjuntos, visualizar imágenes y diagramas SVG interactivos exportados desde Draw.io.

---

## 🛠️ Tecnologías utilizadas

- **Frontend**: Angular v19, TailwindCSS, Angular Material, ngx-sonner, marked, svg-pan-zoom  
- **Backend**: ASP.NET Core 8 (arquitectura en capas: Aplicación, Dominio, Infraestructura)  
- **Base de datos**: MongoDB (contenedor Docker)  
- **Visualización de BD**: Mongo Express  
- **Infraestructura**: Docker, Docker Compose, Nginx (proxy reverso y archivos estáticos)  
- **Otros**: FluentResults, componentes compartidos reutilizables

---

## ⚙️ Instalación rápida con Docker

```bash
# Clonar el repositorio
git clone https://github.com/Cajami/CoreDocu
```

# Acceder al directorio

```bash
cd CoreDocu
```

# Levantar los servicios

```bash
docker compose up -d
```

Esto iniciará los siguientes contenedores:

- 🗄️ mongo – Base de datos MongoDB
- 📡 api – Backend .NET 8
- 🧭 mongo-express – Visualizador de base de datos
- 🌐 web – Frontend Angular + Nginx

<img width="1039" height="317" alt="image" src="https://github.com/user-attachments/assets/1df0d6ab-46f6-4954-bc0c-c96914eb7c18" />

---

🧩 Arquitectura del sistema

- API en .NET 8 con capas bien definidas
- Persistencia en MongoDB con volúmenes para datos y archivos
- FluentResults para estandarizar respuestas del backend
- Archivos adjuntos almacenados y servidos desde rutas configuradas
- Proxy reverso con Nginx para servir estáticos y redirigir peticiones

<img width="394" height="755" alt="image" src="https://github.com/user-attachments/assets/523cfa1e-d89e-4078-b66a-9e2664e96771" />

---

✨ Funcionalidades principales

- Crear proyectos técnicos con estructura jerárquica
- Agregar secciones y artículos por proyecto
- Reordenar secciones y artículos mediante drag & drop
- Redactar artículos en Markdown con vista previa en HTML
- Subir archivos adjuntos: imágenes, Word, Excel, PDF, SVG
- Visualizar ejemplos de Markdown para facilitar la escritura
- Renderizado interactivo de diagramas SVG con zoom y navegación
- Generación automática de TOC (tabla de contenidos) desde encabezados
- Guardado automático al cambiar de pestaña (Editar ↔ Vista Previa)
- Proxy reverso en desarrollo para servir archivos adjuntos

---

🧱 Componentes compartidos

- context-menu-global
- modal-container
- sidebars
- forms (input, row)
Estos componentes se reutilizan en toda la aplicación para mantener consistencia y modularidad.

---

👁️ Modo Visualización

Una vez finalizada la documentación, el usuario puede acceder al modo Ver, donde se muestra el contenido completo en HTML, organizado por secciones y artículos.

<img width="1917" height="866" alt="image" src="https://github.com/user-attachments/assets/7b6827e0-473d-47d2-a4fd-73942d18416c" />

---

📂 Estructura del proyecto

```bash
CoreDocu/
├── api/               # Backend .NET 8
├── web/               # Frontend Angular
├── docker-compose.yml
├── README.md
```

---

📌 Próximas mejoras

- Implementación de pruebas unitarias e integración
- Autenticación de usuarios
- Exportación de documentación en PDF o HTML

---

🤝 Contribuciones

Las contribuciones son bienvenidas. Si deseas colaborar, por favor abre un issue o envía un pull request.

---

---

## 🖼️ Pantallas

A continuación se muestran algunas de las principales pantallas del sistema **CoreDocu**:

### 📊 Dashboard de proyectos

<img width="1915" height="864" alt="image" src="https://github.com/user-attachments/assets/bd213da7-1cac-44d5-ab84-57b2f967fcd2" />

### ✏️ Editor de documentación

Pantalla para crear y editar secciones y artículos, con soporte para Markdown y vista previa en HTML.

<img width="327" height="302" alt="image" src="https://github.com/user-attachments/assets/016f450c-28d0-47ed-be3d-f5a518f84ea8" />

<img width="327" height="235" alt="image" src="https://github.com/user-attachments/assets/ac110d32-c581-4f66-a0ad-cd3ee550a2f7" />

<img width="1915" height="862" alt="image" src="https://github.com/user-attachments/assets/2f1dd4c7-5b0b-4297-aaf9-0b16fa192a3e" />

### 📂 Gestión de archivos adjuntos

Subida y visualización de imágenes, documentos (Word, Excel, PDF) y diagramas SVG interactivos.

<img width="971" height="582" alt="image" src="https://github.com/user-attachments/assets/c2c0c6dd-b1c0-4e23-b4e0-f75742955cb7" />

### 📑 Vista previa con TOC

Visualización del documento con tabla de contenidos generada automáticamente a partir de los encabezados.

<img width="1917" height="866" alt="image" src="https://github.com/user-attachments/assets/6d216a72-f7d3-48e8-b12f-2fd80137ee6a" />

### 🌐 Visualización de proyecto

Modo lectura para explorar todas las secciones y artículos en formato HTML.

<img width="1916" height="865" alt="image" src="https://github.com/user-attachments/assets/bad10c82-e6ba-4860-9527-0795d2edaae1" />

---

## 👤 Autor

Este proyecto fue desarrollado por **Javier Huiñocana Inoñan**, también conocido como **Cajami** en GitHub y **JavierSoft** en otros espacios de desarrollo.

- 💼 GitHub: [@Cajami](https://github.com/Cajami)
- 🛠️ Especializado en Angular, .NET, MongoDB, Docker

Si te gustó este proyecto o te resultó útil, no dudes en dejar una estrella ⭐ en el repositorio.

---
