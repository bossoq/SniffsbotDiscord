FROM node:16-buster-slim

WORKDIR /app

COPY package.json .

COPY tsconfig.json .

RUN yarn

COPY /src ./src

COPY config.json ./src/

CMD ["yarn", "dev"]
