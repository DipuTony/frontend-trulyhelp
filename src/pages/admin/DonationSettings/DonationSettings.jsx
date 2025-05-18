import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axiosInstance from "../../../utils/axiosInterceptor";

const DonationSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCause, setSelectedCause] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  // const [modalMode] = useState("create"); // "create" or "edit"
  const [formData, setFormData] = useState({
    causeId: "",
    name: "",
    displayName: "",
    description: "",
    colorScheme: {
      primary: "#4F46E5",
      secondary: "#818CF8",
      text: "#FFFFFF"
    },
    options: []
  });

  // Fetch all causes on component mount
  useEffect(() => {
    fetchCauses();
  }, []);

  const fetchCauses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}donation-options`);
      
      if (response.data.success) {
        // Transform the data structure to match our component needs
        const causesArray = Object.keys(response.data.data).map(key => {
          const cause = response.data.data[key];
          return {
            name: key,
            causeId: cause.causeId,
            displayName: cause.displayName,
            description: cause.description,
            colorScheme: cause.colorScheme,
            options: cause.options
          };
        });
        
        setCauses(causesArray);
      } else {
        setError("Failed to fetch donation options");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching donation options");
      console.error("Error fetching donation options:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCauseById = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}donation-options/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error("Failed to fetch cause details");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while fetching cause details");
      console.error("Error fetching cause details:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCause = () => {
    setModalMode("create");
    setFormData({
      causeId: "",
      name: "",
      displayName: "",
      description: "",
      colorScheme: {
        primary: "#4F46E5",
        secondary: "#818CF8",
        text: "#FFFFFF"
      },
      options: [
        { frequency: "once", amount: 100, message: "Basic donation" },
        { frequency: "once", amount: 500, message: "Standard donation" },
        { frequency: "once", amount: 1000, message: "Premium donation" },
        { frequency: "monthly", amount: 100, message: "Basic monthly support" },
        { frequency: "monthly", amount: 500, message: "Standard monthly support" }
      ]
    });
    setIsModalOpen(true);
  };

  const handleEditCause = async (cause) => {
    setModalMode("edit");
    setSelectedCause(cause);
    console.log("Edit button clicked", cause)
    
    // Fetch the full cause details including options
    const causeDetails = await fetchCauseById(cause?.causeId);
    
    if (causeDetails) {
      // Transform options from the API format to our form format
      const formattedOptions = [];
      
      if (causeDetails.options) {
        causeDetails.options.forEach(option => {
          formattedOptions.push({
            frequency: option.frequency,
            amount: option.amount,
            message: option.message
          });
        });
      }
      
      setFormData({
        causeId: causeDetails.causeId,
        name: causeDetails.name,
        displayName: causeDetails.displayName,
        description: causeDetails.description,
        colorScheme: causeDetails.colorScheme,
        options: formattedOptions
      });
      
      setIsModalOpen(true);
    }
  };

  const handleDeleteCause = async (causeId) => {
    if (!window.confirm("Are you sure you want to delete this cause? This action cannot be undone.")) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}donation-options/${causeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (response.data.success) {
        toast.success("Cause deleted successfully");
        fetchCauses(); // Refresh the list
      } else {
        toast.error("Failed to delete cause");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred while deleting the cause");
      console.error("Error deleting cause:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      colorScheme: {
        ...prev.colorScheme,
        [name]: value
      }
    }));
  };

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index][field] = field === 'amount' ? parseInt(value, 10) : value;
    
    setFormData(prev => ({
      ...prev,
      options: updatedOptions
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        { frequency: "once", amount: 0, message: "" }
      ]
    }));
  };

  const removeOption = (index) => {
    const updatedOptions = [...formData.options];
    updatedOptions.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      options: updatedOptions
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate form data
      if (!formData.name || !formData.displayName || !formData.description) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      if (formData.options.length === 0) {
        toast.error("Please add at least one donation option");
        return;
      }
      
      // Check for valid amounts
      const invalidOptions = formData.options.filter(option => 
        isNaN(option.amount) || option.amount <= 0 || !option.message
      );
      
      if (invalidOptions.length > 0) {
        toast.error("All options must have valid amounts and messages");
        return;
      }
      
      let response;
      
      if (modalMode === "create") {
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}donation-options`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      } else {
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}donation-options/${selectedCause.causeId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      }
      
      if (response.data.success) {
        toast.success(
          modalMode === "create" 
            ? "Cause created successfully" 
            : "Cause updated successfully"
        );
        setIsModalOpen(false);
        fetchCauses(); // Refresh the list
      } else {
        toast.error(
          modalMode === "create"
            ? "Failed to create cause"
            : "Failed to update cause"
        );
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
      console.error("Error submitting form:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && causes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Donation Settings</h2>
            <p className="mt-2 text-indigo-100">Manage donation causes and options</p>
          </div>
          <button
            onClick={handleCreateCause}
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-all duration-200"
          >
            <i className="fas fa-plus mr-2"></i>
            Add New Cause
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Causes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {causes.map((cause, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-200"
          >
            <div 
              className="p-6" 
              style={{
                backgroundColor: cause.colorScheme?.primary || "#4F46E5",
                color: cause.colorScheme?.text || "#FFFFFF"
              }}
            >
              <h3 className="text-xl font-bold">{cause.displayName}</h3>
              <p className="mt-2 text-sm opacity-90">{cause.description}</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Donation Options</h4>
                <div className="mt-2 space-y-2">
                  {cause.options && cause.options.once && (
                    <div>
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        One-time
                      </span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {cause.options.once.amounts.map((amount, i) => (
                          <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            ₹{amount}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {cause.options && cause.options.monthly && (
                    <div className="mt-2">
                      <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Monthly
                      </span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {cause.options.monthly.amounts.map((amount, i) => (
                          <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            ₹{amount}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEditCause(cause)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <i className="fas fa-edit mr-2"></i>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCause(cause.causeId)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <i className="fas fa-trash-alt mr-2"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {modalMode === "create" ? "Create New Cause" : "Edit Cause"}
                      </h3>
                      
                      <div className="mt-6 space-y-6 w-full">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                              Cause ID (unique identifier) *
                            </label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="e.g., education_fund"
                              required
                              disabled={modalMode === "edit"}
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Used as a unique identifier (no spaces, lowercase)
                            </p>
                          </div>
                          
                          <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                              Display Name *
                            </label>
                            <input
                              type="text"
                              name="displayName"
                              id="displayName"
                              value={formData.displayName}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="e.g., Education Fund"
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description *
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Describe the purpose of this donation cause"
                            required
                          ></textarea>
                        </div>
                        
                        {/* Color Scheme */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Color Scheme</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label htmlFor="primary" className="block text-xs font-medium text-gray-500">
                                Primary Color
                              </label>
                              <div className="mt-1 flex items-center">
                                <input
                                  type="color"
                                  name="primary"
                                  id="primary"
                                  value={formData.colorScheme.primary}
                                  onChange={handleColorChange}
                                  className="h-8 w-8 rounded-md border border-gray-300"
                                />
                                <input
                                  type="text"
                                  value={formData.colorScheme.primary}
                                  onChange={handleColorChange}
                                  name="primary"
                                  className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-xs"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="secondary" className="block text-xs font-medium text-gray-500">
                                Secondary Color
                              </label>
                              <div className="mt-1 flex items-center">
                                <input
                                  type="color"
                                  name="secondary"
                                  id="secondary"
                                  value={formData.colorScheme.secondary}
                                  onChange={handleColorChange}
                                  className="h-8 w-8 rounded-md border border-gray-300"
                                />
                                <input
                                  type="text"
                                  value={formData.colorScheme.secondary}
                                  onChange={handleColorChange}
                                  name="secondary"
                                  className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-xs"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="text" className="block text-xs font-medium text-gray-500">
                                Text Color
                              </label>
                              <div className="mt-1 flex items-center">
                                <input
                                  type="color"
                                  name="text"
                                  id="text"
                                  value={formData.colorScheme.text}
                                  onChange={handleColorChange}
                                  className="h-8 w-8 rounded-md border border-gray-300"
                                />
                                <input
                                  type="text"
                                  value={formData.colorScheme.text}
                                  onChange={handleColorChange}
                                  name="text"
                                  className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 p-4 rounded-md" style={{
                            backgroundColor: formData.colorScheme.primary,
                            color: formData.colorScheme.text
                          }}>
                            <p className="font-medium">Preview</p>
                            <p className="text-sm mt-1 opacity-90">This is how your cause will appear</p>
                          </div>
                        </div>
                        
                        {/* Donation Options */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-sm font-medium text-gray-700">Donation Options *</h4>
                            <button
                              type="button"
                              onClick={addOption}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                            >
                              <i className="fas fa-plus mr-1"></i>
                              Add Option
                            </button>
                          </div>
                          
                          {formData.options.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">No options added yet. Click "Add Option" to create one.</p>
                          ) : (
                            <div className="space-y-3">
                              {formData.options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md">
                                  <div className="w-1/4">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Frequency
                                    </label>
                                    <select
                                      value={option.frequency}
                                      onChange={(e) => handleOptionChange(index, 'frequency', e.target.value)}
                                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm"
                                    >
                                      <option value="once">One-time</option>
                                      <option value="monthly">Monthly</option>
                                    </select>
                                  </div>
                                  
                                  <div className="w-1/4">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Amount (₹)
                                    </label>
                                    <input
                                      type="number"
                                      value={option.amount}
                                      onChange={(e) => handleOptionChange(index, 'amount', e.target.value)}
                                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm"
                                      min="1"
                                      required
                                    />
                                  </div>
                                  
                                  <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1">
                                      Message
                                    </label>
                                    <input
                                      type="text"
                                      value={option.message}
                                      onChange={(e) => handleOptionChange(index, 'message', e.target.value)}
                                      className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm"
                                      placeholder="e.g., Basic donation"
                                      required
                                    />
                                  </div>
                                  
                                  <div className="flex items-end pb-1">
                                    <button
                                      type="button"
                                      onClick={() => removeOption(index)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      modalMode === "create" ? "Create Cause" : "Update Cause"
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationSettings;