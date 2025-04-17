import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Code,
  Star,
  Users,
  Sparkles,
  Check,
  Clock,
  Rocket,
  ChevronRight,
  Upload,
  User,
  Briefcase,
  Database,
  Layout,
  Server,
  PenTool,
  FileCode,
  Languages,
  Plus,
  X,
} from "lucide-react";
import { BACKEND_BASE_URL } from "../utils/constants";
import { setInitialSetup } from "../utils/slices/configSlice";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/slices/userSlice";

const FunFacts = [
  "Profiles with professional photos get 21x more views",
  "Developers with unique skills stand out from the crowd",
  "Most popular skill: 'Problem Solving'",
  "Best icebreaker: 'Tabs or spaces?'",
  "90% of successful connections share similar interests",
];

const InitialSetup = () => {
  const [step, setStep] = useState(1);
  const [funFact, setFunFact] = useState("");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    about: "",
    skills: [],
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [customSkill, setCustomSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  useEffect(() => {
    setFunFact(FunFacts[Math.floor(Math.random() * FunFacts.length)]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, photo: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const toggleSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((i) => i !== skill)
        : [...prev.skills, skill],
    }));
  };

  const addCustomSkill = () => {
    if (customSkill && !formData.skills.includes(customSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, customSkill],
      }));
      setCustomSkill("");
    }
  };

  const removeSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && customSkill) {
      e.preventDefault();
      addCustomSkill();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("age", formData.age);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("about", formData.about);
      formData.skills.forEach((skill) => {
        formDataToSend.append("skills[]", skill);
      });
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }

      const respose = await axios.post(
        BACKEND_BASE_URL + "/profile/edit",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("updated ->", respose);
      dispatch(addUser(respose.data.data));
      navigate("/");
    } catch (error) {
      console.error("Profile setup failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const skillOptions = [
    { name: "JavaScript", icon: <FileCode size={18} /> },
    { name: "Python", icon: <Code size={18} /> },
    { name: "React", icon: <Layout size={18} /> },
    { name: "Node.js", icon: <Server size={18} /> },
    { name: "UI/UX", icon: <PenTool size={18} /> },
    { name: "Database", icon: <Database size={18} /> },
    { name: "DevOps", icon: <Briefcase size={18} /> },
    { name: "Languages", icon: <Languages size={18} /> },
  ];

  const isStep1Valid = formData.age && formData.gender && formData.photo;
  // Skills are now optional
  const isStep3Valid = true; // About is optional

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-l from-secondary/10 via-primary/10 to-info/10 p-4">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-base-100 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Section - Enhanced */}
        <div className="hidden md:block lg:w-5/12 p-10 text-white bg-gradient-to-br from-info via-primary to-secondary relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

          <div className="h-full flex flex-col justify-between relative z-10">
            {/* Header Section */}
            <div>
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm shadow-lg border border-white/10">
                  <User className="text-white" size={28} />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                    Build Your Profile
                  </h1>
                  <p className="text-lg opacity-90 mt-2">
                    Unlock tailored opportunities in our network
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                <div className="badge badge-outline border-white/30 text-white gap-2 px-4 py-3">
                  <Star size={16} /> Step {step} of 3
                </div>
                <div className="badge badge-outline border-white/30 text-white gap-2 px-4 py-3">
                  <Clock size={16} /> Takes just 2 minutes
                </div>
              </div>
            </div>

            {/* Content Middle Section */}
            <div className="space-y-6 my-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Rocket size={18} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Profile Strength
                  </h3>
                  <p className="text-sm opacity-90">
                    Complete profiles get 3x more views and connections
                  </p>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Users size={18} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Network Effect</h3>
                  <p className="text-sm opacity-90">
                    Members with complete profiles connect with 40% more peers
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <Sparkles className="text-yellow-200" size={24} />
                Pro Tip
              </h3>

              <div className="space-y-4">
                <p className="text-sm leading-relaxed">
                  Profiles with{" "}
                  <span className="font-semibold">detailed bios</span> and{" "}
                  <span className="font-semibold">5+ skills</span> receive the
                  most engagement.
                </p>

                <div className="p-3 bg-white/10 rounded-lg border-l-4 border-accent">
                  <p className="italic text-sm mb-1">"{funFact}"</p>
                  <p className="text-xs opacity-70 text-right">
                    — Community Data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:w-7/12 bg-base-100 p-8 md:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Mobile Header */}
            <div className="flex flex-col items-center mb-8 lg:hidden">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-secondary text-white rounded-full mb-4">
                <User size={28} />
              </div>
              <h1 className="text-3xl font-bold mb-2">Create Profile</h1>
              <div className="badge badge-secondary gap-2 mb-4">
                Step {step} of 3
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-between mb-8 relative">
              {[1, 2, 3].map((i) => (
                <React.Fragment key={i}>
                  <div
                    className={`z-10 w-10 h-10 rounded-full flex items-center justify-center 
                      ${
                        step >= i
                          ? "bg-secondary text-secondary-content"
                          : "bg-base-200 text-base-content"
                      }
                      ${
                        i === step ? "ring-2 ring-offset-2 ring-secondary" : ""
                      } transition-all duration-300`}
                  >
                    {i}
                  </div>
                  {i < 3 && (
                    <div
                      className={`absolute h-1 top-1/2 transform -translate-y-1/2 transition-all duration-500 
                      ${step > i ? "bg-secondary" : "bg-base-200"}`}
                      style={{
                        left: `${(i - 1) * 50}%`,
                        right: `${100 - i * 50}%`,
                      }}
                    ></div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold">Basic Information</h2>

                <div className="form-control mb-8">
                  <label className="label">
                    <span className="label-text font-medium">
                      Profile Photo <span className="text-error">*</span>
                    </span>
                  </label>

                  <div
                    className={`mt-2 flex flex-col items-center justify-center border-2 ${
                      dragActive
                        ? "border-secondary bg-secondary/5"
                        : "border-dashed border-base-300"
                    } rounded-xl p-6 transition-all duration-200`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                  >
                    {photoPreview ? (
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-info/20 mb-4">
                          <img
                            src={photoPreview}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => {
                            setPhotoPreview(null);
                            setFormData((prev) => ({ ...prev, photo: null }));
                          }}
                          className="text-info text-sm underline"
                        >
                          Change photo
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                            <Upload size={24} className="text-secondary" />
                          </div>
                          <p className="text-sm text-center">
                            <span className="font-medium">Click to upload</span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-base-content/60 mt-1">
                            PNG, JPG or GIF (max. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".jpeg,.jpg,.png,.gif"
                          onChange={handlePhotoChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Age <span className="text-error">*</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      min="18"
                      max="100"
                      placeholder="e.g., 25"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Gender <span className="text-error">*</span>
                      </span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="select select-bordered w-full"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="btn btn-secondary w-full mt-6"
                  disabled={!isStep1Valid}
                >
                  Continue <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold">Your Skills</h2>
                <p className="text-sm text-base-content/70 mb-4">
                  Select skills to highlight your expertise or add your own
                  custom skills
                </p>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {skillOptions.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => toggleSkill(item.name)}
                      className={`btn h-auto py-3 flex-col gap-2 bg-base-100 hover:bg-base-200 border border-base-300
                        ${
                          formData.skills.includes(item.name)
                            ? "!bg-info/10 !text-info !border-info/30"
                            : ""
                        } transition-all duration-200`}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text font-medium">
                      Add Custom Skill
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="input input-bordered flex-1"
                      placeholder="e.g., Machine Learning"
                    />
                    <button
                      onClick={addCustomSkill}
                      disabled={!customSkill}
                      className="btn btn-secondary btn-square"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {formData.skills.length > 0 && (
                  <div className="mt-4">
                    <label className="label">
                      <span className="label-text font-medium">
                        Selected Skills
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="badge badge-info badge-outline gap-2 p-3"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="btn btn-ghost btn-xs btn-circle"
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="btn btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="btn btn-secondary flex-1"
                  >
                    Continue <ChevronRight size={18} className="ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: About */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold">About You</h2>

                <div className="form-control">
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full h-24"
                    placeholder="Share your professional experience, goals, or what makes you unique. This helps others understand your background and expertise."
                    maxLength="300"
                  ></textarea>
                  <div className="text-xs text-right text-base-content/60 mt-1">
                    {formData.about.length}/300
                  </div>
                </div>

                <div className="card bg-base-100 border border-base-300 shadow-md mt-6 overflow-hidden">
                  <div className="card-body p-0">
                    {/* Header */}
                    <div className="bg-info/10 p-4 flex items-center">
                      <Check size={18} className="text-info mr-2" />
                      <h3 className="font-bold text-lg text-info m-0">
                        Profile Summary
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Profile Image and Basic Info */}
                      <div className="flex items-center gap-3 mb-4">
                        {photoPreview ? (
                          <div className="avatar">
                            <div className="w-12 md:w-20 h-12 md:h-20 rounded-full ring-2 ring-info ring-offset-2">
                              <img
                                src={photoPreview}
                                alt="Profile"
                                className="object-cover"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="avatar placeholder">
                            <div className="bg-info/20 text-info rounded-full w-20 h-20 flex items-center justify-center">
                              <User size={32} />
                            </div>
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="badge badge-info">
                              {formData.gender || "—"}
                            </div>
                            <div className="badge badge-outline">
                              {formData.age
                                ? `${formData.age} years`
                                : "Age not set"}
                            </div>
                          </div>
                          <div className="text-sm opacity-75 mt-1">
                            {formData.about ? (
                              `"${formData.about.substring(0, 60)}${
                                formData.about.length > 60 ? "..." : ""
                              }" `
                            ) : (
                              <span className="italic">No bio added yet</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="bg-base-200 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-sm uppercase tracking-wide text-base-content/70 m-0">
                            Skills
                          </h4>
                          <div className="badge badge-sm">
                            {formData.skills.length}
                          </div>
                        </div>

                        {formData.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill) => (
                              <span
                                key={skill}
                                className="badge badge-sm badge-info badge-outline"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-2 text-base-content/60 text-sm italic">
                            No skills added yet
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="btn btn-outline flex-1"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-secondary flex-1"
                    disabled={!isStep3Valid || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Saving...
                      </>
                    ) : (
                      "Complete Profile"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitialSetup;
