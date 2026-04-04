// Backend/models/serviceModel.js

const formatServiceData = (data) => {
  return {
    serviceName: data.serviceName,
    description: data.description,
    image1: data.image1 || '',
    image2: data.image2 || '',
    image3: data.image3 || '',
    createdAt: data.createdAt || new Date().toISOString()
  };
};

// Use CommonJS export to match the rest of your backend
module.exports = { formatServiceData };