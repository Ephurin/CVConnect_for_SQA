FROM node:20-alpine AS builder
WORKDIR /app

COPY . .
RUN rm -rf node_modules

RUN npm install --legacy-peer-deps
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY . .
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "preview"]