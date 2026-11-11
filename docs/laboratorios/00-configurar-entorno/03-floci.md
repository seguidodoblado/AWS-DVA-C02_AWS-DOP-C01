# Módulo 3: Floci

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="../../../assets/AWS%20DVA-C02.png" alt="Logotipo de AWS DVA-C02" width="128">
  <img src="../../../assets/AWS%20DOP-C01.png" alt="Logotipo de AWS DOP-C01" width="128">
</p>
<!-- markdownlint-enable MD033 -->

## Objetivo

Instalar Floci (edición `floci-always-free`) dentro de la máquina virtual y dejarlo preparado para ejecutar los laboratorios AWS localmente.
Floci se ejecutará mediante Docker y expondrá sus servicios AWS a través del puerto 4566.

## Requisitos previos

- Linux Mint Cinnamon 22.3.
- Docker Engine instalado.
- Docker Compose instalado.
- AWS CLI v2 instalado.
- `curl` instalado.
- Usuario con permisos para ejecutar Docker.
- Conexión a Internet.

Comprobar Docker:

```shell title="Comprobar versión Docker"
docker --version
```

---

```shell title="Comprobar versión Docker Compose"
docker compose version
```

Comprobar AWS CLI:

```shell title="Comprobar versión AWS CLI"
aws --version
```

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/versiones-requisitos.png" alt="Versiones de requisitos para Floci" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Instalar Floci

La instalación se realiza mediante el instalador oficial:

```shell title="Instalar Floci"
curl -fsSL https://floci.io/install.sh | sh
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/instalar-floci.png" alt="Instalar Floci" class="zoomable">
<!-- markdownlint-enable MD033 -->

El instalador añade el comando `floci` al sistema.

!!! warning
    El instalador se descarga y ejecuta directamente desde Internet. En un entorno sensible conviene revisar previamente el contenido del script.

## Comprobar la instalación

Consultar la versión:

```shell title="Comprobar versión Floci"
floci version
```

La instalación utilizada para los laboratorios es:

```shell title="Resultado esperado"
Floci CLI 0.4.0
Server:    2.4.0 (floci-always-free)
```

!!! note
    `floci version` muestra dos versiones independientes: la de la CLI (`0.4.0`) y la del servidor (`2.4.0`). La edición utilizada es `floci-always-free`.

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/floci-version.png" alt="Versión de Floci" class="zoomable">
<!-- markdownlint-enable MD033 -->

Comprobar la ubicación del ejecutable:

```shell title="Comprobar ruta ejecutable Floci"
command -v floci
```

Consultar la ayuda:

```shell title="Ayuda Floci"
floci help
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/floci-help.png" alt="Ayuda de Floci" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Iniciar Floci

Para iniciar Floci en modo normal:

```shell title="Iniciar Floci modo normal"
floci start
```

El servicio quedará disponible en:

