# Configurar emuladores locales de AWS

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="../../assets/AWS%20DVA-C02.webp" alt="Logotipo de AWS DVA-C02" width="128">
  <img src="../../assets/AWS%20DOP-C01.png" alt="Logotipo de AWS DOP-C01" width="128">
</p>
<!-- markdownlint-enable MD033 -->

En esta sección encontrarás como configurar los emuladores del cloud para no tener dependencia de AWS para realizar algunas practicas.

## Consideraciones de seguridad

!!! warning "Atención"
    - El instalador se descarga y ejecuta directamente desde Internet. Antes de utilizar este método en un entorno sensible, conviene revisar el contenido del script y verificar que procede del sitio oficial de Floci.
    - Todos los recursos creados durante los laboratorios serán locales y estarán aislados del entorno AWS real, salvo que se indique expresamente lo contrario.
    - Las credenciales utilizadas en los laboratorios son ficticias.
    - No utilizar `aws login` para conectarse en los emuladores locales.
    - No utilizar tokens de LocalStack en repositorios.
    - No ejecutar comandos destructivos sobre volúmenes Docker sin verificar antes su propietario.
    - Mantener separados los estados persistentes de Floci y LocalStack.

## Configurar región en AWS CLI

```shell title="Configurar región AWS CLI"
aws configure set region eu-west-1
```

## Floci

Los laboratorios se ejecutarán con *Floci Community* como emulador local de servicios AWS.

### Entorno utilizado

- Sistema operativo: Linux Mint 22.3 (Zena)
- Base del sistema: Ubuntu 24.04 Noble
- Floci: versión 2.2.0
- Edición: Community
- Plan: `floci-always-free`
- Backend de DynamoDB: `native`
- Docker Engine: versión 29.9.0
- Docker Compose: versión 5.6.0

### Requisitos previos de Floci

Floci necesita Docker y Docker Compose. Se pueden comprobar con:

```shell title="Comprobar Docker y Docker Compose"
docker --version
docker compose version
```

### Instalación de Floci

La instalación se realiza mediante el instalador oficial de Floci.

```shell title="Instalador oficial Floci"
curl -fsSL https://floci.io/install.sh | sh
```

Después, se comprueba la versión instalada:

```shell title="Comprobar versión Floci"
floci --version
```

La instalación debe mostrar Floci `2.2.0` y la edición Community.
Posteriormente comprobaremos el entorno

```shell title="Comprobar entorno Floci"
floci doctor
```

!!! success "Resultado"
    ```shell
    Floci AWS Doctor — checking your environment
    ✓ docker.installed           Docker 29.9.0 detected
    ✓ docker.daemon              Daemon reachable
    ✓ docker.socket              /var/run/docker.sock accessible
    ✓ docker.version             Docker 29.9.0 (>= 20.10)
    ✓ port.available             Port 4566 in use by container 'floci' (expected)
    ✓ image.present              floci/floci image present locally
    ✓ image.version              Server image version 2.2.0 (>= 1.5.0)
    ✓ container.running          Container 'floci' is running
    ✓ endpoint.reachable         http://localhost:4566 is reachable (server v2.2.0)
    ✓ aws.cli.endpoint           AWS_ENDPOINT_URL=http://localhost.floci.io:4566
    ✓ aws.cli.s3.pathstyle       S3 path-style addressing configured
    All checks passed.
    ```

También se puede comprobar la salud del endpoint:

```shell title="Comprobar salud endpoint"
curl http://localhost:4566/_localstack/health
```

### Iniciar Floci

Para iniciar el entorno local:

```shell title="Iniciar Floci"
floci start
```

Floci utilizará su configuración predeterminada y expondrá el endpoint principal en el puerto `4566`.

### Detener Floci

Para detener el entorno:

```shell title="Detener Floci"
floci stop
```

Se debe detener Floci antes de iniciar LocalStack, porque ambos utilizan el puerto principal `4566` y no pueden ejecutarse simultáneamente con la configuración predeterminada.

### Comprobación básica

La instalación puede verificarse también consultando la ayuda del programa.

```shell title="Ayuda Floci"
floci help
```

Si Floci se inicia correctamente, el entorno estará preparado para configurar AWS CLI y comenzar los laboratorios.

### Panel de control

