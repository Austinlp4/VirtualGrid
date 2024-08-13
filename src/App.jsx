import { useState, useEffect } from 'react'
import Grid from "./Grid"
import { columnMapping, sortableMapping } from "./gridConfig"
import products from '../products.json';
import './App.css'

function App() {
  let [data, setData] = useState([])
  let [propertySchema, setPropertySchema] = useState(columnMapping)

  useEffect(() => {
    setData(products)
    let schema = products[0]?.allPropertySchema.map((property) => ({
      key: property.id,
      label: property.name,
      width: property.name === "Name" ? "500px" : "175px",
      sticky: false,
      sortFn: property.type === 'string' ? (a, b) => a.localeCompare(b) : (a, b) => a - b
    }))

    setPropertySchema(schema)
  }, []);

  return (
    <div style={{ maxWidth: "90%", margin: "20px auto", height: "600px" }}>
      <Grid 
        columnMapping={propertySchema}
        setData={setData}
        data={data}
        selectable
        itemsPerPage={50}
      >
        <Grid.Header 
          sortable={sortableMapping}
        />
        <Grid.Content rowHeight={80}/>
      </Grid>
    </div>
  )
}

export default App


// Grid Props

// customComponents
// {{
//   'grid-row': {
//     component: () => {}, // We can define
//     props: {
//       // we can add additional props to the custom grid component here [propName]: propValue
//     }
//   }
// }}