[http://localhost:4566](http://localhost:4566)

También responde en `http://localhost.floci.io:4566`, que es el alias que utiliza `floci doctor` para AWS CLI.

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/floci-pantalla-inicial.png" alt="Pantalla inicial de Floci" class="zoomable">
<!-- markdownlint-enable MD033 -->

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/floci-dashboard.png" alt="Dashboard de Floci" class="zoomable">
<!-- markdownlint-enable MD033 -->

Comprobar el estado:

```shell title="Comprobar estado Floci"
floci status
```

El resultado debe indicar:

```shell title="Resultado esperado"
Container:  floci  running
Reachable:  yes
Version:    2.4.0
```

La salida completa incluye también `Image`, `Ports`, `Endpoint` y `Edition`.

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/floci-status.png" alt="Estado de Floci" class="zoomable">
<!-- markdownlint-enable MD033 -->

Comprobar el entorno completo:

```shell title="Comprobar entorno completo Floci"
floci doctor
```

El diagnóstico debe confirmar:

- Docker instalado.
- Docker accesible.
- Imagen de Floci disponible.
- Contenedor activo.
- Endpoint accesible.
- Versión de Floci detectada.

!!! note
    Si `floci doctor` muestra el aviso `aws.cli.endpoint` con `AWS_ENDPOINT_URL is not set`, es esperado antes de configurar AWS CLI. Se resuelve con `use-floci` que explicaremos más adelante, el cual define `AWS_ENDPOINT_URL=http://localhost.floci.io:4566`. Las comprobaciones directas con `curl` o `aws --endpoint-url` pueden seguir usando `http://localhost:4566`.

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/floci-doctor.png" alt="Comprobar entorno completo Floci" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Activar IAM Policy Enforcement

Para los laboratorios que prueben permisos IAM se activará el motor de evaluación de políticas:

```yaml title="Activar el motor de evaluación de políticas"
FLOCI_SERVICES_IAM_ENFORCEMENT_ENABLED=true
```

La variable debe llegar al contenedor. Para garantizarlo se utilizará Docker Compose.
Crear el archivo:

```shell title="Crear archivo compose.floci.yaml"
nano compose.floci.yaml
```

Contenido:

```yaml title="compose.floci.yaml"
services:
  floci:
    image: floci/floci:latest
    container_name: floci
    ports:
      - "4566:4566"
    environment:
      FLOCI_SERVICES_IAM_ENFORCEMENT_ENABLED: "true"
      FLOCI_DEFAULT_REGION: "eu-west-1"
    volumes:
      - floci-data:/app/data
      - /var/run/docker.sock:/var/run/docker.sock

volumes:
  floci-data:
```

Validar el archivo:

```shell title="Validar compose.floci.yaml"
docker compose -f compose.floci.yaml config
```

Si Floci estaba iniciado mediante `floci start`, detenerlo antes de utilizar Compose:

```shell title="Detener Floci"
floci stop
```

Si el contenedor anterior sigue existiendo:

```shell title="Eliminar contenedor Floci normal"
docker rm floci
```

Iniciar Floci con IAM Policy Enforcement:

```shell title="Iniciar Floci con evaluación de políticas"
docker compose -f compose.floci.yaml up -d
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/floci-evaluacion-politicas.png" alt="Iniciar Floci con evaluación de políticas" class="zoomable">
<!-- markdownlint-enable MD033 -->

Para una mayor comodidad, creamos un fichero `.bash_aliases` con el siguiente contenido:

```text title=".bash_aliases"
alias floci-iam='docker compose -f compose.floci.yaml up -d'
alias noendpoint='unset AWS_ENDPOINT_URL'
```

!!! note
    Los alias utilizan la ruta relativa `compose.floci.yaml`. Ejecútalos desde el directorio en el que creaste el archivo, o sustituye la ruta por una absoluta. El alias `noendpoint` elimina `AWS_ENDPOINT_URL` de la sesión actual.

Posteriormente lo hacemos efectivo con:

```shell title="Activar alias"
source ~/.bash_aliases
```

Esto hará que cuando invoquemos al alias:

```shell title="Iniciar Floci con evaluación de políticas"
floci-iam
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/floci-iam.png" alt="Iniciar Floci con evaluación de políticas" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Comprobar IAM Policy Enforcement

Verificar que la variable está dentro del contenedor:

```shell title="Comprobar variable evaluación políticas"
docker inspect floci \
  --format '{{range .Config.Env}}{{println .}}{{end}}' \
  | grep FLOCI_
```

Resultado esperado:

```shell title="Resultado esperado"
FLOCI_SERVICES_IAM_ENFORCEMENT_ENABLED=true
FLOCI_DEFAULT_REGION=eu-west-1
FLOCI_VERSION=2.4.0
FLOCI_STORAGE_PERSISTENT_PATH=/app/data
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/comprobar-variable-iam.png" alt="Comprobar variable IAM" class="zoomable">
<!-- markdownlint-enable MD033 -->

Consultar los logs relacionados con IAM:

```shell title="Consultar logs relacionados con IAM"
docker logs floci 2>&1 | grep -iE 'iam|policy|enforcement'
```

Debe aparecer una indicación equivalente a:

```shell title="Resultado esperado"
IAM: policy enforcement enabled
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/comprobar-logs-iam.png" alt="Comprobar logs IAM" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Verificar el endpoint con AWS CLI

!!! note
    AWS CLI requiere una región configurada incluso cuando se conecta a Floci.
    Se utiliza `eu-west-1` como región local de referencia.
    <!-- cSpell:disable-next-line -->
    Para configurarla:
    ```bash
    aws configure set region eu-west-1
    ```

Utilizar credenciales ficticias para conectarse al emulador:

```shell title="Credenciales ficticias AWS"
AWS_ACCESS_KEY_ID=test \
AWS_SECRET_ACCESS_KEY=test \
aws --endpoint-url=http://localhost:4566 \
sts get-caller-identity
```

El resultado debe corresponder a una cuenta local, normalmente:

```json title="Resultado esperado"
{
    "UserId": "000000000000",
    "Account": "000000000000",
    "Arn": "arn:aws:iam::000000000000:root"
}
```

Comprobar que IAM está disponible:

```shell title="Comprobar usuarios IAM"
AWS_ACCESS_KEY_ID=test \
AWS_SECRET_ACCESS_KEY=test \
aws --endpoint-url=http://localhost:4566 \
iam list-users
```

Al comenzar, la lista debería estar vacía:

```json title="Lista vacía usuarios IAM"
{
    "Users": []
}
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/comprobar-credenciales-usuarios-iam.png" alt="Comprobar credenciales usuarios IAM" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Configuración de AWS CLI para Floci

Después de iniciar Floci, configuramos las variables de entorno que utilizará AWS CLI:

```shell title="Configurar AWS CLI con endpoint local"
export AWS_ACCESS_KEY_ID='test'
export AWS_SECRET_ACCESS_KEY='test'
export AWS_DEFAULT_REGION='eu-west-1'
export AWS_ENDPOINT_URL='http://localhost.floci.io:4566'
```

!!! note
    `http://localhost:4566` y `http://localhost.floci.io:4566` apuntan al mismo emulador local. Se usa `localhost.floci.io` en `AWS_ENDPOINT_URL` porque es el alias que recomienda `floci doctor`; para comprobaciones directas sigue siendo válido `http://localhost:4566`.

Para mayor comodidad podemos añadir este contenido en `.bash_aliases`

```text title="use-floci"
use-floci() {
  export AWS_ACCESS_KEY_ID=test
  export AWS_SECRET_ACCESS_KEY=test
  export AWS_DEFAULT_REGION=eu-west-1
  export AWS_ENDPOINT_URL=http://localhost.floci.io:4566

  echo "AWS CLI configurada para Floci"
}
```

Posteriormente recargamos los alias con:

```shell title="Recargar alias"
source ~/.bash_aliases
```

Y ahora podemos preparar las variables de Floci para AWS CLI con este simple comando:

```shell title="Preparar variables Floci para AWS CLI"
use-floci
```

---

```shell title="Resultado esperado"
AWS CLI configurada para Floci
```

## Detener Floci

Si se inició mediante Docker Compose:

```shell title="Detener Floci con evaluación de políticas"
docker compose -f compose.floci.yaml down
```

Si se inició mediante CLI:

```shell title="Detener Floci"
floci stop
```

De la misma manera que antes, para hacer más cómodo el comando Compose vamos a realizar un alias.
En `.bash_aliases` ponemos el siguiente contenido tras el alias de inicio:

```text title=".bash_aliases"
alias floci-iam-stop='docker compose -f compose.floci.yaml down'
```

Recargamos los alias y ejecutamos el de parada para comprobar que detiene el entorno:

```shell title="Recargar alias"
source ~/.bash_aliases
```

```shell title="Detener Floci con evaluación de políticas"
floci-iam-stop
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/floci-iam-stop.png" alt="Detener Floci con evaluación de políticas" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Restablecer el entorno

El estado de Floci se conserva en el volumen `floci-data`.
Para eliminar completamente el estado del entorno, incluido el volumen:

```shell title="Eliminar completamente estado entorno Floci"
docker compose -f compose.floci.yaml down -v
```

Si el contenedor ya se detuvo con `down` sin `-v`, el volumen sigue existiendo. En ese caso, consultar los volúmenes:

```shell title="Consultar volúmenes"
docker volume ls
```

Eliminar únicamente el volumen de Floci:

```shell title="Eliminar volumen Floci"
docker volume rm seguidodoblado_floci-data
```

El nombre puede variar según el nombre del proyecto de Docker Compose. Sustituye `seguidodoblado_floci-data` por el que aparezca en `docker volume ls`.

!!! warning
    Eliminar el volumen borra usuarios, grupos, políticas, buckets, instancias y demás recursos locales de Floci.

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/eliminar-entorno-completo-floci.png" alt="Eliminar entorno completo Floci" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Alternancia con LocalStack

Floci y LocalStack utilizan el puerto 4566, por lo que no pueden ejecutarse simultáneamente.

### Alternar Floci

Si quieres Floci en modo normal:

```shell title="Alternar a Floci normal"
lstk stop
noendpoint
floci start
use-floci
```

Si necesitas evaluación de políticas:

```shell title="Alternar a Floci con evaluación de políticas"
lstk stop
noendpoint
floci-iam
use-floci
```

`use-floci` configura `AWS_ENDPOINT_URL=http://localhost.floci.io:4566` y las credenciales de AWS CLI.

### Alternar LocalStack

En caso de haber iniciado Floci de manera normal:

```shell title="Alternar con Floci iniciado normalmente"
floci stop
noendpoint
lstk start
use-localstack
```

En caso de haber iniciado Floci con evaluación de políticas:

```shell title="Alternar con Floci iniciado con evaluación de políticas"
floci-iam-stop
noendpoint
lstk start
use-localstack
```

`use-localstack` está definida en [04. LocalStack](04-localstack.md#configurar-aws-cli-para-localstack) y configura `AWS_ENDPOINT_URL=http://localhost.localstack.cloud:4566`.

!!! note
    `floci-iam` y `floci-iam-stop` utilizan `compose.floci.yaml` con ruta relativa. Ejecuta estos comandos desde el directorio en el que creaste el archivo, o usa una ruta absoluta.

Solo debe estar activo uno de los dos emuladores.

<!-- markdownlint-disable MD046 -->
!!! success "Resultado"
    Floci queda instalado y preparado dentro de la máquina virtual con:

    - Floci CLI 0.4.0 y servidor 2.4.0 (edición `floci-always-free`).
    - Docker como motor de ejecución.
    - Endpoint local en `http://localhost:4566` (`http://localhost.floci.io:4566` para AWS CLI).
    - Región de AWS CLI: `eu-west-1`.
    - IAM Policy Enforcement activado mediante Docker Compose.
    - Persistencia local mediante el volumen `floci-data`.
    - AWS CLI preparada para conectarse al emulador.
    
    El siguiente artículo documentará la instalación y configuración de LocalStack.
<!-- markdownlint-enable MD046 -->

---

!!! info "Acerca de este proyecto"
    - Esta documentación ha sido elaborada de forma independiente por **José Antonio Seguido Doblado** como material de estudio.
    - No constituye documentación oficial de Amazon Web Services (AWS).
!!! warning
    - Estos laboratorios no reproducen necesariamente todos los pasos de la consola real de AWS.
    - Las instrucciones se adaptarán al simulador local utilizado, manteniendo los objetivos y conceptos de la guía del laboratorio original.
