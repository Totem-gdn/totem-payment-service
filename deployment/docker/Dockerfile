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

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

RUN addgroup -S pptruser && adduser -S -G pptruser pptruser \
    && mkdir -p /home/pptruser/Downloads /app \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser /app

USER pptruser

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV} \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /usr/src/payment-service

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY --from=builder /usr/src/payment-service/contract ./contract

COPY --from=builder /usr/src/payment-service/dist ./dist

CMD ["node", "dist/main"]
