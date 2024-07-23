import { useState } from 'react'
import Grid from "./Grid"
import { tableData } from "./tableData"
import { columnMapping } from "./gridConfig"
import {
  NewGridRow
} from "./custom-components"

function App() {
  let [data, setData] = useState(tableData)

  return (
    <div style={
      {
        maxWidth: "1100px",
        margin: "20px auto"
      }
    }>
      <Grid 
        columnMapping={columnMapping}
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
            name: {
              key: 'name',
              sortFn: (a, b) => a.localeCompare(b)
            },
            age: {
              key: 'age',
              sortFn: (a, b) => a - b
            },
          }}
        />
        <Grid.Content rowHeight={80}/>
      </Grid>
    </div>
  )
}

export default App
