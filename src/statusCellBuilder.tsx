import { TableCellBuilder, TableCellBuilderOptions } from '@grafana/ui/components/Table/TableCellBuilder';
import React from 'react';
import numeral from 'numeral';


/** Simplest cell that just spits out the value */
export const StatusCellBuilder: TableCellBuilder = (cell: TableCellBuilderOptions) => {
  const { props, value, className, tresholds, trend } = cell;
  const { style } = props;
  // Get difference bettwen 5 weeks ago and this week in one value.

  const getTrend = function(element: any) {

    if (element === undefined || element == null || element.trend === undefined || element.trend === null)
      return (<span style={{ color: 'black' }}></span>);
    else if (element.trend > trend[0])
      return (<span style={{ color: 'black' }}>▲	 ({numeral(element.trend).format('+0%')})</span>);
    else if (element.trend < trend[1])
      return (<span style={{ color: 'black' }}>▼ ({numeral(element.trend).format('+0%')})</span>);
    else
      return (<span style={{ color: 'black' }}>▶ ({numeral(element.trend).format('+0%')})</span>);
  };

  const getColor = function(element: any) {
    if (element == null || element.color === undefined || element.color === null)
      return 'black';
    else if (element.color > tresholds[0])
      return 'green';
    else if (element.color < tresholds[1])
      return 'red';
    else
      return 'orange';
  };

  const getBgColor = function(element: any) {
    if (element == null || element.color === undefined || element.color === null)
      return '';
    else if (element.color > tresholds[0])
      return '#d2f8d2';
    else if (element.color < tresholds[1])
      return 'pink';
    else
      return '#FFEDCC';
  };

  const getValue = function(value) {
    let row = cell.row[0];
    let col = cell.column.name;
    if (value === undefined || value == null || value.value === undefined)
      return 'n/a';
    if (row == 'Commission' || row == 'EPV' || col == 'Commission' || col == 'EPV')
      return numeral(value.value).format('$0,0');
    if (row == 'CTR' || row == 'FID' || row == 'FCP' || row == 'Stability' || row == 'BR' || col == 'CTR' || col == 'FID' || col == 'FCP' || col == 'Stability' || col == 'BR')
      return numeral(value.value).format('0\\%');
    if (props.format)
      return numeral(value.value).format(props.format);
    if (value.value < 1)
      return numeral(value.value).format('0.[00]');

    return numeral(value.value).format('0,0');

  };

  return (
    <div style={{ ...style, padding: '10px', background: getBgColor(value) }} className={'gf-table-cell ' + className}>
      <span style={{ color: getColor(value), fontWeight: 'bold' }}>{getValue(value)}</span> {getTrend(value)}
    </div>
  );
};

export const rowCellBuilder: TableCellBuilder = (cell: TableCellBuilderOptions) => {
  const { props, value, className } = cell;
  const { style } = props;

  return (
    <div style={{ ...style, fontWeight: 'bold', padding: '10px' }} className={'gf-table-cell ' + className}>
      <span>{value || 'n\\a'}</span>
    </div>
  );
};