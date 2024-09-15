import { useEffect, useState } from "react";
import { FaHospital, FaFirstAid } from "react-icons/fa";
import baseApi from "../../axios/baseApi";
import ProcessImage from "./ProcessImage";

export default function DonorRegister() {
  const [hospitalName, setHospitalName] = useState("");
  const [donorname, setDonorName] = useState("");
  const [dob, setDob] = useState("");
  const [bloodtype, setBloodType] = useState("");
  const [picture, setPicture] = useState(null); // Store image file
  const [imageUrl, setImageUrl] = useState(""); // For storing the uploaded Cloudinary URL
  const [descriptors,setDescriptors] = useState([])
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log("dob", dob);
    console.log("bloodtype", bloodtype);
        //awaited descriptor
    console.log("descriptor",descriptors)
  }, [dob, bloodtype,descriptors]);

  const stats = [
    {
      name: "New Patients",
      number: 178,
      icon: <FaHospital />,
    },
    {
      name: "Blood Donations",
      number: 178,
      icon: <FaFirstAid />,
    },
    {
      name: "Register Donors",
      number: 178,
      icon: <FaHospital />,
    },
    {
      name: "New Patients",
      number: 178,
      icon: <FaHospital />,
    },
  ];

  const uploadImage = async (file) => {
    const cloudinaryUrl =
      "https://api.cloudinary.com/v1_1/nayy-1999/image/upload";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bloodImage"); // Replace with your actual Cloudinary preset

    try {
      const response = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Uploaded Image Data:", data);
      setImageUrl(data.secure_url); // Save the URL after successful upload
      setUploaded(true);
      return data.secure_url;
    } catch (error) {
      console.error("Error while uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleChangePic = async(e) => {
    const file = e.target.files[0];
    if (!file) {
      return alert("No file selected");
    }

    // Validate image size (e.g., less than 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return alert("Please select an image smaller than 10MB.");
    }

    setPicture(file); // Store file without uploading it yet
    await uploadImage(file);
  };

  const handleSaveRecord = async () => {
    if (!donorname || !dob || !bloodtype) {
      return alert("Please fill out all required fields.");
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Save the donor data first
      const response = await baseApi.post(
        "/donorRegister",
        {
          donorname,
          dob,
          bloodtype,
        }
      );

      console.log("New donor data saved:", response);
      console.log("id",response.data.data._id)

      // If donor data is successfully saved, upload the picture
      if (picture) {
        const uploadedImageUrl = await uploadImage(picture);
        console.log("Image uploaded successfully:", uploadedImageUrl);

    

        // Update donor record with uploaded image URL                       
       const verifyResponse = await baseApi.put(
          "/donorRegister/image", // Assuming `donorId` is returned in response
          {
            donorId:response.data.data._id,
             picture: imageUrl,
             descriptors:descriptors
            }
        );
        console.log("response",verifyResponse.data.message)
        if(verifyResponse?.data?.verifyMessage){
          setSuccess(false)
          setError(`${verifyResponse?.data?.verifyMessage}`)
          return
        }
        
      setSuccess(true);
       
      }
       
    } catch (error) {
      console.error("Error saving donor data:", error);
      setError("Failed to save donor data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
    
  
    <ProcessImage imageUrl={imageUrl} setDescriptors={setDescriptors}/>
    <div className="flex justify-center items-center h-[100%] bg-[#181a1b] w-[100%] md:py-[1rem] py-[.3rem]">



    <div className="flex  flex-col flex-wrap gap-[1rem]">
      {/* Statistics Section */}
      <div className="flex justify-center flex-wrap gap-[1rem]">
        {stats.map((section, index) => (
          <div key={index}>
            <div className="flex justify-between border-[1px] border-[#3d3434] h-[100px] w-fit md:w-[200px] rounded-[10px] bg-[#fff] gap-[1rem] p-[1rem]">
              <div className="flex flex-col items-start justify-center">
                <h4 className="text-[20px] font-mono">{section.number}</h4>
                <h4 className="text-[20px] font-mono">{section.name}</h4>
              </div>
              <div
                className={`${
                  index === 1 ? "bg-[red]" : "bg-[blue]"
                } rounded-[10px] text-[20px] w-[100%] flex items-center justify-center md:text-[32px] text-[#fff]`}
              >
                {section.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Donor Registration Form */}
      <div className="flex flex-col w-[100%] bg-[#eee] rounded-[10px]">
        <div className="flex justify-between w-[100%] bg-[red] px-[2rem] items-center">
          <p className="text-[#fff] md:text-[28px]">Donor Registration</p>
          <img
            src="/docImg.jpg"
            className="object-cover h-[50px] w-[50px] rounded-[10px]"
            alt="Donor"
          />
        </div>

        <div className="flex flex-col w-[100%] p-[2rem]">
          <div className="flex flex-col pb-[.5rem]">
            <h4 className="text-[18px] font-mono">Hospital Section</h4>
            <hr className="border-[1px] border-[red] w-[100%]" />
            <label className="mt-[.5rem]">
              <h4>Hospital Name</h4>
              <input
                type="text"
                placeholder="Enter hospital name"
                className="border-[1px] rounded-[10px] border-[#000] p-[.3rem] w-[80%]"
                onChange={(e) => setHospitalName(e.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-col pt-[1rem]">
            <h4 className="text-[18px] font-mono">Donor Section</h4>
            <hr className="border-[1px] border-[red] w-[100%]" />
          </div>

          <div className="flex flex-col gap-[.5rem] py-[.5rem]">
            <label>
              <h4>Donor Name</h4>
              <input
                type="text"
                placeholder="Enter donor name"
                className="border-[1px] rounded-[5px] p-[.3rem] w-[80%]"
                onChange={(e) => setDonorName(e.target.value)}
              />
            </label>

            <label>
              <h4>Date of Birth</h4>
              <input
                type="date"
                className="border-[1px] rounded-[5px] p-[.3rem] w-[80%]"
                onChange={(e) => setDob(e.target.value)}
              />
            </label>

            <label>
              <h4>Blood Type</h4>
              <select
                className="w-[100px] border-[1px] rounded-[5px] p-[.3rem]"
                onChange={(e) => setBloodType(e.target.value)}
              >
                <option>-</option>
                <option>AB-</option>
                <option>AB+</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O-</option>
                <option>O+</option>
              </select>
            </label>

            <label>
              <h4>Upload Picture</h4>
              <div className="flex gap-[2rem] items-center">
                <button className="border-[1px] md:hover:bg-[green] border-[red] rounded-[5px] px-[.3rem]">
                  Take Photo
                </button>
                <p>OR</p>
                <input
                  type="file"
                  accept="image/*"
                  className="border-[1px] rounded-[5px] p-[.3rem] w-[80%]"
                  onChange={handleChangePic}
                />
              </div>
            </label>

            <div className="mt-[.5rem] flex justify-center flex-col gap-[.5rem] items-center">
              <button
                className="bg-[green] md:hover:bg-[red] text-[#fff] font-mono w-fit px-[1rem] py-[.5rem] rounded-[10px]"
                onClick={handleSaveRecord}
                disabled={loading}
              >
                {loading ? "Saving..." : "Register Donor"}
              </button>

              {error && <p className="text-[red] mt-[.5rem]">{error}</p>}
              {success && <p className="text-[green] mt-[.5rem]">Face Verified And Registered Successfully!</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    </>
  );
}
