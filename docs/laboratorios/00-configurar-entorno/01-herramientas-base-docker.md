# Módulo 1. Herramientas básicas y Docker

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="../../../assets/AWS%20DVA-C02.webp" alt="Logotipo de AWS DVA-C02" width="128">
  <img src="../../../assets/AWS%20DOP-C01.png" alt="Logotipo de AWS DOP-C01" width="128">
</p>
<!-- markdownlint-enable MD033 -->

## Instalar herramientas básicas

Instalar los paquetes necesarios para añadir repositorios y descargar archivos:

```shell title="Instalar herramientas básicas"
sudo apt install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release \
  unzip \
  git \
  jq
```

Comprobar que están disponibles:

```shell title="Comprobar herramientas básicas"
curl --version
git --version
jq --version
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/comprobar-herramientas-basicas.png" alt="Comprobar herramientas básicas" class="zoomable">
<!-- markdownlint-enable MD033 -->

---

## Instalar Docker Engine

### Añadir la clave oficial de Docker

```shell title="Crear directorio /etc/apt/keyrings"
sudo install -m 0755 -d /etc/apt/keyrings
```

---

```shell title="Descargar clave oficial de Docker"
sudo curl -fsSL \
  https://download.docker.com/linux/ubuntu/gpg \
  -o /etc/apt/keyrings/docker.asc
```

---

```shell title="Dar permisos a clave oficial"
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

### Añadir el repositorio de Docker

```shell title="Añadir repositorio Docker"
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$UBUNTU_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Actualizar la información de paquetes:

```shell title="Actualizar información paquetes"
sudo apt update
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/preparar-repositorio-docker.png" alt="Preparar repositorio Docker" class="zoomable">
<!-- markdownlint-enable MD033 -->

### Instalar Docker y Docker Compose

```shell title="Instalar Docker y Docker Compose"
sudo apt install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/instalar-docker.png" alt="Instalar Docker" class="zoomable">
<!-- markdownlint-enable MD033 -->

### Comprobar el servicio Docker

```shell title="Comprobar servicio Docker"
sudo systemctl status docker
```

El servicio debe aparecer como:

```shell title="Estado correcto servicio Docker"
active (running)
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/comprobar-docker.png" alt="Comprobar servicio Docker" class="zoomable">
<!-- markdownlint-enable MD033 -->

Si no estuviera iniciado:

```shell title="Iniciar servicio Docker"
sudo systemctl start docker
```

Para que Docker se inicie automáticamente con la VM:

```shell title="Habilitar inicio automático Docker"
sudo systemctl enable docker
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/habilitar-inicio-automatico-docker.png" alt="Habilitar inicio automático Docker" class="zoomable">
<!-- markdownlint-enable MD033 -->

### Ejecutar Docker sin sudo

Añadir el usuario actual el grupo Docker:

```shell title="Añadir usuario a grupo Docker"
sudo usermod -aG docker "$USER"
```

---

```shell title="Aplicar permisos Docker sin reinicio"
newgrp docker
```

---

```shell title="Comprobar pertenencia el grupo docker"
groups
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/comprobar-grupo-docker.png" alt="Comprobar grupo Docker" class="zoomable">
<!-- markdownlint-enable MD033 -->

Comprobar que Docker funciona sin privilegios elevados:

```shell title="Comprobar Docker sin privilegios elevados"
docker run hello-world
```

El comando debe descargar la imagen de prueba y mostrar un mensaje confirmando que Docker funciona correctamente.

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/comprobar-funciona-docker.png" alt="Comprobar funcionamiento Docker" class="zoomable">
<!-- markdownlint-enable MD033 -->

### Comprobar versiones

```shell title="Comprobar versión Docker"
docker --version
```

---

```shell title="Comprobar versión Docker Compose"
docker compose version
```

Resultado esperado:

```shell title="Resultado esperado versiones Docker y Docker Compose"
Docker version ...
Docker Compose version v2...
```

Ejemplo:

<!-- markdownlint-disable MD033 -->
<!-- cSpell:disable-next-line -->
<img src="../../../assets/versiones-docker.png" alt="Versiones Docker y Docker Compose" class="zoomable">
<!-- markdownlint-enable MD033 -->

---

<!-- markdownlint-disable MD046 -->
!!! success "Resultado"
    La máquina virtual ya dispone de:

    - Docker Engine.
    - Docker CLI.
    - Docker Buildx.
    - Docker Compose como plugin.
    - Permisos para ejecutar Docker sin `sudo`.

    Los emuladores Floci y LocalStack se ejecutarán posteriormente como contenedores Docker.
<!-- markdownlint-enable MD046 -->

---

!!! info "Acerca de este proyecto"
    - Esta documentación ha sido elaborada de forma independiente por **José Antonio Seguido Doblado** como material de estudio.
    - No constituye documentación oficial de Amazon Web Services (AWS).
!!! warning
    - Estos laboratorios no reproducen necesariamente todos los pasos de la consola real de AWS.
    - Las instrucciones se adaptarán al simulador local utilizado, manteniendo los objetivos y conceptos de la guía del laboratorio original.
