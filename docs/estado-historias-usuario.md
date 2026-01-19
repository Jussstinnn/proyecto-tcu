# 📋 Estado de Implementación – Historias de Usuario

**Proyecto:** Fidelitas TechSeed
**Curso:** Diseño y Desarrollo de Sistemas
**Repositorio:** https://github.com/Jussstinnn/proyecto-tcu

---

## 📌 Introducción

Este documento presenta el **estado actual de implementación de las Historias de Usuario (HU)** definidas para el proyecto de desarrollo de la plataforma web Fidelitas TechSeed.

Las historias de usuario se resumen en tres categorías:

- **Implementadas al 100%**
- **Implementadas aproximadamente al 70%**
- **Pendientes de implementación**

---

## Historias de Usuario Implementadas al 100%

Estas historias cuentan con **interfaz funcional, lógica completa y flujo cerrado**, permitiendo su uso real dentro del sistema.

### Estudiante

- **HU-01 – Crear anteproyecto TCU**  
  Permite al estudiante registrar un anteproyecto mediante un formulario estructurado y almacenar la información correctamente en el sistema.

- **HU-02 – Editar y guardar anteproyecto**  
  El estudiante puede modificar su anteproyecto, guardarlo como borrador y recuperar la información en sesiones posteriores.

- **HU-03 – Autenticación de usuario**  
  Implementación completa del inicio de sesión, manejo de sesión y control de acceso.

- **HU-04 – Visualizar estado del anteproyecto**  
  El estudiante puede consultar el estado actual del anteproyecto (pendiente, aprobado o rechazado).

---

### Revisor / Coordinador

- **HU-08 – Visualizar listado de anteproyectos**  
  Dashboard funcional que permite listar anteproyectos según su estado y acceder a su información.

- **HU-09 – Revisar anteproyecto**  
  El personal revisor puede visualizar el contenido completo del anteproyecto para su análisis.

---

## Historias de Usuario Implementadas ~70%

Estas historias cuentan con **flujo funcional e interfaz**, pero no se encuentran completamente cerradas debido a dependencias externas o validaciones pendientes.

### Estudiante

- **HU-05 – Validación automática del anteproyecto mediante IA**  
  Se implementó la estructura base de validación y el flujo general, sin embargo, la validación profunda por reglas académicas aún no está finalizada.

- **HU-06 – Carga de documentos firmados**  
  Permite la subida y almacenamiento de documentos, pero carece de control de versiones y validaciones finales.

---

### Revisor / Coordinador

- **HU-10 – Aprobar o rechazar anteproyecto**  
  Incluye la lógica de cambio de estado, pero falta una bitácora completa y reglas formales de aprobación.

- **HU-11 – Enviar observaciones al estudiante**  
  Permite registrar observaciones visibles para el estudiante, sin notificaciones automáticas.

---

### Sistema

- **HU-14 – Registro de bitácora de cambios**  
  Existe la estructura base para registrar eventos, pero no todos los escenarios del sistema están cubiertos.

---

## Historias de Usuario Pendientes de Implementación

Las siguientes historias no han sido desarrolladas o se mantienen únicamente a nivel de diseño.

### Estudiante

- **HU-07 – Firma digital interna de documentos**  
  No se ha implementado un módulo de firma digital ni validación legal.

---

### Coordinador

- **HU-12 – Generación automática de documentos PDF**  
  No se ha desarrollado la generación automática de documentos oficiales con código único.

- **HU-13 – Integración con el sistema institucional de la universidad**  
  El proceso se realiza de forma manual, sin integración directa.

---

### Sistema

- **HU-15 – Notificaciones automáticas (correo / sistema)**  
  No se cuenta con un sistema de notificaciones activo.

- **HU-16 – Reportes y métricas administrativas**  
  No se han desarrollado reportes estadísticos ni dashboards administrativos.

---

## Resumen General

| Estado de la HU                   | Cantidad |
| --------------------------------- | -------- |
| Completadas al 100%               | 6        |
| Implementadas ~70%                | 5        |
| Pendientes                        | 5        |
| **Total de Historias de Usuario** | **16**   |

---
