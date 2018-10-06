FROM node:10
RUN mkdir -p /app
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ENV PORT 8080
CMD ["npm","start"]

