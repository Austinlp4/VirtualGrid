import { useRef } from 'react';
import PropTypes from 'prop-types';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import Checkbox from '@mui/material/Checkbox';

export const GridHeader = ({ 
    columnMapping, 
    sortable, 
    setData, 
    data,
    selectable,
    selectedRows,
    handleSelect
}) => {
    return (
        <div className="grid-header" style={styles.headerRow}>
            {selectable && (
                <div style={{ width: '50px', padding: '0 .25rem' , ...styles.headerColumn }}>
                    <Checkbox 
                        onChange={() => handleSelect('all')}
                        checked={selectedRows === 'all'}
                    />
                </div>
            )}
            {columnMapping.map((column, index) => 
                <HeaderColumn
                    index={index}
                    column={column}
                    sortable={sortable}
                    setData={setData}
                    data={data}
                />
        )}
        </div>
    );
}

const HeaderColumn = ({ 
    column, 
    sortable, 
    index, 
    setData,
    data,
}) => {
    console.log({ column, sortable });
    const lastSort = useRef(null);

    const handleSort = (key, sortFn) => {
        console.log('setData: ', setData);
        if (!sortFn) {
            console.error('No sort function provided for column: ', key);
            return;
        }

        if (!setData) {
            console.error('No setData function provided');
            return;
        }

        const dataCopy = [...data];
        let newData = dataCopy.sort((a, b) => sortFn(
            lastSort.current !== key ? a[key] : b[key], 
            lastSort.current !== key ? b[key] : a[key]
        ));

        lastSort.current = lastSort.current !== key ? key : null;

        setData(newData);
    }

    return (
        <div
            key={column.index}
            style={{ 
                width: column.width, 
                ...styles.headerColumn 
            }}
        >
            {column.label}
            {sortable && sortable[column.key] && (
                <SwapVertIcon
                    fontSize="small"
                    column={column}
                    sortable={sortable}
                    onClick={
                        () => handleSort(
                            column.key,
                            sortable[column.key]?.sortFn
                        )
                    }
                />
            )}
        </div>
    )
}

GridHeader.propTypes = {
    columnMapping: PropTypes.array,
    sortable: PropTypes.shape({
        [PropTypes.string]: PropTypes.shape({
            label: PropTypes.string.isRequired,
            sortFn: PropTypes.func,
        })
    }),
}

const styles = {
    headerRow: {
        padding: '1rem',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#f3f3f3',
        borderBottom: '1px solid #e3e3e3'
    },
    headerColumn: {
        display: 'flex',
        alignItems: 'center',
        gap: '.25rem',
    },
    columnLabel: {
        marginRight: '12px',
    }
}