# LOOMARQ Web Production v1.5

Sitio estático de LOOMARQ para `https://getloomarq.com`, construido con HTML, CSS, JavaScript e imágenes. No requiere instalación de paquetes, framework, compilación ni backend propio. El formulario utiliza Netlify Forms.

La propuesta actual es integración de sistemas y automatización empresarial por proyecto, con implementación digital industrial como especialidad. La experiencia profesional del fundador se presenta por separado del antecedente industrial de Loomarq, que sigue en documentación.

Flujo de trabajo: **VS Code / Codex → Git local → GitHub → Netlify → getloomarq.com**.

La preparación local no crea el repositorio remoto, no conecta servicios y no publica el sitio. La conexión a GitHub, el primer push y la vinculación con Netlify son pasos posteriores que requieren la autorización del responsable del proyecto.

## Estructura

```text
.
├── index.html                 # Página principal y formulario evaluacion
├── privacidad.html            # Política de privacidad
├── gracias.html               # Ruta anterior; orienta al formulario sin confirmar recepción
├── 404.html                   # Página de error para Netlify
├── favicon.ico
├── site.webmanifest           # Identidad, inicio e iconos del manifiesto
├── robots.txt
├── sitemap.xml
├── netlify.toml               # Publicación desde la raíz y cabeceras HTTP
├── .gitignore
├── README_PUBLICACION.md
├── tests/contact-form.test.mjs # Regresiones del formulario con node:test
└── assets/
    ├── css/styles.css
    ├── js/main.js              # Menú, año y envío confirmado de consultas
    ├── icons/                 # Favicons e iconos del manifiesto
    └── img/
        ├── brand/             # Logo y símbolo de LOOMARQ
        └── og/                # Imagen para compartir en redes
```

## Prueba local

Desde la raíz, con Python 3 disponible, ejecutar:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8000/`. Detener el servidor con `Ctrl+C`. Python es solo una herramienta de vista previa; el sitio no depende de Python y no se instala ningún paquete.

Comprobar el menú móvil, las anclas, las imágenes, los estilos y las páginas `/privacidad.html`, `/gracias.html` y `/404.html`. Revisar en las herramientas del navegador que los recursos respondan sin errores.

Se puede abrir `index.html` directamente para una vista rápida: sus recursos usan rutas relativas. Para verificar la navegación completa y las rutas desde la raíz del manifiesto y de la página 404, usar el servidor HTTP. Los enlaces `./` de las páginas auxiliares pueden abrir una carpeta bajo `file://`.

El servidor de Python no interpreta `netlify.toml`, no procesa Netlify Forms y no sirve automáticamente nuestra `404.html` al solicitar una ruta inexistente. Un POST local puede responder 501; esto no demuestra un fallo del formulario. Las cabeceras, el manejo real del error 404 y la recepción de consultas se verifican en Netlify después de autorizar la publicación.

## Formulario y canales de consulta

El formulario HTML `evaluacion` utiliza Netlify Forms, con `action="/"`, método POST, campo oculto `form-name`, honeypot `bot-field` y consentimiento obligatorio `privacidad`. `main.js` envía los campos mediante `fetch` al mismo origen con codificación `application/x-www-form-urlencoded`. La confirmación se muestra en el formulario, sin navegar a otra página. Para procesar consultas, Netlify debe tener la detección activada y el formulario registrado tras un despliegue.

El botón se habilita únicamente después de instalar el manejador de envío. Sin JavaScript o si faltan las APIs necesarias, permanece deshabilitado y se ofrece WhatsApp; así se evita un POST nativo sin manejo de errores. No enviar consultas reales durante las pruebas locales.

| Nombre enviado a Netlify | Uso actual |
| --- | --- |
| `nombre` | Nombre, obligatorio |
| `empresa` | Empresa, opcional |
| `email` | Correo electrónico, obligatorio y validado como email |
| `telefono` | Teléfono o WhatsApp, opcional |
| `etapa` | Tipo de consulta, obligatorio; se conserva la clave existente por compatibilidad |
| `maquina` | Máquina o equipo, opcional, para consultas industriales |
| `mensaje` | Descripción del problema, obligatoria |
| `privacidad` | Aceptación del uso de datos para responder, obligatoria |

