import React, { useRef, useEffect, useState } from 'react';
import { GridRow } from './grid-row';
import { GridHeader } from './grid-header';
import { StickyList } from './sticky-list';
import AutoSizer from 'react-virtualized-auto-sizer'; // Add this import

export const GridContent = ({ 
    data, 
    columnMapping,
    customComponents,
    selectable,
    selectedRows,
    handleSelect,
    rowHeight,
    sortable,
    setData,
    setColMap
}) => {
    const containerRef = useRef(null);
    const [containerHeight, setContainerHeight] = useState(500);

    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                const parent = containerRef.current.parentElement.parentElement;
                setContainerHeight(parent.clientHeight - 50);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    const Row = customComponents && customComponents['grid-row']['component'] || GridRow;
    const rowProps = customComponents && customComponents['grid-row']['props'] || {};

    const renderRow = ({ index, style }) => {
        if (index === 0) return null; // The header will be rendered separately
        return (
            <Row 
                {...rowProps}
                style={style} // Apply the style prop here
                row={index - 1}
                columnMapping={columnMapping} 
                customCell={customComponents && customComponents['grid-cell'] || null}
                selectable={selectable}
                selectedRows={selectedRows}
                handleSelect={handleSelect}
                rowHeight={rowHeight}
                data={data[index - 1]}
            />
        );
    };

    const StickyRow = () => (
        <GridHeader
            columnMapping={columnMapping}
            sortable={sortable}
            setData={setData}
            data={data}
            selectable={selectable}
            selectedRows={selectedRows}
            handleSelect={handleSelect}
            setColMap={setColMap}
        />
    );

    return (
        <div ref={containerRef} style={{ height: '600px', width: '100%', overflowX: 'auto' }}>
            <AutoSizer>
                {({ width, height }) => (
                    <StickyList
                        height={height}
                        itemCount={data.length + 1}
                        itemSize={rowHeight}
                        width={width}
                        stickyIndices={[0]}
                        StickyRow={StickyRow}
                        overscanCount={5}
                    >
                        {renderRow}
                    </StickyList>
                )}
            </AutoSizer>
        </div>
    );
}