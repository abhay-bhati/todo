FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY server.js .
COPY public ./public
COPY data ./data

EXPOSE 3000

CMD ["node", "server.js"]