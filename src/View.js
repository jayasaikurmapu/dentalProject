import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/joy/Table';
import Button from '@mui/joy/Button';
import AddIcon from '@mui/icons-material/Add';
import toothimg from './images/toothimg.jpg';
import implantimg from './images/implant.png';
import { faTooth, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { successToast, warningToast, errorToast, infoToast } from './toastHelper';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid } from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

import { ToastContainer } from 'react-toastify';

const View = () => {
  const [data, setData] = useState([]);
  const [dataMaterial, setDataMaterial] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('ALL');
  const [selectedMaterial, setSelectedMaterial] = useState('ALL');
  const [selectedToothType, setSelectedToothType] = useState('ALL');
  const [toothMaterialShow, setToothMaterialShow] = useState(true);
  const [toothMaterialTypeShow, setToothMaterialTypeShow] = useState(true);
  const [uniqueProdtypes, setUniqueProdtypes] = useState([]);
  const [uniqueProductMaterials, setUniqueProductMaterials] = useState([]);
  const [uniqueProductNames, setUniqueProductNames] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);
  const [editData, setEditData] = useState([]);
  const [formData, setFormData] = useState({
    caseid: 0,
    patientname: '',
    age: 0,
    sex: '',
    doctorname: '',
    clinicname: '',
    notation1: '',
    notation2: '',
    notation3: '',
    notation4: '',
    toothimplant: '',
    toothimplanttype: '',
    toothmaterial: '',
    shade: '',
    units: '',
    workorder: '',
    splinstr: '',
    recieveddate: '',
    recievedtime: '',
    recievedmaterial: '',
    lowerrecieved: '',
    upperrecieved: '',
    deliverydate: '',
    deliverytime: '',
    deliverymaterial: '',
    invoicegenerated: '',
    invoicenumber: '',
    paymentmethod: '',
    referencenumber: '',
  });
  const [selectedButtons, setSelectedButtons] = useState({
    notation1: [],
    notation2: [],
    notation3: [],
    notation4: [],
  });

  const [selectedLowerMaterials, setSelectedLowerMaterials] = useState([]);
  const [lowerSize, setLowerSize] = useState('');
  const [selectedUpperMaterials, setSelectedUpperMaterials] = useState([]);
  const [upperSize, setUpperSize] = useState('');

  const handleLowerCheckboxChange = (event) => {
    const { value } = event.target;
    setSelectedLowerMaterials((prevSelectedMaterials) => {
      if (prevSelectedMaterials.includes(value)) {
        return prevSelectedMaterials.filter((material) => material !== value);
      } else {
        return [...prevSelectedMaterials, value];
      }
    });
  };

  const handleLowerSizeChange = (event) => {
    setLowerSize(event.target.value);
  };

  const handleUpperCheckboxChange = (event) => {
    const { value } = event.target;
    setSelectedUpperMaterials((prevSelectedMaterials) => {
      if (prevSelectedMaterials.includes(value)) {
        return prevSelectedMaterials.filter((material) => material !== value);
      } else {
        return [...prevSelectedMaterials, value];
      }
    });
  };

  const handleUpperSizeChange = (event) => {
    setUpperSize(event.target.value);
  };

  // useEffect(() => {
  //   const lowerMaterialsString = selectedLowerMaterials.join(',');
  //   const combinedLowerString = lowerSize ? `${lowerMaterialsString}, ${lowerSize}` : lowerMaterialsString;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     lowerrecieved: combinedLowerString,
  //   }));
  // }, [selectedLowerMaterials, lowerSize]);

  useEffect(() => {
    const lowerMaterialsString = selectedLowerMaterials.join(',');
    const combinedLowerString = lowerSize ? `${lowerMaterialsString}, ${lowerSize}` : lowerMaterialsString;
    setFormData((prevFormData) => {
      const newLowerString = combinedLowerString ? `lower: ${combinedLowerString}` : '';
      const existingUpperString = prevFormData.recievedmaterial.split('upper: ')[1] || '';
      return {
        ...prevFormData,
        recievedmaterial: [newLowerString, existingUpperString].filter(Boolean).join(' | ')
      };
    });
  }, [selectedLowerMaterials, lowerSize]);

  useEffect(() => {
    const upperMaterialsString = selectedUpperMaterials.join(',');
    const combinedUpperString = upperSize ? `${upperMaterialsString}, ${upperSize}` : upperMaterialsString;
    setFormData((prevFormData) => {
      const newUpperString = combinedUpperString ? `upper: ${combinedUpperString}` : '';
      const existingLowerString = prevFormData.recievedmaterial.split('upper: ')[0].replace(' | ', '') || '';
      return {
        ...prevFormData,
        recievedmaterial: [existingLowerString, newUpperString].filter(Boolean).join(' | ')
      };
    });
  }, [selectedUpperMaterials, upperSize]);

  // const handleButtonClick = (notation, number) => {
  //   const sumOfNotations = formData.notation1.length + formData.notation2.length + formData.notation3.length + formData.notation4.length;
  //   setCalcUnits(sumOfNotations);
  //   setSelectedButtons((prev) => {
  //     const updated = [...prev[notation]];
  //     const index = updated.indexOf(number);

  //     if (index > -1) {
  //       updated.splice(index, 1); // Remove the number if it's already selected
  //     } else {
  //       updated.push(number); // Add the number if it's not selected
  //     }

  //     if (notation == 'notation1' || notation == 'notation3') {
  //       updated.sort((a, b) => b - a);
  //     }
  //     else {
  //       updated.sort((a, b) => a - b); // Sort the numbers in ascending order
  //     }

  //     handleChange({ target: { name: notation, value: updated.join('') } });
  //     return { ...prev, [notation]: updated };
  //   });
  // };

  // Define a function to calculate the sum of notations
  const calculateUnits = () => {
    const { notation1, notation2, notation3, notation4 } = formData;
    const sum = notation1.length + notation2.length + notation3.length + notation4.length;
    setFormData(prevFormData => ({
      ...prevFormData,
      units: sum.toString() // Convert sum to string for TextField
    }));
  };

  // Inside handleButtonClick function
  const handleButtonClick = (notation, number) => {
    setSelectedButtons(prev => {
      const updated = [...prev[notation]];
      const index = updated.indexOf(number);

      if (index > -1) {
        updated.splice(index, 1);
      } else {
        updated.push(number);
      }

      if (notation === 'notation1' || notation === 'notation3') {
        updated.sort((a, b) => b - a);
      } else {
        updated.sort((a, b) => a - b);
      }

      handleChange({ target: { name: notation, value: updated.join('') } });
      calculateUnits(); // Calculate units whenever notations change
      return { ...prev, [notation]: updated };
    });
  };

  // Inside useEffect for notations dependency
  useEffect(() => {
    calculateUnits();
  }, [formData.notation1, formData.notation2, formData.notation3, formData.notation4]);


  const renderButtons = (notation) => {
    let buttons = [];
    for (let i = 1; i <= 9; i++) {
      buttons.push(
        <Grid item xs={1} key={i}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => handleButtonClick(notation, i)}
            style={{
              backgroundColor: selectedButtons[notation].includes(i) ? 'lightblue' : '',
            }}
          >
            {i}
          </Button>
        </Grid>
      );
    }
    return buttons;
  };

  useEffect(() => {
    getData();
    getDoctors();
    getData2();
  }, []);

  const getData2 = () => {
    axios
      .get(`http://localhost:8080/material/all`)
      .then((response) => {
        const materialsData = response.data;
        setDataMaterial(materialsData);
        // Extract unique values
        const prodtypes = [...new Set(materialsData.map(item => item.prodtype))];
        // const productMaterials = [...new Set(materialsData.map(item => item.productmaterial))];
        // const productNames = [...new Set(materialsData.map(item => item.productname))];

        // Set state
        setUniqueProdtypes(prodtypes);
        // setUniqueProductMaterials(productMaterials);
        // setUniqueProductNames(productNames);
        // console.log(prodtypes, productMaterials, productNames);
      })
      .catch((error) => {
        console.error('Axios error:', error);
      });
  }

  const getData = () => {
    axios
      .get(`http://localhost:8080/lotus/all`)
      .then((response) => {
        const productsData = response.data;
        // console.log(productsData)
        setData(productsData);

      })
      .catch((error) => {
        console.error('Axios error:', error);
      });
  };

  const getDoctors = () => {
    axios
      .get(`http://localhost:8080/docs/all`)
      .then((response) => {
        const docsData = response.data;
        setDoctors(docsData);

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

  const handleOpen2 = (sno) => {
    console.log(sno);
    axios
      .get(`http://localhost:8080/lotus/alll/${sno}`)
      .then((response) => {
        const productsData = response.data;
        setEditData(productsData);
      })
      .catch((error) => {
        console.error('Axios error:', error);
      });
    setOpenSecond(true);
  };

  const handleClose2 = () => {
    setOpenSecond(false);
  };

  const handleUpdate = () => {
    console.log("should write update code");
  }

  console.log(formData.toothimplant);
  useEffect(() => {
    if (formData.toothimplant !== "") {
      setToothMaterialShow(false);
    }
    if ((formData.toothimplant !== "") && (formData.toothmaterial === "")){
      setToothMaterialTypeShow(true);
    }
    console.log("toothimplant status changed")
  }, [formData.toothimplant])

  useEffect(() => {
    if (formData.toothmaterial !== "") {
      setToothMaterialTypeShow(false);
    }
    console.log("toothimplanttype status changed")
  }, [formData.toothmaterial])


  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    if (name === "toothimplant") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        toothmaterial: "",
      }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        toothimplanttype: "",
      }));
      const materialsData = dataMaterial.filter(material => material.prodtype === value);
      const productMaterials = [...new Set(materialsData.map(item => item.productmaterial))];
      setUniqueProductMaterials(productMaterials);
    }
    if (name === "toothmaterial") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        toothimplanttype: "",
      }));
      console.log(formData.toothimplant);
      const materialsData = dataMaterial.filter(material => material.prodtype === formData.toothimplant);
      const materialsData2 = materialsData.filter(material => material.productmaterial === value);
      const productNames = [...new Set(materialsData2.map(item => item.productname))];
      setUniqueProductNames(productNames);
    }
  };

  const handleChange2 = (e) => {
    const { name, value } = e.target;
    setEditData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const post = () => {
    console.log(formData);
    console.log(formData.doctorname);
    axios.post('http://localhost:8080/lotus/save', formData)
      .then(response => {
        console.log(response.status);
        // Append the new entry to the existing data
        setData(prevData => [...prevData, formData]);
      })
      .catch(error => {
        console.error('Error:', error);
        errorToast('Error adding data');
      });
    axios.get(`http://localhost:8080/docs/all`)
      .then((response) => {
        const docstorsData = response.data;
        console.log(docstorsData);
        console.log(formData.doctorname);
        let is_user = [];
        if (docstorsData) {
          is_user = docstorsData.find((user) => user.docname === formData.doctorname);
        }
        else {
          is_user = undefined;
        }


        console.log(is_user);
        if (is_user !== undefined) {
          // setUsername('');
          // errorToast('Username already exists, enter a new username');
          // return;
          console.log("doctor already exists")
        }
        else {
          const docData = {
            docname: formData.doctorname
          };
          console.log(docData);
          axios.post('http://localhost:8080/docs/save', docData)
            .then(response => {
              console.log(response.status);
            })
            .catch(error => {
              console.error('Error:', error);
              errorToast('Error adding data');
            });
        }

      })
      .catch((error) => {
        console.error('Axios error:', error);
      });
  }



  const handleSubmit = () => {
    // Handle form submission
    console.log(formData);
    // console.log(formData.doctorname)
    if (!formData.caseid) {
      infoToast('Case I.D. is required');
      return;
    }
    if (!formData.patientname) {
      infoToast('Patient Name is required');
      return;
    }
    if (!formData.age) {
      infoToast('Age is required');
      return;
    }
    if (!formData.sex) {
      infoToast('Sex is required');
      return;
    }
    if (!formData.doctorname) {
      infoToast('Doctorname is required');
      return;
    }
    if (!formData.clinicname) {
      infoToast('Clinic name is required');
      return;
    }
    if (!formData.toothimplant) {
      infoToast('Product Type is required');
      return;
    }
    if (!formData.toothmaterial) {
      infoToast('Product Material is required');
      return;
    }
    if (!formData.toothimplanttype) {
      infoToast('Product Name is required');
      return;
    }
    if (!formData.shade) {
      infoToast('Shade is required');
      return;
    }
    if (!formData.recieveddate) {
      infoToast('Recieved Date is required');
      return;
    }
    if (!formData.deliverydate) {
      infoToast('Delivery Date is required');
      return;
    }
    if (!formData.recievedtime) {
      infoToast('Recieved Time is required');
      return;
    }
    if (!formData.deliverytime) {
      infoToast('Delivery Time is required');
      return;
    }
    if (!formData.recievedmaterial) {
      infoToast('Recieved Material is required');
      return;
    }
    if (!formData.deliverymaterial) {
      infoToast('Delivery Material is required');
      return;
    }

    post();

    // Close the dialog
    handleClose();
    successToast('Data Added Successfully');
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleMaterialChange = (event) => {
    setSelectedMaterial(event.target.value);
  };

  const handleToothTypeChange = (event) => {
    setSelectedToothType(event.target.value);
  }

  const filteredData = data.filter(row => {
    const matchesDoctor = selectedDoctor === 'ALL' || row.doctorname === selectedDoctor;
    const matchesMaterial = selectedMaterial === 'ALL' || row.toothmaterial === selectedMaterial;
    const matchesToothType = selectedToothType === 'ALL' || row.toothimplant === selectedToothType;
    return matchesDoctor && matchesMaterial && matchesToothType;
  });


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
    border: '1px solid black'  // Add vertical border to the right
  };

  const table2CellStyle = {
    padding: '8px',
    textAlign: 'center',
    minWidth: '150px',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
    fontFamily: 'Regularpoppin',
    border: '1px solid black'  // Add vertical border to the right
  };

  const fixedWidthStyle = {
    display: 'inline-block',
    width: '90px',  // Adjust based on your requirement
    textAlign: 'right'
  };

  // const separatorStyle = {
  //   display: 'inline-block',
  //   width: '10px',  // Adjust based on your requirement
  //   textAlign: 'center',
  //   position: 'relative'
  // };

  const verticalLineStyle = {
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '50%',
    width: '2px',
    backgroundColor: 'black'
  };


  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '200px'  // Adjust based on your requirement
  };

  const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between'
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '70px' }}> {/* Container to wrap the content */}
      <div>
        <h2 style={{ textAlign: 'center', paddingTop: '10px', fontFamily: 'Mediumpoppin' }}>LOTUS DENTAL CAD CAM LAB</h2>
        <select
          value={selectedDoctor}
          onChange={handleDoctorChange}
          style={{
            padding: '8px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            minWidth: '150px',
            maxWidth: '200px',
          }}
        >
          <option value="ALL">ALL</option>
          {doctors.map((doctor) => (
            <option key={doctor.serialno} value={doctor.docname}>
              {doctor.docname}
            </option>
          ))}
        </select>


        <select value={selectedMaterial}
          onChange={handleMaterialChange}
          style={{
            padding: '8px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            minWidth: '150px',
            maxWidth: '200px',
          }}>
          <option value="ALL">ALL</option>
          <option value="DMLS">DMLS</option>
          <option value="Acrylic">Acrylic</option>
          <option value="Zirconium">Zirconium</option>
        </select>

        <select value={selectedToothType}
          onChange={handleToothTypeChange}
          style={{
            padding: '8px',
            fontSize: '16px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            minWidth: '150px',
            maxWidth: '200px',
          }}>
          <option value="ALL">ALL</option>
          <option value="Tooth">Tooth</option>
          <option value="Implant">Implant</option>
        </select>

        <div style={{ overflowX: 'auto' }}>
          <Table
            sx={{ minWidth: 'max-content', width: '100%' }}
            stripe="odd"
            hoverRow
            stickyHeader>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Sno</th>
                <th style={tableHeaderStyle}>Case I.D.</th>

                <th style={{ ...tableHeaderStyle, width: '200px' }}>
                  <div>
                    Patient Name, Age, Sex
                  </div>
                  <hr style={{ border: '1px solid black' }} />
                  <div>
                    Doctor Name, Clinic Name
                  </div>
                </th>

                <th style={{ ...tableHeaderStyle, width: '200px' }}>Notation </th>

                <th style={tableHeaderStyle}>Product Type</th>
                <th style={tableHeaderStyle}>Product Material</th>
                <th style={tableHeaderStyle}>Product Name</th>
                <th style={tableHeaderStyle}>Shade</th>
                <th style={tableHeaderStyle}>No. of Units</th>
                <th style={tableHeaderStyle}>Work Order</th>
                <th style={{ ...tableHeaderStyle, width: '200px' }}>
                  Special Instructions
                </th>
                {/* <th style={tableHeaderStyle}>Recieved Date</th>
              <th style={tableHeaderStyle}>Recieved Time</th> */}

                <th style={{ ...tableHeaderStyle, width: '200px' }}>
                  <div>
                    Recieved Date
                  </div>
                  <hr style={{ border: '1px solid black' }} />
                  <div>
                    Delivery Date
                  </div>
                </th>

                <th style={{ ...tableHeaderStyle, width: '200px' }}>
                  <div>
                    Recieved Time
                  </div>
                  <hr style={{ border: '1px solid black' }} />
                  <div>
                    Delivery Time
                  </div>
                </th>


                <th style={{ ...tableHeaderStyle, width: '200px' }}>
                  Recieved Material
                </th>
                <th style={tableHeaderStyle}>Delivery Material</th>
                <th style={tableHeaderStyle}>Invoice Generated</th>
                <th style={tableHeaderStyle}>Invoice Number</th>
                <th style={tableHeaderStyle}>Payment Method</th>
                <th style={tableHeaderStyle}>Reference Number</th>
                <th style={tableHeaderStyle}>Edit Details</th>

              </tr>
            </thead>
            <tbody>
              {/* {console.log(data)} */}
              {filteredData.map((row, index) => (
                <tr key={index}>
                  <td style={table2CellStyle}>{index + 1}</td>
                  <td style={table2CellStyle}>{row.caseid}</td>

                  <td style={table2CellStyle}>
                    <div>
                      {row.patientname} , {row.age} , {row.sex}
                    </div>
                    <hr style={{ border: '1px solid black', margin: '8px 0' }} />
                    <div>
                      {row.doctorname} , {row.clinicname}
                    </div>
                  </td>

                  <td style={table2CellStyle}>
                    <div>
                      <div style={containerStyle}>
                        <div style={verticalLineStyle}></div>
                        <div style={rowStyle}>
                          <span style={fixedWidthStyle}>{row.notation1}</span>
                          {/* <span style={separatorStyle}>|</span> */}
                          <span style={{ ...fixedWidthStyle, textAlign: 'left' }}>{row.notation2}</span>
                        </div>
                        <hr style={{ border: '1px solid black', margin: '8px 0' }} />
                        <div style={rowStyle}>
                          <span style={fixedWidthStyle}>{row.notation3}</span>
                          {/* <span style={separatorStyle}>|</span> */}
                          <span style={{ ...fixedWidthStyle, textAlign: 'left' }}>{row.notation4}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td style={table2CellStyle}>
                    {row.toothimplant === 'Tooth' ? (
                      <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
                        <div>
                          {row.toothimplant}
                        </div>
                        <FontAwesomeIcon icon={faTooth} style={{ marginLeft: '2px', fontSize: '20px' }} />
                      </div>
                    ) : (
                      <div style={{ display: 'flex', textAlign: 'center', justifyContent: 'center' }}>
                        <div>
                          {row.toothimplant}
                        </div>
                        <img src={implantimg} width={23} />
                        {/* <FontAwesomeIcon icon={faScrewdriverWrench} style={{ marginLeft: '2px', fontSize: '20px' }} /> */}
                      </div>
                    )}
                  </td>

                  <td style={table2CellStyle}>{row.toothmaterial}</td>
                  <td style={table2CellStyle}>{row.toothimplanttype}</td>
                  <td style={table2CellStyle}>{row.shade}</td>
                  <td style={table2CellStyle}>{row.units}</td>
                  <td style={table2CellStyle}>{row.workorder}</td>
                  <td style={table2CellStyle}>{row.splinstr}</td>
                  {/* <td style={table2CellStyle}>{row.recieveddate}</td>
                <td style={table2CellStyle}>{row.recievedtime}</td> */}
                  <td style={table2CellStyle}>
                    <div>
                      {row.recieveddate}
                    </div>
                    <hr style={{ border: '1px solid black', margin: '8px 0' }} />
                    <div>
                      {row.deliverydate}
                    </div>
                  </td>
                  <td style={table2CellStyle}>
                    <div>
                      {row.recievedtime}
                    </div>
                    <hr style={{ border: '1px solid black', margin: '8px 0' }} />
                    <div>
                      {row.deliverytime}
                    </div>
                  </td>
                  <td style={table2CellStyle}>{row.recievedmaterial}</td>
                  <td style={table2CellStyle}>{row.deliverymaterial}</td>
                  <td style={table2CellStyle}>{row.invoicegenerated}</td>
                  <td style={table2CellStyle}>{row.invoicenumber}</td>
                  <td style={table2CellStyle}>{row.paymentmethod}</td>
                  <td style={table2CellStyle}>{row.referencenumber}</td>
                  <td style={table2CellStyle}>
                    <Button onClick={() => { handleOpen2(row.sno) }} color="primary">
                      Edit Details
                      {/* {console.log(editData)} */}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Entry</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                autoFocus
                margin="dense"
                name="caseid"
                label="Case ID"
                type="text"
                fullWidth
                variant="standard"
                value={formData.caseid}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="patientname"
                label="Patient Name"
                type="text"
                fullWidth
                variant="standard"
                value={formData.patientname}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="age"
                label="Age"
                type="number"
                fullWidth
                variant="standard"
                value={formData.age}
                onChange={handleChange}
              />

              <FormControl fullWidth margin="dense" variant="standard">
                <InputLabel>Sex</InputLabel>
                <Select
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  label="Sex"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  {/* <MenuItem value=""></MenuItem> */}
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                name="doctorname"
                label="Doctor Name"
                type="text"
                fullWidth
                variant="standard"
                value={formData.doctorname}
                onChange={handleChange}
              />

              <TextField
                margin="dense"
                name="clinicname"
                label="Clinic Name"
                type="text"
                fullWidth
                variant="standard"
                value={formData.clinicname}
                onChange={handleChange}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    name="notation1"
                    label="Upper Right"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.notation1}
                    onChange={handleChange}
                    disabled
                  />
                  <Grid container spacing={1}>
                    {renderButtons('notation1')}
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    name="notation2"
                    label="Upper Left"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.notation2}
                    onChange={handleChange}
                    disabled
                  />
                  <Grid container spacing={1}>
                    {renderButtons('notation2')}
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    name="notation3"
                    label="Lower Right"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.notation3}
                    onChange={handleChange}
                    disabled
                  />
                  <Grid container spacing={1}>
                    {renderButtons('notation3')}
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    name="notation4"
                    label="Lower Left"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={formData.notation4}
                    onChange={handleChange}
                    disabled
                  />
                  <Grid container spacing={1}>
                    {renderButtons('notation4')}
                  </Grid>
                </Grid>
              </Grid>

              <FormControl fullWidth margin="dense" variant="standard">
                <InputLabel>Product Type</InputLabel>
                <Select
                  name="toothimplant"
                  value={formData.toothimplant}
                  onChange={handleChange}
                  label="Product Type"
                >
                  {uniqueProdtypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>


              <FormControl fullWidth margin="dense" variant="standard" disabled={toothMaterialShow}>
                <InputLabel>Product Material</InputLabel>
                <Select
                  name="toothmaterial"
                  value={formData.toothmaterial}
                  onChange={handleChange}
                  label="Tooth Material"
                >
                  {uniqueProductMaterials.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="dense" variant="standard" disabled={toothMaterialTypeShow}>
                <Autocomplete
                  options={uniqueProductNames}
                  disabled={toothMaterialTypeShow}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Product Name"
                      variant="standard"
                    />
                  )}
                  value={formData.toothimplanttype}
                  onChange={(event, newValue) => {
                    setFormData(prevFormData => ({
                      ...prevFormData,
                      toothimplanttype: newValue
                    }));
                  }}
                />
              </FormControl>

              <TextField
                margin="dense"
                name="shade"
                label="Shade"
                type="text"
                fullWidth
                variant="standard"
                value={formData.shade}
                onChange={handleChange}
              />

              <TextField
                margin="dense"
                name="units"
                label="No. of Units"
                type="number"
                fullWidth
                variant="standard"
                value={formData.units}
                onChange={handleChange}
                disabled
              />
              <TextField
                margin="dense"
                name="workorder"
                label="Work Order"
                type="text"
                fullWidth
                variant="standard"
                value={formData.workorder}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="splinstr"
                label="Special Instructions"
                type="text"
                fullWidth
                variant="standard"
                value={formData.splinstr}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="recieveddate"
                label="Received Date"
                type="date"
                fullWidth
                variant="standard"
                value={formData.recieveddate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                name="recievedtime"
                label="Received Time"
                type="time"
                fullWidth
                variant="standard"
                value={formData.recievedtime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />

              {/* <TextField
              margin="dense"
              name="recievedmaterial"
              label="Received Material"
              type="text"
              fullWidth
              variant="standard"
              value={formData.recievedmaterial}
              onChange={handleChange}
              disabled // Disable manual editing to keep it consistent with checkboxes
            /> */}

              <FormGroup row style={{ alignItems: 'flex-start' }}>
                <span style={{ marginTop: '29px', marginRight: '16px' }}>Lower :</span>
                <div>
                  {['Metal Tray', 'Plastic Tray'].map((material) => (
                    <FormControlLabel
                      key={material}
                      style={{ marginTop: '22px' }}
                      control={
                        <Checkbox
                          checked={selectedLowerMaterials.includes(material)}
                          onChange={handleLowerCheckboxChange}
                          value={material}
                        />
                      }
                      label={material}
                    />
                  ))}
                </div>
                <TextField
                  margin="dense"
                  name="lowersize"
                  label="Size"
                  type="text"
                  sx={{ width: '150px', height: '10px', marginTop: '14px' }}
                  value={lowerSize}
                  onChange={handleLowerSizeChange}
                />
              </FormGroup>

              <FormGroup row>
                {['Alginate', 'Putty'].map((material) => (
                  <FormControlLabel
                    key={material}
                    style={{ marginTop: '15px', marginLeft: '55px' }}
                    control={
                      <Checkbox
                        checked={selectedLowerMaterials.includes(material)}
                        onChange={handleLowerCheckboxChange}
                        value={material}
                      />
                    }
                    label={material}
                  />
                ))}
              </FormGroup>
              {/* 'Poured', 'Not Poured', 'Model' */}

              <FormGroup row>
                {['Poured', 'Not Poured', 'Model'].map((material) => (
                  <FormControlLabel
                    key={material}
                    style={{ marginTop: '15px', marginLeft: '55px' }}
                    control={
                      <Checkbox
                        checked={selectedLowerMaterials.includes(material)}
                        onChange={handleLowerCheckboxChange}
                        value={material}
                      />
                    }
                    label={material}
                  />
                ))}
              </FormGroup>

              <FormGroup row>
                <span style={{ marginTop: '29px', marginRight: '16px' }}>Upper:</span>
                {['Metal Tray', 'Plastic Tray'].map((material) => (
                  <FormControlLabel
                    key={material}
                    style={{ marginTop: '22px' }}
                    control={
                      <Checkbox
                        checked={selectedUpperMaterials.includes(material)}
                        onChange={handleUpperCheckboxChange}
                        value={material}
                      />
                    }
                    label={material}
                  />
                ))}
                <TextField
                  margin="dense"
                  name="uppersize"
                  label="Size"
                  type="text"
                  sx={{ width: '150px', height: '10px', marginTop: '14px' }}
                  value={upperSize}
                  onChange={handleUpperSizeChange}
                />
              </FormGroup>

              <FormGroup row>
                {['Alginate', 'Putty'].map((material) => (
                  <FormControlLabel
                    key={material}
                    style={{ marginTop: '15px', marginLeft: '55px' }}
                    control={
                      <Checkbox
                        checked={selectedUpperMaterials.includes(material)}
                        onChange={handleUpperCheckboxChange}
                        value={material}
                      />
                    }
                    label={material}
                  />
                ))}
              </FormGroup>

              <FormGroup row>
                {['Poured', 'Not Poured', 'Model'].map((material) => (
                  <FormControlLabel
                    key={material}
                    style={{ marginTop: '15px', marginLeft: '55px' }}
                    control={
                      <Checkbox
                        checked={selectedUpperMaterials.includes(material)}
                        onChange={handleUpperCheckboxChange}
                        value={material}
                      />
                    }
                    label={material}
                  />
                ))}
              </FormGroup>

              <TextField
                margin="dense"
                name="recievedmaterial"
                label="Received Material"
                type="text"
                fullWidth
                variant="standard"
                value={formData.recievedmaterial}
                onChange={(e) => setFormData({ ...formData, recievedmaterial: e.target.value })}
                disabled
              />

              {/* <FormGroup row>
              <span style={{ marginTop: '8px' }}>
                Bite:
              </span>
              {['Wax', 'AluWax', 'Putty'].map((material) => (
                <FormControlLabel
                  key={material}
                  control={
                    <Checkbox
                      checked={selectedMaterials.includes(material)}
                      onChange={handleCheckboxChange}
                      value={material}
                    />
                  }
                  label={material}
                />
              ))}
            </FormGroup> */}



              <TextField
                margin="dense"
                name="deliverydate"
                label="Delivery Date"
                type="date"
                fullWidth
                variant="standard"
                value={formData.deliverydate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                name="deliverytime"
                label="Delivery Time"
                type="time"
                fullWidth
                variant="standard"
                value={formData.deliverytime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                name="deliverymaterial"
                label="Delivery Material"
                type="text"
                fullWidth
                variant="standard"
                value={formData.deliverymaterial}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="invoicegenerated"
                label="Invoice Generated"
                type="text"
                fullWidth
                variant="standard"
                value={formData.invoicegenerated}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="invoicenumber"
                label="Invoice Number"
                type="text"
                fullWidth
                variant="standard"
                value={formData.invoicenumber}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="paymentmethod"
                label="Payment Method"
                type="text"
                fullWidth
                variant="standard"
                value={formData.paymentmethod}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="referencenumber"
                label="Reference Number"
                type="text"
                fullWidth
                variant="standard"
                value={formData.referencenumber}
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

        {/* --------------------------------------------------------------------------------- */}
        <Dialog open={openSecond} onClose={handleClose2}>
          <DialogTitle>Add New Entry</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                autoFocus
                margin="dense"
                name="caseid"
                label="Case ID"
                type="text"
                fullWidth
                variant="standard"
                value={editData.caseid}
                onChange={handleChange2}
              />
              <TextField
                margin="dense"
                name="patientname"
                label="Patient Name"
                type="text"
                fullWidth
                variant="standard"
                value={editData.patientname}
                onChange={handleChange2}
              />
              <TextField
                margin="dense"
                name="age"
                label="Age"
                type="number"
                fullWidth
                variant="standard"
                value={editData.age}
                onChange={handleChange2}
              />

              <FormControl fullWidth margin="dense" variant="standard">
                <InputLabel>Sex</InputLabel>
                <Select
                  name="sex"
                  value={editData.sex}
                  onChange={handleChange2}
                  label="Sex"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  {/* <MenuItem value=""></MenuItem> */}
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                name="doctorname"
                label="Doctor Name"
                type="text"
                fullWidth
                variant="standard"
                value={editData.doctorname}
                onChange={handleChange2}
              />

              <TextField
                margin="dense"
                name="clinicname"
                label="Clinic Name"
                type="text"
                fullWidth
                variant="standard"
                value={editData.clinicname}
                onChange={handleChange2}
              />

              {/* --------------------------------------------- */}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    name="notation1"
                    label="Upper Right"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.notation1}
                    onChange={handleChange2}
                    disabled
                  />
                  <Grid container spacing={1}>
                    {renderButtons('notation1')}
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    name="notation2"
                    label="Upper Left"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.notation2}
                    onChange={handleChange2}
                    disabled
                  />
                  <Grid container spacing={1}>
                    {renderButtons('notation2')}
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    name="notation3"
                    label="Lower Right"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.notation3}
                    onChange={handleChange2}
                    disabled
                  />
                  <Grid container spacing={1}>
                    {renderButtons('notation3')}
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    name="notation4"
                    label="Lower Left"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={editData.notation4}
                    onChange={handleChange2}
                    disabled
                  />
                  <Grid container spacing={1}>
                    {renderButtons('notation4')}
                  </Grid>
                </Grid>
              </Grid>

              <FormControl fullWidth margin="dense" variant="standard">
                <InputLabel>Product Type</InputLabel>
                <Select
                  name="toothimplant"
                  value={editData.toothimplant}
                  onChange={handleChange2}
                  label="Tooth / Implant"
                >
                  <MenuItem value="Tooth">Tooth</MenuItem>
                  <MenuItem value="Implant">Implant</MenuItem>
                  {/* <MenuItem value=""></MenuItem> */}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="dense" variant="standard">
                <InputLabel>Product Material</InputLabel>
                <Select
                  name="toothmaterial"
                  value={editData.toothmaterial}
                  onChange={handleChange2}
                  label="Tooth Material"
                >
                  <MenuItem value="DMLS">DMLS</MenuItem>
                  <MenuItem value="Acrylic">Acrylic</MenuItem>
                  <MenuItem value="Zirconium">Zirconium</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="dense" variant="standard">
                <InputLabel>Product Name</InputLabel>
                <Select
                  name="toothimplanttype"
                  value={editData.toothimplanttype}
                  onChange={handleChange2}
                  label="Tooth / Implant Type"
                >
                  <MenuItem value="A">A</MenuItem>
                  <MenuItem value="B">B</MenuItem>
                  <MenuItem value="C">C</MenuItem>
                  <MenuItem value="D">D</MenuItem>
                  <MenuItem value="E">E</MenuItem>
                  <MenuItem value="F">F</MenuItem>
                </Select>
              </FormControl>

              <TextField
                margin="dense"
                name="shade"
                label="Shade"
                type="text"
                fullWidth
                variant="standard"
                value={editData.shade}
                onChange={handleChange2}
              />

              <TextField
                margin="dense"
                name="units"
                label="No. of Units"
                type="number"
                fullWidth
                variant="standard"
                value={editData.units}
                onChange={handleChange2}
                disabled
              />
              <TextField
                margin="dense"
                name="workorder"
                label="Work Order"
                type="text"
                fullWidth
                variant="standard"
                value={editData.workorder}
                onChange={handleChange2}
              />
              <TextField
                margin="dense"
                name="splinstr"
                label="Special Instructions"
                type="text"
                fullWidth
                variant="standard"
                value={editData.splinstr}
                onChange={handleChange2}
              />
              <TextField
                margin="dense"
                name="recieveddate"
                label="Received Date"
                type="date"
                fullWidth
                variant="standard"
                value={editData.recieveddate}
                onChange={handleChange2}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                name="recievedtime"
                label="Received Time"
                type="time"
                fullWidth
                variant="standard"
                value={editData.recievedtime}
                onChange={handleChange2}
                InputLabelProps={{ shrink: true }}
              />

              {/* <TextField
              margin="dense"
              name="recievedmaterial"
              label="Received Material"
              type="text"
              fullWidth
              variant="standard"
              value={formData.recievedmaterial}
              onChange={handleChange}
              disabled // Disable manual editing to keep it consistent with checkboxes
            /> */}

              <FormGroup row style={{ alignItems: 'flex-start' }}>
                <span style={{ marginTop: '29px', marginRight: '16px' }}>Lower :</span>
                <div>
                  {['Metal Tray', 'Plastic Tray'].map((material) => (
                    <FormControlLabel
                      key={material}
                      style={{ marginTop: '22px' }}
                      control={
                        <Checkbox
                          checked={selectedLowerMaterials.includes(material)}
                          onChange={handleLowerCheckboxChange}
                          value={material}
                        />
                      }
                      label={material}
                    />
                  ))}
                </div>
                <TextField
                  margin="dense"
                  name="lowersize"
                  label="Size"
                  type="text"
                  sx={{ width: '150px', height: '10px', marginTop: '14px' }}
                  value={lowerSize}
                  onChange={handleLowerSizeChange}
                />
              </FormGroup>

              <FormGroup row>
                {['Alginate', 'Putty'].map((material) => (
                  <FormControlLabel
                    key={material}
                    style={{ marginTop: '15px', marginLeft: '55px' }}
                    control={
                      <Checkbox
                        checked={selectedLowerMaterials.includes(material)}
                        onChange={handleLowerCheckboxChange}
                        value={material}
                      />
                    }
                    label={material}
                  />
                ))}
              </FormGroup>
              {/* 'Poured', 'Not Poured', 'Model' */}

              <FormGroup row>
                {['Poured', 'Not Poured', 'Model'].map((material) => (
                  <FormControlLabel
                    key={material}
                    style={{ marginTop: '15px', marginLeft: '55px' }}
                    control={
                      <Checkbox
                        checked={selectedLowerMaterials.includes(material)}
                        onChange={handleLowerCheckboxChange}
                        value={material}
                      />
                    }
                    label={material}
                  />
                ))}
              </FormGroup>

              <FormGroup row>
                <span style={{ marginTop: '29px', marginRight: '16px' }}>Upper:</span>
                {['Metal Tray', 'Plastic Tray'].map((material) => (
                  <FormControlLabel
                    key={material}
                    style={{ marginTop: '22px' }}
                    control={
                      <Checkbox
                        checked={selectedUpperMaterials.includes(material)}
                        onChange={handleUpperCheckboxChange}
                        value={material}
                      />
                    }
                    label={material}
                  />
                ))}
                <TextField
                  margin="dense"
                  name="uppersize"
                  label="Size"
                  type="text"
                  sx={{ width: '150px', height: '10px', marginTop: '14px' }}
                  value={upperSize}
                  onChange={handleUpperSizeChange}
                />
              </FormGroup>

              <FormGroup row>
                {['Alginate', 'Putty'].map((material) => (
                  <FormControlLabel
                    key={material}
                    style={{ marginTop: '15px', marginLeft: '55px' }}
                    control={
                      <Checkbox
                        checked={selectedUpperMaterials.includes(material)}
                        onChange={handleUpperCheckboxChange}
                        value={material}
                      />
                    }
                    label={material}
                  />
                ))}
              </FormGroup>

              <FormGroup row>
                {['Poured', 'Not Poured', 'Model'].map((material) => (
                  <FormControlLabel
                    key={material}
                    style={{ marginTop: '15px', marginLeft: '55px' }}
                    control={
                      <Checkbox
                        checked={selectedUpperMaterials.includes(material)}
                        onChange={handleUpperCheckboxChange}
                        value={material}
                      />
                    }
                    label={material}
                  />
                ))}
              </FormGroup>

              <TextField
                margin="dense"
                name="recievedmaterial"
                label="Received Material"
                type="text"
                fullWidth
                variant="standard"
                value={editData.recievedmaterial}
                onChange={(e) => setEditData({ ...editData, recievedmaterial: e.target.value })}
                disabled
              />

              <TextField
                margin="dense"
                name="deliverydate"
                label="Delivery Date"
                type="date"
                fullWidth
                variant="standard"
                value={editData.deliverydate}
                onChange={handleChange2}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                name="deliverytime"
                label="Delivery Time"
                type="time"
                fullWidth
                variant="standard"
                value={editData.deliverytime}
                onChange={handleChange2}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                name="deliverymaterial"
                label="Delivery Material"
                type="text"
                fullWidth
                variant="standard"
                value={editData.deliverymaterial}
                onChange={handleChange2}
              />
              <TextField
                margin="dense"
                name="invoicegenerated"
                label="Invoice Generated"
                type="text"
                fullWidth
                variant="standard"
                value={editData.invoicegenerated}
                onChange={handleChange2}
              />
              <TextField
                margin="dense"
                name="invoicenumber"
                label="Invoice Number"
                type="text"
                fullWidth
                variant="standard"
                value={editData.invoicenumber}
                onChange={handleChange2}
              />
              <TextField
                margin="dense"
                name="paymentmethod"
                label="Payment Method"
                type="text"
                fullWidth
                variant="standard"
                value={editData.paymentmethod}
                onChange={handleChange2}
              />
              <TextField
                margin="dense"
                name="referencenumber"
                label="Reference Number"
                type="text"
                fullWidth
                variant="standard"
                value={editData.referencenumber}
                onChange={handleChange2}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose2} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Other content goes here */}

        {/* Sticky Button */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, margin: '20px' }}>
          <Button
            // color="success"
            onClick={handleOpen}
            variant="soft"
            sx={{
              width: 56, // Ensure width and height are equal
              height: 56, // Ensure width and height are equal
              borderRadius: '50%', // Make it a circle
              minWidth: 'auto', // Remove the default min-width
              padding: 0, // Remove padding to ensure the icon is centered
              bgcolor: 'black', // Darker color
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

export default View;



// 1 2 3 4 5 6 7 8 9 | 1 2 3 4 5 6 7 8 9
// --------------------------------------
// 1 2 3 4 5 6 7 8 9 | 1 2 3 4 5 6 7 8 9