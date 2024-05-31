import React, { useState } from 'react';
import Barcode from './Barcode';

const BarCodeGenerator = ({ onBarcodeGenerated }) => {
  const [barcodes, setBarcodes] = useState([]);
  const [disableButton, setDisableButton] = useState(false);

  const generateUniqueBarcode = () => {
    let newBarcode;
    do {
        console.log(Date.now());
      newBarcode = `random`; // Generate a unique value using timestamp and random number
    } while (barcodes.includes(newBarcode)); // Ensure it doesn't already exist
    return newBarcode;
  };

  const addBarcode = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const newBarcode = generateUniqueBarcode();
    setBarcodes([...barcodes, newBarcode]);
    onBarcodeGenerated(newBarcode); // Call the callback with the new barcode
    setDisableButton(true);
  };

  return (
    <div>
      <button disabled={disableButton} onClick={addBarcode}>Generate Barcode</button>
      <div>
        {barcodes.map((code) => (
          <Barcode key={code} value={code} />
        ))}
      </div>
    </div>
  );
};

export default BarCodeGenerator;





// import React, { useState } from 'react';
// import Barcode from './Barcode';
// import { v4 as uuidv4 } from 'uuid';

// const BarCodeGenerator = ({ onBarcodeGenerated }) => {
//   const [barcodes, setBarcodes] = useState([]);

//   const generateUniqueBarcode = () => {
//     let newBarcode;
//     do {
//       newBarcode = uuidv4(); // Generate a unique value
//     } while (barcodes.includes(newBarcode)); // Ensure it doesn't already exist
//     return newBarcode;
//   };

//   const addBarcode = (event) => {
//     event.preventDefault(); // Prevent the default form submission behavior
//     const newBarcode = generateUniqueBarcode();
//     setBarcodes([...barcodes, newBarcode]);
//     onBarcodeGenerated(newBarcode); // Call the callback with the new barcode
//   };

//   return (
//     <div>
//       <button onClick={addBarcode}>Generate Barcode</button>
//       <div>
//         {barcodes.map((code) => (
//           <Barcode key={code} value={code} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BarCodeGenerator;



// how to regenerate barcode from existing code:
// 1.  npm install react-barcode

// 2.  import React from 'react';
// import Barcode from 'react-barcode';

// const BarcodeGenerator = () => {
//   const barcodeValue = '24842134-8666-4338-bca7-a378caed0ea2';

//   return (
//     <div>
//       <h1>Generated Barcode</h1>
//       <Barcode value={barcodeValue} />
//     </div>
//   );
// };

// export default BarcodeGenerator;


// 3. or we can customize:
// <Barcode 
//   value={barcodeValue}
//   width={2}
//   height={100}
//   format="CODE128"  // You can choose other formats as needed
//   displayValue={false}  // Whether to display the value below the barcode
//   background="#f0f0f0"  // Background color
//   lineColor="#000"  // Line color
// />

// 4. So, in this way we can only store the barcode uuid value to regenerate the barcode 
