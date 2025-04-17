import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/slices/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import UserCard from "./UserCard"; // Import your UserCard component

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const defaultAvatar = "https://image.pngaaa.com/689/5258689-middle.png";

  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.emailId || "",
    age: user.age || "",
    about: user.about || "",
    skills: user.skills || [],
    gender: user.gender || "",
  });

  const [image, setImage] = useState({
    preview: user?.photoUrl || defaultAvatar,
    file: null,
  });

  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveProfileClick = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName.trim());
      formData.append("lastName", form.lastName.trim());
      formData.append("age", form.age);
      formData.append("gender", form.gender);
      // Properly format skills array as JSON string
      form.skills.forEach((skill, index) => {
        formData.append(`skills[${index}]`, skill);
      });

      // Clean up about text (remove extra whitespace)
      formData.append("about", form.about.trim().replace(/\s+/g, " "));
      if (image.file) {
        formData.append("photo", image.file);
      }
      console.log(formData);
      const response = await axios.post(
        `${BACKEND_BASE_URL}/profile/edit`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      dispatch(addUser(response?.data?.data));
      toast.success("Profile Updated Successfully!");
    } catch (error) {
      setErrors({
        other: error?.response?.data?.message || "Something went wrong",
      });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file (JPEG, PNG, GIF)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          preview: reader.result,
          file: file,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() !== "") {
      setForm((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (index) => {
    const updated = form.skills.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, skills: updated }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.age || isNaN(form.age) || form.age < 0)
      newErrors.age = "Please enter a valid age";
    if (!form.gender) newErrors.gender = "Please select a gender";
    return newErrors;
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center mx-4 md:mx-8 my-8 mb-16">
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={true}
        theme="dark"
      />

      <form
        onSubmit={handleSaveProfileClick}
        className="max-w-2xl p-6 bg-base-100 shadow-xl shadow-base-content/20 border-t-4 border-secondary rounded-2xl space-y-6 w-full h-screen"
      >
        <h3 className="text-xl md:text-2xl font-bold text-center">
          Edit Profile
        </h3>

        <div className="flex flex-col items-center gap-5">
          {/* Profile Image Container with Modern Shadow and Transition */}
          <div className="relative group">
            <div className="w-36 h-36 md:hidden rounded-full overflow-hidden border-2 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
              <img
                src={image.preview}
                alt="Profile preview"
                className="w-full  h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Modern Upload Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-sm rounded-full"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="bg-white/20 p-3 rounded-full mb-1">
                  <MdCloudUpload className="text-white text-xl" />
                </div>
                <span className="text-white text-sm font-medium">
                  Change Photo
                </span>
              </div>
            </div>
          </div>

          {/* Upload Controls - Modern Layout */}
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary/10 to-secondary/20 hover:from-secondary/20 hover:to-secondary/30 text-secondary font-medium rounded-lg shadow hover:shadow-md transition-all duration-200"
              >
                <MdCloudUpload className="text-lg" />
                {image.file ? "Change" : "Upload Photo"}
              </button>
            </div>

            {/* Modern Help Text */}
            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">
                Portrait photo, jpg or png
              </p>
              <p className="text-[0.65rem] text-gray-500 mt-0.5">
                Max file size: 5MB
              </p>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              className={`input w-full ${errors.firstName && "input-error"}`}
              value={form.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <span className="text-error text-sm">{errors.firstName}</span>
            )}
          </div>

          <div>
            <label className="label mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              className={`input input-bordered w-full ${
                errors.lastName && "input-error"
              }`}
              value={form.lastName}
              onChange={handleChange}
            />
            {errors.lastName && (
              <span className="text-error text-sm">{errors.lastName}</span>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="label mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="input input-bordered w-full"
              value={form.email}
              disabled
            />
          </div>

          <div>
            <label className="label mb-1">Gender</label>
            <select
              name="gender"
              className={`select select-bordered w-full ${
                errors.gender && "select-error"
              }`}
              value={form.gender}
              onChange={handleChange}
            >
              <option disabled value="">
                Select gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <span className="text-error text-sm">{errors.gender}</span>
            )}
          </div>

          <div>
            <label className="label mb-1">Age</label>
            <input
              type="number"
              name="age"
              className={`input input-bordered w-full ${
                errors.age && "input-error"
              }`}
              value={form.age}
              onChange={handleChange}
            />
            {errors.age && (
              <span className="text-error text-sm">{errors.age}</span>
            )}
          </div>
        </div>

        <div>
          <label className="label mb-1">About</label>
          <textarea
            name="about"
            className="textarea textarea-bordered w-full"
            rows="3"
            maxLength="100"
            value={form.about}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Skills
          </label>

          {/* Input with floating button */}
          <div className="relative flex gap-2">
            <input
              type="text"
              placeholder="Type a skill and press Enter"
              className="flex-1 input input-bordered input-md focus:ring-2 focus:ring-info focus:border-transparent pr-16"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
            />
            <button
              type="button"
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-circle btn-sm ${
                newSkill.trim() ? "btn-info" : "btn-disabled bg-gray-200"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Skills chips container */}
          <div className="flex flex-wrap gap-2 min-h-10">
            {form.skills.length > 0 ? (
              form.skills.map((skill, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-info/10 text-info hover:bg-info/20 transition-colors duration-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    className="ml-1.5 -mr-1 p-0.5 rounded-full hover:bg-info/30 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No skills added yet</p>
            )}
          </div>
        </div>

        {errors.other && (
          <span className="text-error text-sm">{errors.other}</span>
        )}

        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={isUploading}
            className={`
      relative overflow-hidden
      w-full max-w-xs
      px-8 py-3
      bg-gradient-to-r from-blue-500 to-info
      hover:from-blue-600 hover:to-indigo-700
      text-white font-medium rounded-lg
      shadow-lg hover:shadow-xl
      transition-all duration-300
      transform hover:scale-[1.02]
      focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50
      ${isUploading ? "opacity-90 cursor-not-allowed" : ""}
    `}
          >
            {isUploading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <span className="relative z-10">Save Changes</span>
                {/* Animated background elements */}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="
            absolute -left-10 w-12 h-48
            bg-white/30
            skew-x-[-15deg]
            transition-all duration-1000
            group-hover:left-[110%]
            overflow-hidden
          "
                  ></span>
                </span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Desktop preview using UserCard */}
      <div className="hidden md:block w-full md:max-w-4xl px-8 pt-4 pb-8">
        <h3 className="text-2xl w-full bg-gray border-1 p-2 border-gray-400 rounded-xl font-semibold text-center bg-gradient-to-r from-gray-500 to-gray-600 text-transparent bg-clip-text">
          Preview
        </h3>
        <div className="mt-4">
          <UserCard
            user={{
              ...form,
              photoUrl: image.preview,
              skills: form.skills,
            }}
            isPreview={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
