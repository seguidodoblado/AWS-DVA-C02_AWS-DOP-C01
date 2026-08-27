# Modelo de responsabilidad compartida de AWS

La seguridad en la nube se basa en un **modelo de responsabilidad compartida** entre AWS y el cliente.

AWS es responsable de la **seguridad de la nube** (*security of the cloud*), mientras que el cliente es responsable de la **seguridad en la nube** (*security in the cloud*).

La responsabilidad de cada parte depende del servicio utilizado, pero el principio fundamental siempre es el mismo: AWS protege la infraestructura que ejecuta los servicios, mientras que el cliente protege sus datos, identidades y configuraciones.

---

## Modelo de responsabilidades

```text
                 MODELO DE RESPONSABILIDAD COMPARTIDA

┌──────────────────────────────────────────────────────────────┐
│              RESPONSABILIDAD DEL CLIENTE                     │
├──────────────────────────────────────────────────────────────┤
│ • Datos del cliente                                          │
│ • Plataformas, aplicaciones e identidades                    │
│ • Gestión de identidades y accesos (IAM)                     │
│ • Sistemas operativos                                        │
│ • Configuración de red y firewall                            │
│ • Cifrado y autenticación                                    │
│ • Protección del tráfico de red                              │
└──────────────────────────────────────────────────────────────┘
                          ▲
                 Seguridad EN la nube
────────────────────────────────────────────────────────────────
                 Seguridad DE la nube
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                 RESPONSABILIDAD DE AWS                       │
├──────────────────────────────────────────────────────────────┤
│ • Software de los servicios                                  │
│ • Servicios de computación                                   │
│ • Servicios de almacenamiento                                │
│ • Servicios de bases de datos                                │
│ • Servicios de red                                           │
│ • Hardware e infraestructura global                          │
│ • Regiones                                                   │
│ • Zonas de disponibilidad                                    │
│ • Edge Locations                                             │
└──────────────────────────────────────────────────────────────┘
```

---

## Ejemplo

Una forma sencilla de comprender este modelo es compararlo con un edificio.

- **AWS** actúa como la empresa constructora. Es responsable de diseñar, construir y mantener el edificio para que sea seguro y estable.
- **El cliente** alquila un apartamento dentro del edificio. A partir de ese momento, es responsable de proteger sus pertenencias y de cerrar la puerta de su vivienda.

El edificio es seguro por diseño gracias a AWS, pero la seguridad del apartamento depende de cómo lo gestione el inquilino.

Del mismo modo:

- AWS protege la infraestructura física y lógica que soporta los servicios en la nube.
- El cliente protege sus datos, identidades, aplicaciones y la configuración de los recursos que utiliza.

---

## Ideas clave

- La seguridad es una responsabilidad compartida.
- AWS es responsable de la **seguridad de la nube**.
- El cliente es responsable de la **seguridad en la nube**.
- La responsabilidad del cliente aumenta a medida que administra más componentes de la infraestructura.

---

| Tipo de servicio                | Responsabilidad del cliente |
|---------------------------------|-----------------------------|
| Servicios altamente gestionados | Menor                       |
| Servicios menos gestionados     | Mayor                       |

> !!! note "Idea principal!
>
> Cuanto mayor es el nivel de gestión que ofrece AWS, menor es la responsabilidad operativa del cliente.
