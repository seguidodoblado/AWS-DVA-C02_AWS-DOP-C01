# Módulo 2: AWS CLI v2

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="../../../assets/AWS%20DVA-C02.png" alt="Logotipo de AWS DVA-C02" width="128">
  <img src="../../../assets/AWS%20DOP-C01.png" alt="Logotipo de AWS DOP-C01" width="128">
</p>
<!-- markdownlint-enable MD033 -->

## Objetivo

Instalar AWS CLI v2 dentro de la máquina virtual Linux y verificar que funciona correctamente antes de conectarla a Floci o LocalStack.
AWS CLI se utilizará posteriormente para administrar los servicios simulados mediante sus APIs compatibles con AWS.

## Requisitos previos

- Linux Mint Cinnamon 22.3.
- Arquitectura x86_64 o amd64.
- `curl` instalado.
- Acceso a Internet.
- Permisos para modificar la configuración del usuario.

Comprobar la arquitectura:

```shell title="Comprobar la arquitectura"
uname -m
```

Para esta guía se espera:

```shell title="Resultado esperado"
x86_64
```

## Instalar AWS CLI v2

AWS proporciona un instalador oficial para Linux. El instalador actual instala AWS CLI para el usuario actual y coloca el ejecutable en `~/.local/bin`.
Ejecutar:

```shell title="Instalar AWS CLI v2"
curl -fsSL https://awscli.amazonaws.com/v2/install.sh | bash
```

Si la instalación finaliza correctamente, debería aparecer un mensaje indicando que AWS CLI si ha instalado.

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/instalar-aws-cli.png" alt="Instalar AWS CLI v2" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Comprobar el PATH

Comprobar si el directorio de instalación está disponible:

```shell title="Comprobar path"
echo "$PATH"
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/comprobar-path.png" alt="Comprobar PATH" class="zoomable">
<!-- markdownlint-enable MD033 -->

Si `~/.local/bin` no aparece en el resultado, añadirlo temporalmente:

```shell title="Añadir PATH"
export PATH="$HOME/.local/bin:$PATH"
```

Para hacerlo permanente en Bash:

```shell title="Añadir PATH de manera permanente"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
```

Recargar la configuración:

```shell title="Recargar configuración"
source ~/.bashrc
```

## Verificar la instalación

Consultar la versión:

```shell title="Comprobar versión AWS CLI"
aws --version
```

El resultado debe comenzar por:

```shell title="Resultado esperado"
aws-cli/2
```

Un resultado completo puede tener este formato:

```shell title="Formato de resultado a versión de AWS CLI"
aws-cli/2.x.x Python/3.x.x Linux/... exe/x86_64
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/aws-cli-version.png" alt="Comprobar versión AWS CLI v2" class="zoomable">
<!-- markdownlint-enable MD033 -->

La versión exacta puede variar porque el instalador obtiene la versión más reciente disponible.
Comprobar también la ruta del ejecutable:

```shell title="Comprobar ruta ejecutable"
command -v aws
```

Ejemplo:

```shell title="Resultado esperado"
/home/usuario/.local/bin/aws
```

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/aws-cli-ruta-ejecutable.png" alt="Comprobar ruta ejecutable AWS CLI v2" class="zoomable">
<!-- markdownlint-enable MD033 -->

## Verificar la ayuda

```shell title="Ayuda AWS CLI"
aws help
```

La ayuda debe mostrar los comandos principales de AWS  CLI.

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/aws-help.png" alt="Ayuda de AWS CLI v2" class="zoomable">
<!-- markdownlint-enable MD033 -->

Para consultar la ayuda de un servicio concreto:

```shell title="Ayuda AWS CLI sobre S3"
aws s3 help
```

---

```shell title="Ayuda AWS CLI sobre EC2"
aws ec2 help
```

---

```shell title="Ayuda AWS CLI sobre IAM"
aws iam help
```

## Comprobar que se utiliza AWS CLI v2

```shell title="Comprobar v2 en AWS CLI"
aws --version | grep -o 'aws-cli/2'
```

Si devuelve:

```shell title="Resultado esperado"
aws-cli/2
```

la instalación corresponde a la versión 2.

## Configuración de credenciales

En este artículo no se configura todavía una cuenta AWS real ni un emulador local.
La configuración de enpoints, perfiles y credenciales ficticias se realizará en el artículo de configuración común del entorno.

!!! warning
    No ejecutar `aws login` durante la configuración de Floci o LocalStack.  
    Ese comando inicia un proceso de autenticación contra AWS real.

Los emuladores utilizarán posteriormente credenciales de prueba, por ejemplo:

```shell title="Credenciales AWS de prueba"
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

Estas credenciales no proporcionan acceso a una cuenta AWS real cuando se utilizan con el endpoint local correcto.

<!-- markdownlint-disable MD046 -->
!!! success "Resultado"
    La VM ya dispone de:

     - AWS CLI v2 instalado.
     - Ejecutable AWS disponible en el PATH.
     - Soporte para los comandos de IAM, S3, EC2 y otros servicios.
     - Preparación suficiente para conectarse posteriormente a Floci y LocalStack

    El siguiente artículo documentará la instalación y configuración de Floci.
<!-- markdownlint-enable MD046 -->

---

!!! info "Acerca de este proyecto"
    - Esta documentación ha sido elaborada de forma independiente por **José Antonio Seguido Doblado** como material de estudio.
    - No constituye documentación oficial de Amazon Web Services (AWS).
!!! warning
    - Estos laboratorios no reproducen necesariamente todos los pasos de la consola real de AWS.
    - Las instrucciones se adaptarán al simulador local utilizado, manteniendo los objetivos y conceptos de la guía del laboratorio original.
