APLICACIÓN JSONPLACEHOLDER — INSTRUCCIONES

Archivos:
- index.html: estructura de la página.
- style.css: estilos visuales.
- script.js: consulta de la API, tarjetas y ventana flotante.

Cómo ejecutar:
1. Extrae la carpeta del archivo ZIP.
2. Abre la carpeta en Visual Studio Code.
3. Abre index.html en el navegador. Recomendado: usar la extensión Live Server.
4. Necesitas conexión a Internet para consultar JSONPlaceholder y cargar la fuente visual.

Cómo probar:
1. Espera a que carguen las publicaciones.
2. Haz clic en cualquier tarjeta.
3. Verifica que la ventana muestre ID, Name, Username, Email, Phone y Website.
4. Cierra la ventana con el botón X, el botón Cerrar, pulsando fuera de la ventana o con Escape.

Nota técnica:
La aplicación consulta https://jsonplaceholder.typicode.com/posts y
https://jsonplaceholder.typicode.com/users. Relaciona cada publicación con
su autor mediante post.userId y user.id. Los datos se obtienen de la API.
