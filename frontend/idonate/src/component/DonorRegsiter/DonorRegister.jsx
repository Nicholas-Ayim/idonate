import { useEffect, useState } from "react";
import { FaHospital, FaFirstAid } from "react-icons/fa";
import baseApi from "../../axios/baseApi";
import ProcessImage from "./ProcessImage";
import { selectHospitalLogin } from "../../feature/hospitalSlice";
import { useSelector } from "react-redux";

export default function DonorRegister() {
  // get the hospital name and pass to the donation registration
  const {HospitalName} = useSelector(selectHospitalLogin)

  console.log("hospital-name",HospitalName)
  const [donorname, setDonorName] = useState("");
  const [dob, setDob] = useState("");
  const [bloodtype, setBloodType] = useState("");
  const [picture, setPicture] = useState(null); // Store image file
  const [imageUrl, setImageUrl] = useState(""); // For storing the uploaded Cloudinary URL
  const [descriptors, setDescriptors] = useState([]);
  const [uploaded, setUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log("dob", dob);
    console.log("bloodtype", bloodtype);
    console.log("descriptor", descriptors);
  }, [dob, bloodtype, descriptors]);

  const stats = [
    {
      name: "New Patients",
      number: 2,
      icon: <FaHospital />,
    },
    {
      name: "Blood Donations",
      number: 5,
      icon: <FaFirstAid />,
    },
    {
      name: "Register Donors",
      number: 3,
      icon: <FaHospital />,
    },
    {
      name: "New Patients",
      number: 1,
      icon: <FaHospital />,
    },
  ];

  const uploadImage = async (file) => {
    const cloudinaryUrl =
      "https://api.cloudinary.com/v1_1/<cloudinary_name>/image/upload";
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

  const handleChangePic = async (e) => {
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
      const response = await baseApi.post("/donorRegister", {
        donorname,
        dob,
        bloodtype,
        hospitalDonated:HospitalName
      });

      console.log("New donor data saved:", response);
      console.log("id", response.data.data._id);

      // If donor data is successfully saved, upload the picture
      if (picture) {
        const uploadedImageUrl = await uploadImage(picture);
        console.log("Image uploaded successfully:", uploadedImageUrl);

        const verifyResponse = await baseApi.put("/donorRegister/image", {
          donorId: response.data.data._id,
          picture: imageUrl,
          descriptors: descriptors,
        });

        console.log("response", verifyResponse.data.message);
        if (verifyResponse?.data?.verifyMessage) {
          setSuccess(false);
          setError(`${verifyResponse?.data?.verifyMessage}`);
          return;
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md">
        <ProcessImage imageUrl={imageUrl} setDescriptors={setDescriptors} />

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((section, index) => (
            <div
              key={index}
              className="flex justify-between items-center border px-4 py-6 rounded-lg shadow-sm bg-gray-50"
            >
              <div className="text-left">
                <h4 className="text-xl font-semibold">{section.number}</h4>
                <p className="text-sm text-gray-600">{section.name}</p>
              </div>
              <div
                className={`${
                  index === 1 ? "bg-red-500" : "bg-blue-500"
                } p-4 rounded-full text-white text-2xl`}
              >
                {section.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Donor Registration Form */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Donor Registration
        </h2>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Hospital Name
            </label>
            <input
              type="text"
              placeholder="Enter hospital name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setHospitalName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Donor Name
            </label>
            <input
              type="text"
              placeholder="Enter donor name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setDonorName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Blood Type
            </label>
            <select
              className="mt-1 block w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Picture
            </label>
            <div className="mt-2 flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                className="p-2 border border-gray-300 rounded-md shadow-sm w-full"
                onChange={handleChangePic}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-lg"
              onClick={handleSaveRecord}
              disabled={loading}
            >
              {loading ? "Saving..." : "Register Donor"}
            </button>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-center">
              Donor registered successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
