import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@mui/material/Checkbox';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

export const GridHeader = ({
    columnMapping,
    sortable,
    setData,
    data,
    selectable,
    selectedRows,
    handleSelect,
    setColMap,
}) => {
    const [draggedColumn, setDraggedColumn] = useState(null);

    const handleDragStart = (e, index) => {
        setDraggedColumn(index);
    };

    const handleDragOver = (index) => {
        if (draggedColumn === index) return;
        const newColMap = [...columnMapping];
        const [draggedCol] = newColMap.splice(draggedColumn, 1);
        newColMap.splice(index, 0, draggedCol);
        setColMap(newColMap);
        setDraggedColumn(index);
    };

    const handleDrop = () => {
        setDraggedColumn(null);
    };

    return (
        <div className="grid-header" style={styles().headerRow}>
            {selectable && (
                <div style={{ width: '50px', padding: '0 .25rem', ...styles(false).headerColumn }}>
                    <Checkbox
                        onChange={() => handleSelect('all')}
                        checked={selectedRows === 'all'}
                    />
                </div>
            )}
            {columnMapping.map((column, index) => (
                <HeaderColumn
                    key={column.key}
                    index={index}
                    column={column}
                    sortable={sortable}
                    setData={setData}
                    data={data}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(index)}
                    onDrop={handleDrop}
                />
            ))}
        </div>
    );
};

const HeaderColumn = ({
    column,
    sortable,
    index,
    setData,
    data,
    onDragStart,
    onDragOver,
    onDrop,
}) => {
    const lastSort = useRef(null);

    const handleSort = (key, sortFn) => {
        if (!sortFn) {
            console.error('No sort function provided for column: ', key);
            return;
        }

        if (!setData) {
            console.error('No setData function provided');
            return;
        }

        const dataCopy = [...data];
        let newData = dataCopy.sort((a, b) =>
            sortFn(lastSort.current !== key ? a[key] : b[key], lastSort.current !== key ? b[key] : a[key])
        );

        lastSort.current = lastSort.current !== key ? key : null;

        setData(newData);
    };

    return (
        <div
            key={column.index}
            style={{
                minWidth: column.width,
                maxWidth: column.width,
                ...styles(true).headerColumn,
                cursor: 'move',
                position: column.sticky ? 'sticky' : 'relative',
                left: column.sticky ? '0' : 'auto',
                zIndex: column.sticky ? 1 : 'auto',
            }}
            draggable
            onDragStart={onDragStart}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver();
            }}
            onDrop={onDrop}
        >
            {column.label}
            {sortable && sortable[column.key] && (
                <div
                    style={styles().iconGroup}
                    onClick={() =>
                        handleSort(column.key, sortable[column.key]?.sortFn)
                    }
                >
                    <ArrowDropUp fontSize="small" column={column} sortable={sortable} style={styles().iconUp} />
                    <ArrowDropDown fontSize="small" column={column} sortable={sortable} style={styles().iconDown} />
                </div>
            )}
            <span className="resizable-handle" style={styles().resizeHandle} />
        </div>
    );
};

GridHeader.propTypes = {
    columnMapping: PropTypes.array,
    sortable: PropTypes.shape({
        [PropTypes.string]: PropTypes.shape({
            label: PropTypes.string.isRequired,
            sortFn: PropTypes.func,
        }),
    }),
    setData: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    selectable: PropTypes.bool,
    selectedRows: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    handleSelect: PropTypes.func,
    setColMap: PropTypes.func.isRequired,
};

const styles = (hasBorder = true) => {
    return {
        headerRow: {
            padding: '.25rem 1rem',
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: 'white',
            height: '50px',
        },
        headerColumn: {
            display: 'flex',
            alignItems: 'center',
            gap: '.25rem',
            // borderRight: hasBorder ? '1px solid #e3e3e3' : 'none',
            // borderLeft: hasBorder ? '1px solid #e3e3e3' : 'none',
            padding: '0 .5rem',
            borderBottom: '1px solid #e3e3e3',
            borderTop: '1px solid #e3e3e3',
            backgroundColor: 'white',
        },
        columnLabel: {
            marginRight: '12px',
        },
        iconGroup: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            height: '20px',
            width: '20px',
            cursor: 'pointer',
        },
        iconUp: {
            position: 'absolute',
            top: '-2px',
        },
        iconDown: {
            position: 'absolute',
            bottom: '-5px',
        },
        resizeHandle: {
            position: 'absolute',
            right: 0,
            top: 5,
            bottom: 5,
            width: '3px',
            cursor: 'col-resize',
            backgroundColor: '#e3e3e3'
        }
    };
};

export default GridHeader;