Se puede acceder a su panel de control desde [http://localhost:4566](http://localhost:4566).

<!-- markdownlint-disable MD033 -->
<img src="../../assets/floci-dashboard.png" alt="Dashboard de Floci" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Activar IAM Policy Enforcement en Floci

Por defecto, Floci puede crear usuarios, grupos y políticas IAM sin aplicar necesariamente esas políticas al autorizar las llamadas a los servicios. Para reproducir mejor el comportamiento de AWS, se activa el motor de evaluación IAM mediante:

```yaml title="Activar motor evaluación IAM"
FLOCI_SERVICES_IAM_ENFORCEMENT_ENABLED=true
```

### Configuración mediante Docker Compose

Se utiliza un archivo independiente llamado `compose.floci.yaml`:

```yaml title="compose.floci.yaml"
services:
  floci:
    image: floci/floci:latest
    container_name: floci
    ports:
      - "4566:4566"
    environment:
      FLOCI_SERVICES_IAM_ENFORCEMENT_ENABLED: "true"
    volumes:
      - floci-data:/app/data
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  floci-data:
```

La variable se define dentro `environment`, de modo que llega al contenedor de Floci.

!!! warning "Aviso"
    Exportarla únicamente en la terminal no es suficiente, porque `floci start` no la transmite automáticamente al contenedor.

### Cambiar al arranque mediante Compose

Si Floci fue iniciado previamente con `floci start`, primero se detiene y se elimina el contenedor anterior para evitar conflictos de nombre:

```shell title="Eliminar contenedor anterior"
floci stop
docker rm floci
```

Si el contenedor sigue activo:

```shell title="Forzar eliminar contenedor anterior"
docker rm -f floci
```

!!! info "Información"
    Los siguientes comandos deben realizarse en el directorio que contenga el fichero `compose.floci.yaml` y `compose.localstack.yaml`.

En caso necesario, LocalStack debe estar detenido, porque ambos entornos utilizan el puerto `4566`:

```shell title="Detener contenedor LocalStack"
docker compose -f compose.localstack.yaml down
```

Después se inicia Floci con la configuración de enforcement:

```shell title="Iniciar Floci configuración enforcement"
docker compose -f compose.floci.yaml up
```

### Verificar la variable dentro del contenedor

```shell title="Verificar variable dentro contenedor"
docker inspect floci \
  --format '{{range .Config.Env}}{{println .}}{{end}}' \
  | grep FLOCI_SERVICES_IAM_ENFORCEMENT_ENABLED
```

!!! success "Resultado esperado"
    `FLOCI_SERVICES_IAM_ENFORCEMENT_ENABLED=true`

Consultar los logs relacionados con IAM:

```shell title="Consultar logs Floci IAM"
docker logs floci 2>&1 | grep -iE 'iam|policy|enforce'
```

También se puede comprobar que el contenedor está activo:

```shell title="Comprobar contenedor activo"
docker ps
```

### Verificar el endpoint de Floci

```shell title="Verificar endpoint Floci"
AWS_ACCESS_KEY_ID=test \
AWS_SECRET_ACCESS_KEY=test \
aws --endpoint-url=http://localhost:4566 \
sts get-caller-identity
```

!!! success "Resultado esperado"
    El resultado debe corresponder a una cuenta local, normalmente:
    `000000000000`

### Nota sobre la persistencia

El volumen `floci-data` conserva el estado de Floci entre reinicios del contenedor. Por eso, al iniciar Floci de nuevo mediante Compose pueden seguir existiendo los usuarios, grupos, políticas y recursos creados anteriormente.

Para comprobar el volumen:

```shell title="Comprobar volumen contenedor"
docker volume ls
```

Para eliminar todo el estado local de Floci, primero se detiene el servicio y después se elimina su volumen:

```shell title="Eliminar todo estado local Floci"
docker compose -f compose.floci.yaml down
docker volume rm desarrollo_floci-data
```

El nombre exacto del volumen puede incluir el nombre del proyecto de Docker Compose.

## LocalStack

LocalStack se utilizará como entorno alternativo a Floc. Ambos emuladores utilizar el puerto `4566`, por lo que no se ejecutarán simultáneamente.

### Requisitos previos de LocalStack

- Linux Mint 22.3.
- Docker Engine instalado y operativo.
- Docker Compose disponible.
- Una cuenta de LocalStack con licencia activa para `lstk`.

Comprobar Docker:

```shell title="Comprobar Docker y Docker Compose"
docker --version
docker compose version
```

### Instalar la CLI `lstk`

La instalación recomendada para Linux mediante npm es:

```shell title="Instalación recomendada LocalStack"
npm install -g @localstack/lstk
```

Comprobar la instalación:

```shell title="Comprobar versión LocalStack"
lstk --version
```

También se puede comprobar el entorno:

```shell title="Comprobar entorno LocalStack"
lstk doctor
```

### Iniciar y detener con la CLI `lstk`

La primera ejecución inicia el proceso de autenticación de LocalStack:

```shell title="Iniciar LocalStack"
lstk start
```

La CLI se encarga de iniciar el contenedor y conectarlo con el endpoint local.
Se puede acceder a su panel de control desde [https://app.localstack.cloud/inst/default/resources](https://app.localstack.cloud/inst/default/resources).

<!-- markdownlint-disable MD033 -->
<img src="../../assets/localstack-dashboard.png" alt="Dashboard de LocalStack" class="zoomable">
<!-- markdownlint-enable MD033 -->

Para detener LocalStack:

```shell title="Detener LocalStack"
lstk stop
```

!!! info "Información"
    La CLI antigua `localstack` sigue apareciendo en documentación anterior, pero la herramienta recomendada actualmente es `lstk`.

## Activar IAM Policy Enforcement en LocalStack

Por defecto, LocalStack permite acceder a las APIs sin evaluar completamente las políticas IAM. Para reproducir el comportamiento de autorización de AWS se activa:

```toml title="Activar validación políticas IAM"
ENFORCE_IAM=1
```

La configuración de LocalStack puede gestionarse mediante un archivo `config.toml`:

```toml title="config.toml"
[[containers]]
type = "aws"

[containers.env]
ENFORCE_IAM = "1"
DEBUG = "1"
```

La variable `ENFORCE_IAM=1` hace que LocalStack evalúe las políticas de identidad, las políticas basadas en recursos y otras restricciones IAM aplicables.

### Arranque mediante Docker Compose

Como alternativa, se puede utilizar un archivo separado:

```yaml title="compose.localstack.yaml"
services:
  localstack:
    image: localstack/localstack:latest
    container_name: localstack
    ports:
      - "4566:4566"
    environment:
      ENFORCE_IAM: "1"
      DEBUG: "1"
      AWS_DEFAULT_REGION: "eu-west-1"
    volumes:
      - localstack-data:/var/lib/localstack
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  localstack-data:
```

Guardar como:

```yaml
compose.localstack.yaml
```

!!! info "Información"
    Los siguientes comandos deben realizarse en el directorio que contenga el fichero `compose.localstack.yaml` y `compose.floci.yaml`.

### Validar la configuración

```shell title="Validar configuración Docker"
docker compose -f compose.localstack.yaml config
```

### Iniciar LocalStack mediante Compose

```shell title="Iniciar LocalStack configuración enforcement"
docker compose -f compose.localstack.yaml up
```

### Detener LocalStack mediante Compose

```shell title="Detener LocalStack configuración enforcement"
docker compose -f compose.localstack.yaml down
```

### Comprobar el endpoint de LocalStack

```shell title="Verificar endpoint LocalStack"
AWS_ACCESS_KEY_ID=test \
AWS_SECRET_ACCESS_KEY=test \
aws --endpoint-url=http://localhost:4566 \
sts get-caller-identity
```

!!! success "Resultado esperado"
    El resultado debe identificar una cuenta local, normalmente:
    `000000000000`

También se puede comprobar la salud del endpoint:

```shell title="Comprobar salud endpoint"
curl http://localhost:4566/_localstack/health
```

### Verificar IAM Policy Enforcement en LocalStack

Si LocalStack se inicio con Docker Compose, comprobar la variable dentro del contenedor:

```shell title="Comprobar variable dentro contenedor"
docker inspect localstack \
  --format '{{range .Config.Env}}{{println .}}{{end}}' \
  | grep ENFORCE_IAM
```

!!! success "Resultado esperado"
    `ENFORCE_IAM=1`

Consultar los logs relacionados con IAM:

```shell title="Consultar logs LocalStack IAM"
docker logs localstack 2>&1 | grep -iE 'iam|policy|enforce'
```

La comprobación funcional definitiva consiste en crear un usuario sin permisos, ejecutar un operación con sus credenciales y verificar que LocalStack responde con `AccessDenied`.

<!-- markdownlint-disable MD046 -->
!!! abstract "Resultado"
    LocalStack queda instalado como entorno alternativo con:

    - Docker operativo.
    - CLI `lstk`.
    - Endpoint local en `localhost.localstack.cloud:4566`.
    - Región predeterminada `eu-west-1`.
    - Estado persistente en el volumen `localstack-data` (El nombre exacto del volumen puede incluir el nombre del proyecto de Docker Compose)
<!-- markdownlint-enable MD046 -->

## Alternar entre Floci y LocalStack con Policy Enforcement activado

!!! warning "Atención"
    Floci y LocalStack no deben ejecutarse simultáneamente con esta configuración, porque ambos utilizar el puerto `4566`.

Para pasar de Floci a LocalStack:

```shell title="Pasar de Floci a LocalStack"
docker compose -f compose.floci.yaml down
docker compose -f compose.localstack.yaml up
```

Para pasar de LocalStack a Floci

```shell title="Pasar de LocalStack a Floci"
docker compose -f compose.localstack.yaml down
docker compose -f compose.floci.yaml up -d
```

---

!!! info "Acerca de este proyecto"
    - Esta documentación ha sido elaborada de forma independiente por **José Antonio Seguido Doblado** como material de estudio.
    - No constituye documentación oficial de Amazon Web Services (AWS).
!!! warning
    - Estos laboratorios no reproducen necesariamente todos los pasos de la consola real de AWS.
    - Las instrucciones se adaptarán al simulador local utilizado, manteniendo los objetivos y conceptos de la guía del laboratorio original.
