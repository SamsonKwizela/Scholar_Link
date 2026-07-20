const API_BASE_URL = "http://localhost:8000/api";

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function parseResponse(response) {
  const contentType =
    response.headers.get("content-type") || "";

  const isJson =
    contentType.includes("application/json");

  const payload = isJson
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    // Handle authentication and authorization errors
    if (response.status === 401) {
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Redirect to login if not already on login page
      if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
        window.location.href = "/login";
      }
      
      throw new Error("Your session has expired. Please log in again.");
    }
    
    if (response.status === 403) {
      throw new Error("You do not have permission to access this resource.");
    }

    // Provide specific error messages based on status code
    let message;
    switch (response.status) {
      case 400:
        message = payload?.message || payload?.error || "Validation error. Please check your input.";
        break;
      case 404:
        message = "API endpoint not found.";
        break;
      case 500:
        message = "Internal server error. Please try again later.";
        break;
      default:
        message = payload?.message || payload?.error || `HTTP Error ${response.status}`;
    }

    throw new Error(message);
  }

  return payload;
}

export async function apiRequest(
  endpoint,
  options = {}
) {
  // Get stored login token
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers: {
        ...defaultHeaders,

        // Send Authorization header if token exists
        // Backend will validate if the endpoint requires authentication
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),

        ...(options.headers || {}),
      },
    }
  );

  return parseResponse(response);
}

export async function getApiCollection(
  endpoint
) {
  const payload = await apiRequest(endpoint);

  // If backend returns array directly
  if (Array.isArray(payload)) {
    return payload;
  }

  // Handle wrapped API responses
  if (
    payload &&
    typeof payload === "object"
  ) {
    const collectionKeys = [
      "data",
      "items",
      "results",
      "scholarships",
      "internships",
      "applications",
      "assessments",
    ];

    for (const key of collectionKeys) {
      if (
        Array.isArray(payload[key])
      ) {
        return payload[key];
      }
    }
  }

  return [];
}

export async function getDashboardStats() {
  const payload =
    await apiRequest(
      "/dashboard/stats"
    );

  // Backend returns { success: true, data: { scholarships, internships, ... } }
  const stats = payload?.data || payload;

  return {
    scholarships: Number(
      stats?.scholarships ?? 0
    ),
    applications: Number(
      stats?.applications ?? 0
    ),
    assessments: Number(
      stats?.assessments ?? 0
    ),
    internships: Number(
      stats?.internships ?? 0
    ),
  };
}

export async function loginUser(
  email,
  password
) {
  const data = await apiRequest(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  // Save token automatically
  if (data.token) {
    localStorage.setItem(
      "token",
      data.token
    );
  }

  if (data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );
  }

  return data;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Assessment API functions
export async function getAssessments(filters = {}) {
  const params = new URLSearchParams(filters);
  return await apiRequest(`/assessments?${params}`);
}

export async function getAssessment(id) {
  return await apiRequest(`/assessments/${id}`);
}

export async function createAssessment(data) {
  return await apiRequest('/assessments', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateAssessment(id, data) {
  return await apiRequest(`/assessments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteAssessment(id) {
  return await apiRequest(`/assessments/${id}`, {
    method: 'DELETE'
  });
}

// Question API functions
export async function getQuestions(assessmentId) {
  return await apiRequest(`/questions/${assessmentId}`);
}

export async function createQuestion(data) {
  return await apiRequest('/questions', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateQuestion(id, data) {
  return await apiRequest(`/questions/single/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteQuestion(id) {
  return await apiRequest(`/questions/single/${id}`, {
    method: 'DELETE'
  });
}

export async function bulkCreateQuestions(data) {
  return await apiRequest('/questions/bulk', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Assessment Attempt API functions
export async function startAssessmentAttempt(assessmentId) {
  return await apiRequest('/assessment-attempts/start', {
    method: 'POST',
    body: JSON.stringify({ assessmentId })
  });
}

export async function submitAssessmentAttempt(attemptId, answers) {
  return await apiRequest('/assessment-attempts/submit', {
    method: 'POST',
    body: JSON.stringify({ attemptId, answers })
  });
}

export async function getStudentAttempts(studentId) {
  return await apiRequest(`/assessment-attempts/${studentId}`);
}

export async function getAttempt(attemptId) {
  return await apiRequest(`/assessment-attempts/single/${attemptId}`);
}

export async function saveAttemptAnswers(attemptId, answers) {
  return await apiRequest(`/assessment-attempts/${attemptId}/answers`, {
    method: 'PUT',
    body: JSON.stringify({ answers })
  });
}

// Auth API functions
export async function registerUser(name, email, password, role = 'student') {
  const data = await apiRequest(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        role,
      }),
    }
  );

  // Save token automatically
  if (data.token) {
    localStorage.setItem(
      "token",
      data.token
    );
  }

  if (data.user) {
    localStorage.setItem(
      "user",
      JSON.stringify(data.user)
    );
  }

  return data;
}

export async function getCurrentUser() {
  return await apiRequest("/auth/me");
}

// Application API functions
export async function applyToOpportunity(data) {
  return await apiRequest('/applications/apply', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

// Scholarship API functions
export async function getScholarships(filters = {}) {
  const params = new URLSearchParams(filters);
  return await apiRequest(`/scholarships?${params}`);
}

export async function getScholarship(id) {
  return await apiRequest(`/scholarships/${id}`);
}

export async function createScholarship(data) {
  return await apiRequest('/scholarships', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateScholarship(id, data) {
  return await apiRequest(`/scholarships/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteScholarship(id) {
  return await apiRequest(`/scholarships/${id}`, {
    method: 'DELETE'
  });
}

// Internship API functions
export async function getInternships(filters = {}) {
  const params = new URLSearchParams(filters);
  return await apiRequest(`/internships?${params}`);
}

export async function getInternship(id) {
  return await apiRequest(`/internships/${id}`);
}

export async function createInternship(data) {
  return await apiRequest('/internships', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateInternship(id, data) {
  return await apiRequest(`/internships/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteInternship(id) {
  return await apiRequest(`/internships/${id}`, {
    method: 'DELETE'
  });
}

// Scholar API functions
export async function getScholars(filters = {}) {
  const params = new URLSearchParams(filters);
  return await apiRequest(`/scholars?${params}`);
}

export async function getScholar(id) {
  return await apiRequest(`/scholars/${id}`);
}

export async function createScholar(data) {
  return await apiRequest('/scholars/create', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateScholar(id, data) {
  return await apiRequest(`/scholars/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function deleteScholar(id) {
  return await apiRequest(`/scholars/delete/${id}`, {
    method: 'DELETE'
  });
}

// Notification API functions
export async function getNotifications() {
  return await apiRequest('/notifications');
}

export async function markNotificationAsRead(id) {
  return await apiRequest(`/notifications/${id}/read`, {
    method: 'PATCH'
  });
}

// Profile API functions
export async function getProfile() {
  return await apiRequest('/profile');
}

export async function updateProfile(data) {
  return await apiRequest('/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

// Dashboard API functions
export async function getRecommendations() {
  const payload = await apiRequest('/dashboard/recommendations');
  return payload.data || payload;
}

// Upload API function
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: {
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
    body: formData,
  });

  return parseResponse(response);
}

// Admin API functions
export async function registerAdmin(name, email, password) {
  const data = await apiRequest('/admin/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  return data;
}

export async function loginAdmin(email, password) {
  const data = await apiRequest('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
}

export async function createUser(data) {
  return await apiRequest('/admin/create-user', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
