# Floci

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="../../assets/AWS%20DVA-C02.webp" alt="Logotipo de AWS DVA-C02" width="128">
  <img src="../../assets/AWS%20DOP-C01.png" alt="Logotipo de AWS DOP-C01" width="128">
</p>
<!-- markdownlint-enable MD033 -->

En esta sección encontrarás laboratorios prácticos para aplicar los conceptos y servicios de AWS incluidos en las guías de estudio.

## 0.1. Instalación y configuración de Floci

Los laboratorios se ejecutarán inicialmente con Floci Community como emulador local de servicios AWS.

### Entorno utilizado

- Sistema operativo: Linux Mint 22.3 (Zena)
- Base del sistema: Ubuntu 24.04 Noble
- Floci: versión 2.2.0
- Edición: Community
- Plan: `floci-always-free`
- Backend de DynamoDB: `native`
- Docker Engine: versión 29.9.0
- Docker Compose: versión 5.6.0

#### Requisitos previos

Floci necesita Docker y Docker Compose. Se pueden comprobar con:

```bash
docker --version
docker compose version
```

#### Instalación

La instalación se realiza mediante el instalador oficial de Floci:

```bash
curl -fsSL https://floci.io/install.sh | sh
```

Después, se comprueba la versión instalada:

```bash
floci --version
```

La instalación debe mostrar Floci `2.2.0` y la edición Community.

#### Iniciar Floci

Para iniciar el entorno local:

```bash
floci start
```

Floci utilizará su configuración predeterminada y expondrá el endpoint principal en el puerto `4566`.

#### Detener Floci

Para detener el entorno:

```bash
floci stop
```

Se debe detener Floci antes de iniciar LocalStack, porque ambos utilizan el puerto principal `4566` y no pueden ejecutarse simultáneamente con la configuración predeterminada.

#### Comprobación básica

La instalación puede verificarse también consultando la ayuda del programa:

```bash
floci help
```

Si Floci se inicia correctamente, el entorno estará preparado para configurar AWS CLI y comenzar los laboratorios.

Se puede acceder a su panel de control desde [http://localhost:4566](http://localhost:4566).

<!-- markdownlint-disable MD033 -->
<img src="../../assets/floci-dashboard.png" alt="Dashboard de Floci">
<!-- markdownlint-enable MD033 -->

#### Consideraciones de seguridad

El instalador se descarga y ejecuta directamente desde Internet. Antes de utilizar este método en un entorno sensible, conviene revisar el contenido del script y verificar que procede del sitio oficial de Floci.

Todos los recursos creados durante los laboratorios serán locales y estarán aislados del entorno AWS real, salvo que se indique expresamente lo contrario.
