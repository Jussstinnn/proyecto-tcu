# Estado de Implementación – Historias de Usuario

**Proyecto:** Fidelitas TechSeed
**Curso:** Diseño y Desarrollo de Sistemas
**Repositorio:** https://github.com/Jussstinnn/proyecto-tcu

---

## Introducción

Este documento presenta el **estado actual de implementación de las Historias de Usuario (HU)** definidas para el proyecto de desarrollo de la plataforma web Fidelitas TechSeed.

Las historias de usuario se resumen en tres categorías:

- **Implementadas al 100%**
- **Implementadas aproximadamente al 70%**
- **Pendientes de implementación**

---

## Historias de Usuario Implementadas al 100%

Estas historias cuentan con **interfaz funcional, lógica implementada y flujo cerrado**, permitiendo su uso real dentro del sistema en el estado actual del proyecto.

### Estudiante

- **HU-01 – Crear anteproyecto TCU**  
  Permite al estudiante registrar un anteproyecto mediante un formulario estructurado, almacenando correctamente la información en el sistema y habilitando su envío al proceso de revisión.

- **HU-02 – Editar y guardar anteproyecto**  
  El estudiante puede modificar su anteproyecto, guardarlo como borrador y recuperar la información en sesiones posteriores sin pérdida de datos.

- **HU-05 – Enviar anteproyecto a revisión**  
  El estudiante puede enviar formalmente su anteproyecto al sistema, quedando registrado con estado inicial y confirmación de envío.

- **HU-04 – Visualizar estado del anteproyecto**  
  El estudiante puede consultar el estado actual de su anteproyecto (enviado, en revisión, aprobado o rechazado).

---

### Revisor / Coordinador

- **HU-06 – Visualizar listado general de anteproyectos**  
  Dashboard funcional que permite listar anteproyectos registrados en el sistema, visualizar su estado y acceder a su información general.

- **HU-09 – Revisar anteproyecto**  
  El personal revisor puede visualizar el contenido completo del anteproyecto enviado por el estudiante para su análisis y evaluación.

---

## Historias de Usuario Implementadas ~70%

Estas historias cuentan con **estructura funcional o lógica base**, pero no se encuentran completamente cerradas debido a la falta de interfaz final, automatizaciones, validaciones formales o dependencias institucionales.

### Estudiante

- **HU-03 – Autenticación de usuario**  
  La lógica de autenticación (backend, validación y control de acceso) se encuentra implementada; sin embargo, el flujo visual completo y la experiencia de usuario aún no están totalmente integrados.

- **HU-07 – Carga de documentos del anteproyecto**  
  Permite la subida y almacenamiento básico de documentos, pero carece de visor integrado, control de versiones y validaciones formales.

- **HU-13 – Corrección del anteproyecto según observaciones**  
  Existe el flujo lógico para actualizar información, pero no está completamente integrado el ciclo formal de corrección y reenvío.

---

### Revisor / Coordinador

- **HU-10 – Aprobar o rechazar anteproyecto**  
  Incluye la lógica básica de cambio de estado del anteproyecto; sin embargo, faltan reglas formales, validaciones finales y control completo del proceso.

- **HU-11 – Enviar observaciones al estudiante**  
  Permite registrar observaciones visibles para el estudiante, pero no cuenta con notificaciones automáticas ni control del ciclo de respuesta.

- **HU-22 – Visualizar anteproyectos asignados**  
  Existe una estructura base para asignación, pero no se encuentra completamente implementada la vista filtrada por revisor.

---

### Sistema

- **HU-14 – Registro de bitácora de cambios**  
  Existe una estructura base para el registro de eventos del sistema; no obstante, no todos los escenarios ni acciones están cubiertos.

- **HU-17 – Gestión básica de roles y permisos**  
  Se cuenta con roles y validaciones en backend, pero sin una interfaz administrativa completa ni trazabilidad avanzada.

---

## Historias de Usuario Pendientes de Implementación

Las siguientes historias no han sido desarrolladas o se mantienen únicamente a nivel de diseño debido a su alcance técnico, legal o institucional.

### Estudiante

- **HU-08 – Validación automática del anteproyecto mediante IA**  
  No se ha implementado la validación automática basada en criterios académicos.

- **HU-16 – Asistente o chatbot de apoyo al estudiante**  
  No se ha desarrollado un módulo de asistencia automatizada.

- **HU-18 – Búsqueda de texto dentro de documentos PDF**  
  No se cuenta con funcionalidad de búsqueda interna en documentos.

---

### Revisor / Coordinador

- **HU-12 – Plantillas estandarizadas de observaciones**  
  No se ha implementado un sistema de plantillas reutilizables para observaciones.

- **HU-19 – Plantillas específicas por carrera**  
  No se han definido ni implementado plantillas personalizadas por carrera.

- **HU-20 – Control de apertura y cierre del periodo de recepción**  
  No se ha desarrollado el control de habilitación o bloqueo del sistema por fechas.

---

### Sistema

- **HU-15 – Notificaciones automáticas (correo / sistema)**  
  No se cuenta con un sistema de notificaciones activas ante cambios de estado o eventos relevantes.

- **HU-21 – Exportación de reportes y bitácoras**  
  No se ha implementado la exportación de información en formatos como PDF o Excel.

- **HU-23 – Validación de autenticidad de documentos aprobados**  
  No se ha desarrollado la validación formal de documentos mediante código o verificación externa.

- **HU-24 – Reportes y métricas administrativas**  
  No se han desarrollado dashboards ni indicadores para la toma de decisiones administrativas.

---

## Resumen General

| Estado de la HU                   | Cantidad |
| --------------------------------- | -------- |
| Completadas al 100%               | 6        |
| Implementadas ~70%                | 8        |
| Pendientes                        | 10       |
| **Total de Historias de Usuario** | **24**   |
