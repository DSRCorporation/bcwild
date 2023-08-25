import React, {useState, useEffect} from 'react';
import {RowListWidget} from './RowListWidget';

/*
 * Uncontrolled component for editing a list of similarly looking "rows".
 * initialValue?: Array<{key: number}> - Array of rows.  Each row must have a
 * unique `key` property.
 * createRow: (key: number) => object - Create a blank row object with given key.
 * onChange: (newRow: object) => void - Called when row data is changed
 * addLabel?: React.Element - Label for the Add button, "+" by default
 * containerClassName - class name for topmost container, default: RowList-container
 * rowContainerClassName - class name for row container, default: RowList-row-container
 * Row: ({value, onDelete, onChange}) => JSX.Element - Row component, where:
 *   value - row object
 *   onDelete: () => void - Called when row deletion is requested
 *   onChange: (newRow: object) => void - Called when row data is changed
 */

export const RowList = ({ initialValue, Row, createRow, onChange, addLabel, containerClassName, rowContainerClassName }) => {
  const [value, setValue] = useState(initialValue || [createRow(1)]);
  const onAdd = () => setValue(value => {
    const lastKey = value.reduce((acc, {key}) => Math.max(acc, key), 0);
    const newKey = lastKey + 1;
    return [...value, createRow(newKey)];
  });
  const onDelete = row => {
    setValue(value => value.filter(({key}) => key !== row.key));
  };
  const onRowChange = newRow => {
    console.debug('orc', newRow);
    setValue(value => value.map(oldRow => oldRow.key === newRow.key ? newRow : oldRow));
  };
  useEffect(() => onChange && onChange(value), [value, onChange]);
  return (
    <RowListWidget
      value={value}
      Row={Row}
      onAdd={onAdd}
      onDelete={onDelete}
      onChange={onRowChange}
      addLabel={addLabel}
      containerClassName={containerClassName}
      rowContainerClassName={rowContainerClassName}
    />
  );
}

