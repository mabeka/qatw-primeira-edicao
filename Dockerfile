# Playwright atualizado
FROM mcr.microsoft.com/playwright:v1.58.2-noble

# Instalar Java
RUN apt-get update && apt-get install -y \
    openjdk-21-jdk \
    && apt-get clean

# Corrigir JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
ENV PATH="${JAVA_HOME}/bin:${PATH}"

# Diretório de trabalho
WORKDIR /app