# Branding (Vic)

Todo lo de marca vive en tres lugares. Nada de esto requiere programar.

1. **Colores, tipografía, radios:** `desktop/src/renderer/src/theme/tokens.css`.
   Cambia los valores; no renombres las variables. La app se actualiza sola.
2. **Logo e ícono:** deja los archivos aquí (`branding/`). SVG para el logo,
   PNG 1024×1024 para el ícono de la app. El integrador los conecta.
3. **Nombre:** cuando esté decidido, avisa al integrador. Se cambia en
   `App.tsx`, `index.html`, `README.md` y `package.json`.

Para ver tus cambios en vivo: `make desktop` y guarda `tokens.css`.
Si prefieres no instalar nada, manda los valores en el issue y alguien los pone.
