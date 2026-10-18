# RETRO-NET

Archivo retro-moderno de cultura pop. React + Vite + Tailwind + Lucide.

    npm install
    npm run start      # compila y abre el preview con todos los medios (http://localhost:4173)
    npm run dev        # modo desarrollo

Después de `npm run build`, también sirve `npm run preview`.
Las fotos y videos están en `public/media/sel22/`.

Todo el código y los datos de prueba están en `src/App.jsx`. Fotos, audio y video son simulados.
Atajo: `/` enfoca el buscador. Flechas izquierda/derecha cambian de pestaña.

## GIF animados
Las animaciones (estática, Pac-Man, carretes, ecualizador, tracking VHS, REC, letrero, arcoíris y logo) son GIF en `public/gifs/`.
Para regenerarlos: `pip install pillow numpy && python3 tools/make_gifs.py`

## Contenido
- `src/archivo.js`: fotos del archivo (títulos, fechas) y las expediciones de la sección Ruta de mochileros. Edita aquí títulos y paradas.
- `public/media/`: fotos y videos optimizados (`sel22/` y `archivo/`).
