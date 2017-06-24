# docker build -t skynet .
# docker save skynet --output skynet.docker
# scp skynet.docker core@cloud.husnoo.com:/tmp/skynet.docker
# docker load --input /tmp/skynet.docker
# docker run -d -p 0.0.0.0:443:443 --name skynet skynet &

FROM alpine
RUN apk update && apk upgrade
RUN apk add --update python py-pip py2-openssl py2-bottle


WORKDIR /code
ADD . /code
ADD host.pem /data/host.pem
ENTRYPOINT [ "python", "/code/skynet.py" ]


EXPOSE  443
CMD ["python", "/code/skynet.py"]
