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

FROM shadowsocks/shadowsocks-libev
LABEL maintainer="David.Z <geek@lzw.name>"

ENV SERVER_ADDR 0.0.0.0
ENV SERVER_PORT 8388
ENV PASSWORD=
ENV METHOD      aes-256-gcm
ENV TIMEOUT     300
ENV DNS_ADDRS   8.8.8.8,8.8.4.4
ENV ARGS=

COPY --from=builder_kcptun /go/bin/server /usr/bin/kcptun-server
COPY --from=builder_kcptun /go/bin/client /usr/bin/kcptun-client

USER nobody

CMD exec ss-server \
    -s $SERVER_ADDR \
    -p $SERVER_PORT \
    -k ${PASSWORD:-$(hostname)} \
    -m $METHOD \
    -t $TIMEOUT \
    -d $DNS_ADDRS \
    -u \
    $ARGS
