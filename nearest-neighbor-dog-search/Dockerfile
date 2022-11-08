FROM python:3.10-slim-buster

WORKDIR /app

ENV WEAVIATE_URL='http://weaviate:8080'

RUN apt-get update && apt-get -y install curl build-essential
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="$PATH:/root/.cargo/bin"

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY . .

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["./run_all.sh"]
