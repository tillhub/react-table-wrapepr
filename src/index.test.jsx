import React from 'react'
import { render, waitForElement } from 'react-testing-library'
import { mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Table from './'

const companyName = 'Stark Inc.'

const sdk = {
  branches: () => ({
    count: () =>
      Promise.resolve({
        data: [
          {
            count: 7
          }
        ]
      }),
    getAll: () =>
      Promise.resolve({
        data: [
          {
            name: companyName,
            branch_number: '1',
            address: 'Manhattan, New York City',
            country: 'New York, USA',
            id: '1'
          },
          {
            name: companyName,
            branch_number: '1',
            address: 'Manhattan, New York City',
            country: 'New York, USA',
            id: '2'
          },
          {
            name: companyName,
            branch_number: '1',
            address: 'Manhattan, New York City',
            country: 'New York, USA',
            id: '3'
          },
          {
            name: companyName,
            branch_number: '1',
            address: 'Manhattan, New York City',
            country: 'New York, USA',
            id: '4'
          },
          {
            name: companyName,
            branch_number: '1',
            address: 'Manhattan, New York City',
            country: 'New York, USA',
            id: '5'
          },
          {
            name: companyName,
            branch_number: '1',
            address: 'Manhattan, New York City',
            country: 'New York, USA',
            id: '6'
          }
        ],
        next: () =>
          Promise.resolve({
            data: [
              {
                name: 'Tillhub,',
                branch_number: '1',
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

describe('Table', () => {
  test('render with data', async () => {
    const wrapper = mount(
      <Table columns={columns} sdkInstance={sdk} dataType="branches" />
    )
    await wrapper.instance().componentDidMount()
    expect(wrapper.state('data')).toHaveLength(6)
    expect(wrapper.state('data')[0]).toMatchObject({
      name: companyName,
      branch_number: '1',
      address: 'Manhattan, New York City',
      country: 'New York, USA',
      id: '1'
    })
  })

  test('delete items', async () => {
    const wrapper = mount(
      <Table columns={columns} sdkInstance={sdk} dataType="branches" />
    )
    await wrapper.instance().componentDidMount()
    expect(wrapper.state('data')).toHaveLength(6)
    wrapper.setProps({ deletedItems: ['1'] })
    expect(wrapper.state('data')).toHaveLength(5)
    expect(wrapper.state('data')[0].id).toBe('2')
  })
})
