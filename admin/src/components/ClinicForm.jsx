import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

const ClinicForm = ({ onSubmit, initialData, buttonText, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
    logoUrl: "",
    details: "{\n  \"phone\": \"+1 (555) 987-6543\",\n  \"email\": \"hello@awesomegrooming.com\",\n  \"location\": \"456 Animal Boulevard, NY\",\n  \"happyPetsTreated\": 12500,\n  \"expertSpecialists\": 8,\n  \"yearsExperience\": 12,\n  \"services\": [\n    {\n      \"name\": \"Full Grooming Spa\",\n      \"description\": \"Comprehensive head-to-tail styling to keep your pet looking fabulous.\"\n    },\n    {\n      \"name\": \"Puppy Bath & Trim\",\n      \"description\": \"A gentle introduction to grooming for young dogs.\"\n    }\n  ],\n  \"testimonials\": [\n    {\n      \"name\": \"Jane Doe\",\n      \"text\": \"The stylists here truly care about my dog. Best salon in the city!\",\n      \"rating\": 5\n    }\n  ]\n}"
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [hasManuallyEditedSlug, setHasManuallyEditedSlug] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      const { name, subdomain, logoUrl, id, createdAt, updatedAt, ...rest } = initialData;
      setFormData({
        name: initialData.name || "",
        subdomain: initialData.subdomain || "",
        logoUrl: initialData.logoUrl || "",
        details: Object.keys(rest).length > 0 ? JSON.stringify(rest, null, 2) : formData.details
      });
      setImagePreview(initialData.logoUrl || "");
      if (initialData.subdomain) setHasManuallyEditedSlug(true);
    }
  }, [initialData]);

  // Auto-slug generator
  useEffect(() => {
    if (!hasManuallyEditedSlug && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData((prev) => ({ ...prev, subdomain: slug }));
    }
  }, [formData.name, hasManuallyEditedSlug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "subdomain") setHasManuallyEditedSlug(true);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      JSON.parse(formData.details);
    } catch (err) {
      toast.error("Invalid JSON format in details.");
      return;
    }

    // Pass the raw file along with the form data to the parent component
    onSubmit({ ...formData, imageFile });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{initialData ? 'Edit Clinic' : 'Add New Clinic'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Logo Upload Section */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic Logo</label>
            <div className="flex items-start gap-6">
              <div 
                className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0 cursor-pointer hover:border-teal-400 transition-colors relative group"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium">Change</span>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-400 text-xs text-center px-2">Click to<br/>Upload</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {imagePreview ? 'Replace Image' : 'Choose File'}
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Upload a square or horizontal logo (PNG, JPG, WebP). 
                  It will be uploaded directly to Cloudinary.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Clinic Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Paws & Bubbles Grooming"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subdomain (Slug)</label>
            <div className="flex">
              <input
                type="text"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                placeholder="e.g. paws"
                className="w-full px-4 py-3 rounded-l-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                required
              />
              <span className="inline-flex items-center px-4 rounded-r-xl border border-l-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm font-medium">
                .futureframe.com
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 ml-1">Auto-generates from name, but can be manually edited.</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              JSON Details <span className="text-gray-400 font-normal">(phone, services, testimonials, etc.)</span>
            </label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows="12"
              className="w-full px-4 py-3 font-mono text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all bg-slate-50"
              required
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all disabled:opacity-70 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClinicForm;
