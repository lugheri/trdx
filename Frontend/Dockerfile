FROM node:18
WORKDIR /usr/src/www
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "server.js"]
EXPOSE 80
          