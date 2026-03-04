# syntax=docker/dockerfile:1

FROM node:24-alpine3.22
WORKDIR /app
COPY package.json ./
RUN yarn install --production --frozen-lockfile
COPY . .
RUN chown -R node:node /app
USER node
EXPOSE 3000
CMD ["node", "src/index.js"]
