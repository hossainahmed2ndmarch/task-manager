import React from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa6";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAuth from "../hooks/useAuth";

const SignUp = () => {
  const { createNewUser, setUser, updateUserProfile, signUpWithGoogle } =
    useAuth();
  const axiosPublic = useAxiosPublic();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const from = location.state || "/";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // Firebase user creation
    createNewUser(data.email, data.password).then((res) => {
      const user = res.user;
      setUser(user);
      updateUserProfile({ displayName: data.name, photoURL: data.photo }).then(
        () => {
          const userInfo = {
            name: data.name,
            email: data.email,
            photo: data.photo,
          };
          axiosPublic.post("/users", userInfo).then((res) => {
            if (res.data.insertedId) {
              reset();
              toast.success(
                `🎉 Registration successful! Welcome ${user.displayName}!`,
                {
                  icon: "🚀",
                }
              );
              navigate('/task-page');
            }
          });
        }
      );
    });
  };

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

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="card w-full max-w-2xl p-2 md:p-[76px] shrink-0">
        <h2 className="text-4xl font-semibold text-black text-center">
          Register your account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
          {/* Name */}
          <div className="fieldset">
            <label className="label">
              <span className="label-text text-xl text-black font-semibold">
                Your Name
              </span>
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required." })}
              placeholder="Enter your name"
              className="input input-bordered w-full md:w-auto rounded-none border border-[#22b0bd] bg-[#d7f2f5]"
            />
            {errors.name && (
              <p className="text-red-600 text-sm font-semibold">
                {errors.name.message}
              </p>
            )}
          </div>
          {/* Photo */}
          <div className="fieldset">
            <label className="label">
              <span className="label-text text-xl text-black font-semibold">
                Photo URL
              </span>
            </label>
            <input
              type="url"
              {...register("photo", { required: "Photo URL is required." })}
              placeholder="Drop your photo url"
              className="input input-bordered w-full md:w-auto rounded-none border border-[#22b0bd] bg-[#d7f2f5]"
            />
            {errors.photo && (
              <p className="text-red-600 font-semibold text-sm">
                {errors.photo.message}
              </p>
            )}
          </div>
          {/* Email */}
          <div className="fieldset">
            <label className="label">
              <span className="label-text text-xl text-black font-semibold">
                Email address
              </span>
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required." })}
              placeholder="Enter your email address"
              className="input input-bordered w-full md:w-auto rounded-none border border-[#22b0bd] bg-[#d7f2f5]"
            />
            {errors.email && (
              <p className="text-red-600 font-semibold text-sm">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Password Create */}
          <div className="fieldset relative">
            <label className="label">
              <span className="label-text text-xl text-black font-semibold">
                Create Your Password
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
                    "Password must contain uppercase, lowercase, number, special character, and be at least 6 characters.",
                },
              })}
              placeholder="Enter your password"
              className="input input-bordered w-full md:w-auto rounded-none border border-[#22b0bd] bg-[#d7f2f5]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="btn btn-xs bg-transparent hover:bg-transparent text-[#22b0bd] shadow-none border-none absolute right-2 top-12"
            >
              {showPassword ? <FaEyeSlash></FaEyeSlash> : <FaEye></FaEye>}
            </button>
            {errors.password && (
              <p className="text-red-600 font-semibold text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          {/* Confirm Password */}
          <div className="fieldset relative">
            <label className="label">
              <span className="label-text text-xl text-black font-semibold">
                Confirm Your Password
              </span>
            </label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("confirmPassword", {
                required: "Confirm Password is required.",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match.",
              })}
              placeholder="Enter your password"
              className="input input-bordered w-full md:w-auto rounded-none border border-[#22b0bd] bg-[#d7f2f5]"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 font-semibold text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <div className="fieldset mt-6">
            <button className="btn border-none bg-[#22b0bd] text-white rounded-none  w-full">
              Register
            </button>
          </div>

          <div className="fieldset mt-6">
            <h5 className="text-3xl font-semibold text-[#22b0bd] text-center mb-6">
              Or
            </h5>
            <button
              onClick={handleGoogleSignUp}
              className="btn border-none bg-[#22b0bd] text-white rounded-none w-full"
            >
              <FaGoogle></FaGoogle>{" "}
              <span className="hidden md:flex">Sign Up With Google</span>
            </button>
          </div>
        </form>
        <p className="font-semibold text-blackLight text-center">
          Already Have An Account ?{" "}
          <Link to={"/"} className="text-[#22b0bd]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
