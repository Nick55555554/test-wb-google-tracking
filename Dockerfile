FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

COPY src/assets/ dist/assets/

CMD sh -c "pnpm run migrate:latest && pnpm run start"