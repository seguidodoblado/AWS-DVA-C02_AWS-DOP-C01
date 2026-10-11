# Labs Training Hub

<!-- markdownlint-disable MD033 -->
<p align="center">
  <img src="../../assets/AWS%20DVA-C02.webp" alt="Logotipo de AWS DVA-C02" width="128">
  <img src="../../assets/AWS%20DOP-C01.png" alt="Logotipo de AWS DOP-C01" width="128">
</p>
<!-- markdownlint-enable MD033 -->

Bienvenido a la sección práctica de los cursos de AWS.

Aquí se recogen las adaptaciones de los laboratorios oficiales para ejecutarlos en entornos locales mediante **Floci** y **LocalStack**.

---

## Laboratorios disponibles

<!-- markdownlint-disable MD033 -->
<div class="grid cards" markdown>

- :material-cloud-outline:{ .lg .middle } **AWS Technical Essentials**

    Laboratorios sobre IAM, VPC, EC2, S3, DynamoDB y alta disponibilidad.

    [:octicons-arrow-right-24: Acceder a los laboratorios](01-aws-technical-essentials/index.md)

- :material-language-javascript:{ .lg .middle } **Developing on AWS**

    Laboratorios relacionados con el desarrollo de aplicaciones mediante servicios de AWS.

    [:octicons-arrow-right-24: Acceder a los laboratorios](02-developing-on-aws/index.md)

- :material-code-braces:{ .lg .middle } **Advanced Developing on AWS**

    Laboratorios de desarrollo avanzado y diseño de aplicaciones en AWS.

    [:octicons-arrow-right-24: Acceder a los laboratorios](03-advanced-developing-on-aws/index.md)

- :material-server-network:{ .lg .middle } **Developing Serverless Solutions on AWS**

    Laboratorios sobre arquitecturas y aplicaciones sin servidor.

    [:octicons-arrow-right-24: Acceder a los laboratorios](04-developing-serverless-solutions/index.md)

- :material-cog-outline:{ .lg .middle } **DevOps Engineering on AWS**

    Laboratorios de automatización, integración continua, entrega continua y operaciones.

    [:octicons-arrow-right-24: Acceder a los laboratorios](05-devops-engineering-on-aws/index.md)

- :material-kubernetes:{ .lg .middle } **Running Containers on Amazon EKS**

    Laboratorios sobre contenedores, Kubernetes y Amazon EKS.

    [:octicons-arrow-right-24: Acceder a los laboratorios](06-running-containers-on-eks/index.md)

- :material-creation:{ .lg .middle } **Generative AI Essentials on AWS**

    Laboratorios introductorios sobre inteligencia artificial generativa en AWS.

    [:octicons-arrow-right-24: Acceder a los laboratorios](07-generative-ai-essentials-on-aws/index.md)

- :material-brain:{ .lg .middle } **Developing Generative AI Applications on AWS**

    Laboratorios para desarrollar aplicaciones de inteligencia artificial generativa.

    [:octicons-arrow-right-24: Acceder a los laboratorios](08-developing-generative-ai-applications/index.md)

</div>
<!-- markdownlint-disable MD033 -->

---

## Entornos locales

Los laboratorios se podrán ejecutar utilizando:

- **Floci**, como emulador local principal.
- **LocalStack**, cuando sea necesario comparar comportamientos o utilizar servicios no disponibles en Floci.
- **AWS CLI**, para interactuar con los servicios simulados.
- **AWS SDKs**, cuando el laboratorio original utilice código.

---

## Estructura de cada laboratorio

Cada laboratorio adaptado incluirá:

1. Objetivos originales.
2. Servicios utilizados.
3. Requisitos del entorno local.
4. Preparación del simulador.
5. Tareas adaptadas.
6. Comandos para Floci o LocalStack.
7. Comprobaciones de resultados.
8. Diferencias respecto al laboratorio real de AWS.
9. Limpieza del entorno.

---

!!! info "Acerca de este proyecto"
    - Esta documentación ha sido elaborada de forma independiente por **José Antonio Seguido Doblado** como material de estudio.
    - No constituye documentación oficial de Amazon Web Services (AWS).
!!! warning
    - Estos laboratorios no reproducen necesariamente todos los pasos de la consola real de AWS.
    - Las instrucciones se adaptarán al simulador local utilizado, manteniendo los objetivos y conceptos de la guía del laboratorio original.
