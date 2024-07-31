import React, { useRef, useEffect, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { GridRow } from './grid-row';

export const GridContent = ({ 
    data, 
    columnMapping,
    customComponents,
    selectable,
    selectedRows,
    handleSelect,
    rowHeight
}) => {
    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(500); // Default height

    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                console.log('Container height: ', containerRef.current.clientHeight);
                // get parent of container
                const parent = containerRef.current.parentElement.parentElement;
                console.log('Parent height: ', parent.offsetHeight);

                setContainerHeight(parent.clientHeight - 50); // Subtract header height
            }
        };

        updateHeight(); // Set initial height
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    const Row = customComponents && customComponents['grid-row']['component'] || GridRow;
    const rowProps = customComponents && customComponents['grid-row']['props'] || {};

    const renderRow = ({ index, style }) => { console.log('Rendering row', index); return (
        <div style={style} key={index}>
            <Row 
                {...rowProps}
                row={index}
                columnMapping={columnMapping} 
                customCell={customComponents && customComponents['grid-cell'] || null}
                selectable={selectable}
                selectedRows={selectedRows}
                handleSelect={handleSelect}
                rowHeight={rowHeight}
                data={data[index]}
            />
        </div>
    ); };

    return (
        <div ref={containerRef} style={styles.container}>
            <List
                height={containerHeight}
                itemCount={data.length}
                itemSize={rowHeight}
                width="100%"
            >
                {renderRow}
            </List>
        </div>
    );
}

const styles = {
    container: {
        height: '100%',
        overflowY: 'auto'
    }
}
