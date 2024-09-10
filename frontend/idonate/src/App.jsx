import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import axios from "axios";
import VerifyApp from './VerifyImage';

export default function App() {
  const [selectedImage, setSelectedImage] = useState("");
  const [name, setName] = useState("");
  const canvasRef = useRef(null);

  // Load the models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
          faceapi.nets.ageGenderNet.loadFromUri("/models"),
        ]);
        console.log("Models loaded successfully");
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
  }, []);

  const imageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageFileReader = new FileReader();
      imageFileReader.onloadend = async () => {
        setSelectedImage(imageFileReader.result);
        await processingImage(imageFileReader.result);
      };
      imageFileReader.readAsDataURL(file);
    }
  };

  const processingImage = async (activeImage) => {
    console.log("Active image processing:", activeImage);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const img = new Image();
    img.src = activeImage;

    img.onload = async () => {
      // Set canvas size to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear the canvas before drawing the new image
      // context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image on the canvas
      context.drawImage(img, 0, 0);

      // Ensure the image is drawn before running face detection
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Fetch face data after drawing the image
      try {
        const detections = await FetchImage(canvas);
        console.log("Image data:", detections);
      } catch (error) {
        console.error("Error fetching image data:", error);
      }
    };

    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
  };

  const FetchImage = async (canvas) => {
    try {
      const detections = await faceapi.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors()
        .withAgeAndGender();

      if (!detections || detections.length === 0) {
        alert("No faces detected. Please upload a clearer image.");
        return [];
      }

      drawFaces(canvas, detections);

      // Store face descriptors in localStorage
      const faceDescriptors = detections
        .filter(d => d.descriptor) // Ensure descriptor exists
        .map(d => d.descriptor);

        // console.log("face descriptors",faceDescriptors)
      if (faceDescriptors.length > 0) {
        localStorage.setItem("image-descriptors", JSON.stringify(faceDescriptors));

        const convertedDescriptors = faceDescriptors.map(descriptor => Object.values(descriptor));
console.log(convertedDescriptors);

      
        // Store the new descriptors into the database
        await axios.post('http://localhost:5000/donor/api/store-face', {
          name,
          descriptor: convertedDescriptors[0]
        });
      } else {
        console.log("No descriptors found for detected faces.");
      }

      return detections;
    } catch (error) {
      console.error("Error detecting faces:", error);
      return [];
    }
  };

  // Draw the detected faces on the canvas
  const drawFaces = (canvas, detectionsData) => {
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

    if (detectionsData.length === 0) {
      alert("Please upload a clearer image");
    }

    detectionsData.forEach(faceProps => {
      const { detection, landmarks, age, gender } = faceProps;

      // Draw the face detection box
      faceapi.draw.drawDetections(canvas, [detection]);

      // Draw the landmarks
      faceapi.draw.drawFaceLandmarks(canvas, landmarks);

      // Draw age and gender
      context.font = '18px Arial';
      context.fillStyle = 'red';
      context.fillText(`Age: ${Math.round(age)}`, detection.box.x, detection.box.y > 10 ? detection.box.y - 10 : 10);
      context.fillText(`Gender: ${gender}`, detection.box.x, detection.box.y > 10 ? detection.box.y - 25 : 25);
    });
  };

  return (
    <>
      <div className='flex items-center justify-center flex-col gap-[2rem]'>
        <input type='file' onChange={(e) => imageChange(e)} />
        <input type='text' placeholder="enter name" onChange={(e) => setName(e.target.value)} />
        {selectedImage && (
          <img src={selectedImage} alt='Uploaded' className='h-[200px] w-[200px]' />
        )}
        <canvas ref={canvasRef} hidden />
      </div>
      <VerifyApp/>
    </>
  );
}
