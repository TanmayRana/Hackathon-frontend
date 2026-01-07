import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { registerUser, clearError } from "../store/slices/authSlice";
import { toast } from "sonner";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && email && password) {
      try {
        await dispatch(registerUser({ fullName, email, password })).unwrap();
        toast.success("Account created successfully!");
      } catch (error) {
        // Error is handled by Redux slice
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br w-full">
      <div className="w-full max-w-lg px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col items-center justify-center pt-8 pb-6 px-6">
            <img src="/img.jpg" alt="Digitalflake" className="w-30 h-30 " />

            <p className="text-gray-500 text-sm">
              Welcome to Digitalflake admin
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-8">
            <div className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 peer"
                  placeholder="Full Name"
                  required
                />
                <label
                  htmlFor="fullName"
                  className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-400"
                >
                  Full Name
                </label>
              </div>
              {/* Email Field */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 peer"
                  placeholder="Email-id"
                  required
                />
                <label
                  htmlFor="email"
                  className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-400"
                >
                  Email-id
                </label>
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 text-sm text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 peer"
                  placeholder="Password"
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute left-3 -top-2.5 bg-white px-1 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-gray-400"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#5c218B] text-white rounded-md hover:bg-[#4a1a6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600">
                Have an account?
                <a
                  href="/"
                  className="text-purple-600 font-medium hover:text-purple-700 hover:underline transition-colors"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
