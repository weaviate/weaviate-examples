import React, {useState, useCallback} from 'react';
import logo from './logo.svg';

const weaviate = require('weaviate-client');

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

function App() {
  const [results, setResults] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const onChange = event => {
    setSearchTerm(event.target.value);
  };

  const fetch = useCallback(() => {
    async function fetch() {
      const res = await client.graphql
        .get()
        .withClassName('MultiModal')
        .withNearText({concepts: [searchTerm]})
        .withFields('filename image')
        .withLimit(1)
        .do();
      setResults(res);
    }

    fetch();
  }, [searchTerm]);

  const onSubmit = event => {
    fetch();
    event.preventDefault();
  };

  return (
    <div className="container" style={{textAlign: 'center'}}>
      <img
        alt="Weaviate Logo"
        src={logo}
        width="33%"
        style={{margin: '25px'}}
      />
      <h1 className="title">
        Weaviate <code>v1.9.0</code> CLIP Demo
      </h1>
      <h2 className="subtitle">Multi-Modal Image/Text search</h2>
      <form
        onSubmit={onSubmit}
        style={{marginTop: '50px', marginBottom: '50px'}}
      >
        <div class="field has-addons">
          <div class="control is-expanded">
            <input
              class="input is-large"
              type="text"
              placeholder="Search for images"
              onChange={onChange}
            />
          </div>
          <div class="control">
            <input
              type="submit"
              class="button is-info is-large"
              value="Search"
              style={{backgroundColor: '#fa0171'}}
            />
          </div>
        </div>
      </form>
      {results.data && (
        <img
          width="100%"
          alt="Multi-Modal Search Result"
          src={
            'data:image/jpg;base64,' +
            results['data']['Get']['MultiModal'][0]['image']
          }
        />
      )}
    </div>
  );
}

export default App;
