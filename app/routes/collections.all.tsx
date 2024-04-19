import {useLoaderData} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {getPaginationVariables} from '@shopify/hydrogen';

import {Collections} from '~/components/Collections';

export const loader = async ({request, context}: LoaderFunctionArgs) => {
  const {storefront} = context;

  const variables = getPaginationVariables(request, {pageBy: 1});

  const collections = storefront.query(COLLECTIONS_QUERY, {
    variables,
  });

  return defer({collections});
};

const CollectionsPage = () => {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div>
      <Collections collections={collections} />
    </div>
  );
};

const COLLECTIONS_QUERY = `#graphql 
    fragment CollectionFragment on Collection {
        id
        title
        handle
        image {
            id
            url
        }
    }

    query Collections (
        $country: CountryCode,
        $language: LanguageCode,
        $first: Int,
        $last: Int,
        $startCursor: String,
        $endCursor: String
        )
        @inContext(country: $country, language: $language) {
            collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
                nodes {
                ...CollectionFragment
                }
                pageInfo {
                hasPreviousPage
                hasNextPage
                startCursor
                endCursor
                }
            }
            	
        }
    
` as const;

export default CollectionsPage;
