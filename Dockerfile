# syntax=docker/dockerfile:1
   
FROM node:18-alpine
USER noroot
WORKDIR /app
COPY . .
#COPY package.json yarn.lock ./
RUN yarn install --production
CMD ["node", "src/index.js"]
EXPOSE 3000
