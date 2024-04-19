import {useLoaderData} from '@remix-run/react';
import {
  type LoaderFunctionArgs,
  defer,
  type ActionFunctionArgs,
  json,
} from '@remix-run/server-runtime';
import {CartForm, getPaginationVariables} from '@shopify/hydrogen';
import {Products} from '~/components/Products';

export const loader = ({params, context, request}: LoaderFunctionArgs) => {
  const products = context.storefront.query(PRODUCTS_QUERY, {
    variables: {
      handle: params.handle,
      ...getPaginationVariables(request, {pageBy: 1}),
    },
  });

  return defer({products});
};

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  let result;

  if (action === CartForm.ACTIONS.LinesAdd) {
    result = await cart.addLines(inputs.lines);
  }

  const headers = result?.cart?.id
    ? cart.setCartId(result?.cart?.id)
    : undefined;

  return json(result, {status: 200, headers});
}

const ProductsPage = () => {
  const {products} = useLoaderData<typeof loader>();

  return <Products products={products} />;
};

export default ProductsPage;

const PRODUCTS_QUERY = `#graphql
    fragment ProductsFragment on Product {
        id
    title
    handle
    featuredImage {id url}
    options {
      name
      values
    }
    }

    fragment ProductsVariantFragment on ProductVariant {
     availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
    }

    query AllProducts(
        $country: CountryCode,
        $language: LanguageCode,
        $first: Int,
        $last: Int,
        $startCursor: String,
        $endCursor: String,
        $handle: String
        )
        @inContext(country: $country, language: $language){
collection(handle: $handle) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...ProductsFragment
        variants(first: 1) {
          nodes {
            ...ProductsVariantFragment
            }
          }
      }
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
       
      }
    }
  }
        }
    
` as const;
