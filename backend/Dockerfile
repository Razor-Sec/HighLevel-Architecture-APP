FROM python:3.13.0a3-alpine
RUN adduser -D razor
RUN apk add build-base mariadb-connector-c-dev \ 
    && apk add --virtual build-deps gcc python3-dev musl-dev \  
    && apk add --no-cache mariadb-dev
USER razor
WORKDIR /app
COPY --chown=razor:razor ./requirements.txt requirements.txt
RUN pip3 install --user --upgrade pip --no-warn-script-location
RUN pip3 install --user -r requirements.txt --no-warn-script-location
ENV PATH="/home/razor/.local/bin:${PATH}"
COPY --chown=razor:razor . .
#RUN python3 -c "import services; services.create_database()"
#CMD ["uvicorn", "main:app", "--reload"]


