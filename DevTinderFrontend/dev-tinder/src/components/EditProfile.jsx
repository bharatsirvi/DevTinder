import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BACKEND_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/slices/userSlice";
import { ToastContainer, toast } from "react-toastify";
import { MdPreview } from "react-icons/md";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.emailId || "",
    age: user.age || "",
    about: user.about || "",
    skills: user.skills || [],
    photoUrl:
      user.photoUrl || "https://image.pngaaa.com/689/5258689-middle.png",
    gender: user.gender || "",
  });

  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleSaveProfileClick = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      try {
        const response = await axios.post(
          BACKEND_BASE_URL + "/profile/edit",
          {
            firstName: form.firstName,
            lastName: form.lastName,
            age: form.age,
            gender: form.gender,
            skills: form.skills,
            about: form.about,
            photoUrl: form.photoUrl,
          },
          { withCredentials: true }
        );
        console.log(response);
        dispatch(addUser(response?.data?.data));
        toast.success("Profile Updated Successfully!");
      } catch (error) {
        setErrors({
          other: error?.response?.data?.message || "Something went wrong",
        });
        console.log(error);
      }
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
    <div className="flex flex-col md:flex-row justify-center items-center mx-4 md:mx-8 my-2 mb-16">
      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={true}
        newestOnTop={true}
        theme="dark"
      />

      <form
        onSubmit={handleSaveProfileClick}
        className="max-w-2xl p-6  bg-base-300 shadow-xl rounded-2xl space-y-6 w-full"
      >
        <h3 className="text-xl md:text-2xl font-bold text-center">
          Edit Profile
        </h3>

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
              <option value="others">Other</option>
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
            className={`textarea textarea-bordered w-full ${
              errors.about && "textarea-error"
            }`}
            rows="3"
            maxLength="100"
            value={form.about}
            onChange={handleChange}
          ></textarea>
        </div>

        <div>
          <label className="label mb-1">Skills</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a skill"
              className="input input-bordered flex-1"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-accent"
              onClick={handleAddSkill}
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {form.skills.map((skill, index) => (
              <div key={index} className="badge badge-outline badge-lg">
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-1 text-warning font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="label mb-1">Profile Photo URL</label>
          <input
            type="text"
            name="photoUrl"
            className={`input input-bordered w-full ${
              errors.photoUrl && "input-error"
            }`}
            value={form.photoUrl}
            onChange={handleChange}
          />
        </div>

        {errors.other && (
          <span className="text-error text-sm">{errors.other}</span>
        )}

        {/* Show Preview button (mobile only) */}
        <button
          type="button"
          className="btn btn-outline btn-sm w-fit self-center md:hidden"
          onClick={() => setShowModal(true)}
        >
          Show Preview
        </button>

        <div className="text-center">
          <button type="submit" className="btn btn-info btn-wide">
            Save Changes
          </button>
        </div>
      </form>

      {/* Desktop preview */}
      <div className="hidden md:block w-full md:max-w-4xl px-8 pt-4 pb-8">
        <h3 className="text-2xl w-full bg-gray border-1 p-2 border-gray-400 rounded-xl font-semibold text-center bg-gradient-to-r from-gray-500 to-gray-600 text-transparent bg-clip-text">
          Preview
        </h3>
        <UserCard user={form} />
      </div>

      {/* Modal for mobile preview */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center md:hidden">
          <div className="w-full px-8 pt-2 pb-8 rounded-xl ">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-4 text-xl text-error font-bold"
            >
              ✕
            </button>
            <h3 className="text-2xl w-full bg-gray border-1 p-2 border-gray-300 rounded-xl font-semibold text-center bg-gradient-to-r from-gray-300 to-gray-400 text-transparent bg-clip-text">
              Preview
            </h3>
            <UserCard user={form} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
