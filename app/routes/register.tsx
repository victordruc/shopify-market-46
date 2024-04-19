import {Form, json, useActionData} from '@remix-run/react';
import {type ActionFunctionArgs} from '@remix-run/server-runtime';
import {type CustomerCreateInput} from '@shopify/hydrogen/storefront-api-types';

export const action = async ({request, context}: ActionFunctionArgs) => {
  const body = await request.formData();

  const variables: Record<string, string> = {};
  body.forEach((value, key) => (variables[key] = value.toString()));

  const data = await context.storefront.mutate(REGISTER_MUTATION, {
    variables: {
      input: variables as unknown as CustomerCreateInput,
    },
  });

  return json(data, {status: 200});
};

const Register = () => {
  const data = useActionData<typeof action>();

  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };
  return (
    <div style={{...style, alignItems: 'center'}}>
      <Form style={style} method="post">
        <label style={style}>
          First Name
          <input name="firstName" />
        </label>
        <label style={style}>
          Last Name
          <input name="lastName" />
        </label>
        <label style={style}>
          Email
          <input name="email" type="email" />
        </label>
        <label style={style}>
          Phone
          <input name="phone" type="phone" />
        </label>
        <label style={style}>
          Password
          <input name="password" type="password" />
        </label>

        <button>Submit</button>
      </Form>
    </div>
  );
};

export default Register;

const REGISTER_MUTATION = `#graphql
mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      email
      firstName
      lastName
    }
    customerUserErrors {
      code
      message
      field
    }
    userErrors {
      field
      message
    }
  }
}
` as const;
