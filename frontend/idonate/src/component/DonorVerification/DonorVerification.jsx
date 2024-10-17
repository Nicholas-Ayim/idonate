import { useEffect, useState, useRef } from "react";
import { FaHospital, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // Import the spinner
import ProcessImage from "../DonorRegsiter/ProcessImage";
import verifyBaseApi from "../../axios/verifyBaseApi";
import {useSearchHospitalNameQuery} from "../../services/searchApi"

export default function DonorVerification() {
  const [activeVerifyPage, setActiveVerifyPage] = useState(false);
  const [activeDonorPage, setActiveDonorPage] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [searching, setSearching] = useState(false);
  const [verifyUpload, setVerifyUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [numberOfDonations,setNumberOfDonations] = useState(0);
  const [hospitalName,setHospitalName] = useState("")

  const [descriptors, setDescriptors] = useState([]);
  const [verifyName, setVerifyName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [verifyStatus, setVerifyStatus] = useState(false);
  const [videoPlay, setVideoPlay] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading
  const[successMessage,setSuccessMessage] = useState("")
  const [errorMessage,setErrorMessage] = useState("")
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleVerifyPage = () => {
    setActiveVerifyPage(!activeVerifyPage);
    setActiveDonorPage(false);
    setVideoPlay(false);
    setVerifyUploaded(false);
    setVerifyName("");
    setBloodType("");
    setImageUrl("");
  };

  const handleDonorPage = () => {
    setActiveDonorPage(!activeDonorPage);
    setActiveVerifyPage(false);
  };

  useEffect(() => {
    if (searchWord !== "") {
      setSearching(true);
    } else {
      setSearching(false);
    }
  }, [searchWord]);

  const uploadFile = async (file) => {
    setLoading(true); // Start loading
    const cloudinaryUrl = "https://api.cloudinary.com/v1_1/<cloudinary_name>/image/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bloodImage");

    try {
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setImageUrl(data.secure_url);
      setVerifyUploaded(true);
      setVideoPlay(false);
      setErrorMessage("")
      setSuccessMessage("")
      return data.secure_url;
    } catch (error) {
      console.error("Error while uploading image:", error);
      throw new Error("Failed to upload image");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (file) {
        await uploadFile(file);
      }
    } catch (error) {
      console.error("file not selected", error);
    }
  };

  const verification = async () => {
    if (imageUrl) {
      setLoading(true); // Start loading
      try {
        const verifyResponse = await verifyBaseApi.post("/donor", {
          descriptors: descriptors,
        });

        if (verifyResponse.status === 200) {
          const { bestMatch } = verifyResponse.data;
          setVerifyStatus(true);
          setVerifyName(bestMatch.donorname);
          setBloodType(bestMatch.bloodtype);
          setNumberOfDonations(bestMatch.NumberOfDonations)
          setHospitalName(bestMatch.hospitalDonated)
          setSuccessMessage("Verification successful!");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Donor not found
          setErrorMessage("Verification failed, donor not found.");
        } else {
          console.error("Verification error:", error);
          setErrorMessage("An error occurred during verification.");
        }
      } finally {
        setLoading(false); // End loading
      }
    }
  };
  

  const startVideo = async () => {
    try {
      const videoElement = videoRef.current;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        setVideoPlay(true);
        setVerifyStatus(false);
        setVerifyName("");
        setBloodType("");
        setImageUrl("");
        videoElement.srcObject = stream;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (video && canvas && context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL('image/jpeg');
      setImageUrl(imageUrl);
      setVerifyUploaded(true);
      setVideoPlay(false);
    }
  };

  return (
    <>
      <ProcessImage imageUrl={imageUrl} setDescriptors={setDescriptors} />
      <div className="flex-col bg-[#2e2e2e] text-white min-h-screen flex items-center py-4 px-8">
        <div className="border-2 w-11/12 max-w-4xl border-gray-700 rounded-lg flex justify-evenly py-4 items-center mb-4 bg-gray-800">
          <FaHospital className="text-gray-300 text-2xl" />
          <p className="text-xl font-semibold">HOSPITAL NAME</p>
          <FaHospital className="text-gray-300 text-2xl" />
        </div>

        <div className="flex w-11/12 max-w-4xl justify-between mb-4">
          <button
            className={`${
              activeVerifyPage ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"
            } border border-gray-600 py-2 px-4 rounded-lg transition-colors duration-300`}
            onClick={handleVerifyPage}
          >
            {activeVerifyPage ? "Cancel Verification" : "Verify Donator"}
          </button>
          <Link
            to="/hospital/dashboard/Donor Register"
            className={`${
              activeDonorPage ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"
            } border border-gray-600 py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-green-600`}
            onClick={handleDonorPage}
          >
            Donator Page
          </Link>
        </div>

        {activeVerifyPage && (
          <>
            <div className="flex flex-col w-full max-w-4xl mb-4">
              <div className="flex gap-4 justify-center items-center mb-4">
                <input
                  type="text"
                  placeholder="Search by Name, Blood Type, ID"
                  className="text-gray-900 border border-blue-500 w-3/4 rounded-lg p-2 text-lg"
                  onChange={(e) => setSearchWord(e.target.value)}
                />
                <FaSearch className="text-xl text-blue-500" />
              </div>

              {searching ? (
                <>
                
                <div className="text-white text-center">Searching...</div>
                
                   </>

              ) : (
                <>
                  <div className="flex flex-col items-center">
                    <div className="border-4 border-blue-500 w-64 h-64 flex items-center justify-center rounded-lg relative mb-4 bg-gray-700">
                      {videoPlay ? (
                        <>
                          <video
                            ref={videoRef}
                            className="video w-full h-full object-cover"
                            autoPlay
                          ></video>
                          <canvas
                            ref={canvasRef}
                            className="hidden"
                          ></canvas>
                        </>
                      ) : (
                        <>
                        
                       
                          <img
                            alt="Upload Preview"
                            className="w-full h-full rounded-lg object-cover"
                            src={verifyUpload ? imageUrl : "/faceLogo1.jpg"}
                          />
                          {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-lg">
                              <ClipLoader color="#ffffff" />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      {verifyStatus && (
                        <div className="text-center text-white">
                          <h4 className="text-lg font-semibold">Name: {verifyName}</h4>
                          <h4 className="text-lg">Blood Type: <span className="text-red-500">{bloodType}</span></h4>
                          <h4 className="text-lg">Number of Donations: <span className="text-green-500">{numberOfDonations}</span></h4>
                          <h4 className="text-lg">Hospital Donated: <span className="text-red-500">{hospitalName}</span></h4>
                        </div>
                      )}
                      <button
                        className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-600 transition-colors duration-300"
                        onClick={videoPlay ? captureImage : startVideo}
                      >
                        {videoPlay ? "Capture" : "Verify Donator Face"}
                      </button>
                      {successMessage &&(<p className="text-[24px] text-green-700">{successMessage}</p>)}
                      {errorMessage &&(<p className="text-[24px] text-red-700">{errorMessage}</p>)}
                      <div className="flex items-center gap-4 mb-4">
                        <input
                          type="file"
                          onChange={(e) => handleVerify(e)}
                          className="border border-blue-500 py-2 px-4 rounded-lg bg-gray-800 text-white cursor-pointer"
                        />
                        <button
                          className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
                          onClick={startVideo}
                        >
                          Take a Pic
                        </button>
                      </div>
                      <button
                        className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
                        onClick={verification}
                      >
                        Verify Donor
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
