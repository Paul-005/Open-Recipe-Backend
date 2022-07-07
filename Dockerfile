FROM node:alpine

WORKDIR /app

RUN npm install -g serve

COPY package.json .

RUN npm install

RUN cd public/Open_Recipe && npm install && npm run build

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
