# Infraestructura global de AWS

La infraestructura global de AWS está formada por una red de centros de datos distribuidos por todo el mundo. Esta infraestructura permite ejecutar aplicaciones cerca de los usuarios, mejorar la disponibilidad y reducir la latencia.

---

## Regiones (Regions)

Una **Región de AWS** es un área geográfica física que contiene uno o varios centros de datos independientes.

Cada región está completamente aislada de las demás para proporcionar tolerancia a fallos y cumplir requisitos de residencia de datos.

Al seleccionar una región para desplegar recursos, es importante considerar aspectos como:

- Latencia.
- Cumplimiento normativo.
- Disponibilidad de servicios.
- Coste.

---

## Zonas de disponibilidad (Availability Zones)

Cada región está formada por **tres o más Zonas de disponibilidad (AZ)**.

Cada Zona de disponibilidad es un conjunto de uno o varios centros de datos físicamente independientes, con alimentación eléctrica, refrigeración y conectividad de red redundantes.

Las aplicaciones pueden distribuirse entre varias zonas de disponibilidad para aumentar su disponibilidad y tolerancia a fallos.

```text
Infraestructura global

Región
   │
   ├──────────────┐
   ▼              ▼
AZ 1           AZ 2
```

---

## Ubicaciones de borde (Edge Locations)

Las **Edge Locations** son ubicaciones distribuidas globalmente que acercan el contenido y determinados servicios de AWS a los usuarios finales.

Se utilizan principalmente para reducir la latencia y acelerar la entrega de contenido mediante servicios como **Amazon CloudFront** o para responder consultas DNS con baja latencia mediante **Amazon Route 53**.

Actualmente AWS dispone de cientos de Edge Locations repartidas por todo el mundo.

```text
                  Región AWS

                     │
                     │
     ┌───────────────┼───────────────┐
     │               │               │

 Edge Location   Edge Location   Edge Location
   (América)       (Europa)         (Asia)

     │               │               │

 Cliente        Cliente         Cliente

Las Edge Locations se distribuyen globalmente para acercar el contenido
a los usuarios y reducir la latencia.
```

---

## Componentes de la infraestructura global

```text
                     Infraestructura global de AWS
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
        Regiones          Zonas de          Edge
                           disponibilidad   Locations
             │                 │                 │
             │                 │                 │
   Área geográfica      Centros de datos   Caché y entrega
      independiente        redundantes       de contenido
```

---
