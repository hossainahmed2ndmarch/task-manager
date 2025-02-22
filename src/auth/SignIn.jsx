import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { userLogIn, setUser, signUpWithGoogle, setResetEmail } = useAuth();
  const axiosPublic = useAxiosPublic();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state || "/";

  const [showPassword, setShowPassword] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // Submit functionality
  const onSubmit = async (data) => {
    try {
      const { email, password } = data;

      // Login
      const res = await userLogIn(email, password);
      const user = res.user;
      setUser(user);
      toast.success(`🎉 Welcome back! ${user?.displayName || "User"}!`);
      navigate("/task-page");;
    } catch (err) {
      const errorMessage =
        err.code === "auth/wrong-password"
          ? "Incorrect password. Please try again."
          : err.message;
      setError("server", { type: "manual", message: errorMessage });
    }
  };

  // Sign up with Google
  const handleGoogleSignUp = () => {
    signUpWithGoogle().then((res) => {
      const userInfo = {
        name: res?.user?.displayName,
        email: res?.user?.email,
        photo: res?.user?.photoURL,
      };
      axiosPublic.post("/users", userInfo).then((res) => {
        // console.log(res.data);
        navigate("/task-page");
      });
    });
  };

  // Forgot password functionality
  const handleForgotPasswordRedirect = (e) => {
    e.preventDefault();
    const email = document.querySelector("input[name='email']").value;
    setResetEmail(email);
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="card w-full max-w-lg p-6 md:p-12 flex flex-col items-center">
        <h2 className="text-4xl font-semibold text-black text-center mb-6">
          Login to your account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          {/* Email */}
          <div className="fieldset mb-4">
            <label className="label">
              <span className="label-text text-xl text-black font-semibold">
                Email address
              </span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email address.",
                },
              })}
              placeholder="Enter your email address"
              className="input input-bordered w-full md:w-auto rounded-none border border-[#22b0bd] bg-[#d7f2f5]"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-2 font-semibold">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="fieldset relative mb-6">
            <label className="label">
              <span className="label-text text-xl text-black font-semibold">
                Password
              </span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required.",
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                  message:
                    "Password must contain at least 6 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
                },
              })}
              placeholder="Enter your password"
              className="input input-bordered w-full md:w-auto rounded-none border border-[#22b0bd] bg-[#d7f2f5]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-xs bg-transparent hover:bg-transparent text-[#22b0bd] shadow-none border-none absolute right-4 top-12"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="text-red-600 text-sm mt-2 font-semibold">
                {errors.password.message}
              </p>
            )}
            {errors.server && (
              <p className="text-red-600 text-sm mt-2 font-semibold">
                {errors.server.message}
              </p>
            )}
            
          </div>

          {/* Submit Button */}
          <div className="form-control mt-6">
            <button className="btn border-none bg-[#22b0bd] text-white rounded-none w-full">
              Login
            </button>
          </div>

          {/* Google Signup Button */}
          <div className="form-control mt-6">
            <h5 className="text-3xl font-semibold text-[#22b0bd] text-center mb-6">
              Or
            </h5>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="btn border-none bg-[#22b0bd] text-white rounded-none w-full"
            >
              <FaGoogle />
              <span className="ml-2">Sign Up With Google</span>
            </button>
          </div>
        </form>
        <p className="font-semibold text-blackLight text-center mt-6">
          Don’t Have An Account?{" "}
          <Link to={"/sign-up"} className="text-[#22b0bd]">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
