import {Await, Link} from '@remix-run/react';
import {Image, Pagination} from '@shopify/hydrogen';
import {Suspense} from 'react';
import {type CollectionsQuery} from 'storefrontapi.generated';

interface CollectionsProps {
  collections: Promise<CollectionsQuery>;
}

export const Collections = ({collections}: CollectionsProps) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={collections}>
        {({collections}) => (
          <Pagination connection={collections}>
            {({PreviousLink, NextLink, nodes}) => (
              <>
                <PreviousLink>Previous</PreviousLink>

                {nodes.map(({id, title, handle, image}) => (
                  <Link key={id} to={`/products/${handle}`}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: 'fit-content',
                      }}
                    >
                      {image && <Image data={image} width={150} />}
                      {title}
                    </div>
                  </Link>
                ))}

                <NextLink>Next</NextLink>
              </>
            )}
          </Pagination>
        )}
      </Await>
    </Suspense>
  );
};
