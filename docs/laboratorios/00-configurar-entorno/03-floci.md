# Módulo 3: Floci

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="../../../assets/AWS%20DVA-C02.webp" alt="Logotipo de AWS DVA-C02" width="128">
  <img src="../../../assets/AWS%20DOP-C01.png" alt="Logotipo de AWS DOP-C01" width="128">
</p>
<!-- markdownlint-enable MD033 -->

## Objetivo

Instalar Floci Community dentro de la máquina virtual y dejarlo preparado para ejecutar los laboratorios AWS localmente.
Floci se ejecutará mediante Docker y expondrá sus servicios AWS a través del puerto 4566.

## Requisitos previos

- Linux Mint Cinnamon 22.3.
- Docker Engine instalado.
- Docker Compose instalado.
- AWS CLI v2 instalado.
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
Floci 2.4.0
```

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
Version:    2.2.0
```

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
```

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
  | grep FLOCI_SERVICES_IAM_ENFORCEMENT_ENABLED
```

Resultado esperado:

```shell title="Resultado esperado"
FLOCI_SERVICES_IAM_ENFORCEMENT_ENABLED=true
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

Al comenzar, lista debería estar vacía:

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
export AWS_ENDPOINT_URL="http://localhost::4566'
```

## Detener Floci

Si se inicio mediante Docker Compose:

```shell title="Detener Floci con evaluación de políticas"
docker compose -f compose.floci.yaml down
```

Si se inicio mediante CLI:

```shell title="Detener Floci"
floci stop
```

De la misma manera que antes, para hacer más cómodo el comando Compose vamos a realizar un alias.
En `.bash_aliases` ponemos el siguiente contenido tras el alias de inicio:

```text title=".bash_aliases"
alias floci-iam-stop='docker compose -f compose.floci.yaml down'
```

Y volver a hacer efectivo el alias que acabamos de crear:

```shell title="Activa alias"
floci-iam-stop
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/floci-iam-stop.png" alt="Detener Floci con evaluación de políticas" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Restablecer el entorno

El estado de Floci se conserva en el volumen `floci-data`.
Para eliminar completamente el estado del entorno:

```shell title="Eliminar completamente estado entorno Floci"
docker compose -f compose.floci.yaml down
```

Consultar los volúmenes:

```shell title="Consultar volúmenes"
docker volume ls
```

Eliminar únicamente el volumen de Floci:

```shell title="Eliminar volumen Floci"
docker volume rm seguidodoblado_floci-data
```

El nombre puede variar según el nombre del proyecto de Docker Compose.

!!! warning
    Eliminar el volumen borra usuarios, grupos, políticas, buckets, instancias y demás recursos locales de Floci.

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/eliminar-entorno-completo-floci.png" alt="Eliminar entorno completo Floci" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Alternancia con LocalStack

Floci y LocalStack utilizar el puerto 4566, por lo que no pueden ejecutarse simultáneamente.
Para iniciar Floci:

```shell title="Iniciar Floci"
floci start
```

En caso de necesitar evaluación de políticas:

```shell title="Iniciar Floci con evaluación de políticas"
floci-iam
```

Para detenerlo:

```shell title="Detener Floci"
floci stop
```

En caso de haber iniciado el motor de evaluación de políticas:

```shell title="Detener Floci con evaluación de políticas"
floci-iam-stop
```

Antes de iniciar LocalStack, Floci debe estar detenido.

<!-- markdownlint-disable MD046 -->
!!! success "Resultado"
    Floci queda instalado y preparado dentro de la máquina virtual con:

    - Floci Community 2.2.0.
    - Docker como motor de ejecución.
    - Endpoint local en `http://localhost:4566`.
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
