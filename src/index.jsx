import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import styled from 'styled-components'
import memoizeOne from 'memoize-one'
import 'react-table/react-table.css'

const StyledTable = styled(ReactTable)`
  width: 100%;
`

const DEFAULT_PAGE_SIZE = 20

class Table extends Component {
  state = {
    pageOptions: {
      page: 0,
      pageSize: this.props.defaultPageSize,
      totalSize: null
    },
    data: [],
    next: null
  }

  componentDidMount() {
    this.getResourcesData()
    this.getResourcesCount()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.deletedItems.length !== this.props.deletedItems.length) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        ({ data }) => ({
          data: data.filter(item => !this.props.deletedItems.includes(item.id))
        }),
        () => {
          this.props.updateConsumerState(this.state.data)
        }
      )
    }
  }

  getResourcesData = () => {
    this.memoizedRequest()
      .getAll()
      .then(res =>
        this.setState({ data: res.data, next: res.next }, () => {
          this.props.updateConsumerState(this.state.data)
        })
      )
      .catch(this.props.onError)
  }

  getResourcesCount = () => {
    if (this.memoizedRequest().count) {
      this.memoizedRequest()
        .count()
        .then(res =>
          this.setState(({ pageOptions }) => ({
            pageOptions: {
              ...pageOptions,
              totalSize: res.data[0].count
            }
          }))
        )
        .catch(this.props.onError)
    } else {
      this.setState(({ pageOptions }) => ({
        pageOptions: {
          ...pageOptions,
          totalSize: this.state.data.length
        }
      }))
    }
  }

  makeRequest = () => {
    const { sdkInstance, dataType } = this.props
    return sdkInstance[dataType]()
  }

  memoizedRequest = memoizeOne(this.makeRequest)

  handlePageChange = page => {
    this.setState(({ pageOptions }) => ({
      pageOptions: { ...pageOptions, page }
    }))
  }
  handlePageSizeChange = pageSize => {
    this.setState(({ pageOptions }) => ({
      pageOptions: { ...pageOptions, pageSize }
    }))
  }

  // remove rows where deleted is true
  ingest = data => data.filter(row => !row.deleted)

  calcTotalPageSize = () => {
    const {
      pageOptions: { pageSize, totalSize }
    } = this.state
    // defaults to 1000 pages if cannot fetch counts from API
    return Math.ceil((totalSize || pageSize) / pageSize) || 1000
  }

  render() {
    const { data: propsData, columns, ...rest } = this.props // eslint-disable-line no-unused-vars
    const {
      data: localData,
      pageOptions: { page, pageSize }
    } = this.state

    const cleanedData = this.ingest(localData)

    return (
      <StyledTable
        data={cleanedData}
        columns={columns}
        page={page}
        pageSize={pageSize}
        className="-striped -highlight"
        noDataText="No data"
        pages={this.calcTotalPageSize()}
        onPageChange={this.handlePageChange}
        onPageSizeChange={this.handlePageSizeChange}
        onFetchData={state => {
          const loaded = cleanedData && cleanedData.length
          const requested = (state.page + 1) * state.pageSize

          if (requested >= loaded && this.state.next) {
            this.state.next
              .then(res =>
                this.setState(
                  ({ data }) => ({
                    data: data.concat(res.data),
                    next: res.next ? res.next : null
                  }),
                  () => {
                    this.props.updateConsumerState(this.state.data)
                  }
                )
              )
              .catch(this.props.onError)
          }
        }}
        {...rest}
      />
    )
  }
}

Table.propTypes = {
  totalRows: PropTypes.number,
  data: PropTypes.array,
  columns: PropTypes.array.isRequired,
  sdkInstance: PropTypes.object,
  dataType: PropTypes.string,
  useBarLoader: PropTypes.bool,
  defaultPageSize: PropTypes.number,
  onError: PropTypes.func,
  updateConsumerState: PropTypes.func,
  deletedItems: PropTypes.array
}

Table.defaultProps = {
  data: null,
  totalRows: null,
  sdkInstance: {},
  dataType: '',
  useBarLoader: false,
  defaultPageSize: DEFAULT_PAGE_SIZE,
  onError: () => {},
  updateConsumerState: () => {},
  deletedItems: []
}

export default Table
