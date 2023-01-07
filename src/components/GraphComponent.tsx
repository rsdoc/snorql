import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { queries } from '../data';

export default function D3Graph({ queryResponse }: any) {
  let { id }: any = useParams();

  useEffect(() => {
    const queriesList = queries;
    const currentQuery = queriesList.filter(
      (query: any) => parseInt(query.id) === parseInt(id)
    )[0];

    d3Sparql('https://dbpedia.org/sparql', currentQuery?.query)
      .then((data: any) => console.log(data, 'data....'))
      .catch((error: any) => console.log(error));

    console.log('currentQuery...', currentQuery);
  });
  return <h1>I am graph component</h1>;
}
