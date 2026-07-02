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
    const message =
      payload?.message ||
      payload?.error ||
      `HTTP Error ${response.status}`;

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

        // Send JWT token automatically
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

  return {
    scholarships: Number(
      payload?.scholarships ?? 0
    ),
    applications: Number(
      payload?.applications ?? 0
    ),
    assessments: Number(
      payload?.assessments ?? 0
    ),
    internships: Number(
      payload?.internships ?? 0
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