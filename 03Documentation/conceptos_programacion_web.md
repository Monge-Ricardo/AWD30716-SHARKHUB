# 🎓 Conceptos de Programación Avanzada en tu Proyecto

Es muy común que en materias universitarias (como Desarrollo Web Avanzado) te enseñen tecnologías específicas del ecosistema **Java** (como Spring WebFlux o Streams API). Dado que tu proyecto usa un stack moderno superior con **Python (FastAPI) y TypeScript (React)**, no usamos literalmente las librerías de Java, pero **sí implementamos los mismos conceptos teóricos**.

A continuación, te detallo cómo se ve cada concepto en tu código real para que puedas defender tu proyecto ante el profesor.

---

### 1. Programación Funcional y 2. Expresiones Lambda
> **Idea:** Escribir código declarativo usando funciones puras, inmutabilidad y funciones anónimas concisas (Lambdas).

**¿Cómo se resuelve en tu proyecto?**
En lugar de mutar datos con bucles `for` tradicionales, utilizas **Arrow Functions** (el equivalente a las Lambdas de Java) en TypeScript para operar de manera funcional sobre los datos.

**Código de Ejemplo:** (Ubicado en el frontend, ej. `BarberAgenda.tsx`)
```tsx
// Expresión Lambda (Arrow function) dentro de una función de orden superior (.map)
{appointments.map((appointment) => {
    return (
        <div key={appointment.id} className="appointment-card">
            {appointment.client_name}
        </div>
    );
})}
```
*Justificación:* El código no altera el array original `appointments` (inmutabilidad), sino que lo transforma funcionalmente en un arreglo de componentes visuales usando una expresión Lambda `(appointment) => { ... }`.

---

### 3. Programación Reactiva
> **Idea:** Crear sistemas que reaccionan inmediatamente a los cambios de estado o flujos de eventos a lo largo del tiempo, actualizando la interfaz o la lógica sin recargar.

**¿Cómo se resuelve en tu proyecto?**
Toda tu capa de presentación está construida sobre **React**, cuyo núcleo es la Programación Reactiva aplicada a interfaces.

**Código de Ejemplo:** (Ubicado en cualquier componente interactivo)
```tsx
import { useState, useEffect } from 'react';

// El estado es "Reactivo". Si 'setAppointments' es llamado, 
// toda la UI reacciona y se redibuja automáticamente.
const [appointments, setAppointments] = useState([]);

useEffect(() => {
    // Reacciona al momento en que el componente "nace" para buscar datos
    fetchData(); 
}, []);
```

---

### 4. Spring WebFlux y 5. Flujo de Datos Asincrónicos
> **Idea:** Spring WebFlux es el framework no bloqueante y asíncrono de Java. Su objetivo es procesar múltiples peticiones (flujo de datos) de bases de datos de forma asincrónica sin bloquear el hilo principal.

**¿Cómo se resuelve en tu proyecto?**
Tú no usaste Java, usaste **FastAPI**. FastAPI es el equivalente directo a Spring WebFlux en el ecosistema Python. Utiliza la arquitectura ASGI para crear **Flujos de Datos Asincrónicos no bloqueantes**.

**Código de Ejemplo:** (Ubicado en `pandabwbarbershop_persistence/app/database.py` y Controladores)
```python
# La palabra clave 'async' indica que el flujo es asincrónico.
# No bloquea el servidor mientras espera que la base de datos responda.
async def connect_db():
    # 'await' crea el flujo asincrónico esperando la promesa
    await prisma.connect()

@app.get("/appointments")
async def get_appointments():
    # El hilo del servidor queda libre para otros usuarios 
    # mientras se procesa esta consulta lenta.
    return await prisma.appointment.find_many()
```
*Justificación:* Exactamente igual que Spring WebFlux, FastAPI usa `async/await` para el manejo de I/O (entrada/salida) sin bloquear, permitiendo concurrencia masiva.

---

### 6. Streams API
> **Idea:** La API de Streams de Java permite procesar secuencias de elementos (colecciones) de forma declarativa (filtrar, mapear, reducir).

**¿Cómo se resuelve en tu proyecto?**
En TypeScript y JavaScript moderno, la manipulación declarativa equivalente a Streams API se hace nativamente con los métodos funcionales de los Arreglos (`.filter()`, `.map()`, `.reduce()`).

**Código de Ejemplo:** (Ubicado en los módulos de inventario, ej. `BarberInventory.tsx`)
```tsx
// Equivalente a: list.stream().filter(p -> p.is_active).map(...)
const activeProducts = products
    .filter((product) => product.is_active === true) // Stream Filter
    .map((product) => product.name);                 // Stream Map
```

---

### 7. Interfaces Funcionales
> **Idea:** En Java, una Interfaz Funcional es una interfaz con un único método abstracto (SAM), que sirve para pasar comportamientos como parámetro.

**¿Cómo se resuelve en tu proyecto?**
En TypeScript, esto es aún más limpio. Se resuelve declarando Tipos o Interfaces de Funciones (Callbacks) que se inyectan como propiedades (Props) de un componente a otro.

**Código de Ejemplo:**
```tsx
// Esto es una Interfaz Funcional en TypeScript
interface AppointmentCardProps {
    appointment: Appointment;
    // Método abstracto único: el componente padre decide qué hace
    onStatusChange: (id: string, newStatus: string) => void; 
}

const AppointmentCard = ({ appointment, onStatusChange }: AppointmentCardProps) => {
    return (
        <button onClick={() => onStatusChange(appointment.id, 'completed')}>
            Completar
        </button>
    );
}
```
*Justificación:* En lugar de crear una clase que implemente `Runnable` o un `Consumer` de Java, defines un tipo de función directa y pasas ese "comportamiento" a los componentes hijos.
