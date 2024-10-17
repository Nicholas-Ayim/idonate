import { useEffect, useState } from "react";
import { useHospitalSignupMutation } from "../../services/hospitalApi";
import { BounceLoader } from "react-spinners";
import { FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import contextApi from "../../contextApi/contextApi";



export default function SignupHospital() {
  const [HospitalSignup, { isloading, isError, data }] = useHospitalSignupMutation();

  const [HospitalName, setHospitalName] = useState("");
  const [address, setAddress] = useState("");
  const [HospitalEmail, setHospitalEmail] = useState("");
  const [region, setRegion] = useState("");
  const [location, setLocation] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [firstFour, setFirstFour] = useState(1234);
  const [secondFour, setSecondFour] = useState(5678);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const [type1, setType1] = useState("");
  const [contact1, setContact1] = useState("");
  const [additionalContacts, setAdditionalContacts] = useState([]);
   const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      try {
        const postalcode = `${cityCode}-${firstFour}-${secondFour}`;
        const contacts = [{ type: type1, number: contact1 }, ...additionalContacts];
        const newSignup = await HospitalSignup({
          HospitalName,
          address,
          HospitalContact: contacts,
          HospitalEmail,
          region,
          location,
          PostalCode: postalcode,
          password,
        });

        if (newSignup.data) {
          setSuccess(newSignup.data.message);
          setError("");
          // Clear form fields
          navigate("/hospital/login")
        } else {
          setError(newSignup.error?.data.message);
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }, 5000);
  };

  const addContact = (e) => {
    e.preventDefault();
    setAdditionalContacts([...additionalContacts, { type: "", number: "" }]);
  };

  const handleAdditionalContactChange = (index, field, value) => {
    const updatedContacts = additionalContacts.map((contact, i) =>
      i === index ? { ...contact, [field]: value } : contact
    );
    setAdditionalContacts(updatedContacts);
  };

  const removeContact = (index) => {
    const updatedContacts = additionalContacts.filter((_, i) => i !== index);
    setAdditionalContacts(updatedContacts);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center text-gray-800">Hospital Signup</h2>
        
        {/* Hospital Name */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Hospital Name</label>
          <input
            type="text"
            value={HospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter hospital name"
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter address"
          />
        </div>

        {/* Street Code */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Street Code</label>
          <div className="flex space-x-2">
            <select
              className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              onChange={(e) => setCityCode(e.target.value)}
            >
              <option>-</option>
              <option>GA</option>
              <option>AK</option>
              {/* Add more options */}
            </select>
            <input
              type="number"
              value={firstFour}
              onChange={(e) => setFirstFour(e.target.value)}
              className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="1234"
            />
            <input
              type="number"
              value={secondFour}
              onChange={(e) => setSecondFour(e.target.value)}
              className="w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="5678"
            />
          </div>
        </div>

        {/* Hospital Email */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Hospital Email</label>
          <input
            type="email"
            value={HospitalEmail}
            onChange={(e) => setHospitalEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter email"
          />
        </div>

        {/* Contact Type and Number */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Contact Type</label>
          <input
            type="text"
            value={type1}
            onChange={(e) => setType1(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Emergency Line"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Number</label>
          <input
            type="text"
            value={contact1}
            onChange={(e) => setContact1(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Enter contact number"
          />
        </div>

        {/* Additional Contacts */}
        {additionalContacts.map((contact, index) => (
          <div key={index} className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={contact.type}
              onChange={(e) => handleAdditionalContactChange(index, "type", e.target.value)}
              className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Additional Contact Type"
            />
            <input
              type="text"
              value={contact.number}
              onChange={(e) => handleAdditionalContactChange(index, "number", e.target.value)}
              className="w-1/2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Additional Number"
            />
            <button type="button" onClick={() => removeContact(index)} className="text-red-600">
              <FaTrash />
            </button>
          </div>
        ))}

        {/* Add Contact Button */}
        <div className="mb-4">
          <button
            type="button"
            onClick={addContact}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Add Contact
          </button>
        </div>

        {/* Region */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Region</label>
          <select
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            onChange={(e) => setRegion(e.target.value)}
          >
            <option disabled>Please select a region</option>
            <option>-</option>
            <option>Greater Accra</option>
            <option>Ashanti</option>
            {/* Add more regions */}
          </select>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Hospital precise location"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-2 text-gray-600">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Create a password"
          />
        </div>
        <div className="mb-4 flex w-[100%] flex-end justify-end" >
          <p>Have Account?<Link to="/hospital/login"> Login</Link></p>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
          >
            {loading ? <BounceLoader size={24} color="white" /> : "Sign Up"}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}

        {/* Success Message */}
        {success && <p className="mt-4 text-center text-green-600">{success}</p>}
      </form>
    </div>
  );
}
