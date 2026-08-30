# --- Build stage ---
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B clean package -DskipTests

# --- Runtime stage ---
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=build /build/target/coding-platform.jar app.jar

# NOTE: this runtime image only ships the JDK, so out of the box only JAVA
# submissions can be compiled/run by LocalProcessCodeExecutionService. To
# support PYTHON, CPP and JAVASCRIPT submissions inside this container, install
# the corresponding toolchains (python3, g++, nodejs) or point the app at a
# separate Docker-per-language sandbox as described in the README.

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
