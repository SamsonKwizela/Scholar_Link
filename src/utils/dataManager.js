// Data Management Utility for localStorage-based "database"
// This simulates a database using localStorage for the frontend-only application

const STORAGE_KEYS = {
  SCHOLARSHIPS: 'scholarships',
  APPLICATIONS: 'applications',
  ASSESSMENTS: 'assessments',
  INTERNSHIPS: 'internships',
};

// Generic CRUD operations
const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('dataChange', { detail: { key } }));
};

const addItem = (key, item) => {
  const data = getData(key);
  const newItem = { ...item, id: Date.now(), createdAt: new Date().toISOString() };
  data.push(newItem);
  setData(key, data);
  return newItem;
};

const updateItem = (key, id, updates) => {
  const data = getData(key);
  const index = data.findIndex(item => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    setData(key, data);
    return data[index];
  }
  return null;
};

const deleteItem = (key, id) => {
  const data = getData(key);
  const filtered = data.filter(item => item.id !== id);
  setData(key, filtered);
};

// Specific operations for each data type
export const scholarshipsManager = {
  getAll: () => getData(STORAGE_KEYS.SCHOLARSHIPS),
  getById: (id) => getData(STORAGE_KEYS.SCHOLARSHIPS).find(s => s.id === id),
  add: (scholarship) => addItem(STORAGE_KEYS.SCHOLARSHIPS, scholarship),
  update: (id, updates) => updateItem(STORAGE_KEYS.SCHOLARSHIPS, id, updates),
  delete: (id) => deleteItem(STORAGE_KEYS.SCHOLARSHIPS, id),
  getCount: () => getData(STORAGE_KEYS.SCHOLARSHIPS).length,
};

export const applicationsManager = {
  getAll: () => getData(STORAGE_KEYS.APPLICATIONS),
  getById: (id) => getData(STORAGE_KEYS.APPLICATIONS).find(a => a.id === id),
  add: (application) => addItem(STORAGE_KEYS.APPLICATIONS, application),
  update: (id, updates) => updateItem(STORAGE_KEYS.APPLICATIONS, id, updates),
  delete: (id) => deleteItem(STORAGE_KEYS.APPLICATIONS, id),
  getCount: () => getData(STORAGE_KEYS.APPLICATIONS).length,
};

export const assessmentsManager = {
  getAll: () => getData(STORAGE_KEYS.ASSESSMENTS),
  getById: (id) => getData(STORAGE_KEYS.ASSESSMENTS).find(a => a.id === id),
  add: (assessment) => addItem(STORAGE_KEYS.ASSESSMENTS, assessment),
  update: (id, updates) => updateItem(STORAGE_KEYS.ASSESSMENTS, id, updates),
  delete: (id) => deleteItem(STORAGE_KEYS.ASSESSMENTS, id),
  getCount: () => getData(STORAGE_KEYS.ASSESSMENTS).length,
};

export const internshipsManager = {
  getAll: () => getData(STORAGE_KEYS.INTERNSHIPS),
  getById: (id) => getData(STORAGE_KEYS.INTERNSHIPS).find(i => i.id === id),
  add: (internship) => addItem(STORAGE_KEYS.INTERNSHIPS, internship),
  update: (id, updates) => updateItem(STORAGE_KEYS.INTERNSHIPS, id, updates),
  delete: (id) => deleteItem(STORAGE_KEYS.INTERNSHIPS, id),
  getCount: () => getData(STORAGE_KEYS.INTERNSHIPS).length,
};

// Export for use in components
export const useDataManager = () => {
  return {
    scholarships: scholarshipsManager,
    applications: applicationsManager,
    assessments: assessmentsManager,
    internships: internshipsManager,
  };
};
