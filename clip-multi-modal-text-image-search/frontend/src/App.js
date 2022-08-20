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
  const [showMore, setShowMore] = useState(false);

  const onChange = event => {
    setSearchTerm(event.target.value);
  };

  const fetch = useCallback(() => {
    async function fetch() {
      const res = await client.graphql
        .get()
        .withClassName('MultiModal')
        .withNearText({concepts: [searchTerm]})
        .withFields('filename image _additional{ certainty id }')
        .do();
      setResults(res);
    }

    fetch();
  }, [searchTerm]);

  const onSubmit = event => {
    setShowMore(false)
    fetch();
    event.preventDefault();
  };

  const getResults = results => {
    const head = results['data']['Get']['MultiModal'][0]
    return <div>
        <div>
          <img
            style={{ maxHeight: '400px' }}
            alt="Certainty: "
            src={
              'data:image/jpg;base64,' +
              head['image']
            }
          />
          <div >Certainty: {(head['_additional']['certainty']*100).toFixed(2)} %</div>
        </div>
      </div>
  }

  const getRestResults = (results) => {
    const [, ...rest] = results['data']['Get']['MultiModal']
    return <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', paddingTop: "20px"}}>
      {
        rest.map(obj => {
          return (
            <div key={obj['_additional']['id']}>
              <img
                style={{ maxHeight: '100px' }}
                alt="Certainty: "
                src={
                  'data:image/jpg;base64,' +
                  obj['image']
                }
              />
              <div >Certainty: {(obj['_additional']['certainty']*100).toFixed(2)} %</div>
            </div>
          )
        })
      }
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
      {results.data && getResults(results)}
      {results.data &&
      <div className="control" style={{paddingTop: "20px"}}>
        <input
          type="button"
          className="button is-info"
          value={showMore ? "Show less" : "Show more"}
          onClick={() => setShowMore(!showMore)}
          style={{backgroundColor: '#fa0171'}}
        />
      </div> }
      { results.data && showMore && getRestResults(results) }
      <div style={{height:'50px'}} />
    </div>
  );
}

export default App;