`etapa` permite elegir integración entre sistemas, automatización de tareas, intercambio o tratamiento de datos, implementación digital industrial u otro problema. Se conservan todas las claves de campos y los valores enviados: `FormData` los recoge y `URLSearchParams` los codifica sin renombrarlos.

Netlify Forms es el servicio encargado de registrar las consultas. El destinatario de las notificaciones por correo se configura en el proyecto de Netlify y no está definido en este repositorio. Antes de publicar, revisar cualquier integración externa que interprete los valores de `etapa` y comprobar que Netlify haya detectado el esquema. La aceptación del POST por Netlify no acredita que una notificación haya llegado al correo.

WhatsApp conserva el número existente. Su mensaje inicial ahora contempla integración, automatización e implementación digital. No se agregaron servicios de analítica: el código actual no contiene scripts de seguimiento.

Las tarjetas sociales usan el símbolo de marca existente para evitar compartir la antigua imagen con texto exclusivamente industrial. Se conserva esa imagen en el repositorio, pero la portada ya no la referencia. Los metadatos, el JSON-LD y su hash CSP en `netlify.toml` se actualizan juntos.

## Validación de la actualización de posicionamiento (v1.2)

Registro histórico del flujo anterior a la corrección de envío v1.4.

- Sintaxis de JavaScript y `git diff --check` sin errores; no hay build, lint ni suite de pruebas configurados en este sitio estático.
- Referencias locales de las cuatro páginas, anclas, etiquetas de formulario, imágenes, manifiesto, sitemap, JSON-LD y correspondencia del hash CSP revisados.
- Revisión en Chrome de escritorio y móvil, con comprobación de desbordamientos en 320, 375, 390, 680, 768, 900, 1024, 1440 y 1920 px.
- Menú móvil: apertura, cierre con Escape, clic exterior, navegación a contacto y retorno de foco al cerrar con Escape. Navegación disponible también sin JavaScript.
- Validación nativa de campos obligatorios, formato de email y consentimiento. Cinco envíos simulados e interceptados en el navegador comprobaron claves, valores con acentos, equipo opcional y redirección a la confirmación. No se enviaron consultas reales.
- La CSP configurada se aplicó a las respuestas locales durante la prueba de navegador, sin errores de consola ni recursos fallidos.

Quedan sin verificar la recepción en Netlify Forms, las notificaciones por correo, posibles integraciones externas del formulario, las tarjetas sociales en cada plataforma y la aplicación de cabeceras y rutas de error en el alojamiento. Esta validación no incluyó un despliegue de producción.

## Optimización comercial y de experiencia (v1.3)

### Auditoría y prioridades

La base actual comunica con claridad la integración y automatización empresarial, conserva la digitalización industrial como especialidad y separa la trayectoria del fundador de los clientes de LOOMARQ. Se mantienen esa propuesta, el H1, la identidad visual, las cinco secciones principales, el menú accesible, los canales de contacto y la arquitectura estática.

Los servicios describían capacidades técnicas, pero faltaban ejemplos que relacionaran un problema cotidiano con una solución posible y un beneficio esperado. El proceso de trabajo explicaba las etapas del proyecto sin nombrar una oferta de entrada. Los CTA usaban textos diferentes y la ayuda para describir el problema desaparecía al escribir en el campo. Se priorizaron estas mejoras de claridad y conversión; la revisión inicial automática de accesibilidad no encontró infracciones en escritorio.

| Orden | Mejora elegida | Impacto comercial | Esfuerzo técnico |
| --- | --- | --- | --- |
| 1 | Tres situaciones empresariales con solución posible y beneficio esperado | Alto | Bajo |
| 2 | Diagnóstico técnico de integración dentro de Cómo trabajamos | Alto | Bajo |
| 3 | CTA común y formulario comprensible sin conocimientos técnicos | Alto | Bajo |
| 4 | Agrupar la experiencia personal y el antecedente propio con identificación explícita | Medio | Bajo |

### Cambios implementados

