import {
  Container,
  Card,
  SimpleGrid,
  Badge,
  Button,
  Stack,
  Title,
  Text,
  Group,
  Table,
  Progress,
  Modal,
  Alert,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconDownload,
  IconEye,
  IconCheck,
  IconX,
  IconClock,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import { getUserApplications, downloadApplicationPDF } from "../utils/api";

export default function MyApplications() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailModalOpened, setDetailModalOpened] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getUserApplications();
      setApplications(data.data || []);
    } catch (error) {
      addNotification({
        title: "Error",
        message: "Failed to load applications. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setDetailModalOpened(true);
  };

  const handleDownloadPDF = async (applicationId) => {
    setDownloadingPdf(true);
    try {
      const blob = await downloadApplicationPDF(applicationId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Application_${applicationId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      addNotification({
        title: "Download Started",
        message: "Your application PDF is being downloaded.",
        type: "success",
      });
    } catch (error) {
      addNotification({
        title: "Download Failed",
        message: "Failed to download PDF. Please try again.",
        type: "error",
      });
    } finally {
      setDownloadingPdf(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'yellow';
      case 'Under Review':
        return 'blue';
      case 'Accepted':
        return 'green';
      case 'Rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <IconClock size={16} />;
      case 'Under Review':
        return <IconEye size={16} />;
      case 'Accepted':
        return <IconCheck size={16} />;
      case 'Rejected':
        return <IconX size={16} />;
      default:
        return <IconClock size={16} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container fluid>
      {/* HEADER */}
      <Card
        radius="xl"
        p={{ base: "md", sm: "xl" }}
        mb="xl"
        withBorder
        className="animate-fade-in"
        style={{
          background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
          border: 'none',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, var(--primary-200) 0%, transparent 70%)',
          opacity: 0.3,
          pointerEvents: 'none'
        }} />

        <Group justify="space-between" align={{ base: "flex-start", sm: "center" }}>
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <Title
              order={{ base: 3, sm: 2 }}
              fw={800}
              style={{
                letterSpacing: '-0.02em',
                marginBottom: '8px',
                color: 'white'
              }}
            >
              My Applications
            </Title>
            <Text
              size={{ base: "sm", sm: "md" }}
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: 1.6
              }}
            >
              Track and manage your scholarship and internship applications
            </Text>
          </div>

          <Button
            onClick={(e) => {
              e.preventDefault();
              navigate("/profile");
            }}
            mt={{ base: "sm", sm: 0 }}
            size="md"
            radius="lg"
            styles={{
              root: {
                background: 'rgba(255, 255, 255, 0.95)',
                color: 'var(--primary-700)',
                fontWeight: 600,
                '&:hover': {
                  background: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                }
              }
            }}
          >
            Back to Profile
          </Button>
        </Group>
      </Card>

      {/* APPLICATIONS LIST */}
      {loading ? (
        <LoadingOverlay visible={loading} />
      ) : applications.length === 0 ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="No Applications Yet"
          color="blue"
          variant="light"
          mb="xl"
        >
          You haven't submitted any applications yet. Complete your profile and submit your first application!
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, lg: 2 }} mb="xl">
          {applications.map((application, index) => (
            <Card
              key={application._id}
              shadow="md"
              radius="xl"
              p="lg"
              withBorder
              className="card-smooth animate-fade-in"
              style={{
                transition: 'all 0.3s ease',
                animationDelay: `${index * 0.05}s`,
                overflow: 'hidden'
              }}
            >
              <Stack gap="md">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Badge
                      color={application.opportunityType === 'scholarship' ? 'blue' : 'cyan'}
                      size="sm"
                      variant="light"
                      style={{ fontWeight: 600, marginBottom: '8px' }}
                    >
                      {application.opportunityType === 'scholarship' ? 'Scholarship' : 'Internship'}
                    </Badge>
                    <Title
                      order={5}
                      fw={700}
                      style={{
                        letterSpacing: '-0.01em',
                        lineHeight: 1.3,
                        marginBottom: '4px'
                      }}
                    >
                      {application.opportunityTitle}
                    </Title>
                    <Text size="xs" c="dimmed">
                      ID: {application._id}
                    </Text>
                  </div>
                  <Badge
                    color={getStatusColor(application.status)}
                    size="md"
                    leftSection={getStatusIcon(application.status)}
                    style={{
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {application.status}
                  </Badge>
                </Group>

                {/* Details */}
                <Card withBorder radius="md" p="md" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Submitted:</Text>
                      <Text size="sm" fw={600}>
                        {formatDate(application.applicationDate)}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Applicant:</Text>
                      <Text size="sm" fw={600}>
                        {application.applicant?.name || 'N/A'}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">Email:</Text>
                      <Text size="sm" fw={600}>
                        {application.applicant?.email || 'N/A'}
                      </Text>
                    </Group>
                  </Stack>
                </Card>

                {/* Admin Response */}
                {application.adminResponse?.message && (
                  <Card withBorder radius="md" p="md" style={{ backgroundColor: 'var(--primary-50)' }}>
                    <Text size="xs" c="dimmed" fw={600} mb="xs">
                      Admin Response:
                    </Text>
                    <Text size="sm">
                      {application.adminResponse.message}
                    </Text>
                    {application.adminResponse.respondedAt && (
                      <Text size="xs" c="dimmed" mt="xs">
                        Responded on: {formatDate(application.adminResponse.respondedAt)}
                      </Text>
                    )}
                  </Card>
                )}

                {/* Progress */}
                <Progress
                  value={
                    application.status === 'Pending' ? 25 :
                    application.status === 'Under Review' ? 50 :
                    application.status === 'Accepted' ? 100 : 0
                  }
                  size="sm"
                  color={
                    application.status === 'Accepted' ? 'green' :
                    application.status === 'Rejected' ? 'red' : 'blue'
                  }
                  style={{
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}
                />

                {/* Actions */}
                <Group grow gap="sm">
                  <Button
                    variant="light"
                    size="sm"
                    radius="md"
                    onClick={() => handleViewDetails(application)}
                    styles={{
                      root: {
                        fontWeight: 600,
                        '&:hover': {
                          background: 'var(--bg-tertiary)',
                        }
                      }
                    }}
                  >
                    <IconEye size={16} style={{ marginRight: '6px' }} />
                    View Details
                  </Button>

                  <Button
                    size="sm"
                    radius="md"
                    onClick={() => handleDownloadPDF(application._id)}
                    loading={downloadingPdf}
                    styles={{
                      root: {
                        background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)',
                          transform: 'translateY(-1px)',
                          boxShadow: 'var(--shadow-md), 0 0 15px rgba(59, 130, 246, 0.3)',
                        }
                      }
                    }}
                  >
                    <IconDownload size={16} style={{ marginRight: '6px' }} />
                    Download PDF
                  </Button>
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {/* APPLICATION DETAIL MODAL */}
      <Modal
        opened={detailModalOpened}
        onClose={() => setDetailModalOpened(false)}
        title="Application Details"
        size="lg"
        centered
      >
        {selectedApplication && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Opportunity</Text>
                <Text fw={500} size="lg">{selectedApplication.opportunityTitle}</Text>
              </div>
              <Badge
                size="lg"
                color={getStatusColor(selectedApplication.status)}
                leftSection={getStatusIcon(selectedApplication.status)}
              >
                {selectedApplication.status}
              </Badge>
            </Group>

            <Divider />

            <Group>
              <div>
                <Text size="sm" c="dimmed">Application ID</Text>
                <Text fw={600}>{selectedApplication._id}</Text>
              </div>
              <div>
                <Text size="sm" c="dimmed">Submitted Date</Text>
                <Text fw={600}>{formatDate(selectedApplication.applicationDate)}</Text>
              </div>
            </Group>

            <Divider />

            <div>
              <Text size="sm" c="dimmed" mb="xs">Applicant Information</Text>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Name:</Text>
                  <Text fw={600}>{selectedApplication.applicant?.name || 'N/A'}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Email:</Text>
                  <Text fw={600}>{selectedApplication.applicant?.email || 'N/A'}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">University:</Text>
                  <Text fw={600}>{selectedApplication.applicant?.university || 'N/A'}</Text>
                </Group>
              </Stack>
            </div>

            {selectedApplication.adminResponse?.message && (
              <>
                <Divider />
                <div>
                  <Text size="sm" c="dimmed" mb="xs">Admin Response</Text>
                  <Card withBorder radius="md" p="md" style={{ backgroundColor: 'var(--primary-50)' }}>
                    <Text size="sm">{selectedApplication.adminResponse.message}</Text>
                    <Text size="xs" c="dimmed" mt="xs">
                      {formatDate(selectedApplication.adminResponse.respondedAt)}
                    </Text>
                  </Card>
                </div>
              </>
            )}

            <Group grow mt="md">
              <Button
                variant="light"
                onClick={() => setDetailModalOpened(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleDownloadPDF(selectedApplication._id);
                  setDetailModalOpened(false);
                }}
                loading={downloadingPdf}
                leftSection={<IconDownload size={16} />}
              >
                Download PDF
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}