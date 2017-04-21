# @ozylog/graphql-errors
Graphql errors handler

[![Travis](https://img.shields.io/travis/ozylog/graphql-errors.svg?style=flat-square)](https://travis-ci.org/ozylog/graphql-errors) [![npm](https://img.shields.io/npm/dt/@ozylog/graphql-errors.svg?style=flat-square)](https://www.npmjs.com/package/@ozylog/graphql-errors)

## Installation
```
npm install @ozylog/graphql-errors --save
```

## Usage

### formatError
```
/*
 * formatError()
 * on development environment, it will return
 * {
 *   type: string,
 *   message: any,
 *   createdAt: Date,
 *   locations: Array<Object>,
 *   path: Array<string>,
 *   stack: string
 * }
 *
 * on production environment, it will return
 * {
 *   type: string,
 *   message: any,
 *   createdAt: Date,
 * }
 */
formatError();

/*
 * formatError(fields)
 * it will return object error based on fields
 * e.g. formartError(['type', 'message', 'locations']) will return
 * {
 *   type: string,
 *   message: any,
 *   locations: Array<Object>
 * }
 */
formatError(fields: Array<string>)
```

### CreateError
```
CreateError(type: string, message: string)
```

## Usage Examples

### formatError
```
'use strict';

import express from 'express';
import expressGraphql from 'express-graphql';
import {formatError} from '@ozylog/graphql-errors';

const app = express();

app.use('/graphql', expressGraphql({
  schema,
  formatError: formatError()
}));
```

### CreateError
```
// errors.js
'use strict';

import {CreateError} from '@ozylog/graphql-errors';

export const BadRequestError = CreateError.bind(null, 'Bad Request');
export const ForbiddenError = CreateError.bind(null, 'Forbidden');


// userMutation.js
'use strict';

import {GraphQLString, GraphQLNonNull} from 'graphql';
import {Rules} from '@ozylog/validator';

import userType from './userType';
import {BadRequestError} from './errors';

export default {
  user: {
    type: userType,
    args: {
      name: {
        name: 'name',
        type: new GraphQLNonNull(GraphQLString)
      },
      email: {
        name: 'email',
        type: new GraphQLNonNull(GraphQLString)
      }
    },
    resolve: async(parentValue, {name, email}) => {
      const rules = new Rules();

      rules.add('name', name, 'Name is required').isRequired();
      rules.add('name', name, 'Min 3 characters').isLength({min: 3});
      rules.add('name', name, 'Max 50 characters').isLength({max: 50});

      rules.add('email', email, 'Email is required').isRequired();
      rules.add('email', email, 'Valid email is required').isEmail();
      rules.add('email', email, 'Max 50 characters').isLength({max: 50});

      const errors = rules.validate();

      if (errors) {
        throw new BadRequestError(errors);
      }

      .....
    }
  }
};
```

## License
MIT
