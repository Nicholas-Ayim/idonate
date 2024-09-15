import { useEffect, useState } from "react";
import { FaHospital, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProcessImage from "../DonorRegsiter/ProcessImage";
import verifyBaseApi from "../../axios/verifyBaseApi";

export default function DonorVerification() {
  const [activeVerifyPage, setActiveVerifyPage] = useState(false);
  const [activeDonorPage, setActiveDonorPage] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [searching, setSearching] = useState(false);
  const [verifyUpload, setVerifyUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // For storing the uploaded Cloudinary URL
  const [descriptors, setDescriptors] = useState([]);
  const [verifyName, setVerifyName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [verifyStatus, setVerifyStatus] = useState(false);
  const [videoPlay, setVideoPlay] = useState(false);

  const handleVerifyPage = () => {
    setActiveVerifyPage(!activeVerifyPage);
    setActiveDonorPage(false);
    setVideoPlay(false)
    // setVerifyStatus(false)
    setVerifyUploaded(false)
    setVerifyName("")
    setBloodType("")
    setImageUrl("")
  };

  const handleDonorPage = () => {
    setActiveDonorPage(!activeDonorPage);
    setActiveVerifyPage(false);
  };

  useEffect(() => {
    if (searchWord !== "") {
      console.log("working!!!");
      setSearching(true);
    } else {
      setSearching(false);
    }
  }, [searchWord]);

  const uploadFile = async (file) => {
    const cloudinaryUrl = "https://api.cloudinary.com/v1_1/nayy-1999/image/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bloodImage");

    try {
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Uploaded Image Data:", data);
      setImageUrl(data.secure_url);
      setVerifyUploaded(true);
      setVideoPlay(false)
      return data.secure_url;
    } catch (error) {
      console.error("Error while uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = await uploadFile(file);
        console.log("image url", imageUrl);
      }
    } catch (error) {
      console.error("file not selected", error);
    }
  };

  const verification = async () => {
    if (imageUrl) {
      const verifyResponse = await verifyBaseApi.post("/donor", {
        descriptors: descriptors,
      });

      console.log("verify response", verifyResponse);
      if (verifyResponse?.data) {
        setVerifyStatus(true);
        const { bestMatch } = verifyResponse.data;
        setVerifyName(bestMatch.donorname);
        setBloodType(bestMatch.bloodtype);
        console.log("donors...", bestMatch.donorname, bestMatch.bloodtype);
      }
    }
  };

  // useEffect(() => {
  //   startVideo();
  // }, []);

  const startVideo = async () => {
    try {
      const videoElement = document.querySelector(".video");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (stream) {
        setVideoPlay(true); // Set videoPlay to true only when starting
        setVerifyStatus(false)
    setVerifyName("")
    setBloodType("")
    setImageUrl("")
        videoElement.srcObject = stream;
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <ProcessImage imageUrl={imageUrl} setDescriptors={setDescriptors} />
      <div className="text-[#fff] flex-col bg-[#181a1b] flex h-[100%] w-[100%] items-center gap-[.5rem] md:gap-[1rem] md:py-[1rem] py-[.5rem]">
        <div className="border-[3px] w-[calc(100%-20%)] border-[#eee] rounded-[10px] flex justify-evenly md:py-[.5rem] items-center my-[.5rem]">
          <FaHospital className="text-[#eee] text-[20px]" />
          <p className="md:text-[30px] text-[#fff]">HOSPITAL NAME</p>
          <FaHospital className="text-[#eee] text-[20px]" />
        </div>

        <div className="flex w-[calc(100%-20%)] flex-start items-start justify-between">
          <button
            className={`${
              activeVerifyPage ? "bg-[red] text-[red]" : ""
            }border-[1px] md:p-[1rem] rounded-[10px] p-[.3rem]`}
            onClick={handleVerifyPage}
          >
            {activeVerifyPage ? "Cancel Verification" : "Verify Donator"}
          </button>
          <Link
            to="/hospital/dashboard/Donor Register"
            className={`${
              activeDonorPage ? "bg-[red] text-[red]" : ""
            }border-[1px] p-[.3rem] md:p-[1rem] rounded-[10px] md:hover:bg-[green]`}
            onClick={handleDonorPage}
          >
            Donator Page
          </Link>
        </div>

        {activeVerifyPage && (
          <>
            <div className="flex flex-col w-[100%]">
              <div className="flex gap-[1rem] justify-center items-center  w-[100%]">
                <input
                  type="text"
                  placeholder="Search by Name, Blood Type, ID"
                  className="text-[#000] border-[1px] border-[blue] w-[calc(100%-50%)] rounded-[10px] md:p-[.5rem] p-[.3rem] text-left md:text-[18px] text-[15px]"
                  onChange={(e) => setSearchWord(e.target.value)}
                />
                <FaSearch className="md:text-[20px]" />
              </div>
            </div>

            {searching ? (
              <>
                <div className="text-[#fff]">searching</div>
              </>
            ) : (
              <>
                <div className="flex flex-col w-[100%] justify-center items-center md:gap-[1rem]">
                  <div className="border-[3px] border-[blue] md:w-[250px] md:h-[250px] flex items-center justify-center rounded-[10px]">
                    {videoPlay ? (
                      <>
                        <video
                          className="video h-[100%] w-[100%] flex items-center justify-center"
                          autoPlay
                        ></video>
                      </>
                    ) : (
                      <>
                        <img
                          alt="no image"
                          className="h-[100%] w-[100%] rounded-[10px] object-cover"
                          src={
                            verifyUpload ? `${imageUrl}` : "/docImg.jpg"
                          }
                        />
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    {verifyStatus && (
                      <div className="flex flex-col gap-[.2rem]">
                        <h4 className="text-[#fff] capitalize">
                          Name: {verifyName}
                        </h4>
                        <h4 className="text-[#fff]">
                          BloodType:{" "}
                          <span className="text-[red] capitalize">
                            {bloodType}
                          </span>
                        </h4>
                      </div>
                    )}
                    <button className="md:text-[20px] font-mono">  {videoPlay ? "Capture": "Verify Donator Face"} </button>
                    <div className="flex items-center">
                      <input type="file" onChange={(e) => handleVerify(e)} />
                      <button
                        className="border-[1px] rounded-[10px] border-[red] p-[.5rem]"
                        onClick={startVideo}
                      >
                        Take a Pic
                      </button>
                    </div>
                    <div>
                      <button
                        className="border-[1px] rounded-[10px] border-[red] p-[.5rem]"
                        onClick={verification}
                      >
                        Verify Donor
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}
