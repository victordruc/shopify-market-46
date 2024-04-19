import {Form, NavLink} from '@remix-run/react';
import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';

const Account = () => {
  const style: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  return <div style={{...style, alignItems: 'center'}}></div>;
};

export default Account;
