# @tillhub/react-table-wrapper

> A wrapper over react-table that abstract stuff like fetching data, pagination, and page size and navigation events. Expects reacieving an SDK for fetching data. The SDK should structure from data type methods the themselves have the methods "getAll" and "count". The wrapper passes other not mentioned props down to the react-table library. Please refer to the react-table documentation to find out what other props are accetped.


[![NPM](https://img.shields.io/npm/v/@tillhub/react-table-wrapper.svg)](https://www.npmjs.com/package/@tillhub/react-table-wrapper) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


## Install

```bash
npm install @tillhub/react-table-wrapper
```

### Properties

| Property            | type     | required | default   | description                                                                                                                                                                                                                                      |
| ------------------- | -------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| sdkInstance         | object   | yes      | -         | An SDK instance or API source in the form of an object. Will be used for data fetching that will later on be passed as the data array for the table.                                                                                             |
| dataType            | string   | yes      | -         | The the name of the resource that will get called on the sdkInstance.                                                                                                                                                                            |
| columns             | array    | yes      | -         | Array of objects that includes Header, accessor and Cell keys to organize the fetched data in the table. See `react-table` docs for more descriptive explanation of the columns array prop.                                                      |
| pendingMessage      | boolean  | no       | 'Loading' | The message the table should display before the data is being displayed in the table.                                                                                                                                                            |
| useBarLoader        | boolean  | no       | false     | Should `react-table-wrapper` display a linear bar loader at the top of the component container while the component is being mounted.                                                                                                             |
| onError             | function | no       | () => {}  | A function to run when encountering with error on data fetching.                                                                                                                                                                                 |
| updateConsumerState | function | no       | () => {}  | If the component that is using `react-table-wrapper` needs to know about the fetched data, updateConsumerState should provide a way to to do so in the form of a function. This function will be invoked after fetching the data with this data. |
| deletedItems        | string   | no       | []        | Array of ids that were deleted from the DB while the table was rendered. `react-table-wrapper` will filtered the items from the data that was fetched and was rendered.                                                                          |
| getAllFn            | string   | no       | 'getAll'  | An alternative name for the getAll function provided by the SDK resource object                                                                                                                                                                  |
| countFn             | string   | no       | 'count'   | An alternative name for the count function provided by the SDK resource object                                                                                                                                                                   |

### Usage
```jsx
import React, { Component } from 'react'
import Table from '@tillhub/react-table-wrapper'

class Table extends Component {
  state = {
    data: {}
    deletedItems: []
  }

  dispatchError = (err) => {
    console.error(err.message)
  }

  updateData = data => {
    this.setState({ data })
  }

  render() {
    return (
      <TillhubTable
        sdkInstance={th}
        dataType="branches"
        onError={dispatchError}
        columns={[
          {
            Header: 'Name',
            accessor: 'name',
            Cell: row => row.value
          }
        ]}
        updateConsumerState={this.updateData}
        deletedItems={this.state.deletedItems}
        pendingMessage="Loading data..."
        getAllFn="getAllBranches"
        countFn="countBranches"
      />
    )
  }
}
```

### The SDK instance required shape

```js
{
  branches: () => ({
    count: () =>
      Promise.resolve({
        data: [
          {
            count: 2
          }
        ]
      }),
    getAll: () =>
      Promise.resolve({
        data: [
          {
            name: 'Stark Industries',
            branch_number: '1',
            address: 'Manhattan, New York City',
            country: 'New York, USA',
            id: '1'
          }
        ],
        next: () =>
          Promise.resolve({
            data: [
              {
                name: 'Stark Industries',
                branch_number: '2',
                address: 'Berlin',
                country: 'Germany',
                id: '7'
              }
            ],
            next: () => null
          })
      })
  })
}
```


## License

MIT © [erezsob](https://github.com/erezsob)
