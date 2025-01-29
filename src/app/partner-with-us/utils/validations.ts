
export const accountCreationValidation = (formData: Record<string, any>) => {
    const newErrors: Record<string, string> = {};
  
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }
  
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }
  
    // Contact number validation
    if (!formData.contactNo) {
      newErrors.contactNo = "Phone number is required.";
    } else if (!/^(?:\+91[\-\s]?)?[6-9]\d{9}$/.test(formData.contactNo)) {
      newErrors.contactNo = "Phone number must be valid number.";
    } else if (formData.contactNo.length !== 10) {
      newErrors.contactNo = "Phone number must be 10 digits.";
    }
  
    return newErrors;
  };