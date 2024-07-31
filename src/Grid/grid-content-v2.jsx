import { 
    useState, 
    useRef,
    useCallback,
    useEffect,
} from 'react';
import { GridRow } from './grid-row';

const buffer = 2;

export const GridContent = ({ 
    data, 
    columnMapping,
    customComponents,
    renderedRange = 10,
    selectable,
    selectedRows,
    handleSelect,
    rowHeight
}) => {
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const containerRef = useRef(null);
    const totalHeight = data.length * rowHeight;

    const totalRows = Math.ceil(containerHeight / rowHeight);

    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            setScrollTop(containerRef.current.scrollTop)
        }
    }, [])

    useEffect(() => {
        const container = containerRef.current;

        setContainerHeight(container.clientHeight);

        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        }
    }, [
        handleScroll,
        containerRef
    ])

    const startIndex = Math.max(
        0, 
        Math.floor(
            scrollTop / rowHeight
        ) - buffer
    );

    const endIndex = Math.min(
        data.length, 
        Math.ceil(
            (scrollTop + containerHeight) / rowHeight
        ) + buffer
    );

    const Row = customComponents && customComponents['grid-row']['component'] || GridRow;
    const rowProps = customComponents && customComponents['grid-row']['props'] || {};
    const MergedRowComponent = (props) => (
        <Row 
            {...rowProps}
            {...props}
            columnMapping={columnMapping} 
            customCell={customComponents && customComponents['grid-cell'] || null}
            selectable={selectable}
            selectedRows={selectedRows}
            handleSelect={handleSelect}
            rowHeight={rowHeight}
            data={data}
        />
    );

    const items = [];
    for (let i = startIndex; i < endIndex; i++) {
        items.push(
            <MergedRowComponent 
                key={i}
                row={i}
            />
        )
    }

    return (
        <div 
            ref={containerRef}
            style={{
                ...styles.container
            }}
        >
            <div 
                style={{
                    ...styles.innerContainer 
                }}
            >
                {items}
            </div>
        </div>
    )
}

const styles = {
    container: {
        height: '500px',
        overflowY: 'auto'
    },
    innerContainer: {

    }
}