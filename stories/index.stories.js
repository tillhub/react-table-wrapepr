import React from 'react'
import { storiesOf } from '@storybook/react'
import { toast } from 'react-toastify'
import Table from '../src/Table'

const dispatchError = err => {
  toast.error(err.message)
}

const columns = [
  {
    Header: 'Name',
    accessor: 'name',
    Cell: row => row.value
  },
  {
    Header: 'Branch',
    accessor: 'branch_number',
    Cell: row => row.value
  },
  {
    Header: 'Address',
    accessor: 'address',
    Cell: row => row.value
  },
  {
    Header: 'Country',
    accessor: 'country',
    Cell: row => row.value
  }
]

const sdk = {
  data: () => ({
    getAll: () =>
      Promise.resolve({
        data: [
          {
            name: 'Stark Inc.',
            branch_number: '1',
            address: 'Manhattan, New York City',
            country: 'New York, USA'
          }
        ],
        next: () =>
          Promise.resolve({
            data: [
              {
                name: 'Tillhub,',
                branch_number: '1',
                address: 'Berlin',
                country: 'Germany'
              }
            ],
            next: () => ({})
          })
      }),
    count: () =>
      Promise.resolve({
        data: [
          {
            count: 1
          }
        ]
      })
  })
}

storiesOf('Table', module).add('simple', () => (
  <Table
    onError={dispatchError}
    sdkInstance={sdk}
    dataType="data"
    columns={columns}
  />
))
