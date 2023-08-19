FROM node:18
#FROM node:14
WORKDIR /usr/src/app
COPY package*json ./
RUN npm install
COPY . .
#RUN npm run build
CMD ["npm","run","dev"]
EXPOSE 4000