- `index.html`: ejemplos de sistemas desconectados, tareas en Excel e información dispersa dentro de Servicios. Se identifican como ejemplos conceptuales y se acortan las listas técnicas para limitar la repetición. La propuesta inicial explica qué se evalúa en un diagnóstico y cómo se decide avanzar, sin fijar precio, gratuidad, plazos ni entregables nuevos.
- `index.html`: CTA principal «Contanos tu caso» en navegación, portada, servicios y método; WhatsApp sigue siendo un canal alternativo para la misma consulta. El formulario muestra campos opcionales, ofrece orientación para quien desconoce la solución técnica y conserva la ayuda del mensaje mediante `aria-describedby`. Se preservan todos los nombres de campos, sus requisitos y los valores enviados en `etapa`; solo cambian las etiquetas visibles de sus opciones.
- `index.html`: experiencia laboral del fundador y trabajo propio de LOOMARQ reunidos en Experiencia, con su diferencia explícita. El antecedente industrial conserva su estado de documentación pendiente. Las descripciones SEO, Open Graph y Twitter incorporan el desarrollo de software y los problemas operativos. El JSON-LD y su hash CSP permanecen válidos.
- `assets/css/styles.css`: estilos de las situaciones reutilizables (`article` y listas de definición), disposición móvil en una columna, título del diagnóstico, ayuda del formulario y adaptación del componente existente `case-note` al fondo de Experiencia. Se conservan colores, fuentes y estilo general; no se agregan assets, scripts ni dependencias de producción.

### Verificación local

Registro de la revisión v1.3, anterior al envío dentro del sitio incorporado en v1.4.

- Sintaxis JavaScript y `git diff --check` sin errores. No hay suite de tests, lint, chequeo de tipos ni build configurados; el sitio se sirve directamente.
- Referencias locales, IDs únicos, anclas y asociaciones accesibles revisadas en las cuatro páginas. Manifiesto y sitemap válidos; contrato de campos y valores del formulario comparado con `main`. JSON-LD válido y coincidencia con el hash CSP existente.
- Chrome: sin desbordamiento horizontal en 320, 375, 390, 480, 680, 768, 900, 901, 1024, 1280, 1440 y 1920 px. Capturas revisadas en escritorio y móvil.
- axe-core: sin infracciones automáticas de WCAG 2.1 AA en la portada en escritorio y móvil, en el detalle del antecedente desplegado y en las tres páginas auxiliares. Esta comprobación automática no equivale a una auditoría completa de accesibilidad.
- Menú móvil, Escape, retorno de foco, clic exterior, enlace para saltar al contenido y navegación a contacto comprobados. Navegación y envío nativo disponibles también sin JavaScript.
- Campos obligatorios, formato de email y consentimiento comprobados. Cinco envíos simulados e interceptados, uno por cada tipo de consulta, validaron claves, valores con acentos, campos opcionales y navegación a la confirmación. Un sexto envío interceptado comprobó el funcionamiento sin JavaScript. No se enviaron consultas a servicios externos.
- Sin errores de consola, de página ni de carga de recursos, con las cabeceras CSP de producción aplicadas por el servidor local. Las herramientas de navegador se instalaron en un directorio temporal externo al repositorio.

### Pendientes de validación humana

- Definir las condiciones comerciales del diagnóstico: alcance, modalidad y precio; plazos y entregables si corresponde ofrecerlos. La web indica que se acuerdan antes de avanzar.
- Reunir documentación y autorización para publicar materiales del antecedente industrial y futuros casos propios. El componente `case-note` puede ampliarse con evidencia aprobada; los ejemplos conceptuales deben seguir identificados como tales.
- Verificar en el alojamiento la recepción en Netlify Forms y las notificaciones por correo. Las pruebas locales interceptan el POST y no acreditan recepción real. La vista previa tampoco valida el comportamiento de la ruta 404 en Netlify ni las tarjetas sociales de cada plataforma.

## Corrección del formulario (v1.4)

Registro histórico. La comprobación del HTML de respuesta introducida en esta versión era demasiado estricta y se corrige en v1.5, descrita a continuación.

### Diagnóstico

