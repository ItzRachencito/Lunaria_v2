FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /build
COPY 03_backend/lunaria-backend-springboot/pom.xml ./pom.xml
COPY 03_backend/lunaria-backend-springboot/mvnw ./
COPY 03_backend/lunaria-backend-springboot/.mvn ./.mvn
RUN apk add --no-cache curl && \
    chmod +x mvnw && \
    ./mvnw dependency:go-offline -B
COPY 03_backend/lunaria-backend-springboot/src ./src
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]
