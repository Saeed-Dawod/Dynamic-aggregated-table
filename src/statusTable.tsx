// Libraries
import _ from 'lodash';
import React, { Component, ReactElement } from 'react';
import {
  MultiGrid,
  CellMeasurerCache,
  CellMeasurer,
  GridCellProps,
  Index,
} from 'react-virtualized';
import { Themeable } from '@grafana/ui/types/theme';
import {
  TableCellBuilder,
  ColumnStyle,
  TableCellBuilderOptions,
} from '@grafana/ui/components/Table/TableCellBuilder';
import { StatusCellBuilder, rowCellBuilder } from './statusCellBuilder';
import { SeriesData } from '@grafana/ui/types/data';
import { InterpolateFunction } from '@grafana/ui/types/panel';




export interface Props extends Themeable {
  data: SeriesData;

  minColumnWidth: number;
  showHeader: boolean;
  fixedHeader: boolean;
  fixedColumns: number;
  rotate: boolean;
  styles: ColumnStyle[];

  replaceVariables: InterpolateFunction;
  width: number;
  height: number;
  isUTC?: boolean;
  dynamicThreshold?: any;
  dynamicTrend?: any;
}


interface DataIndex {
  column: number;
  row: number; // -1 is the header!
}

export class StatusTable extends Component<Props> {

  measurer: CellMeasurerCache;
  scrollToTop = false;
  rotateWidth = 100;

  static defaultProps = {
    showHeader: true,
    fixedHeader: true,
    fixedColumns: 0,
    rotate: false,
    minColumnWidth: 10,
  };

  constructor(props: Props) {
    super(props);

    this.measurer = new CellMeasurerCache({
      defaultHeight: 30,
      fixedWidth: true,
    });
  }

  componentDidUpdate(prevProps: Props) {
    const { data, showHeader, rotate } = this.props;
    const dataChanged = data !== prevProps.data;
    const configsChanged =
      showHeader !== prevProps.showHeader ||
      this.props.rotate !== prevProps.rotate ||
      this.props.fixedColumns !== prevProps.fixedColumns ||
      this.props.fixedHeader !== prevProps.fixedHeader;

    // Reset the size cache
    if (dataChanged || configsChanged) {
      this.measurer.clearAll();
    }


    if (dataChanged || rotate !== prevProps.rotate) {
      const { width, minColumnWidth } = this.props;
      this.rotateWidth = Math.max(width / data.rows.length, minColumnWidth);
    }

  }


  /** Converts the grid coordinates to SeriesData coordinates */
  getCellRef = (rowIndex: number, columnIndex: number): DataIndex => {
    const { showHeader, rotate } = this.props;
    const rowOffset = showHeader ? -1 : 0;

    if (rotate) {
      return { column: rowIndex, row: columnIndex + rowOffset };
    } else {
      return { column: columnIndex, row: rowIndex + rowOffset };
    }
  };

  onCellClick = (rowIndex: number, columnIndex: number) => {
    const { row, column } = this.getCellRef(rowIndex, columnIndex);
    const values = this.props.data.rows[row];
    const value = values[column];
    console.log('CLICK', value, row);

  };

  headerBuilder = (cell: TableCellBuilderOptions): ReactElement<'div'> => {
    const { data } = this.props;
    const { columnIndex, rowIndex, style } = cell.props;
    const { column } = this.getCellRef(rowIndex, columnIndex);

    let col = data.fields[column];

    if (!col) {
      col = {
        name: '??' + columnIndex + '???',
      };
    }

    return (
      <div className="gf-table-header" style={style} onClick={() => this.onCellClick(rowIndex, columnIndex)}>
        {col.name}
      </div>
    );
  };

  getTableCellBuilder = (column: number): TableCellBuilder => {
    if (column == 0)
      return rowCellBuilder;
    return StatusCellBuilder ; // the default
  };

  cellRenderer = (props: GridCellProps): React.ReactNode => {
    const { rowIndex, columnIndex, key, parent } = props;
    const { row, column } = this.getCellRef(rowIndex, columnIndex);
    const { data } = this.props;

    const isHeader = row < 0;
    const rowData = isHeader ? data.fields : data.rows[row];
    const value = rowData ? rowData[column] : '';
    const builder = isHeader ? this.headerBuilder : this.getTableCellBuilder(column);


    return (
      <CellMeasurer cache={this.measurer} columnIndex={columnIndex} key={key} parent={parent} rowIndex={rowIndex}>
        {builder({
          value,
          row: rowData,
          column: data.fields[column],
          tresholds: this.props.dynamicThreshold,
          trend: this.props.dynamicTrend,
          props,
        })}
      </CellMeasurer>
    );
  };


  getColumnWidth = (col: Index): number => {
    return Math.max((this.props.width - 10) / this.props.data.fields.length, this.props.minColumnWidth);
    ;
  };

  render() {
    const { showHeader, fixedHeader, fixedColumns, rotate, width, height } = this.props;
    const { data } = this.props;
    if (!data || !data.fields || !data.fields.length) {
      return <span>Missing Fields</span>; // nothing
    }

    let columnCount = data.fields.length;
    let rowCount = data.rows.length + (showHeader ? 1 : 0);
    console.log(rowCount);
    let fixedColumnCount = Math.min(fixedColumns, columnCount);
    let fixedRowCount = showHeader && fixedHeader ? 1 : 0;


    // Called after sort or the data changes
    const scroll = this.scrollToTop ? 1 : -1;
    const scrollToRow = rotate ? -1 : scroll;
    const scrollToColumn = rotate ? scroll : -1;
    if (this.scrollToTop) {
      this.scrollToTop = false;
    }

    // Force MultiGrid to rerender if these options change
    // See: https://github.com/bvaughn/react-virtualized#pass-thru-props
    const refreshKeys = {
      d1: this.props.data,
      s0: this.props.styles,
    };
    return (
      <MultiGrid
        {...refreshKeys}
        scrollToRow={scrollToRow}
        columnCount={columnCount}
        scrollToColumn={scrollToColumn}
        rowCount={rowCount}
        overscanColumnCount={8}
        overscanRowCount={8}
        columnWidth={this.getColumnWidth}
        deferredMeasurementCache={this.measurer}
        cellRenderer={this.cellRenderer}
        rowHeight={this.measurer.rowHeight}
        width={width}
        height={height}
        fixedColumnCount={fixedColumnCount}
        fixedRowCount={fixedRowCount}
        classNameTopLeftGrid="gf-table-fixed-column"
        classNameBottomLeftGrid="gf-table-fixed-column"

      />
    );
  }
}

export default StatusTable;