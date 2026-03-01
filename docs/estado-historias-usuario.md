# Estado de Implementación – Historias de Usuario

**Proyecto:** Fidelitas TechSeed  
**Curso:** Diseño y Desarrollo de Sistemas  
**Repositorio:** https://github.com/Jussstinnn/proyecto-tcu  

---

## Introducción

Este documento presenta el **estado actual de implementación de las Historias de Usuario (HU)** definidas para el proyecto Fidelitas TechSeed, actualizado tras la última reunión de alcance.

El sistema actualmente contempla:

- Dos roles: **Estudiante** y **Coordinador**.
- Generación automática de **PDF cada vez que el estudiante finaliza y envía su anteproyecto**.
- Versionado automático del documento en cada corrección.
- Generación de un **PDF final aprobado con código alfanumérico único visible como sello de validez**.
- Trazabilidad mediante bitácora.
- Funcionalidades de IA planificadas para la última fase del proyecto.

Las historias de usuario se clasifican en tres categorías:

- **Implementadas al 100%**
- **Implementadas aproximadamente al 70%**
- **Pendientes de implementación**

Total actual: **15 Historias de Usuario**

---

## Historias de Usuario Implementadas al 100%

Estas historias cuentan con lógica funcional, integración con base de datos y flujo operativo completo dentro del sistema.

### Estudiante

- **HU-01 – Crear anteproyecto estructurado**  
  Permite completar el anteproyecto mediante un formulario guiado por etapas, registrando correctamente la información en la base de datos.

- **HU-02 – Finalizar y generar PDF automático**  
  Al presionar “Finalizar y enviar”, el sistema genera automáticamente un PDF con la información ingresada.

- **HU-03 – Corrección con versionado automático**  
  Permite corregir observaciones y generar una nueva versión del PDF, manteniendo el historial de versiones anteriores.

---

### Coordinador

- **HU-07 – Bandeja general de anteproyectos**  
  Permite visualizar todos los anteproyectos registrados con filtros por estado y fecha.

- **HU-08 – Tomar voluntariamente un anteproyecto**  
  Permite que un coordinador se asigne un caso disponible para su gestión.

---

## Historias de Usuario Implementadas ~70%

Estas funcionalidades cuentan con estructura base implementada, pero requieren mejoras visuales, automatización o cierre formal del flujo.

### Estudiante

- **HU-04 – Notificaciones con enlace directo**  
  Existe la lógica de estados y observaciones, pero falta completar la notificación automática con enlace directo a la sección corregible.

---

### Coordinador

- **HU-09 – Reasignar anteproyecto**  
  Existe la base de asignación, pero requiere mejoras para mostrar claramente quién tiene cada caso y permitir reasignación fluida.

- **HU-10 – Bitácora completa por versión**  
  La estructura de registro existe, pero falta trazabilidad detallada por versión generada del PDF.

- **HU-12 – Recordatorios automáticos**  
  Existe planificación de SLA, pero aún no está completamente automatizado.

- **HU-13 – Plantillas institucionales**  
  Funcionalidad definida pero pendiente implementación completa.

- **HU-15 – Gestión básica de roles**  
  Autenticación y control de roles implementados en backend, pendiente mejora visual y administrativa.

---

## Historias de Usuario Pendientes de Implementación

Estas historias forman parte del alcance aprobado pero aún no han sido desarrolladas.

### Coordinador

- **HU-11 – Documento final aprobado con código alfanumérico**  
  Pendiente implementación de generación automática del PDF final con código único visible como sello de validez.

- **HU-14 – Control de periodo académico**  
  Pendiente implementación de habilitación/deshabilitación de generación de PDF según calendario activo.

---

### Estudiante (Sprint Final – IA)

- **HU-05 – Validación IA de coherencia**  
  No implementada.

- **HU-06 – Chatbot de apoyo**  
  No implementado.

---

## Resumen General

| Estado de la HU | Cantidad |
|-----------------|----------|
| Completadas al 100% | 5 |
| Implementadas ~70% | 6 |
| Pendientes | 4 |
| **Total de Historias de Usuario** | **15** |
