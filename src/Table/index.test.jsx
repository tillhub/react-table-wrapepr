import React from 'react'
import { render, waitForElement } from 'react-testing-library'
import Table from './'

const companyName = 'Stark Inc.'

const sdk = {
  branches: () => ({
    getAll: () =>
      Promise.resolve({
        data: [
          {
            name: companyName,
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
      })
  })
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

describe.skip('Table', () => {
  test('render', async () => {
    const { getByText } = render(
      <Table columns={columns} sdkInstance={sdk} dataType="branches" />
    )
    const name = await waitForElement(() => getByText(companyName))
    // fireEvent.click(next)
  })
})
