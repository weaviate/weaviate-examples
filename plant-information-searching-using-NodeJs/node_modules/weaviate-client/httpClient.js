const fetch = require("isomorphic-fetch");

const client = (config) => {
  const url = makeUrl(config.baseUri);

  return {
    post: (path, payload, expectReturnContent = true) => {
      return fetch(url(path), {
        method: "POST",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(makeCheckStatus(expectReturnContent));
    },
    put: (path, payload, expectReturnContent = true) => {
      return fetch(url(path), {
        method: "PUT",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(makeCheckStatus(expectReturnContent));
    },
    patch: (path, payload) => {
      return fetch(url(path), {
        method: "PATCH",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }).then(makeCheckStatus(false));
    },
    delete: (path, payload) => {
      return fetch(url(path), {
        method: "DELETE",
        headers: {
          ...config.headers,
          "content-type": "application/json",
        },
        body: payload ? JSON.stringify(payload) : undefined,
      }).then(makeCheckStatus(false));
    },
    get: (path, expectReturnContent = true) => {
      return fetch(url(path), {
        method: "GET",
        headers: {
          ...config.headers,
        },
      }).then(makeCheckStatus(expectReturnContent));
    },
    getRaw: (path) => {
      // getRaw does not handle the status leaving this to the caller
      return fetch(url(path), {
        method: "GET",
        headers: {
          ...config.headers,
        },
      });
    },
  };
};

const makeUrl = (basePath) => (path) => basePath + path;

const makeCheckStatus = (expectResponseBody) => (res) => {
  if (res.status >= 400 && res.status < 500) {
    return res.json().then((err) => {
      return Promise.reject(
        `usage error (${res.status}): ${JSON.stringify(err)}`
      );
    });
  }

  if (res.status >= 500) {
    return res.json().then((err) => {
      return Promise.reject(
        `usage error (${res.status}): ${JSON.stringify(err)}`
      );
    });
  }

  if (expectResponseBody) {
    return res.json();
  }
};

module.exports = client;
