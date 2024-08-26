import { useState, useRef, useEffect } from 'react';
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
    const isResizing = useRef(false);

    const handleDragStart = (e, index) => {
        if (isResizing.current) {
            e.preventDefault();
            return;
        }
        setDraggedColumn(index);
    };

    const handleDragOver = (index) => {
        if (isResizing.current || draggedColumn === index) return;
        const newColMap = [...columnMapping];
        const [draggedCol] = newColMap.splice(draggedColumn, 1);
        newColMap.splice(index, 0, draggedCol);
        setColMap(newColMap);
        setDraggedColumn(index);
    };

    const handleDrop = () => {
        if (isResizing.current) return;
        setDraggedColumn(null);
    };

    return (
        <div className="sticky grid-header" style={styles().headerRow}>
            {selectable && (
                <div className="checkbox-cell" style={{ width: '50px', ...styles().headerCheckbox }}>
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
                    setColMap={setColMap}
                    columnMapping={columnMapping}
                    isResizing={isResizing}
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
    setColMap,
    columnMapping,
    isResizing,
    onDragStart,
    onDragOver,
    onDrop,
}) => {
    const lastSort = useRef(null);
    const columnRef = useRef(null);
    const [draggable, setDraggable] = useState(true);

    useEffect(() => {
        if (isResizing.current) {
            setDraggable(false);
        } else {
            setDraggable(true);
        }
    }, [isResizing.current]);

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

    const handleResizeStart = (e) => {
        e.stopPropagation();
        isResizing.current = true;
        const startX = e.clientX;
        const startWidth = columnRef.current.offsetWidth;

        const handleMouseMove = (e) => {
            const newWidth = startWidth + e.clientX - startX;
            const newColMap = [...columnMapping];
            newColMap[index].width = `${newWidth}px`;
            setColMap(newColMap);
        };

        const handleMouseUp = () => {
            isResizing.current = false;
            setDraggable(true);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        setDraggable(false);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            ref={columnRef}
            style={{
                minWidth: column.width,
                maxWidth: column.width,
                ...styles().headerColumn,
                cursor: draggable ? 'move' : 'default',
                position: column.sticky ? 'sticky' : 'relative',
                left: column.sticky ? '0' : 'auto',
                zIndex: column.sticky ? 1 : 'auto',
                height: '100%',
                boxSizing: 'border-box',
                padding: '0 8px',
            }}
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={(e) => {
                e.preventDefault();
                onDragOver();
            }}
            onDrop={onDrop}
        >
            <div style={styles().columnLabel}>{column.label}</div>
            {sortable && sortable[column.key] && (
                <div
                    style={styles().iconGroup}
                    onClick={() => handleSort(column.key, sortable[column.key]?.sortFn)}
                >
                    <ArrowDropUp fontSize="small" style={styles().iconUp} />
                    <ArrowDropDown fontSize="small" style={styles().iconDown} />
                </div>
            )}
            <span
                className="resizable-handle"
                style={styles().resizeHandle}
                onMouseDown={handleResizeStart}
            />
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
    setData: PropTypes.func,
    data: PropTypes.array,
    selectable: PropTypes.bool,
    selectedRows: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    handleSelect: PropTypes.func,
    setColMap: PropTypes.func,
};

const styles = () => ({
    headerRow: {
        padding: '.25rem .5rem',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
        height: '60px',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        // borderBottom: '1px solid #e3e3e3',
    },
    headerColumn: {
        display: 'flex',
        alignItems: 'center',
        gap: '.25rem',
        // borderBottom: '1px solid #e3e3e3',
        borderTop: '1px solid #e3e3e3',
        backgroundColor: 'white',
        height: '100%',
        position: 'relative',
        boxSizing: 'border-box',
        padding: '0 .5rem'
    },
    headerCheckbox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #e3e3e3',
        borderTop: '1px solid #e3e3e3',
        backgroundColor: 'white',
        height: '100%',
    },
    columnLabel: {
        marginRight: '12px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontWeight: '500',
        paddingLeft: '.75rem'
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
        top: '-1px',
    },
    iconDown: {
        position: 'absolute',
        bottom: '-3px',
    },
    resizeHandle: {
        position: 'absolute',
        right: 0,
        top: 10,
        bottom: 10,
        width: '2px',
        cursor: 'col-resize',
        backgroundColor: '#999',
        opacity: 1,
        transition: 'none',
    }
});

export default GridHeader;