El 19 de noviembre de 2026 se comprobó mediante GET que el sitio responde desde Netlify y que `/gracias.html` y `/gracias` existen y responden HTTP 200. No hay framework ni router de aplicación: son archivos estáticos publicados desde la raíz. No se encontró FormSubmit, `_next`, API propia ni configuración de Vercel.

El formulario anterior usaba `method="POST"` y `action="./gracias.html"`: el navegador enviaba los datos a esa ruta, en vez de comprobar el resultado dentro de la página. La existencia de un archivo accesible por GET no implica que el alojamiento acepte un POST. El responsable confirmó que `evaluacion` no aparece en Forms. Además, el HTML publicado conserva `data-netlify="true"`, atributo que Netlify elimina cuando detecta el formulario. El problema identificado es la falta de registro del formulario en Netlify, junto con un flujo nativo sin manejo de errores; crear otra página de agradecimiento no registra ni entrega las consultas.

No se consultó el panel privado ni el historial de envíos de Netlify, y no se verificó el destinatario de las notificaciones. Tampoco se comprobó la entrega real al correo. Los GET públicos y las pruebas interceptadas no demuestran que las consultas anteriores se hayan recibido.

### Comportamiento corregido

- Se mantiene Netlify Forms y se envía un POST al origen, sin redirecciones. Los campos obligatorios y el email se validan antes de enviar. Se preservan el honeypot, el consentimiento y el enlace a privacidad.
- Mientras se envía, se muestra el estado, se bloquean los controles y se impide un segundo envío. No hay reintentos automáticos. Un tiempo de espera de 20 segundos limita las solicitudes que no responden; un fallo de red o timeout deja el envío sin confirmar, aunque el servidor podría haberlo recibido. Antes de un reenvío en ese caso, se puede consultar por WhatsApp.
- Solo una respuesta HTTP exitosa directa permite mostrar el agradecimiento. Se rechazan los errores HTTP, las redirecciones y las respuestas que devuelven una página estática del propio sitio con estado 200. La respuesta de error del servidor no se inserta en la página ni se muestra al visitante.
- Ante un error, se conservan los valores y el consentimiento en los controles, se habilita el reintento manual y se ofrece WhatsApp. Los mensajes tienen región accesible y reciben foco. Los datos se borran y se ocultan los campos únicamente después de la confirmación; el envío queda bloqueado para impedir duplicarlo.
- Los datos viajan en el cuerpo del POST al mismo origen. No se agregan almacenamiento persistente, analítica, registros con datos personales, tokens ni credenciales en el navegador.
- La ruta histórica `/gracias.html` se conserva para enlaces anteriores, pero ya no afirma que una consulta fue recibida por el solo hecho de abrirla. Orienta al formulario y a WhatsApp. Sin JavaScript, el formulario ofrece ese canal alternativo en lugar de navegar sin poder manejar el error.

### Configuración y comprobación en Netlify

1. En el proyecto que sirve `getloomarq.com`, abrir **Forms** y habilitar **Enable form detection**. Si ya estaba habilitada, revisar el despliegue y su procesamiento de formularios. Esto se configura en Netlify; agregar el atributo al HTML no activa por sí solo el servicio.
2. Desplegar la versión corregida desde la raíz del repositorio: publish directory `.` y sin comando de build. La detección se aplica en el siguiente despliegue, por lo que habilitarla sin volver a desplegar no alcanza.
3. Confirmar que **Forms** muestre **evaluacion**, con los campos esperados. Comprobar el HTML servido: `data-netlify="true"` debe haber sido procesado y `form-name` debe conservar el valor `evaluacion`.
4. En **Forms → Submission notifications → Add notification**, configurar o revisar la notificación por email para `evaluacion` y el destinatario real. No hace falta agregar variables SMTP, claves privadas ni direcciones de destinatario al HTML. Vercel no interviene en el alojamiento observado; Netlify Forms requiere su propio servicio de procesamiento si se cambia de proveedor en el futuro.
5. Realizar un único envío de prueba identificable, con un correo propio y contenido no confidencial. En la pestaña Network, confirmar el POST a `/`, su respuesta exitosa directa y la confirmación en la página, sin navegación a `/gracias.html`.
6. Buscar esa misma prueba en **Forms → evaluacion**, incluyendo los envíos marcados como spam. Luego verificar la llegada de la notificación al destinatario y revisar su carpeta de spam. La aparición en Netlify y la recepción del email son dos comprobaciones distintas. Si aparece en Forms pero no llega el correo, revisar la notificación antes de repetir el envío.

