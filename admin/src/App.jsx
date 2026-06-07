import React, { useState, useEffect } from "react";
import { getClinics, addClinic, updateClinic, deleteClinic, uploadImage } from "./services/api";
import ClinicForm from "./components/ClinicForm";
import toast, { Toaster } from "react-hot-toast";
import confetti from "canvas-confetti";

const App = () => {
  const [clinics, setClinics] = useState([]);
  const [editingClinic, setEditingClinic] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successUrl, setSuccessUrl] = useState(null);
  
  const [isLoadingClinics, setIsLoadingClinics] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClinics = async () => {
    try {
      setIsLoadingClinics(true);
      const { data } = await getClinics();
      setClinics(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch clinics");
    } finally {
      setIsLoadingClinics(false);
    }
  };

  useEffect(() => {
    fetchClinics();
  }, []);

  const handleAddOrUpdateClinic = async (formDataPayload) => {
    setIsSubmitting(true);
    setSuccessUrl(null);
    try {
      let finalLogoUrl = formDataPayload.logoUrl;
      
      // 1. Upload Image to Cloudinary if a new file is provided
      if (formDataPayload.imageFile) {
        toast.loading("Uploading image to Cloudinary...", { id: 'upload' });
        const uploadData = new FormData();
        uploadData.append('image', formDataPayload.imageFile);
        
        const uploadRes = await uploadImage(uploadData);
        if (uploadRes.data.success) {
          finalLogoUrl = uploadRes.data.url;
          toast.success("Image uploaded!", { id: 'upload' });
        } else {
          toast.error("Image upload failed.", { id: 'upload' });
        }
      }

      // 2. Save Clinic Data
      const clinicData = {
        name: formDataPayload.name,
        subdomain: formDataPayload.subdomain,
        logoUrl: finalLogoUrl,
        details: formDataPayload.details
      };

      if (editingClinic) {
        await updateClinic(editingClinic.id, clinicData);
        toast.success("Clinic updated successfully");
      } else {
        await addClinic(clinicData);
        toast.success("Clinic created successfully");
        setSuccessUrl(`https://${clinicData.subdomain}.futureframe.com`);
        fireConfetti();
      }
      
      fetchClinics();
      setEditingClinic(null);
      setShowForm(false);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to save clinic";
      toast.error(msg);
      toast.dismiss('upload'); // clear loading toast if error
    } finally {
      setIsSubmitting(false);
    }
  };

  const fireConfetti = () => {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    function randomInRange(min, max) { return Math.random() * (max - min) + min; }
    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      var particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleDeleteClinic = async (id) => {
    if (window.confirm("Are you sure you want to delete this clinic?")) {
      try {
        await deleteClinic(id);
        toast.success("Clinic deleted successfully");
        fetchClinics();
      } catch (error) {
        toast.error("Failed to delete clinic");
      }
    }
  };

  const handleEditClinic = (clinic) => {
    setEditingClinic(clinic);
    setShowForm(true);
    setSuccessUrl(null);
  };

  const handleShowForm = () => {
    setEditingClinic(null);
    setShowForm(true);
    setSuccessUrl(null);
  };

  const closeSuccessMsg = () => setSuccessUrl(null);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Super Admin Portal</h1>
            <p className="text-slate-500 mt-1">Manage grooming salon tenants and subdomains.</p>
          </div>
          {!showForm && (
            <button
              onClick={handleShowForm}
              className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-teal-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              + Create New Clinic
            </button>
          )}
        </header>

        {successUrl && (
          <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-top-4">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-xl font-bold text-emerald-800 mb-2">🎉 Clinic Successfully Generated!</h3>
            <p className="text-emerald-700 mb-4">Your new dynamic tenant is now live at:</p>
            <div className="flex items-center gap-3">
              <a href={successUrl} target="_blank" rel="noreferrer" className="text-lg font-mono text-emerald-900 font-bold hover:underline bg-white px-4 py-2 rounded-lg border border-emerald-100 shadow-sm">
                {successUrl}
              </a>
            </div>
            <button onClick={closeSuccessMsg} className="absolute top-4 right-4 text-emerald-600 hover:text-emerald-800">
              ✕
            </button>
          </div>
        )}

        {showForm ? (
          <ClinicForm
            onSubmit={handleAddOrUpdateClinic}
            initialData={editingClinic}
            buttonText={editingClinic ? "Save Changes" : "Generate Clinic"}
            onCancel={() => setShowForm(false)}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoadingClinics ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <svg className="animate-spin h-10 w-10 text-teal-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Loading Tenants...</h3>
              </div>
            ) : clinics.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏢</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No Clinics Found</h3>
                <p className="text-gray-500">Get started by creating your first clinic tenant.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                      <th className="px-6 py-4">Clinic Details</th>
                      <th className="px-6 py-4">Subdomain</th>
                      <th className="px-6 py-4">Created Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clinics.map((clinic) => (
                      <tr key={clinic.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg border border-gray-200 overflow-hidden bg-white flex shrink-0 items-center justify-center">
                              {clinic.logoUrl ? (
                                <img src={clinic.logoUrl} alt="" className="w-full h-full object-contain p-1" />
                              ) : (
                                <span className="text-gray-400 text-xs text-center leading-tight">No<br/>Logo</span>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{clinic.name}</div>
                              <div className="text-xs text-slate-500 truncate max-w-[200px]">{clinic.location || 'No location set'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {clinic.subdomain}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(clinic.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditClinic(clinic)}
                              className="px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClinic(clinic.id)}
                              className="px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:text-red-700 shadow-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
