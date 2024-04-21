# Establecer la imagen base de Node.js
FROM node:21-alpine3.18

# Crear y establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar el archivo package.json y package-lock.json a /app
COPY package*.json ./

# Instalar las dependencias del backend
RUN npm install

# Copiar el resto de los archivos del backend a /app
COPY . .

# Exponer el puerto en el que el servidor Express escucha
EXPOSE 4000

# Comando para iniciar el servidor backend en modo de producción
CMD ["npm", "start"]
