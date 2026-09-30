# LOOMARQ Web Production v1.1

Sitio estático de LOOMARQ para `https://getloomarq.com`, construido con HTML, CSS, JavaScript e imágenes. No requiere instalación de paquetes, framework, compilación ni backend propio. El formulario utiliza Netlify Forms.

Flujo de trabajo: **VS Code / Codex → Git local → GitHub → Netlify → getloomarq.com**.

La preparación local no crea el repositorio remoto, no conecta servicios y no publica el sitio. La conexión a GitHub, el primer push y la vinculación con Netlify son pasos posteriores que requieren la autorización del responsable del proyecto.

## Estructura

```text
.
├── index.html                 # Página principal y formulario evaluacion
├── privacidad.html            # Política de privacidad
├── gracias.html               # Confirmación del formulario
├── 404.html                   # Página de error para Netlify
├── favicon.ico
├── site.webmanifest           # Identidad, inicio e iconos del manifiesto
├── robots.txt
├── sitemap.xml
├── netlify.toml               # Publicación desde la raíz y cabeceras HTTP
├── .gitignore
├── README_PUBLICACION.md
└── assets/
    ├── css/styles.css
    ├── js/main.js              # Menú móvil y año del pie de página
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
6. Revisar el deploy autorizado y comprobar las páginas y los recursos en la URL de Netlify. Enviar una consulta de prueba sin datos privados, comprobar su recepción en Forms y la navegación a `gracias.html`.
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

## Revisión de preparación

Se revisaron los 20 archivos originales, las referencias del sitio, el manifiesto, el sitemap y la configuración. No se identificaron secretos, credenciales, datos privados ni referencias locales accidentales en el código. Las imágenes de marca incluyen metadatos de procedencia, conservados sin modificación.

Se corrigieron únicamente las rutas de la página 404 y la política de caché de assets, además de agregar `.gitignore` y actualizar esta guía. Se conserva la arquitectura estática, el diseño y el contenido del sitio. Las referencias a la dirección local en esta guía son instrucciones de prueba deliberadas.
