# builder
FROM node:lts-alpine AS builder

WORKDIR /usr/src/payment-service

RUN npm i glob rimraf

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# production
FROM node:lts-alpine

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/payment-service

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/src/payment-service/contract ./contract

COPY --from=builder /usr/src/payment-service/dist ./dist

CMD ["node", "dist/main"]
