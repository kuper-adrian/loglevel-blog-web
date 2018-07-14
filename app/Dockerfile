FROM node:8.11.3-alpine

ARG environment=development

ENV PORT=8080
ENV NODE_ENV=${environment}

# Create app directory
WORKDIR /loglevel-blog

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8080
ENTRYPOINT [ "node", "./bin/www" ]