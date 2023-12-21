FROM node:20-alpine

ENV PORT=3000

WORKDIR /app
COPY package*.json /app/

RUN npm install

COPY . /app/
EXPOSE ${PORT}
CMD [ "npm", "start" ]