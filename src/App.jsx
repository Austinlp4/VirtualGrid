import { useState, useEffect } from 'react'
import Grid from "./Grid"
import { tableData } from "./tableData"
import { columnMapping } from "./gridConfig"
import {
  NewGridRow
} from "./custom-components"
import products from '../products.json';

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
    console.log('products', products, 'schema', schema);
  }, []);

  return (
    <div style={
      {
        maxWidth: "90%",
        margin: "20px auto",
        height: "600px",
      }
    }>
      <Grid 
        columnMapping={propertySchema}
        setData={setData}
        data={data}
        selectable
        customComponents={{
          'grid-row': {
            component: NewGridRow,
            props: {
              newProp: 'Hello',
            }
          }
        }}
      >
        <Grid.Header 
          sortable={{
              masterUniqueId: {
                key: 'masterUniqueId',
                sortFn: (a, b) => a.localeCompare(b)
              },
              base: {
                key: 'base',
                sortFn: (a, b) => a.localeCompare(b)
              },
              'product_name': {
                key: 'product_name',
                sortFn: (a, b) => a.localeCompare(b)
              },
              version: {
                key: 'version',
                sortFn: (a, b) => a.localeCompare(b)
              },
          }}
        />
        <Grid.Content rowHeight={80}/>
      </Grid>
    </div>
  )
}

export default App
