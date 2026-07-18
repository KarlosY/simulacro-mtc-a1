# 🚗 Simulador de Examen de Reglas MTC A1 (Perú)

¡Bienvenido al simulador definitivo para el examen de reglas de tránsito para la categoría A1 del Ministerio de Transportes y Comunicaciones (MTC) de Perú! 

Este proyecto fue creado para proporcionar una plataforma gratuita, interactiva y 100% fiel al balotario oficial para ayudar a los postulantes a aprobar su examen de conocimientos.

## 🌟 Características Principales

- **Base de datos oficial**: Las 200 preguntas han sido extraídas *exactamente* del PDF del balotario oficial del MTC, sin alteraciones de texto para garantizar la máxima fidelidad.
- **Soporte de Señalética**: Incluye todas las imágenes de las señales de tránsito que vienen en la prueba oficial (cruces, pare, reguladoras, etc.).
- **Modo Examen**: 
  - Simula las condiciones reales de la prueba del Touring/MTC.
  - Elige 40 preguntas al azar del balotario.
  - Temporizador de 40 minutos.
  - Calificación instantánea al finalizar, requiriendo 35 preguntas correctas para aprobar.
  - Pantalla de revisión para ver qué preguntas fallaste y sus respuestas correctas.
- **Modo Repaso**: Un apartado que lista el balotario completo con las 200 preguntas, sus alternativas y la respuesta correcta resaltada, ideal para estudiar en cualquier momento.
- **Diseño Moderno**: Interfaz construida aplicando *Glassmorphism* y animaciones suaves para que el estudio no sea aburrido.

## 🛠 Tecnologías Utilizadas

- **Framework principal**: [Astro v5](https://astro.build/) - Garantiza una carga rápida y estructura limpia.
- **Interactividad**: [React](https://react.dev/) - Utilizado mediante *Astro Islands* para los componentes dinámicos del simulador (temporizador, selección de opciones, resultados).
- **Estilos**: Vanilla CSS con variables nativas para el sistema de diseño (Glassmorphism).
- **Extracción de Datos**: Scripts en Python (`pdftohtml`, manejo de `XML`) para el parseo milimétrico de las coordenadas del documento oficial y vinculación automática de imágenes de señalética.

## 🚀 Instalación y Uso Local

Para levantar este proyecto en tu propia máquina, sigue estos pasos:

1. **Clona el repositorio** o asegúrate de estar en el directorio del proyecto.
2. **Instala las dependencias**:
   ```bash
   npm install
   ```
3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
4. Abre tu navegador y dirígete a `http://localhost:4321`.

## 📁 Estructura del Proyecto

- `src/pages/index.astro`: El menú principal de la aplicación.
- `src/pages/review.astro`: La página que hospeda el "Modo Repaso".
- `src/components/`: Componentes interactivos en React (`ExamSimulator.jsx`, `QuestionView.jsx`, `ResultsReview.jsx`, `ReviewList.jsx`, `Timer.jsx`).
- `src/data/questions.json`: El dataset validado que funciona como única fuente de verdad (Single Source of Truth).
- `public/images/`: Contiene todas las señales extraídas del documento oficial.

## 💡 Cómo Estudiar Mejor

1. Lee primero todo el contenido utilizando el **Modo Repaso**.
2. Una vez te sientas confiado, ve al **Modo Examen** y ponte a prueba contra el reloj.
3. Si fallas una pregunta, el simulador te mostrará la respuesta correcta al final. Apunta esos errores y búscalos en el Modo Repaso.

---
*Desarrollado para la comunidad de conductores del Perú.* 🇵🇪
