FROM node:20-alpine AS builder
WORKDIR /TRPpowersPlus
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /TRPpowersPlus/out /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf