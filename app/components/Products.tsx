import {Await, type FetcherWithComponents, Link} from '@remix-run/react';
import {CartForm, Image, Money, Pagination} from '@shopify/hydrogen';
import {Suspense} from 'react';
import {type AllProductsQuery} from 'storefrontapi.generated';

interface ProductsProps {
  products: Promise<AllProductsQuery>;
}

export const Products = ({products}: ProductsProps) => {
  return (
    <Suspense fallback={<div>...Loading</div>}>
      <Await resolve={products}>
        {({collection}) =>
          collection && (
            <Pagination connection={collection.products}>
              {({nodes, NextLink, PreviousLink}) => (
                <>
                  <PreviousLink>Previous</PreviousLink>

                  {nodes.map(({id, title, handle, featuredImage, variants}) => (
                    <>
                      <Link key={id} to={`/products/${handle}`}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: 'fit-content',
                          }}
                        >
                          {featuredImage && (
                            <Image data={featuredImage} width={150} />
                          )}
                          {title}
                        </div>

                        <Money data={variants.nodes[0].price} />
                        {variants.nodes[0].compareAtPrice && (
                          <Money
                            as="s"
                            data={variants.nodes[0].compareAtPrice}
                          />
                        )}
                      </Link>

                      <CartForm
                        action={CartForm.ACTIONS.LinesAdd}
                        inputs={{
                          lines: [
                            {
                              merchandiseId: variants.nodes[0].id,
                              quantity: 1,
                            },
                          ],
                        }}
                      >
                        {(fetcher: FetcherWithComponents<any>) => (
                          <>
                            <button
                              type="submit"
                              disabled={fetcher.state !== 'idle'}
                            >
                              buy
                            </button>
                          </>
                        )}
                      </CartForm>
                    </>
                  ))}

                  <NextLink>Next</NextLink>
                </>
              )}
            </Pagination>
          )
        }
      </Await>
    </Suspense>
  );
};
