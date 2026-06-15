// Data Management Utility for localStorage-based "database"
// This simulates a database using localStorage for the frontend-only application

const STORAGE_KEYS = {
  SCHOLARSHIPS: 'scholarships',
  APPLICATIONS: 'applications',
  ASSESSMENTS: 'assessments',
  INTERNSHIPS: 'internships',
};

// Initial dummy data to populate localStorage if empty
const INITIAL_DATA = {
  scholarships: [
    {
      id: 1,
      title: "Women in Tech Scholarship",
      field: "Technology",
      deadline: "12 June 2026",
      status: "Open",
      amount: "$5,000",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      description: "Supporting women pursuing careers in technology",
      eligibility: "Female students enrolled in tech-related programs",
    },
    {
      id: 2,
      title: "STEM Excellence Grant",
      field: "Engineering",
      deadline: "25 June 2026",
      status: "Closing Soon",
      amount: "$8,000",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
      description: "Recognizing excellence in STEM fields",
      eligibility: "Students with GPA 3.5+ in STEM programs",
    },
    {
      id: 3,
      title: "Global Leaders Program",
      field: "Business",
      deadline: "5 July 2026",
      status: "Open",
      amount: "$10,000",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
      description: "Developing tomorrow's business leaders",
      eligibility: "Students with leadership experience",
    },
  ],
  applications: [
    { id: 1, scholarship: "Women in Tech Scholarship", status: "Pending", date: "2026-06-10" },
    { id: 2, scholarship: "STEM Excellence Grant", status: "Assessment Required", date: "2026-06-08" },
    { id: 3, scholarship: "Africa Education Fund", status: "Approved", date: "2026-06-05" },
  ],
  assessments: [
    { 
      id: 1, 
      title: "STEM Excellence Grant Assessment", 
      deadline: "10 June 2026", 
      status: "In Progress",
      scholarshipId: 2 
    },
    { 
      id: 2, 
      title: "Global Leaders Program Assessment", 
      deadline: "15 June 2026", 
      status: "Pending",
      scholarshipId: 3 
    },
  ],
  internships: [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "Tech Corp",
      location: "Remote",
      deadline: "20 June 2026",
      status: "Open",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978",
    },
    {
      id: 2,
      title: "Data Science Intern",
      company: "Data Solutions",
      location: "Lagos, Nigeria",
      deadline: "15 June 2026",
      status: "Closing Soon",
      image: "https://images.unsplash.com/photo-1460925895917-aae19e938282",
    },
    {
      id: 3,
      title: "UX Design Intern",
      company: "Design Studio",
      location: "Remote",
      deadline: "25 June 2026",
      status: "Open",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5",
    },
    {
      id: 4,
      title: "Backend Developer Intern",
      company: "Web Services Ltd",
      location: "Accra, Ghana",
      deadline: "30 June 2026",
      status: "Open",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    },
  ],
};

// Initialize localStorage with initial data if empty
const initializeData = () => {
  Object.keys(INITIAL_DATA).forEach(key => {
    if (!localStorage.getItem(STORAGE_KEYS[key.toUpperCase()])) {
      localStorage.setItem(STORAGE_KEYS[key.toUpperCase()], JSON.stringify(INITIAL_DATA[key]));
    }
  });
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

// Initialize data on load
initializeData();

// Export for use in components
export const useDataManager = () => {
  return {
    scholarships: scholarshipsManager,
    applications: applicationsManager,
    assessments: assessmentsManager,
    internships: internshipsManager,
  };
};