No se modificó la configuración de producción ni se realizó un despliegue durante esta corrección. El arreglo local requiere habilitar/registrar el formulario y comprobar el flujo real antes de considerarlo resuelto en producción.

### Verificación de la corrección

Se ejecutaron 15 comprobaciones automatizadas en Chrome con los POST interceptados localmente: campos obligatorios/email/consentimiento; espera y bloqueo de duplicados; éxito directo; errores HTTP 404, 422, 429 y 500; HTTP 200 con la portada o la página histórica; redirección a una URL válida; fallo de red con reintento manual; timeout; ausencia de JavaScript o de `fetch`; conservación de las cinco opciones y los datos industriales opcionales; responsive, rutas y privacidad.

Las pruebas comprobaron la conservación de datos ante fallos, la limpieza únicamente después del éxito, la ausencia de datos en localStorage/sessionStorage y la permanencia en la página. La revisión automática de accesibilidad no encontró infracciones WCAG 2.1 AA en los estados inicial, éxito y error ni en las tres páginas auxiliares. Se revisaron capturas móviles y ocho anchos entre 320 y 1440 px, con la CSP existente aplicada localmente. También se verificaron sintaxis JavaScript, enlaces, etiquetas, manifiesto, sitemap y correspondencia del hash CSP. No hay build, lint, chequeo de tipos ni suite de tests configurados en este sitio estático.

No se enviaron consultas reales, no se verificó entrega por correo y no se publicaron cambios. La comprobación del servicio y de las notificaciones sigue el procedimiento anterior en Netlify.

