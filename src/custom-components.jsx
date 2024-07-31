import Checkbox from '@mui/material/Checkbox';

export const NewGridRow = ({ 
  newProp, 
  row, 
  columnMapping, 
  customCell, 
  data,
  selectable,
  selectedRows,
  handleSelect,
  rowHeight
}) => {
    console.log('data from row: ', row, data)
    console.log('selectable: ', selectable);
    return (
      <div className="grid-row" style={{
        height: `${rowHeight}px`,
        backgroundColor: row % 2 === 0 ? '#f9f9f9' : 'white'
      }}>
        {selectable && (
          <div style={{ width: "50px", padding: "0 .5rem" }}>
            <Checkbox 
              onChange={() => handleSelect(row)}
              checked={selectedRows === 'all' || selectedRows.includes(row)}
            />
          </div>
        )}
        {columnMapping.map((column, index) => {
          const Cell = customCell && customCell['component'] || NewGridCell;
          const cellProps = customCell && customCell['props'] || {};
          const MergedCellComponent = (props) => (
            <Cell 
              {...cellProps}
              {...props}
              column={column}
              cell={data[column.key]}
              columnMapping={columnMapping}
            />
          );
          return (
            <MergedCellComponent 
              key={index}
              newProp={newProp}
            />
          )
        })}
      </div>
    )
}

export const NewGridCell = ({ newProp, cell, column, columnMapping }) => {
    console.log('cell: ', cell, columnMapping, column);
    return (
      <div className="grid-cell" style={{
        padding: '0 .5rem',
        width: column.width
      }}>
        {cell}
      </div>
    )
}