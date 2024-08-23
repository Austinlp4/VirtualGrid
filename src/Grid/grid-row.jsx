import Checkbox from '@mui/material/Checkbox';
import { GridCell } from './grid-cell';

export const GridRow = ({ 
  row, 
  columnMapping, 
  customCell, 
  data,
  selectable,
  selectedRows,
  handleSelect,
  rowHeight
}) => {
    return (
      <div className="grid-row" style={{
        height: `${rowHeight}px`,
        backgroundColor: row % 2 === 0 ? '#f9f9f9' : 'white',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        {selectable && (
          <div style={{ 
            width: "50px", 
            padding: '0 .5rem',
            boxSizing: 'border-box'
          }}>
            <Checkbox 
              onChange={() => handleSelect(row)}
              checked={selectedRows === 'all' || selectedRows.includes(row)}
            />
          </div>
        )}
        {columnMapping.map((column, index) => {
          const Cell = customCell && customCell['component'] || GridCell;
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
            />
          )
        })}
      </div>
    )
}