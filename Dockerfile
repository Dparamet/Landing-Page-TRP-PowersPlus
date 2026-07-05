FROM node:latest AS builder
WORKDIR /TRPpowersPlus
COPY package.json .
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000

FROM nginx:alpine
COPY --from=builder /TRPpowersPlus/out /usr/share/nginx/html