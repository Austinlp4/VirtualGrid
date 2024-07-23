import { useState } from 'react';

import "./grid.css";
import { 
    cloneElement, 
} from "react";
import { GridHeader } from "./grid-header";
import { GridContent } from "./grid-content-v2";
import { GridRow } from "./grid-row";
import { GridContainer } from "./grid-container";

const Grid = ({
    children,
    columnMapping,
    methodMapping,
    customComponents,
    setData,
    data,
    selectable
}) => {
    let [selectedRows, setSelectedRows] = useState([]);

    const handleSelect = (row) => {
        if (selectedRows === 'all') {
            setSelectedRows([row]);
            return;
        }
        if (row === 'all' && selectedRows !== 'all') {
            setSelectedRows('all');
            return;
        } 
        if (row === 'all' && selectedRows === 'all') {
            setSelectedRows([]);
            return;
        }
        if (selectedRows.includes(row)) {
            setSelectedRows(selectedRows.filter(selectedRow => selectedRow !== row));
            return;
        }
        setSelectedRows([...selectedRows, row]);
    } 

    const childrenWithProps = 
    Array.isArray(children) ? children.map(
        (child, index) => {
            const childProps = child.props;

            const newProps = { 
                key: index,
                ...childProps, 
                // DATA PROPS
                columnMapping,
                customComponents,
                data,
                selectable,
                selectedRows,
                // METHODS PROPS
                setData,
                handleSelect
            };

            if (childProps.excludeProps) {
                console.log(childProps.excludeProps);
                childProps.excludeProps.forEach(prop => {
                    delete newProps[prop];
                });
            }

            return cloneElement(
                child, 
                newProps
            );
    }) : 
    cloneElement(
        children, 
        { 
            ...children.props,
            columnMapping,
            customComponents
        }
    )
    ;

    return (
        <div className="grid-container">
            <GridContainer>
                {childrenWithProps}
            </GridContainer>    
        </div>
    );
};

Grid.Header = GridHeader;
Grid.Content = GridContent;

export default Grid;