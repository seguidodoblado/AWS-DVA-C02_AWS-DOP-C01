# Módulo 4: LocalStack

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="../../../assets/AWS%20DVA-C02.png" alt="Logotipo de AWS DVA-C02" width="128">
  <img src="../../../assets/AWS%20DOP-C01.png" alt="Logotipo de AWS DOP-C01" width="128">
</p>
<!-- markdownlint-enable MD033 -->

## Objetivo

Instalar LocalStack dentro de la máquina virtual y dejarlo preparado como entorno alternativo a Floci.
LocalStack se ejecutará mediante la CLI oficial `lstk`, que gestionará el contenedor Docker y la autenticación. El endpoint principal será el puerto 4566.

!!! warning
    LocalStack y Floci no deben ejecutarse simultáneamente porque utilizan el mismo puerto principal.

## Requisitos previos

- Linux Mint Cinnamon 22.3.
- Docker Engine instalado.
- AWS CLI v2 instalado.
- `curl` instalado.
- Conexión a Internet.
- Cuenta de LocalStack con licencia activa.

Comprobar Docker:

```shell title="Comprobar versión Docker"
docker --version
```

Comprobar AWS CLI:

```shell title="Comprobar versión AWS CLI"
aws --version
```

## Instalar Node.js mediante nvm

La CLI `lstk` se instalará mediante npm. Para evitar incompatibilidades entre las versiones del sistema, se utilizará nvm.
Instalar nvm:

```shell title="Instalar nvm"
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

!!! warning
    El instalador se descarga y ejecuta directamente desde Internet. En un entorno sensible conviene revisar previamente el contenido del script.

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/instalar-nvm.png" alt="Instalar nvm" class="zoomable">
<!-- markdownlint-enable MD033 -->

Recargar Bash:

```shell title="Recargar Bash"
source ~/.bashrc
```

Comprobar que nvm está disponible:

```shell title="Comprobar disponibilidad nvm"
command -v nvm
```

Instalar Node.js LTS:

```shell title="Instalar Node.js LTS"
nvm install --lts
```

Activar la versión LTS:

```shell title="Activar la versión Node.js LTS"
nvm use --lts
```

Comprobar las versiones:

```shell title="Comprobar versión Node.js"
node --version
```

---

```shell title="Comprobar versión npm"
npm --version
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/comprobar-versiones-node-npm.png" alt="Comprobar versiones Node.js y npm" class="zoomable">
<!-- markdownlint-enable MD033 -->

Comprobar las rutas:

```shell title="Comprobar ruta ejecutable Node.js"
command -v node
```

---

```shell title="Comprobar ruta ejecutable npm"
command -v npm
```

Las rutas deben apuntar normalmente a un directorio gestionado por nvm:

```shell title="Resultado esperado"
/home/usuario/.nvm/versions/node/...
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/rutas-ejecutables-node-npm.png" alt="Comprobar rutas ejecutables Node.js y npm" class="zoomable">
<!-- markdownlint-enable MD033 -->

<!-- markdownlint-disable MD046 -->
!!! warning "No ejecutar:"
    `sudo npm install -g npm`

    La versión más reciente de npm puede exigir una versión de Node.js más nueva. Además los paquetes instalados mediante nvm no deben instalarse con sudo.
<!-- markdownlint-enable MD046 -->

## Instalar la CLI `lstk`

Instalar la CLI de LocalStack:

```shell title="Instalar CLI lstk"
npm install -g @localstack/lstk
```

Comprobar la versión:

```shell title="Comprobar versión CLI lstk"
lstk --version
```

Resultado esperado:

```shell title="Resultado esperado"
lstk 1.4.3
```

Comprobar la ubicación:

```shell title="Comprobar ruta ejecutable CLI lstk"
command -v lstk
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/instalar-lstk.png" alt="Instalar CLI lstk" class="zoomable">
<!-- markdownlint-enable MD033 -->

!!! note
    La CLI antigua `localstack` está deprecada. En este entorno se utilizará `lstk`.

## Comprobar el entorno

Antes de iniciar LocalStack:

```shell title="Comprobar entorno lstk"
lstk doctor
```

El diagnóstico comprueba:

- Docker y su entorno.
- Conectividad de red.
- Recursos disponibles.
- Espacio de almacenamiento.
- Configuración necesaria para iniciar el emulador.

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/lstk-doctor.png" alt="Comprobar entorno lstk" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Autenticación

La primera vez que se ejecute `lstk start` (en la sección siguiente) puede abrirse un proceso de autenticación en el navegador. Complétalo si la CLI lo solicita.

## Configurar IAM Policy Enforcement

Por defecto, LocalStack no aplica completamente las políticas IAM. Para los laboratorios que lo requieran, se activará el motor de evaluación mediante:

```toml title="Variable de evaluación de políticas"
ENFORCE_IAM=1
```

`lstk` permite transmitir variables al contenedor mediante perfiles definidos en su archivo `config.toml`.

### Localizar el archivo de configuración

