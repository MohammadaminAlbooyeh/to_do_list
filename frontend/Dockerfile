FROM node:18-bullseye-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npx expo export --platform web

# Fix: preload client bundle before main bundle
RUN CLIENT_JS=$(ls dist/_expo/static/js/web/client-*.js 2>/dev/null | head -1) && \
    MAIN_JS=$(ls dist/_expo/static/js/web/index-*.js 2>/dev/null | head -1) && \
    if [ -n "$CLIENT_JS" ] && [ -n "$MAIN_JS" ]; then \
      CLIENT_FILE=$(basename $CLIENT_JS); \
      MAIN_FILE=$(basename $MAIN_JS); \
      sed -i "s|<script src=\"/_expo/static/js/web/$MAIN_FILE\" defer></script>|<script src=\"/_expo/static/js/web/$CLIENT_FILE\" defer></script><script src=\"/_expo/static/js/web/$MAIN_FILE\" defer></script>|" dist/index.html; \
    fi

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
