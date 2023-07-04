FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY ./ ./
RUN npm install
EXPOSE 4003
CMD [ "npm","start" ]
