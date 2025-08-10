# 🎯 Ejercicios Prácticos

## 📝 Ejercicio 1: Crear un Sistema de Gestión Académica

Crea una base de datos académica para gestionar la información de profesores.

### Requisitos:

Crear una colección llamada **teachers** con validación de esquema que incluya los siguientes campos requeridos:

* `name` (string, mínimo 2 caracteres)
* `age` (entero, entre 25 y 70)
* `specialty` (string)
* `yearsOfExperience` (entero, mínimo 0)

Insertar al menos tres documentos de ejemplo que contengan también los siguientes campos adicionales:

* `email` (string)
* `department` (string)
* `salary` (numérico)
* `active` (booleano)

Realizar las siguientes consultas:

* Buscar todos los profesores con más de 15 años de experiencia (`yearsOfExperience > 15`).
* Calcular el promedio de edad (`age`) de los profesores activos (`active: true`).
* Generar estadísticas por departamento (`department`): número de profesores, experiencia total, salario promedio y listado de nombres.

---

## 📚 Ejercicio 2: Sistema de Cursos y Matriculaciones

Diseña una colección para administrar los cursos y su proceso de inscripción.

### Requisitos:

Crear una colección llamada **courses** e insertar al menos dos documentos con los siguientes campos:

* `code` (string, por ejemplo, "MAT101")
* `name` (string)
* `credits` (entero)
* `teacherId` (referencia al `_id` de la colección `teachers`)
* `schedule` (objeto con los días y franjas horarias del curso)
* `maxCapacity` (entero, cupo máximo)
* `enrolled` (arreglo inicialmente vacío)

Matricular un alumno en un curso agregando al arreglo `enrolled` un objeto con:

* `studentId`
* `enrollmentDate` (fecha actual)
* `status` (por ejemplo, "active")
