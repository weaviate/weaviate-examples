# Weaviate with Prometheus Monitoring & Grafana Dashboards

This setup contains a `docker-compose.yml` that spins up Weaviate (without any
modules), a Prometheus instance, and a Grafana instance. Weaviate is configured
to expose Prometheus-metrics. The Prometheus instance is configured to scrape
those metrics from Weaviate. Finally, the Grafana instance is configured to use
the Prometheus instance as a datasource, and uses a dashboard provider to
include some sample dashboards.

## How to use


### Step 1: Spin everything up

Spin up everything using `docker-compose up -d`. You can check if weaviate is
running by querying the API root (`curl localhost:8080/v1`).

### Step 2: Use Weaviate normally

In order to view metrics on the dashboards, you need to create some usage.
Ideally you will use Weaviate as you would normally use it in this step. As a
very minimal example, we can import two objects using the `/v1/batch` API:

```sh
curl localhost:8080/v1/batch/objects -H 'content-type:application/json' -d '{"objects":[
  {"class": "Example", "vector": [0.1, 0.3], "properties":{"text": "This is the first object"}},
  {"class": "Example", "vector": [0.01, 0.7], "properties":{"text": "This is another object"}}
]}'
```

### Step 3: Open Grafana in the browser

1. Open your Browser at `localhost:3000`
2. Log into the Grafana instance using `weaviate`/`weaviate`.
3. Select one of the sample dashboards, such as "Importing Data Into Weaviate".

You should now see some metrics on this dashboard.



