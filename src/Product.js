import React, { useState, useEffect } from 'react';
import BarCodeGenerator from './BarCodeGenerator';
import axios from 'axios';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import AddIcon from '@mui/icons-material/Add';
import Barcode from 'react-barcode';
import { successToast, errorToast } from './toastHelper';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { ToastContainer } from 'react-toastify';

const Product = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        prodname: '',
        hexcode: '',
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios
            .get(`http://localhost:8080/product/all`)
            .then((response) => {
                const productsData = response.data;
                // console.log(productsData);
                setData(productsData);
            })
            .catch((error) => {
                console.error('Axios error:', error);
            });
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleBarcodeGenerated = (newBarcode) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            hexcode: newBarcode,
        }));
    };

    const post = () => {
        console.log(formData);
        axios.post('http://localhost:8080/product/save', formData)
            .then(response => {
                console.log(response.status);
                setData(prevData => [...prevData, formData]);
            })
            .catch(error => {
                console.error('Error:', error);
                errorToast('Error adding data');
            });
    };

    const handleSubmit = () => {
        console.log(formData);
        post();
        handleClose();
        successToast('Data Added Successfully');
    };

    const tableHeaderStyle = {
        padding: '8px',
        textAlign: 'center',
        minWidth: '150px',
        wordWrap: 'break-word',
        whiteSpace: 'normal',
        position: 'sticky',
        top: 0,
        backgroundColor: '#f1f1f1',
        fontFamily: 'Mediumpoppin',
        border: '1px solid black'
    };

    const table2CellStyle = {
        padding: '8px',
        textAlign: 'center',
        minWidth: '150px',
        wordWrap: 'break-word',
        whiteSpace: 'normal',
        fontFamily: 'Regularpoppin',
        border: '1px solid black'
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '70px' }}>
            <div>
                <h2 style={{ textAlign: 'center', paddingTop: '10px', fontFamily: 'Mediumpoppin' }}>Products</h2>
                <div style={{ overflowX: 'auto' }}>
                    <Table
                        sx={{ minWidth: 'max-content', width: '100%' }}
                        stripe="odd"
                        hoverRow
                        stickyHeader>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Sno</th>
                                <th style={tableHeaderStyle}>Product Name</th>
                                <th style={tableHeaderStyle}>Code</th>
                                <th style={{ ...tableHeaderStyle, width: '200px' }}>Bar Code </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td style={table2CellStyle}>{index + 1}</td>
                                    <td style={table2CellStyle}>{row.prodname}</td>
                                    <td style={table2CellStyle}>{row.hexcode}</td>
                                    <td style={table2CellStyle}>
                                        <Barcode
                                            value={row.hexcode}
                                            width={1}
                                            height={50}
                                            format="CODE128"  // You can choose other formats as needed
                                            displayValue={false}  // Whether to display the value below the barcode
                                            background="#f0f0f0"  // Background color
                                            lineColor="#000"  // Line color
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Add New Entry</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="prodname"
                                label="Product Name"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={formData.prodname}
                                onChange={handleChange}
                            />
                            <BarCodeGenerator onBarcodeGenerated={handleBarcodeGenerated} />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </Dialog>

                <div style={{ position: 'fixed', bottom: 0, left: 0, margin: '20px' }}>
                    <Button
                        onClick={handleOpen}
                        variant="soft"
                        sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            minWidth: 'auto',
                            padding: 0,
                            bgcolor: 'black',
                        }}
                    >
                        <AddIcon sx={{ color: 'white' }} />
                    </Button>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Product;
