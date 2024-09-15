import * as faceapi from "face-api.js" 


import React, { useEffect } from 'react'

export default function ProcessImage({imageUrl,setDescriptors}) {
    useEffect(()=>{

        //loading all models
        const loadModels = async()=>{
            try{

                await Promise.all([
         faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
          faceapi.nets.ageGenderNet.loadFromUri("/models"),
                ])
              

                console.log("models")
                //fetch the image via url
                const img = await faceapi.fetchImage(imageUrl)
                console.log("image 64 Base String",img.src)
                //start the processing image by extracting the image into canvas
                console.log("image url",imageUrl)

                const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                console.log("Detections:", detections);

                if (!detections || detections.length === 0) {
                    alert("No faces detected. Please upload a clearer image.");
                    return [];
                  }

                   // Store face descriptors in localStorage
      const faceDescriptors = detections
      .filter(d => d.descriptor) // Ensure descriptor exists
      .map(d => d.descriptor);

      // console.log("face descriptors",faceDescriptors)
    if (faceDescriptors.length > 0) {
      localStorage.setItem("image-descriptors", JSON.stringify(faceDescriptors));

      const convertedDescriptors = faceDescriptors.map(descriptor => Object.values(descriptor));
      //pass array to setDescriptors
      setDescriptors(convertedDescriptors)
console.log("converted descriptors",convertedDescriptors);
    }
            }catch(error){
                console.error("loading failed")
            }
        }
        loadModels()
    },[imageUrl,setDescriptors])
  return (
   <>
   
   </>
  )
}
