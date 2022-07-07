FROM node:alpine

WORKDIR /app

RUN npm install -g serve

COPY package.json .

RUN npm install

WORKDIR /public/Open_Recipe

RUN npm install && npm run build

WORKDIR /app

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
