# Módulo 0: Descripción general del curso

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="../../assets/AWS%20DVA-C02.webp" alt="Logotipo de AWS DVA-C02" width="128">
  <img src="../../assets/AWS%20DOP-C01.png" alt="Logotipo de AWS DOP-C01" width="128">
</p>
<!-- markdownlint-enable MD033 -->

## Mapa del curso

### [Módulo 1: Introducción a Amazon Web Services](modulos/01-introduccion-a-amazon-web-services.md)

Este módulo presenta:

- [Los conceptos fundamentales de la nube.](modulos/01-introduccion-a-amazon-web-services.md#que-es-la-computacion-en-la-nube)
- [Las ventajas de utilizar servicios en la nube.](modulos/01-introduccion-a-amazon-web-services.md#ventajas-de-la-computacion-en-la-nube)
- [La infraestructura global de AWS.](modulos/01-introduccion-a-amazon-web-services.md#aws-global-infrastructure)
- [AWS Identity and Access Management (IAM).](modulos/01-introduccion-a-amazon-web-services.md#aws-identity-and-access-management-iam)

---

### [Módulo 2: Computación en AWS](modulos/02-computacion-en-aws.md)

Este módulo presenta los principales servicios de computación de AWS:

- [Amazon Elastic Compute Cloud (Amazon EC2).](modulos/02-computacion-en-aws.md#amazon-elastic-compute-cloud)
- [AWS Lambda.](modulos/02-computacion-en-aws.md#aws-lambda)
- [Amazon Elastic Container Service (Amazon ECS).](modulos/02-computacion-en-aws.md#amazon-elastic-container-service)
- [Amazon Elastic Kubernetes Service (Amazon EKS).](modulos/02-computacion-en-aws.md#amazon-elastic-kubernetes-service)

El módulo explica distintas formas de ejecutar aplicaciones y cargas de trabajo en AWS, desde instancias virtuales hasta contenedores y funciones sin servidor.

---

### Módulo 3: Redes en AWS

Este módulo se centra en Amazon Virtual Private Cloud (Amazon VPC).
También aborda otras tecnologías de red utilizadas para:

- Crear redes privadas en AWS.
- Proteger los recursos.
- Controlar la comunicación entre componentes.
- Conectar una red privada con los recursos de AWS.

---

### Módulo 4: Almacenamiento en AWS

Este módulo presenta diferentes soluciones de almacenamiento:

- Amazon Simple Storage Service (Amazon S3).
- Amazon Elastic Block Store (Amazon EBS).
- Amazon Elastic File System (Amazon EFS).
- Amazon FSx.
- Almacenamiento de instancias de Amazon EC2.

El módulo explica cómo seleccionar una solución de almacenamiento según las necesidades de la aplicación.

---

### Módulo 5: Bases de datos

Este módulo presenta varios casos de uso relacionados con servicios de base de datos, con especial atención a:

- Amazon Relational Database Service (Amazon RDS).
- Amazon DynamoDB.

---

### Módulo 6: Monitorización, balanceo de carga y escalado

Este módulo explica cómo monitorizar y escalar aplicaciones mediante:

- Amazon CloudWatch.
- Elastic Load Balancing (ELB).
- Amazon EC2 Auto Scaling.

Estos servicios permiten observar el comportamiento de las aplicaciones, distribuir el tráfico y adaptar la capacidad según la demanda.

---

### Módulo 7: Resumen del curso

El último módulo resume los principales conceptos tratados durante el curso, especialmente:

- Los servicios fundamentales de AWS.
- La relación entre computación, redes y almacenamiento.
- Las bases de datos.
- La monitorización.
- El balanceo de carga.
- El escalado.

```mermaid
flowchart TD
    A["Introducción a AWS ⚗️"] --> B["Computación en AWS"]
    B --> C["Redes en AWS ⚗️"]
    C --> D["Almacenamiento en AWS"]
    D --> E["Bases de datos ⚗️"]
    E --> F["Monitorización, balanceo de carga y escalado ⚗️"]
    F --> G["Resumen del curso"]

    G --> H["Temas del módulo"]
    H --> H1["Resumen del curso"]
    H --> H2["Recursos adicionales"]
```

*Los módulos que contienen este símbolo ⚗️ disponen de laboratorio práctico.*

---

!!! info "Acerca de este proyecto"
    - Esta documentación ha sido elaborada de forma independiente por **José Antonio Seguido Doblado** como material de estudio.
    - No constituye documentación oficial de Amazon Web Services (AWS).
