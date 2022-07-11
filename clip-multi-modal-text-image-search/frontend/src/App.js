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
        .withFields('filename image _additional{ certainty }')
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

  const getResult = results => {
    const certainty = results['data']['Get']['MultiModal'][0]['_additional']['certainty']
    return <div>
        <img
          style={{ maxHeight: '400px' }}
          alt="Certainty: "
          src={
            'data:image/jpg;base64,' +
            results['data']['Get']['MultiModal'][0]['image']
          }
        />
        <div >Certainty: {certainty*100} %</div>
      </div>
  }

  return (
    <div className="container" style={{textAlign: 'center', maxWidth: '600px'}}>
      <img
        alt="Weaviate Logo"
        src={logo}
        width="33%"
        style={{margin: '25px', maxHeight: '100px'}}
      />
      <h1 className="title">
        Weaviate <code>v1.14.1</code> CLIP Demo
      </h1>
      <h2 className="subtitle">Multi-Modal Image/Text search</h2>
      <form
        onSubmit={onSubmit}
        style={{marginTop: '50px', marginBottom: '50px'}}
      >
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              className="input is-large"
              type="text"
              placeholder="Search for images"
              onChange={onChange}
            />
          </div>
          <div className="control">
            <input
              type="submit"
              className="button is-info is-large"
              value="Search"
              style={{backgroundColor: '#fa0171'}}
            />
          </div>
        </div>
      </form>
      {results.data && getResult(results)}
    </div>
  );
}

export default App;
