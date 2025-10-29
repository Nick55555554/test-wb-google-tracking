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

CMD sh -c "pnpm run migrate:latest && pnpm run start"