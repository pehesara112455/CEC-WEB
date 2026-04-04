// backend/models/serviceModel.js

export const formatServiceData = (data) => {
  return {
    serviceName: data.serviceName,
    description: data.description,
    image1: data.image1 || '',
    image2: data.image2 || '',
    image3: data.image3 || '',
    createdAt: data.createdAt || new Date().toISOString()
  };
};