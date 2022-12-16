// react imports
import React, { useState } from 'react';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { 
  Button, 
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
 } from '@mui/material';
 import { getAuth } from 'firebase/auth';
 
// local imports
import { serverCalls } from '../../api';
import { useGetData } from '../../custom_hooks';
import { ItemForm } from '../ItemForm/ItemForm';
import { SlackUserForm } from '../SlackUserForm/SlackUserForm';

const myStyles = {
  main_button: {
      marginLeft: 'auto',
      backgroundColor: '#DF1D5A',
      '&:hover': {
          backgroundColor: '#36C5F1',
      },
  }
}


const columns: GridColDef[] = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 400 },
    {
      field: 'category',
      headerName: 'Category',
      width: 250,
      editable: true,
    },
    {
      field: 'item',
      headerName: 'Item',
      width: 500,
      editable: true,
    },
    {
      field: 'date_created',
      headerName: 'Created Date',
      width: 175,
      type: 'date',
      editable: true,
    },
    {
      field: 'date_due',
      headerName: 'Due Date',
      width: 175,
      type: 'date',
      editable: true,
    },
    {
      field: 'date_reminder',
      headerName: 'Reminder Date',
      width: 175,
      editable: true,
    },
    {
      field: 'user_token',
      headerName: 'User Token',
      width: 200,
      editable: true,
    }
  ];

  interface gridData {
    data: {
      id?: string;
    }
  }

  export const DataTable = () => {
    let {itemData, getData} = useGetData();
    let [open, setOpen] = useState(false);
    let [gridData, setData] = useState<GridSelectionModel>([])

    let handleOpen = () => {
      setOpen(true)
    }

    let handleClose = () => {
      setOpen(false)
    }

    let deleteData = () => {
      serverCalls.delete(`${gridData[0]}`)
      getData()
    }

    console.log(gridData)
				const MyAuth = localStorage.getItem('myAuth');
				console.log(MyAuth);
			  if (MyAuth == 'true'){
		    return (
		        <div style={{ height: 600, width: '100%' }}>
		            <h2>Items</h2>
		            <DataGrid
		                rows={itemData}
		                columns={columns}
		                pageSize={9}
		                rowsPerPageOptions={[9]}
		                checkboxSelection
		                onSelectionModelChange={(newSelectionModel) => { setData(newSelectionModel); }}
		                {...itemData}
		            />
                <Button onClick={handleOpen}><Typography variant='inherit' color='black'>Update</Typography></Button>
                <Button sx={myStyles.main_button} variant='contained' onClick={deleteData}>Delete</Button>
		            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
		                <DialogTitle id="form-dialog-title">Update Item</DialogTitle>
		                <DialogContent>
		                    <DialogContentText>Item id: {gridData[0]}</DialogContentText>
		                    <ItemForm id={`${gridData[0]}`} />
		                </DialogContent>
		                <DialogActions>
		                    <Button onClick={handleClose} color="primary">Cancel</Button>
		                    <Button onClick={handleClose} color="secondary">Done</Button>
		                </DialogActions>
		            </Dialog>
		        </div>
        )
    } else { 
        return(
        <div>
            <h3>Please Sign In to View Your Item Collection</h3>
        </div>
    )};

}

