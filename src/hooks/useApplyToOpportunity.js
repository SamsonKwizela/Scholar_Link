import { useState, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX, IconAlertCircle } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';

export const useApplyToOpportunity = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const applyToOpportunity = useCallback(async (opportunityData) => {
    setLoading(true);
    setError(null);

    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        notifications.show({
          title: 'Authentication Required',
          message: 'Please login to apply for this opportunity',
          color: 'red',
          icon: <IconAlertCircle size={16} />,
          autoClose: 3000,
        });
        navigate('/login');
        return { success: false, error: 'Not authenticated' };
      }

      // Get user profile from localStorage
      const userProfile = localStorage.getItem('userProfile');
      const profile = userProfile ? JSON.parse(userProfile) : {};

      // Prepare application data
      const applicationPayload = {
        ...opportunityData,
        applicant: {
          name: profile.name || 'Not provided',
          email: profile.email || 'Not provided',
          role: profile.role || 'Not provided',
          location: profile.location || 'Not provided',
          university: profile.university || 'Not provided',
          about: profile.about || 'Not provided',
          avatar: profile.avatar || null,
          cv: profile.cv || null,
          coverLetter: profile.coverLetter || null,
        },
        applicationDate: new Date().toISOString(),
        status: 'Pending',
      };

      // Call the API
      const response = await apiRequest('/applications/apply', {
        method: 'POST',
        body: JSON.stringify(applicationPayload),
      });

      // Show success notification
      notifications.show({
        title: 'Application Submitted Successfully',
        message: 'Your application has been submitted and is being processed',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 5000,
      });

      return { success: true, data: response };
    } catch (err) {
      console.error('Application submission error:', err);

      let errorMessage = 'Failed to submit application. Please try again.';

      // Handle specific error cases
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        errorMessage = 'Session expired. Please login again.';
        notifications.show({
          title: 'Session Expired',
          message: errorMessage,
          color: 'red',
          icon: <IconAlertCircle size={16} />,
          autoClose: 3000,
        });
        navigate('/login');
      } else if (err.message.includes('Network') || err.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.message.includes('validation') || err.message.includes('Validation')) {
        errorMessage = 'Please complete your profile before applying.';
      }

      setError(errorMessage);
      notifications.show({
        title: 'Application Failed',
        message: errorMessage,
        color: 'red',
        icon: <IconX size={16} />,
        autoClose: 5000,
      });

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return {
    applyToOpportunity,
    loading,
    error,
    clearError: () => setError(null),
  };
};
