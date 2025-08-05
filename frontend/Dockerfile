# 1. Build stage
FROM node:18-alpine AS build
WORKDIR /app

# 1.1. Copia package.json e package-lock.json e instala deps
COPY package*.json ./
RUN npm ci

# 1.2. Define a variável de build antes do build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# 1.3. Copia o restante do código e gera o bundle
COPY . .
RUN npm run build

# 2. Serve o build com Nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
