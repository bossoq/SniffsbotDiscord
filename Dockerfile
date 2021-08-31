FROM node:16-buster-slim

WORKDIR /app

COPY /src ./src

COPY package.json .

COPY config.json ./src/

RUN yarn

CMD ["yarn", "dev"]
