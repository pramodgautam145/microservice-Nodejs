FROM node:alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY ./ ./
RUN npm install
EXPOSE 4002
CMD ["npm","start"]