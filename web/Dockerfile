FROM node:10
RUN mkdir -p /app
WORKDIR /app
COPY ./server.js .
COPY ./client.html .
COPY ./package.json .
RUN npm install
COPY . .
EXPOSE 8080
#ENV PORT 8080
CMD ["npm","start"]

