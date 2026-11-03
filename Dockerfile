# syntax=docker/dockerfile:1

FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Permite publicar na raiz (/) ou em um subdiretorio, sem alterar o Vite.
ARG VITE_BASE_PATH=/
RUN npm run build -- --base="${VITE_BASE_PATH}"

FROM nginx:1.27-alpine AS runtime

# CVE-2026-111497: a imagem oficial ainda traz o brotli-libs vulneravel (1.1.0-r2).
# Quando ela sair com o pacote corrigido, esta linha passa a nao ter efeito.
RUN apk upgrade --no-cache brotli-libs

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
