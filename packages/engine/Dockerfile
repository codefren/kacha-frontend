FROM azul/zulu-openjdk-alpine:8 as build
LABEL maintainer "Tim Brust <tim.brust@sinnerschrader.com>"

COPY . /src
WORKDIR /src

ARG REFRESHED_AT
ENV REFRESHED_AT $REFRESHED_AT

#RUN apk add --repository http://dl-cdn.alpinelinux.org/alpine/edge/main/ --no-cache \
#    nodejs \
#    nodejs-npm \
#    yarn \
#    curl \
#    nano

RUN apk add --repository http://dl-cdn.alpinelinux.org/alpine/v3.11/main/ --no-cache --virtual native-deps \
    g++ curl yarn nano gcc libgcc libstdc++ linux-headers make python3 nodejs npm && \
    npm install --quiet node-gyp -g &&\
    npm i -g typescript &&\
    npm install --quiet


ARG MAVEN_VERSION=3.9.4
ARG USER_HOME_DIR="/root"
ARG SHA=deaa39e16b2cf20f8cd7d232a1306344f04020e1f0fb28d35492606f647a60fe729cc40d3cba33e093a17aed41bd161fe1240556d0f1b80e773abd408686217e
ARG BASE_URL=https://apache.osuosl.org/maven/maven-3/${MAVEN_VERSION}/binaries

RUN mkdir -p /usr/share/maven /usr/share/maven/ref \
    && curl -fsSL -o /tmp/apache-maven.tar.gz ${BASE_URL}/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
    && echo "${SHA}  /tmp/apache-maven.tar.gz" | sha512sum -c - \
    && tar -xzf /tmp/apache-maven.tar.gz -C /usr/share/maven --strip-components=1 \
    && rm -f /tmp/apache-maven.tar.gz \
    && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

ENV MAVEN_HOME /usr/share/maven
ENV MAVEN_CONFIG "$USER_HOME_DIR/.m2"

COPY packages/engine/mvn-entrypoint.sh /usr/local/bin/mvn-entrypoint.sh
COPY packages/engine/settings-docker.xml /usr/share/maven/ref/


COPY packages/engine /usr/src/app
WORKDIR /usr/src/app
RUN cd core && mvn clean install && rm -rf build/ && mkdir -p build && cd jsprit-optimroute/  && \
    mvn clean compile assembly:single && chmod +x target/jsprit-optimroute-1.8-SNAPSHOT-jar-with-dependencies.jar

WORKDIR /src

RUN apk add jq bash openssh-client git && rm package-lock.json && git config --global url."https://github.com/".insteadOf git@github.com: && git config --global url."https://".insteadOf git:// && git config --global url."https://".insteadOf ssh:// &&\
    yarn bootstrap && yarn isolate -w @optimroute/engine -o dist &&\
    cd dist &&\
    yarn install &&\
    yarn build && \
    yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")')

FROM azul/zulu-openjdk-alpine:8


COPY --from=build /src/dist/dist /opt/app
COPY --from=build /src/dist/node_modules /opt/app/node_modules
COPY --from=build /usr/src/app/core/jsprit-optimroute/target/ /opt/app/optimroute-engine-core

WORKDIR /opt/app

RUN apk add --repository http://dl-cdn.alpinelinux.org/alpine/edge/main/ --no-cache \
    nano \
    npm && npm install pm2 -g

RUN chmod +x /opt/app/optimroute-engine-core/jsprit-optimroute-1.8-SNAPSHOT-jar-with-dependencies.jar
ENV EXECUTABLE_PATH /opt/app/optimroute-engine-core/jsprit-optimroute-1.8-SNAPSHOT-jar-with-dependencies.jar

ENTRYPOINT ["pm2-runtime", "src/main.js"]