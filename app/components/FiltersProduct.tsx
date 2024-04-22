import {Await, useSearchParams} from '@remix-run/react';

import {Suspense} from 'react';
import {type AllProductsQuery} from 'storefrontapi.generated';

interface FiltersProductProps {
  products: Promise<AllProductsQuery>;
}

const transformIdToKey = (key: string) => {
  const arrayKey = key.split('.');
  const filterKey = arrayKey[arrayKey.length - 1];

  const result = filterKey.replace(/([_\?])(.)/g, (m) =>
    m.toUpperCase().replace('_', ''),
  );

  return result;
};

export const FiltersProduct = ({products}: FiltersProductProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (key: string, value: string) => {
    const filterKey = transformIdToKey(key);

    setSearchParams((filters) => {
      filters.set(filterKey, value);

      return filters;
    });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={products}>
        {({collection}) => (
          <div>
            {collection?.products.filters
              .map(({type, label, id, values}) =>
                type === 'LIST' ? (
                  <label key={id}>
                    {label}
                    <select
                      value={searchParams.get(transformIdToKey(id))!}
                      onChange={(e) => handleChange(id, e.target.value)}
                    >
                      {values.map(({id, label}) => (
                        <option key={id} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null,
              )
              .filter((v) => v)}
          </div>
        )}
      </Await>
    </Suspense>
  );
};