```shell title="Localizar archivo configuración LocalStack"
lstk config path
```

En Linux, la ruta habitual es:

```shell title="Resultado esperado"
~/.config/lstk/config.toml
```

Si el archivo todavía no existe, se puede crear:

```shell title="Crear config.toml"
mkdir -p ~/.config/lstk
nano ~/.config/lstk/config.toml
```

### Configuración recomendada

Contenido:

```toml title="config.toml"
[[containers]]
type = "aws"
tag = "latest"
port = "4566"
env = ["iam-enforcement"]

[env.iam-enforcement]
DEBUG = "1"
ENFORCE_IAM = "1"
```

Esta configuración indica a `lstk` que:

- utilice el emulador AWS;
- publique el endpoint en el puerto 4566;
- active el perfil `iam-enforcement`;
- establezca `ENFORCE_IAM=1` dentro del contenedor;
- active `DEBUG=1` para facilitar el diagnóstico.

## Iniciar LocalStack

Antes de iniciar LocalStack, eliminar cualquier endpoint previamente definido:

```shell title="Eliminar endpoint"
unset AWS_ENDPOINT_URL
```

Comprobarlo:

```shell title="Comprobar que no existe endpoint"
echo "$AWS_ENDPOINT_URL"
```

La salida debe estar vacía.

Iniciar LocalStack:

```shell title="Iniciar LocalStack"
lstk start
```

La primera ejecución puede solicitar autenticación y preguntar qué emulador utilizar. Selecciona `AWS`. La CLI arranca el contenedor configurado en `config.toml`; si cambias la configuración, el propio `lstk` indica que se edite en `.config/lstk/config.toml`.

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/lstk-start.png" alt="Iniciar lstk" class="zoomable">
<!-- markdownlint-enable MD033 -->

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/lstk-start-1.png" alt="Iniciar lstk" class="zoomable">
<!-- markdownlint-enable MD033 -->

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/lstk-start-2.png" alt="Iniciar lstk" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Comprobar el estado

```shell title="Comprobar estado LocalStack"
lstk status
```

El resultado debe indicar que el emulador AWS está ejecutándose y que el endpoint es accesible. En este entorno, la salida muestra el contenedor `localstack-aws` y la versión `2026.10.4`.

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/lstk-status.png" alt="Estado de LocalStack" class="zoomable">
<!-- markdownlint-enable MD033 -->

Comprobar también el contenedor Docker:

```shell title="Comprobar contenedor Docker"
docker ps
```

El nombre del contenedor lo gestiona `lstk`. En este entorno se llama `localstack-aws`, aunque puede variar.
En caso de estar todo correcto, LocalStack estará accesible desde:

