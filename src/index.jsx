import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
// import styled from 'styled-components'
import 'react-table/react-table.css'

// const StyledTable = styled(ReactTable)`
//   width: 100%;
// `

const DEFAULT_PAGE_SIZE = 20

class Table extends Component {
  state = {
    pageOptions: {
      page: 0,
      pageSize: this.props.defaultPageSize,
      totalSize: null
    },
    isPending: false,
    data: this.props.data,
    next: null
  }

  componentDidMount() {
    this.getResourcesData()
    this.getResourcesCount()
  }

  getResourcesData = () => {
    this.makeRequest()
      .getAll()
      .then(res =>
        this.setState({ data: res.data, next: res.next, isPending: false })
      )
      .catch(this.props.onError)
  }

  getResourcesCount = () => {
    this.makeRequest()
      .count()
      .then(res =>
        this.setState(({ pageOptions }) => ({
          pageOptions: {
            ...pageOptions,
            totalSize: res.data[0].count
          },
          isPending: false
        }))
      )
      .catch(this.props.onError)
  }

  makeRequest = () => {
    const { sdkInstance, dataType } = this.props
    this.setState({ isPending: true })
    return sdkInstance[dataType]()
  }

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
      isPending,
      pageOptions: { page, pageSize }
    } = this.state

    const cleanedData = this.ingest(localData)

    return (
      <ReactTable
        data={this.ingest(cleanedData)}
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
            this.setState({ isPending: true })
            this.state.next
              .then(res =>
                this.setState(({ data }) => ({
                  data: data.concat(res.data),
                  next: res.next ? res.next : null,
                  isPending: false
                }))
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
  onError: PropTypes.func
}

Table.defaultProps = {
  data: [],
  totalRows: null,
  sdkInstance: {},
  dataType: '',
  useBarLoader: false,
  defaultPageSize: DEFAULT_PAGE_SIZE,
  onError: () => {}
}

Table.contextTypes = {
  store: PropTypes.object
}

export default Table
