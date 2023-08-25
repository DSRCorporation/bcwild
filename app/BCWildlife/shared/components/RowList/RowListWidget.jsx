import React from 'react';
import {View} from 'react-native';
import {BaseButton} from '../../../shared/components/BaseButton';

/*
 * value: Array<{key: number}> - Array of rows.  Each row must have a unique
 * `key` property.
 * onAdd: () => void - Called when a new row is requested
 * onDelete: (row: object) => void - Called when row deletion is requested
 * onChange: (newRow: object) => void - Called when row data is changed
 * addLabel?: React.Node - Label for the Add button, "+" by default
 * containerClassName - class name for topmost container, default: RowList-container
 * rowContainerClassName - class name for row container, default: RowList-row-container
 * Row: ({value, onDelete, onChange}) => JSX.Element - Row component, where:
 *   value - row object
 *   onDelete: () => void - Called when row deletion is requested
 *   onChange: (newRow: object) => void - Called when row data is changed
 */
export const RowListWidget = ({value, Row, onAdd, onDelete, onChange, addLabel, containerClassName, rowContainerClassName}) => {
  const addLabelResolved = addLabel || '+';
  const containerClassNameResolved = containerClassName || 'RowList-container';
  const rowContainerClassNameResolved = rowContainerClassName || 'RowList-row-container';
  return (
    <View className={containerClassNameResolved}>
      <View className={rowContainerClassNameResolved}>
        {value.map(row => (
          <Row
            key={row.key}
            value={row}
            onDelete={() => onDelete(row)}
            onChange={onChange}
          />
        ))}
      </View>
      <BaseButton
        onPress={onAdd}
        accessibilityLabel="Add"
      >
        {addLabelResolved}
      </BaseButton>
    </View>
  );
}
