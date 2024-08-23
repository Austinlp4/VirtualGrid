import React, { useRef, useEffect, useState } from 'react';
import Grid from "./Grid";
import { columnMapping, sortableMapping } from "./gridConfig";
import products from '../products.json';
import './App.css';

function App() {
  let [data, setData] = useState([]);
  let [propertySchema, setPropertySchema] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (products.length > 0) {
      let schema = products[0]?.allPropertySchema.map((property) => ({
        key: property.id,
        label: property.name,
        width: property.name === "Name" ? "500px" : "175px",
        sticky: false,
        sortFn: property.type === 'string' ? (a, b) => a.localeCompare(b) : (a, b) => a - b
      }));

      setPropertySchema(schema);
      setData(products);
    }
  }, []);

  useEffect(() => {
    const syncScroll = () => {
      if (containerRef.current) {
        const header = containerRef.current.querySelector('.grid-header');
        header.scrollLeft = containerRef.current.scrollLeft;
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', syncScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', syncScroll);
      }
    };
  }, []);

  return (
    <div style={{ maxWidth: "90%", margin: "20px auto", height: "600px", overflow: "hidden" }}>
      <div ref={containerRef} style={{ height: '100%', overflow: 'auto' }}>
        <Grid 
          columnMapping={propertySchema}
          setData={setData}
          data={data}
          selectable
          sortable={sortableMapping}
        >
          <Grid.Content rowHeight={80} />
        </Grid>
      </div>
    </div>
  );
}

export default App;