Referencias oficiales: [detección y envío AJAX de formularios](https://docs.netlify.com/manage/forms/setup/), [historial de envíos](https://docs.netlify.com/manage/forms/submissions/) y [notificaciones por email](https://docs.netlify.com/manage/forms/notifications/).

## Compatibilidad de la confirmación con Netlify (v1.5)

Después de activar Forms y desplegar, el HTML público ya muestra el formulario procesado por Netlify: `data-netlify` fue eliminado y `form-name=evaluacion` está presente. El dominio sigue respondiendo desde Netlify. Esto corrige la ausencia de detección observada inicialmente, pero deja al descubierto un error de v1.4.

Netlify puede responder al POST con HTTP 200 y el contenido HTML de la página configurada en `action`. Como el formulario usa `action="/"`, esa respuesta puede contener la portada, incluido el formulario y su hoja de estilos. La validación de v1.4 interpretaba esos elementos como un error y mostraba «No pudimos confirmar el envío» aunque el servicio hubiera aceptado el POST. Esta combinación se reprodujo en Chrome usando una respuesta HTTP 200 con la portada: el código anterior falla y el corregido muestra la confirmación.

`main.js` ahora evalúa el resultado HTTP del POST al servicio configurado y rechaza errores y redirecciones. El HTML devuelto por Netlify no se analiza ni se inserta en la página. Se conservan el envío al mismo origen, la validación de campos, el timeout, el bloqueo de duplicados y la conservación de datos ante errores. Un HTTP exitoso confirma la aceptación por el servicio de Forms; la llegada de la notificación al correo debe comprobarse por separado en Forms y en el destinatario. No hay cambios de proveedor, configuración de producción ni dependencias nuevas.

### Verificaciones

```powershell
node --test tests/contact-form.test.mjs
node --check assets/js/main.js
git diff --check
```

Las 13 pruebas de `node:test` cubren HTTP 200 con portada, página propia y cuerpo vacío; validación previa; espera y duplicados; errores 400, 404, 422, 429 y 500; fallo de red y reintento manual; timeout y respuesta redirigida. Usan respuestas simuladas y no envían consultas reales. También se reprodujo el fallo y la corrección en Chrome con POST interceptados localmente y la CSP existente, y se comprobó que un 404 sigue conservando los datos. No hay build, lint ni chequeo de tipos configurados.

Con autorización explícita se realizó después un único envío técnico en producción, sin reintentos. Netlify respondió HTTP 200, `Content-Type: text/html`, con una referencia a `/assets/css/styles.css` en el cuerpo. El navegador mostró igualmente el error de v1.4: quedó confirmado que su comprobación del HTML rechaza una respuesta exitosa del proveedor. Esta prueba acredita la respuesta HTTP observada, pero no confirma por sí sola el registro en Forms ni la recepción de una notificación por correo; ambos deben revisarse también, incluyendo la carpeta de spam.

La corrección está preparada en una rama separada para revisión y despliegue. La revisión local no demuestra recepción de notificaciones por correo. Si el mensaje anterior apareció durante un envío real, revisar si esa consulta ya está en Forms antes de volver a enviarla.

Referencia del proveedor: [respuesta de Forms con el contenido de action](https://answers.netlify.com/t/netlify-form-resubmitting-on-page-refresh-safari-only/32809) y [configuración y envío AJAX](https://docs.netlify.com/manage/forms/setup/).

## Rutas y dominio

- HTML, CSS, JavaScript e imágenes se publican desde la raíz del proyecto.
- La página principal usa `./assets/...`; las páginas auxiliares están en el mismo nivel.
- `404.html` usa `/assets/css/styles.css`, `/favicon.ico` y `/` para funcionar también cuando la URL inexistente contiene subcarpetas.
- El manifiesto usa `/` como inicio y `/assets/icons/...` para sus iconos. Estas rutas funcionan en un servidor local desde la raíz, en el subdominio de Netlify y en el dominio final. El manifiesto por sí solo no implementa funcionamiento sin conexión.
- Las URLs canónicas, Open Graph, datos estructurados, sitemap y referencia al sitemap en robots apuntan deliberadamente a `https://getloomarq.com`. No se reemplazan por la URL de vista previa. El enlace del pie al dominio también lleva deliberadamente al sitio de producción.
- `gracias.html` y `404.html` tienen instrucciones de no indexación; el sitemap contiene la portada y privacidad.

No publicar en una subcarpeta como GitHub Pages sin revisar las rutas desde la raíz. GitHub se utilizará como repositorio y Netlify como alojamiento.

## Git local

La rama principal es `main`. Para verificar el estado preparado:

```powershell
git status
git branch --show-current
git log -1 --oneline
git remote -v
```

El commit inicial se llama `Initial LOOMARQ production website`. Hasta conectar GitHub, `git remote -v` no debe mostrar remotes. No volver a ejecutar `git init` en este repositorio.

`.gitignore` excluye estado local de Netlify, archivos del sistema y editor, temporales y archivos habituales de secretos. Conserva HTML, CSS, JavaScript, imágenes, manifiesto y configuración de Netlify. No guardar consultas de clientes, credenciales ni tokens dentro del proyecto. Gitignore no protege secretos escritos dentro de archivos públicos ni excluye del despliegue manual una carpeta que se arrastre completa.

Git registra el nombre y correo del autor configurados en cada commit. Revisarlos con `git var GIT_AUTHOR_IDENT` antes de compartir el historial; si se prefiere privacidad en GitHub, usar el correo noreply de la cuenta antes de publicar.

## Conectar GitHub cuando exista el repositorio

Crear en GitHub un repositorio vacío con la visibilidad deseada, sin generar README, licencia ni `.gitignore`, porque el proyecto ya tiene historial local. Copiar su URL HTTPS o SSH, sin incluir tokens.

Una vez autorizada la conexión, reemplazar `URL_DEL_REPOSITORIO` por la URL real:

```powershell
git remote add origin "URL_DEL_REPOSITORIO"
git remote -v
```

Verificar que `origin` sea el repositorio correcto. Solo después de autorizar la subida:

```powershell
git push -u origin main
```

Usar la autenticación de GitHub mediante el gestor de credenciales o SSH. No poner contraseñas o tokens en la URL, archivos del sitio ni comandos de la documentación. Si el repositorio remoto ya contiene commits, detenerse y revisar ambos historiales; no usar un push forzado.

## Vincular el proyecto existente de Netlify

Realizar este paso únicamente cuando se autorice conectar y publicar. Vincular un repositorio activa el despliegue continuo y puede iniciar una publicación; los pushes posteriores pueden publicar cambios automáticamente. No crear un proyecto duplicado.

1. Abrir el proyecto existente en Netlify.
2. Ir a **Project configuration → Developer settings → Continuous deployment → Repository → Link repository**. Si ya tiene otro repositorio vinculado, revisar esa conexión antes de cambiarla.
3. Seleccionar GitHub, autorizar el acceso al repositorio de LOOMARQ y elegirlo.
4. Revisar estos valores, incluidos los que pudiera conservar el proyecto existente:

| Configuración | Valor |
| --- | --- |
| Production branch | `main` |
| Base directory | Vacío: raíz del repositorio |
| Package directory | Vacío |
| Build command | Vacío: no hay compilación |
| Publish directory | `.` (definido en `netlify.toml`) |

5. En **Forms**, habilitar la detección de formularios si está desactivada. Debe estar habilitada antes del deploy que detecte el formulario `evaluacion`.
6. Revisar el deploy autorizado y comprobar las páginas y los recursos en la URL de Netlify. Verificar el formulario detectado y la configuración de sus notificaciones. Un envío de prueba requiere autorización explícita; las comprobaciones locales no envían consultas reales.
7. Probar una URL inexistente con subcarpetas, por ejemplo `/prueba/no-existe`, y confirmar respuesta HTTP 404, estilos y regreso al inicio. Comprobar las cabeceras de seguridad y caché con las herramientas del navegador.
8. Revisar que el dominio del proyecto sea `getloomarq.com` y que HTTPS funcione. Si requiere cambios de dominio o DNS, tratarlos como una tarea separada y autorizada; no modificar registros durante la preparación de Git.

La política de assets es `Cache-Control: public, max-age=0, must-revalidate`: permite guardar recursos, pero exige validarlos antes de reutilizarlos. Evita mantener durante un año CSS, JS o imágenes desactualizados cuando sus nombres no cambian. Un navegador que ya hubiera recibido la política anterior podría necesitar una recarga forzada para abandonar esa copia.

La política CSP incluye el hash del bloque JSON-LD de `index.html`. Si se modifica ese bloque, revisar y actualizar el hash correspondiente en `netlify.toml`.

Como se publica la raíz, mantener su contenido apto para publicación, incluida esta documentación. No guardar en ella archivos internos aunque estén ignorados por Git, especialmente si se usa una carga manual.

Referencias oficiales: [vincular un repositorio existente](https://docs.netlify.com/build/git-workflows/repo-permissions-linking/), [configuración de publicación](https://docs.netlify.com/build/configure-builds/overview/), [Netlify Forms](https://docs.netlify.com/manage/forms/setup/) y [caché](https://docs.netlify.com/build/caching/caching-overview/).

## Workflow de cambios futuros

Con GitHub ya conectado, partir de una copia limpia y actualizada:

```powershell
git switch main
git pull --ff-only origin main
```

Editar, probar localmente y revisar los cambios antes de guardarlos:

```powershell
git status
git diff
git add .
git diff --cached --check
git diff --cached
git commit -m "Describe el cambio realizado"
git status
```

Con la publicación aprobada, ejecutar `git push origin main`. Cuando Netlify esté vinculado y sus builds estén activos, ese push puede actualizar producción. Revisar el resultado del deploy, el formulario y el dominio final. Para cambios que requieran revisión previa, trabajar en una rama separada y usar un pull request antes de integrar en `main`.

## Antecedente de preparación inicial

Se revisaron los 20 archivos originales, las referencias del sitio, el manifiesto, el sitemap y la configuración. No se identificaron secretos, credenciales, datos privados ni referencias locales accidentales en el código. Las imágenes de marca incluyen metadatos de procedencia, conservados sin modificación.

Se corrigieron únicamente las rutas de la página 404 y la política de caché de assets, además de agregar `.gitignore` y actualizar esta guía. Se conserva la arquitectura estática, el diseño y el contenido del sitio. Las referencias a la dirección local en esta guía son instrucciones de prueba deliberadas.
