import React, { createContext, forwardRef, useContext } from "react";
import { FixedSizeList as List } from "react-window";

const StickyListContext = createContext();
StickyListContext.displayName = "StickyListContext";

const ItemWrapper = ({ data, index, style }) => {
  const { ItemRenderer, stickyIndices } = data;
  if (stickyIndices && stickyIndices.includes(index)) {
    return null;
  }
  return <ItemRenderer index={index} style={style} />;
};

const innerElementType = forwardRef(({ children, ...rest }, ref) => (
  <StickyListContext.Consumer>
    {({ stickyIndices, StickyRow }) => (
      <div ref={ref} {...rest}>
        {stickyIndices.map(index => (
          <StickyRow key={index} style={{ top: 0, left: 0, width: "100%", height: 50, zIndex: 1 }} />
        ))}
        {children}
      </div>
    )}
  </StickyListContext.Consumer>
));

export const StickyList = ({ children, stickyIndices, StickyRow, ...rest }) => (
  <StickyListContext.Provider value={{ ItemRenderer: children, stickyIndices, StickyRow }}>
    <List
      itemData={{ ItemRenderer: children, stickyIndices }}
      innerElementType={innerElementType}
      {...rest}
    >
      {ItemWrapper}
    </List>
  </StickyListContext.Provider>
);