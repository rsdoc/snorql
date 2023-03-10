import { sql } from '@codemirror/lang-sql';

import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TabList from '../components/TabList';

import { queries } from '../data';

export default function EditorPage() {
  let { id }: any = useParams();
  const [currentQuery, setCurrentQuery] = useState<any>(null);
  const [editorQueryValue, setEditorQueryValue] = useState<any>('');
  const [queryResponse, setQueryResponse] = useState<any>();
  const [error, setError] = useState<any>('');

  useEffect(() => {
    const queriesList = queries;
    const currentQuery = queriesList.filter(
      (query: any) => parseInt(query.id) === parseInt(id)
    )[0];
    setCurrentQuery(currentQuery);
    setQueryResponse('');
    setError('');
  }, [id, setCurrentQuery]);

  const onChange = useCallback((value: any, viewUpdate: any) => {
    setEditorQueryValue(value);
  }, []);

  const handleQueryChange = async () => {
    try {
      const result = await (
        await fetch(
          `https://dbpedia.org/sparql?query=${encodeURIComponent(
            editorQueryValue || currentQuery?.query
          )}&format=json`
        )
      ).json();
      setQueryResponse(result);
    } catch (error: any) {
      setError(error?.message || error);
    }
  };

  return (
    <div>
      <div className="flex flex-col items-start space-y-6 px-4">
        <h2 className="text-xl font-semibold text-gray-600 underline">
          {currentQuery?.title}
        </h2>
        <div className="mt-4 pl-3">
          {currentQuery?.tags?.split(',').map((tag: any, index: number) => (
            <span
              key={`tags-${index + 1}`}
              className="ml-2 mb-2 rounded-full bg-purple-50 px-2 py-1 text-sm tracking-wider ring-1 ring-purple-400"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="w-full">
          <CodeMirror
            value={currentQuery?.query}
            height="300px"
            extensions={[sql()]}
            onChange={onChange}
          />
        </div>
        <div>
          <button
            onClick={handleQueryChange}
            className="rounded bg-purple-300 px-4 py-2 shadow-sm hover:shadow-lg"
          >
            Execute Query
          </button>
        </div>
        <TabList queryResponse={queryResponse} error={error} />
      </div>
    </div>
  );
}
