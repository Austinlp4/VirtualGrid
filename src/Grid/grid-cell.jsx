export const GridCell = ({ cell, column, columnMapping }) => {
    return (
      <div className="grid-cell" style={{
        padding: '0 .5rem',
        minWidth: column.width,
        maxWidth: column.width,
        position: column.sticky ? 'sticky' : 'relative',
        left: column.sticky ? 0 : 'auto',
      }}>
        {!!cell ? cell : '-'}
      </div>
    )
}