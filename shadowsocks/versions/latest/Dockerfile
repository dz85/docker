#
# Dockerfile for kcptun
#

FROM golang:alpine as builder_kcptun
LABEL maintainer="David.Z <geek@lzw.name>"
RUN apk update && \
    apk upgrade && \
    apk add git --no-cache
RUN go get -ldflags "-X main.VERSION=$(date -u +%Y%m%d) -s -w" github.com/xtaci/kcptun/client && \
    go get -ldflags "-X main.VERSION=$(date -u +%Y%m%d) -s -w" github.com/xtaci/kcptun/server

#
# Dockerfile for shadowsocks-libev
#

FROM alpine as builder_ss
LABEL maintainer="David.Z <geek@lzw.name>"
RUN apk update && \
    apk add --no-cache --virtual .build-deps \
    git \
    autoconf \
    automake \
    build-base \
    c-ares-dev \
    libev-dev \
    libtool \
    libsodium-dev \
    linux-headers \
    mbedtls-dev \
    pcre-dev && \
    git clone https://github.com/shadowsocks/shadowsocks-libev.git /tmp/repo && \
    cd /tmp/repo && \
    git submodule update && \
    ./autogen.sh && \
    ./configure --prefix=/usr --disable-documentation && \
    make install && \
    apk del .build-deps && \
    apk add --no-cache && \
    rng-tools $(scanelf --needed --nobanner /usr/bin/ss-* | awk '{ gsub(/,/, "\nso:", $2); print "so:" $2 }' | sort -u) && \
    rm -rf /tmp/repo

#
# Dockerfile for main
#

FROM alpine
LABEL maintainer="David.Z <geek@lzw.name>"
COPY --from=builder_kcptun /go/bin/server /usr/bin/kcptun-server
COPY --from=builder_kcptun /go/bin/client /usr/bin/kcptun-client
COPY --from=builder_ss /usr/bin/ss-* /usr/bin/
