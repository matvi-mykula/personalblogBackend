//// handle request returns

const createResponse = (success, status, data) => {
  return { success: success, status: status, data: data };
};

export { createResponse };
