# ==============================================================================
# NIXGO tech - Optimized Dockerfile for VPS Production Deployment
# ==============================================================================

FROM nginx:1.27-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Clean up default Nginx public files
RUN rm -rf ./*

# Copy Custom Nginx Configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy all site assets (respecting the exclusions defined in .dockerignore)
COPY . ./

# Set secure permissions: readable by all, writable only by root
RUN chmod -R 755 /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Production-ready healthcheck using wget (using 127.0.0.1 to avoid IPv6 resolution issues)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

