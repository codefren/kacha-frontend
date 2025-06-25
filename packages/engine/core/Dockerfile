FROM openjdk:8-jdk-alpine as build
# ----
# Install Maven
RUN apk add --no-cache curl tar bash
ARG MAVEN_VERSION=3.6.3
ARG USER_HOME_DIR="/root"
RUN mkdir -p /usr/share/maven && \
    curl -fsSL http://apache.osuosl.org/maven/maven-3/$MAVEN_VERSION/binaries/apache-maven-$MAVEN_VERSION-bin.tar.gz | tar -xzC /usr/share/maven --strip-components=1 && \
    ln -s /usr/share/maven/bin/mvn /usr/bin/mvn
ENV MAVEN_HOME /usr/share/maven
ENV MAVEN_CONFIG "$USER_HOME_DIR/.m2"
# speed up Maven JVM a bit
ENV MAVEN_OPTS="-XX:+TieredCompilation -XX:TieredStopAtLevel=1"
#ENTRYPOINT ["/usr/bin/mvn"]
# ----
# Install project dependencies and keep sources
# make source folder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# installing projects
COPY packages/engine/core /usr/src/app
RUN mvn clean install && rm -rf build/ && mkdir -p build && cd jsprit-optimroute/ && mvn clean compile assembly:single && cp target/jsprit-optimroute-1.8-SNAPSHOT-jar-with-dependencies.jar ../build/
# copying to exec directory
FROM openjdk:8-jdk-alpine
COPY --from=build /usr/src/app/jsprit-optimroute/target/jsprit-optimroute-1.8-SNAPSHOT-jar-with-dependencies.jar /opt/jsprit-optimroute-1.8-SNAPSHOT-jar-with-dependencies.jar
COPY --from=build /usr/local /usr/local
WORKDIR /opt
RUN chmod +x jsprit-optimroute-1.8-SNAPSHOT-jar-with-dependencies.jar
# ENTRYPOINT ["/opt/jsprit-optimroute-1.8-SNAPSHOT-jar-with-dependencies.jar"]
ENTRYPOINT ["java","-jar","/opt/jsprit-optimroute-1.8-SNAPSHOT-jar-with-dependencies.jar"]