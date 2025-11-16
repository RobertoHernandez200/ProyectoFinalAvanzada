# STAGE 1: Build del binario con soporte para Alpine (musl)
FROM golang:latest AS builder

WORKDIR /app

# Variables para compilar binarios estáticos que Alpine pueda ejecutar
ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o server main.go

# STAGE 2: Imagen final mínima
FROM alpine:latest

WORKDIR /app

# Certificados para HTTPS
RUN apk add --no-cache ca-certificates

# Copiar binario compilado correctamente
COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]
