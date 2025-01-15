# syntax=docker/dockerfile:1
   
FROM node:23-alpine
USER nonroot
WORKDIR /app
COPY . .
COPY package.json yarn.lock ./
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000
