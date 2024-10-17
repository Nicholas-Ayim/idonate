import { useState } from "react";
import { useHospitalLoginMutation } from "../../services/hospitalApi";
import { Link, useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";

export default function HospitalLogins() {
  const [HospitalLogin, { isLoading, isError, data }] = useHospitalLoginMutation();
  const [hospitalemail, setHospitalEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleHospitalLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      try {
        const response = await HospitalLogin({
          HospitalEmail: hospitalemail,
          password,
        });
        const successRes = response?.data;
        const errorRes = response?.error?.data;

        if (successRes) {
          setHospitalEmail("");
          setPassword("");
          setSuccess(successRes?.message);
          navigate("/hospital/dashboard");
        }

        if (errorRes) {
          setHospitalEmail(hospitalemail);
          setPassword(password);
          setErrorMessage(errorRes?.message);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Hospital Login</h2>
        <form className="space-y-4" onSubmit={handleHospitalLogin}>
          <div>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your hospital email"
              value={hospitalemail}
              onChange={(e) => setHospitalEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
          {success && <div className="text-green-500 text-sm">{success}</div>}
          {loading && (
            <div className="flex justify-center">
              <BounceLoader color="#3498db" />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mb-4 pt-2 flex w-[100%] flex-end justify-end" >
          <p className="text-red-800">register account<Link to="/"> Signup</Link></p>
        </div>
      </div>
    </div>
  );
}
