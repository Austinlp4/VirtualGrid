export const GridCell = ({ cell, column, columnMapping }) => {
    return (
      <div className="grid-cell" style={{
        padding: '0 8px',
        minWidth: column.width,
        maxWidth: column.width,
        position: column.sticky ? 'sticky' : 'relative',
        left: column.sticky ? 0 : 'auto',
        boxSizing: 'border-box',
      }}>
        {!!cell ? cell : '-'}
      </div>
    )
}