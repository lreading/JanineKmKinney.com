FROM postgres:12

COPY scripts/ /docker-entrypoint-initdb.d/
COPY ./docker-healthcheck /usr/local/bin
# TODO: May want to change for production, this is a very short interval meant for test databases only
HEALTHCHECK --interval=2s CMD ["docker-healthcheck"]