[https://app.localstack.cloud](https://app.localstack.cloud)

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/localstack-pantalla-inicial.png" alt="Pantalla inicial de LocalStack" class="zoomable">
<!-- markdownlint-enable MD033 -->

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/localstack-dashboard.png" alt="Dashboard LocalStack" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Comprobar IAM Policy Enforcement

Obtener el nombre del contenedor:

```shell title="Obtener nombre contenedor"
docker ps --format '{{.Names}}'
```

Inspeccionar sus variables:

```shell title="Inspeccionar variables contenedor"
docker inspect localstack-aws \
  --format '{{range .Config.Env}}{{println .}}{{end}}' \
  | grep ENFORCE_IAM
```

Sustituye `localstack-aws` por el nombre que devuelva `docker ps` si es diferente.

Resultado esperado:

```shell title="Resultado esperado"
ENFORCE_IAM=1
```

La presencia de esta variable dentro del contenedor confirma que `lstk` ha aplicado el perfil correctamente.

!!! note
    No es obligatorio que los logs muestren un mensaje IAM durante el arranque. La comprobación principal es verificar `ENFORCE_IAM=1` dentro del contenedor y realizar posteriormente una prueba funcional de permisos.

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/verificar-variable-iam.png" alt="Verificar variable IAM" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Comprobar el endpoint

Comprobar el estado del endpoint:

```shell title="Comprobar estado endpoint"
curl http://localhost:4566/_localstack/health
```

También se puede utilizar AWS CLI:

```shell title="Comprobar estado AWS CLI"
AWS_ACCESS_KEY_ID=test \
AWS_SECRET_ACCESS_KEY=test \
AWS_DEFAULT_REGION=eu-west-1 \
aws --endpoint-url=http://localhost:4566 \
sts get-caller-identity
```

Resultado esperado:

```json title="Resultado esperado"
{
    "UserId": "000000000000",
    "Account": "000000000000",
    "Arn": "arn:aws:iam::000000000000:root"
}
```

Comprobar IAM:

```shell title="Comprobar IAM"
AWS_ACCESS_KEY_ID=test \
AWS_SECRET_ACCESS_KEY=test \
AWS_DEFAULT_REGION=eu-west-1 \
aws --endpoint-url=http://localhost:4566 \
iam list-users
```

En un entorno nuevo, la lista debería estar vacía:

```json title="Resultado esperado"
{
    "Users": []
}
```

## Configurar AWS CLI para LocalStack

Después de iniciar LocalStack, se puede configurar la sesión para dirigir AWS CLI al endpoint local:

```shell title="Configurar AWS CLI con endpoint local"
export AWS_ENDPOINT_URL='http://localhost.localstack.cloud:4566'
export AWS_DEFAULT_REGION='eu-west-1'
export AWS_ACCESS_KEY_ID='test'
export AWS_SECRET_ACCESS_KEY='test'
```

Comprobar:

```shell title="Comprobar variable endpoint"
echo "$AWS_ENDPOINT_URL"
```

Para una mayor comodidad podemos generar el siguiente contenido en `.bash_aliases`.

```text title=".bash_aliases"
alias noendpoint='unset AWS_ENDPOINT_URL'

use-localstack() {
  export AWS_ACCESS_KEY_ID=test
  export AWS_SECRET_ACCESS_KEY=test
  export AWS_DEFAULT_REGION=eu-west-1
  export AWS_ENDPOINT_URL=http://localhost.localstack.cloud:4566

  echo "AWS CLI configurada para LocalStack"
}
```

El alias `noendpoint` elimina `AWS_ENDPOINT_URL` de la sesión actual.

Recargamos los alias:

```shell title="Recargar alias"
source ~/.bash_aliases
```

Después podemos invocar:

```shell title="Configurar variables LocalStack en AWS CLI"
use-localstack
```

`AWS_ENDPOINT_URL` no debe estar definida al ejecutar `lstk start`, porque `lstk` gestiona su propio contenedor local. Se configura después de iniciar LocalStack.

!!! note
    `http://localhost:4566` y `http://localhost.localstack.cloud:4566` apuntan al mismo emulador local. Se usa el alias `localhost.localstack.cloud` en `AWS_ENDPOINT_URL` porque es el que muestra `lstk status`; para comprobaciones directas con `curl` o `aws --endpoint-url` sigue siendo válido `http://localhost:4566`.

También se puede evitar la variable y especificar siempre el endpoint:

```shell title="Especificar endpoint"
aws --endpoint-url=http://localhost:4566 sts get-caller-identity
```

## Detener LocalStack

```shell title="Detener LocalStack"
lstk stop
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/lstk-stop.png" alt="Detener LocalStack" class="zoomable">
<!-- markdownlint-enable MD033 -->
Comprobar que se ha detenido:

```shell title="Comprobar estado LocalStack"
lstk status
```

## Restablecer el entorno

Para eliminar el estado del emulador AWS local, se puede utilizar el mecanismo de reset de `lstk`.

```shell title="Resetear LocalStack"
lstk reset
```

Consultar la ayuda si se necesita confirmar las opciones:

```shell title="Ayuda resetear LocalStack"
lstk reset --help
```

!!! warning
    El restablecimiento elimina los recursos locales de LocalStack, como usuarios, políticas, buckets, tablas e instancias.

## Alternancia con Floci

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

`use-localstack` configura `AWS_ENDPOINT_URL=http://localhost.localstack.cloud:4566` y las credenciales de AWS CLI.

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

`use-floci` está definida en [03. Floci](03-floci.md#configuracion-de-aws-cli-para-floci) y configura `AWS_ENDPOINT_URL=http://localhost.floci.io:4566`.

!!! note
    `floci-iam` y `floci-iam-stop` utilizan `compose.floci.yaml` con ruta relativa. Ejecuta estos comandos desde el directorio en el que creaste el archivo, o usa una ruta absoluta.

Solo debe estar activo uno de los dos emuladores.

<!-- markdownlint-disable MD046 -->
!!! success "Resultado"
    LocalStack queda instalado y preparado dentro de la máquina virtual con:

    - Node.js LTS gestionado mediante nvm.
    - npm compatible con Node.js.
    - CLI `lstk` 1.4.3.
    - Autenticación gestionada por `lstk`.
    - Docker como motor de ejecución.
    - IAM Policy Enforcement activado mediante un perfil de `config.toml`.
    - Endpoint local en `http://localhost:4566` (`http://localhost.localstack.cloud:4566` para AWS CLI).
    - Región usada por AWS CLI: `eu-west-1`.
    - Persistencia y reset gestionados por `lstk`.
    - AWS CLI preparada para conectarse al emulador.

    No es necesario utilizar Docker Compose para LocalStack en la evaluación de políticas. Compose se reserva para Floci, mientras que LocalStack se inicia y configura mediante `lstk`.
<!-- markdownlint-enable MD046 -->

---

!!! info "Acerca de este proyecto"
    - Esta documentación ha sido elaborada de forma independiente por **José Antonio Seguido Doblado** como material de estudio.
    - No constituye documentación oficial de Amazon Web Services (AWS).
!!! warning
    - Estos laboratorios no reproducen necesariamente todos los pasos de la consola real de AWS.
    - Las instrucciones se adaptarán al simulador local utilizado, manteniendo los objetivos y conceptos de la guía del laboratorio original.
