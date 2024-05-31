import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import AddIcon from '@mui/icons-material/Add';
import { successToast, errorToast } from './toastHelper';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { ToastContainer } from 'react-toastify';

const Material = () => {
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({});
    const [open, setOpen] = useState(false);
    const [openSecond, setOpenSecond] = useState(false);
    const [formData, setFormData] = useState({
        prodtype: '',
        productmaterial: '',
        productname: '',
        productprice: 0.0,
        waranty: 0.0,
        deleteflag: 'no'
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        axios
            .get(`http://localhost:8080/material/all`)
            .then((response) => {
                const materialsData = response.data.filter(material => material.deleteflag === "no");
                setData(materialsData);
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

    const handleOpen2 = (mno) => {
        axios
            .get(`http://localhost:8080/material/alll/${mno}`)
            .then((response) => {
                const productsData = response.data;
                setEditData(productsData);
                setOpenSecond(true);
            })
            .catch((error) => {
                console.error('Axios error:', error);
            });
    };

    const handleClose2 = () => {
        setOpenSecond(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setEditData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleRadioChange = (e) => {
        const { value } = e.target;
        setEditData((prevFormData) => ({
            ...prevFormData,
            deleteflag: value,
        }));
    };

    const handleUpdate = () => {
        console.log(editData);
        axios.put('http://localhost:8080/material/materialupdate', editData)
            .then(response => {
                successToast('Updated Successfully');
                getData();
            })
            .catch(error => {
                console.error('Error is:', error);
            });
        handleClose2();
    };

    const post = () => {
        axios.post('http://localhost:8080/material/save', formData)
            .then(response => {
                setData(prevData => [...prevData, formData]);
                successToast('Data Added Successfully');
            })
            .catch(error => {
                console.error('Error:', error);
                errorToast('Error adding data');
            });
    };

    const handleSubmit = () => {
        post();
        handleClose();
    };

    const customSort = (a, b) => {
        const order = ["TOOTH", "IMPLANT", "ACRYLIC"];
        const indexA = order.indexOf(a.prodtype);
        const indexB = order.indexOf(b.prodtype);

        if (indexA === -1 && indexB === -1) {
            return a.prodtype.localeCompare(b.prodtype);
        } else if (indexA === -1) {
            return 1;
        } else if (indexB === -1) {
            return -1;
        } else {
            return indexA - indexB;
        }
    };

    const sortedData = [...data].sort(customSort);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(price);
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
                                <th style={tableHeaderStyle}>Product Type</th>
                                <th style={tableHeaderStyle}>Product Material</th>
                                <th style={{ ...tableHeaderStyle, width: '200px' }}>Product Name</th>
                                <th style={tableHeaderStyle}>Product Price </th>
                                <th style={tableHeaderStyle}>Product Waranty </th>
                                <th style={tableHeaderStyle}>Delete Flag </th>
                                <th style={tableHeaderStyle}>Update Details </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((row, index) => (
                                <tr key={index}>
                                    <td style={table2CellStyle}>{index + 1}</td>
                                    <td style={table2CellStyle}>{row.prodtype}</td>
                                    <td style={table2CellStyle}>{row.productmaterial}</td>
                                    <td style={table2CellStyle}>{row.productname}</td>
                                    <td style={table2CellStyle}>{formatPrice(row.productprice)}</td>
                                    <td style={table2CellStyle}>{row.waranty}</td>
                                    <td style={table2CellStyle}>{row.deleteflag}</td>
                                    <td style={table2CellStyle}>
                                        <Button onClick={() => { handleOpen2(row.mno) }} color="primary">
                                            Edit Details
                                        </Button>
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
                                name="prodtype"
                                label="Product Type"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={formData.prodtype}
                                onChange={handleChange}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                name="productmaterial"
                                label="Product Material"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={formData.productmaterial}
                                onChange={handleChange}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                name="productname"
                                label="Product Name"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={formData.productname}
                                onChange={handleChange}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                name="productprice"
                                label="Product Price"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={formData.productprice}
                                onChange={handleChange}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                name="waranty"
                                label="Product Waranty"
                                type="int"
                                fullWidth
                                variant="standard"
                                value={formData.waranty}
                                onChange={handleChange}
                            />
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

                <Dialog
                    open={openSecond}
                    onClose={handleClose2}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Edit Entry</DialogTitle>
                    <DialogContent>
                        <form>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="prodtype"
                                label="Product Type"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={editData.prodtype}
                                onChange={handleChange2}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                name="productmaterial"
                                label="Product Material"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={editData.productmaterial}
                                onChange={handleChange2}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                name="productname"
                                label="Product Name"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={editData.productname}
                                onChange={handleChange2}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                name="productprice"
                                label="Product Price"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={editData.productprice}
                                onChange={handleChange2}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                name="waranty"
                                label="Product Waranty"
                                type="int"
                                fullWidth
                                variant="standard"
                                value={editData.waranty}
                                onChange={handleChange2}
                            />
                            <FormControl>
                                <FormLabel id="delete-flag-radio-group-label">Temporary Delete</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="delete-flag-radio-group-label"
                                    name="deleteflag"
                                    value={editData.deleteflag}
                                    onChange={handleRadioChange}
                                >
                                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="no" control={<Radio />} label="No" />
                                </RadioGroup>
                            </FormControl>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose2} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} color="primary">
                            Update
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

export default Material;
