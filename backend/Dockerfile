# 1. Build stage
FROM python:3.11-slim AS builder
WORKDIR /app

# Copia apenas requirements e instala
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2. Final image
FROM python:3.11-slim
WORKDIR /app

# Copia as dependências do stage anterior
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
# Copia o código da app
COPY app ./app
COPY start.sh .

# Garante permissão de execução
RUN chmod +x start.sh

# Expõe a porta que o Uvicorn vai usar
EXPOSE 8000

# Comando padrão
CMD ["./start.sh"]
