FROM node:alpine

WORKDIR /

COPY package.json .

RUN npm install

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
