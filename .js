import React, { useState, useEffect } from "react";
import "./styles.css"; // Add your CSS for styling

const fetchFormStructure = async () => {
  // Simulated API response
  return {
    fields: [
      { name: "name", type: "text", label: "Name", required: true },
      { name: "email", type: "email", label: "Email", required: true },
      { name: "age", type: "number", label: "Age", required: false },
    ],
  };
};

const DynamicForm = () => {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [feedback, setFeedback] = useState("");

  // Fetch form structure when component loads
  useEffect(() => {
    fetchFormStructure().then((response) => setFields(response.fields));
  }, []);

  // Calculate progress
  useEffect(() => {
    const requiredFields = fields.filter((field) => field.required);
    const completedFields = requiredFields.filter((field) => formData[field.name]);
    setProgress((completedFields.length / requiredFields.length) * 100 || 0);
  }, [formData, fields]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmittedData([...submittedData, formData]);
      setFeedback("Form submitted successfully!");
      setFormData({});
    }
  };

  // Render dynamic fields
  const renderField = (field) => (
    <div key={field.name} className="form-group">
      <label>
        {field.label} {field.required && "*"}
      </label>
      <input
        type={field.type}
        name={field.name}
        value={formData[field.name] || ""}
        onChange={handleChange}
        className={errors[field.name] ? "error" : ""}
      />
      {errors[field.name] && <small>{errors[field.name]}</small>}
    </div>
  );

  return (
    <div className="form-container">
      <h1>Dynamic Form</h1>
      <form onSubmit={handleSubmit}>
        {fields.map(renderField)}
        <div className="progress-bar" style={{ width: `${progress}%` }}>
          {Math.round(progress)}%
        </div>
        <button type="submit">Submit</button>
      </form>
      {feedback && <p className="feedback">{feedback}</p>}
      {submittedData.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(submittedData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submittedData.map((data, index) => (
              <tr key={index}>
                {Object.values(data).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DynamicForm;
