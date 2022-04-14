function highlightQuery (query, errors) {
  var locations = errors.map(function (e) { return e.locations })
    .reduce(function (a, b) {
      return a.concat(b)
    }, [])

  var queryHighlight = ''

  query.split('\n').forEach(function (row, index) {
    var line = index + 1
    var lineErrors = locations.filter(function (loc) { return loc && loc.line === line })

    queryHighlight += row + '\n'

    if (lineErrors.length) {
      var errorHighlight = []

      lineErrors.forEach(function (line) {
        for (var i = 0; i < 8; i++) {
          errorHighlight[line.column + i] = '~'
        }
      })

      for (var i = 0; i < errorHighlight.length; i++) {
        queryHighlight += errorHighlight[i] || ' '
      }
      queryHighlight += '\n'
    }
  })

  return queryHighlight
}

module.exports = function (params) {
  require('isomorphic-fetch')
  if (!params.url) throw new Error('Missing url parameter')

  var headers = new Headers(params.headers)
  headers.append('Content-Type', 'application/json')

  return {
    query: function (query, variables, onResponse) {

      var req = new Request(params.url, {
        method: 'POST',
        body: JSON.stringify({
          query: query,
          variables: variables
        }),
        headers: headers,
        credentials: params.credentials
      })

      return fetch(req)
      .then(function (res) {
        onResponse && onResponse(req, res)

        return res.json()
      }).then(function (body) {
        if (body.errors && body.errors.length) {
          body.highlightQuery = highlightQuery(query, body.errors)
        }

        return body
      })
    }
  }
}
