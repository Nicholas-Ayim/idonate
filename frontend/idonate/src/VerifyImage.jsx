// App.js (React)
import React, { useState } from 'react';
import axios from 'axios';
import * as faceapi from 'face-api.js';

function VerifyApp() {
  const [selectedImage, setSelectedImage] = useState("");


  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      ]);
    };
    loadModels();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setSelectedImage(reader.result);
        await verifyFace(reader.result)
      };
      reader.readAsDataURL(file);
    }
  };


  const verifyFace = async (imageSrc) => {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.onload = async () => {
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0);

     
      const detections = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions()
      .withFaceDescriptors()
      .withAgeAndGender();

      if (detections) {
        const faceDescriptors = detections
        .filter(d => d.descriptor) // Ensure descriptor exists
        .map(d => d.descriptor);

        const convertedDescriptors = faceDescriptors.map(descriptor => Object.values(descriptor));

        const response = await axios.post('http://localhost:5000/donor/api/verify-face', {
          descriptor: convertedDescriptors[0]
        });
        console.log('Verification result:', response.data);
      }
    };
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} />
      <canvas ref={canvasRef} />
      <button onClick={() => verifyFace(selectedImage)}>Verify Face</button>
    </div>
  );
}

export default VerifyApp
