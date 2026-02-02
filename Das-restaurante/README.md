# DAS – Ecosistema de Restaurantes (Monorepo)

![Java](https://img.shields.io/badge/Java-17%2B-blue?logo=openjdk) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-API%20REST-success?logo=spring) ![Angular](https://img.shields.io/badge/Angular-Frontend-red?logo=angular) ![SQL%20Server](https://img.shields.io/badge/SQL%20Server-DB-informational?logo=microsoft-sql-server)

Este repositorio reúne dos proyectos complementarios para el caso de estudio de la materia DAS:

- **das-restaurante**: conjunto de servicios (REST y SOAP) por restaurante y un agregador para orquestación/datos. Incluye scripts de base de datos y utilitarios para levantar y detener todos los servicios.
- **das-ristorino**: aplicación completa (backend + frontend) que consume los servicios anteriores y ofrece una experiencia integrada.

> Si solo necesitas ver cada proyecto por separado, revisa sus propios README y documentación:
> - Documentación y servicios: [das-restaurante/README.md](das-restaurante/README.md)
> - App completa (backend + Angular): [das-ristorino/README.md](das-ristorino/README.md)

---

## Visión General

- Arquitecturas incluidas:
  - Múltiples microservicios para restaurantes (REST y SOAP) en [das-restaurante](das-restaurante).
  - App "Ristorino" con backend Java y frontend Angular en [das-ristorino](das-ristorino).
- Scripts para preparar datos y administrar procesos en [das-restaurante/scripts](das-restaurante/scripts).
- Documentación adicional (arquitectura, ejemplos, verificación de datos) dentro de cada proyecto.

## Sobre el Proyecto

- Ecosistema académico que simula varios restaurantes expuestos como microservicios (REST y SOAP) y una aplicación integral que los consume.
- Dos proyectos complementarios:
  - **das-restaurante**: servicios por restaurante (REST y SOAP) y un agregador para orquestar/centralizar datos.
  - **das-ristorino**: aplicación completa con backend Java Spring Boot y frontend Angular que consume los servicios.
- Capacidades clave:
  - Orquestación y agregación de información entre servicios.
  - Autenticación con JWT en la app y consumo seguro de APIs.
- Tecnologías: Java 17+, Spring Boot, Angular, SQL Server, integración REST/SOAP.
- Relación entre módulos: primero se levantan los servicios de **das-restaurante** (start/stop en [scripts](das-restaurante/scripts)), luego se ejecuta **das-ristorino** (backend y frontend) para ofrecer una experiencia unificada.

## Requisitos

- Java (JDK) 17+ y Maven Wrapper (se usa `mvnw`/`mvnw.cmd` incluidos).
- Node.js 18+ y npm. Recomendado Angular CLI si desarrollas frontend.
- Bash (Git Bash o WSL) en Windows para ejecutar los `.sh` opcionales.
- Motor de base de datos según los scripts provistos (ver sección Base de datos).

## Estructura de Carpetas

- **das-restaurante**: servicios por restaurante (REST/SOAP), agregadores y scripts
  - Documentos: [das-restaurante/ARQUITECTURA.md](das-restaurante/ARQUITECTURA.md), [das-restaurante/ARQUITECTURA_NUEVA.md](das-restaurante/ARQUITECTURA_NUEVA.md)
  - Servicios backend: [das-restaurante/backend](das-restaurante/backend)
  - Scripts y SQL: [das-restaurante/scripts](das-restaurante/scripts)
  - Logs en ejecución: [logs](logs)
- **das-ristorino**: aplicación completa
  - Backend Java: [das-ristorino/backend](das-ristorino/backend)
  - Frontend Angular: [das-ristorino/frontend/das-ristorino-frontend](das-ristorino/frontend/das-ristorino-frontend)
  - Documentación: [das-ristorino/a-documentacion](das-ristorino/a-documentacion)

## Puesta en Marcha Rápida

### A) Levantar todos los servicios de restaurantes (das-restaurante)

- Windows (Git Bash) o Linux/macOS:
  1. Abrir terminal en: `das-restaurante/scripts`
  2. Ejecutar:
     ```bash
     bash ./start-all-restaurants.sh
     ```
  3. Para detener:
     ```bash
     bash ./stop-all-restaurants.sh
     ```
  - PIDs generados en [logs](logs). Revisa `*.pid` y los `target/` de cada servicio para trazas.
  - Tests rápidos por servicio: ver `TEST_CURL.md` en cada módulo REST (p. ej. [das-restaurante/backend/bella-pizza-rest/TEST_CURL.md](das-restaurante/backend/bella-pizza-rest/TEST_CURL.md)).

- Alternativa (individual):
  - Desde cada módulo (por ejemplo, [das-restaurante/backend/bella-pizza-rest](das-restaurante/backend/bella-pizza-rest)):
    - Windows:
      ```powershell
      .\mvnw.cmd spring-boot:run
      ```
    - Linux/macOS/Git Bash:
      ```bash
      ./mvnw spring-boot:run
      ```

### B) Aplicación Ristorino (backend + frontend)

- Backend (Java):
  - Ubicación: [das-ristorino/backend](das-ristorino/backend)
  - Comandos:
    - Windows:
      ```powershell
      cd .\das-ristorino\backend\
      .\mvnw.cmd spring-boot:run
      ```
    - Linux/macOS/Git Bash:
      ```bash
      cd ./das-ristorino/backend/
      ./mvnw spring-boot:run
      ```

- Frontend (Angular):
  - Ubicación: [das-ristorino/frontend/das-ristorino-frontend](das-ristorino/frontend/das-ristorino-frontend)
  - Comandos:
    ```bash
    cd ./das-ristorino/frontend/das-ristorino-frontend/
    npm install
    npm start
    ```
  - Por defecto suele iniciar en http://localhost:4200 (ajústalo según `package.json`).

## Base de Datos

- Scripts SQL principales en [das-restaurante/scripts/sql](das-restaurante/scripts/sql) y subcarpetas por restaurante.
- En das-ristorino hay utilitarios: [das-ristorino/setup-database.sh](das-ristorino/setup-database.sh) y documentación en [das-ristorino/a-documentacion](das-ristorino/a-documentacion) (ver especialmente [VERIFICACION_DATOS_RESTAURANTES.md](das-ristorino/a-documentacion/VERIFICACION_DATOS_RESTAURANTES.md)).
- Motor y credenciales: adapta a tu entorno local según los scripts. Si tu entorno es Windows, puedes usar Git Bash o un cliente SQL de tu preferencia para ejecutar los `.sql`.

## Documentación útil

- Arquitectura general y nueva propuesta: [das-restaurante/ARQUITECTURA.md](das-restaurante/ARQUITECTURA.md), [das-restaurante/ARQUITECTURA_NUEVA.md](das-restaurante/ARQUITECTURA_NUEVA.md)
- Quickstart Ristorino: [das-ristorino/QUICKSTART.md](das-ristorino/QUICKSTART.md)
- Guías de desarrollo y prácticas: [das-ristorino/a-documentacion/GUIA_DESARROLLO.md](das-ristorino/a-documentacion/GUIA_DESARROLLO.md), [das-ristorino/a-documentacion/EJEMPLOS_PRACTICOS.md](das-ristorino/a-documentacion/EJEMPLOS_PRACTICOS.md)

## Troubleshooting

- Si un servicio no arranca:
  - Verifica que el puerto no esté ocupado y revisa `target/` y [logs](logs).
  - Ejecuta `mvnw clean` y vuelve a correr `spring-boot:run` en ese módulo.
- Scripts `.sh` en Windows:
  - Usa Git Bash o WSL. Alternativamente, ejecuta cada servicio con `mvnw.cmd` como se muestra arriba.
- Endpoints y pruebas manuales:
  - Revisa los `TEST_CURL.md` en cada módulo REST y el archivo [das-restaurante/test-soap.html](das-restaurante/test-soap.html) para pruebas SOAP.

## Contribución y Estilo

- Mantén los cambios acotados por módulo.
- Actualiza documentación relacionada cuando agregues/alteres endpoints u operaciones.
- Antes de subir, compila localmente y ejecuta pruebas rápidas (`mvnw test` si aplica).

---

Hecho con fines académicos. Ajusta nombres de hosts/puertos/credenciales según tu entorno.
