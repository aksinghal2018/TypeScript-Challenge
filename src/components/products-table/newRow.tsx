import { TableCell,Grid } from '@mui/material'
import React from 'react'


function NewRow({item1}) {
  if(typeof(item1.item1)=="string" || typeof(item1.item1)=="object"){
      return(<TableCell align="right">
      <Grid item xs={1.5}>
        {item1 != undefined ? <><h4 style={{ marginTop: "-11px" }}>{item1.item1}</h4><h4>{item1.item2}</h4></> : <></>}
      </Grid>
    </TableCell>)
  }
    return (
    <><TableCell align="right">
    <Grid item xs={.7}>
      {item1 != undefined ?
        <>
          <h4 style={{ marginTop: "-11px", borderRadius: "20px", backgroundColor: item1.item1>item1.item2?"blue":"red", textAlign: "center" }}>
            {item1.item1}
          </h4>
          <h4 style={{ marginTop: "-11px", borderRadius: "20px", backgroundColor: item1.item1>item1.item2?"red":"blue", textAlign: "center" }}>
            {item1.item2}
        </h4>
        </> : 
        <></>}
    </Grid>
  </TableCell></>
  )
}

export default NewRow