FROM ubuntu:20.04
FROM node:18 as node
WORKDIR /
COPY . .
RUN npm install 
RUN npm install next@latest
RUN npm run build
EXPOSE 3000

CMD ["npm","run","start"]
