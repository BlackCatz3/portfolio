export const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
};

export const success = (data, statusCode = 200) => ({
  statusCode,
  headers,
  body: JSON.stringify(data)
});

export const error = (message, statusCode = 500) => ({
  statusCode,
  headers,
  body: JSON.stringify({ error: message })
});
