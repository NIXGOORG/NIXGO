# NIXGO tech — sitio estático servido con nginx
FROM nginx:1.27-alpine

# Config de nginx (gzip, caché, headers de seguridad)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Archivos del sitio (lo excluido va en .dockerignore)
COPY . /usr/share/nginx/html/

EXPOSE 80

# Healthcheck simple
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
