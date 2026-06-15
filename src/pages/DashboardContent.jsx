import {
  Container,
  Card,
  SimpleGrid,
  Badge,
  Button,
  Stack,
  Title,
  Table,
  Progress,
  Image,
  Text,
  Group,
  TextInput,
  Select,
  Modal,
  Divider,
} from "@mantine/core";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDataManager } from "../utils/dataManager";

export default function DashboardContent() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { scholarships, applications, assessments, internships } = useDataManager();

  const [data, setData] = useState({
    scholarships: [],
    applications: [],
    assessments: [],
    internships: [],
  });

  const [stats, setStats] = useState({
    scholarships: 0,
    applications: 0,
    assessments: 0,
    internships: 0,
  });

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationModalOpened, setApplicationModalOpened] = useState(false);
  const [applyingFor, setApplyingFor] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const loadData = () => {
    const scholarshipsData = scholarships.getAll();
    const applicationsData = applications.getAll();
    const assessmentsData = assessments.getAll();
    const internshipsData = internships.getAll();

    setData({
      scholarships: scholarshipsData,
      applications: applicationsData,
      assessments: assessmentsData,
      internships: internshipsData,
    });

    setStats({
      scholarships: scholarshipsData.length,
      applications: applicationsData.length,
      assessments: assessmentsData.length,
      internships: internshipsData.length,
    });
  };

  const calculateProfileCompletion = () => {
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) return 0;

    const profile = JSON.parse(userProfile);
    const fields = ['name', 'role', 'email', 'location', 'university', 'about'];
    const completedFields = fields.filter(field => profile[field] && profile[field].trim() !== '');

    // Check if avatar is set (not the default)
    const hasAvatar = profile.avatar && !profile.avatar.includes('pravatar.cc');
    if (hasAvatar) completedFields.push('avatar');

    return Math.round((completedFields.length / (fields.length + 1)) * 100);
  };

  const handleApply = async (scholarship) => {
    setApplyingFor(scholarship.id);
    setSendingEmail(true);

    try {
      // Collect profile data from localStorage
      const userProfile = localStorage.getItem('userProfile');
      const profile = userProfile ? JSON.parse(userProfile) : {};

      // Prepare application data
      const applicationData = {
        scholarshipId: scholarship.id,
        scholarshipTitle: scholarship.title,
        scholarshipAmount: scholarship.amount,
        scholarshipField: scholarship.field,
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
        status: 'Pending'
      };

      // Simulate sending email to admin
      console.log('📧 SENDING APPLICATION EMAIL TO ADMIN:');
      console.log('Subject: New Scholarship Application - ' + scholarship.title);
      console.log('To: admin@scholalink.com');
      console.log('Application Data:', JSON.stringify(applicationData, null, 2));

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add application to localStorage
      applications.add({
        scholarship: scholarship.title,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        scholarshipId: scholarship.id,
        applicationData: applicationData
      });

      // Show success message
      alert(`Application for ${scholarship.title} submitted successfully! Your profile details have been sent to the admin.`);

    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setApplyingFor(null);
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleDataChange = () => {
      loadData();
    };

    window.addEventListener('dataChange', handleDataChange);
    window.addEventListener('storage', handleDataChange);

    return () => {
      window.removeEventListener('dataChange', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, []);


  return (
    <Container fluid>
      {/* WELCOME CARD */}
      <Card
        radius="lg"
        p="xl"
        mb="xl"
        withBorder
        className="card-welcome"
      >
        <Group justify="space-between">
          <div>
            <Title order={2}>Welcome back 👋</Title>
            <Text mt="sm" c="dimmed">
              Explore scholarships and complete your assessments.
            </Text>
          </div>

          <Button onClick={() => navigate("/scholarships")}>
            Explore Scholarships
          </Button>
        </Group>
      </Card>

      {/* STATS CARDS */}
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} mb="xl">
        <Card withBorder p="lg">
          <Text size="sm" c="dimmed">
            Scholarships
          </Text>
          <Title order={2}>{stats.scholarships}</Title>
        </Card>

        <Card withBorder p="lg">
          <Text size="sm" c="dimmed">
            Applications
          </Text>
          <Title order={2}>{stats.applications}</Title>
        </Card>

        <Card withBorder p="lg">
          <Text size="sm" c="dimmed">
            Assessments
          </Text>
          <Title order={2}>{stats.assessments}</Title>
        </Card>

        <Card withBorder p="lg">
          <Text size="sm" c="dimmed">
            Internships
          </Text>
          <Title order={2}>{stats.internships}</Title>
        </Card>
      </SimpleGrid>

      {/* SCHOLARSHIPS */}
      <Group justify="space-between" mb="md">
        <Title order={3}>Recommended Scholarships</Title>
        <Group>
          <TextInput placeholder="Search scholarship..." w={220} />
          <Select
            placeholder="Filter field"
            data={["Technology", "Engineering", "Business"]}
            w={180}
          />
        </Group>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mb="xl">
        {data.scholarships.map((item) => (
          <Card
            key={item.id}
            shadow="sm"
            radius="xl"
            p="0"
            withBorder
            className="card-smooth"
          >
            <Image src={item.image} height={180} alt={item.title} />

            <Stack p="lg">
              <Group justify="space-between">
                <Badge color="blue">{item.field}</Badge>

                <Badge color={item.status === "Open" ? "green" : "orange"}>
                  {item.status}
                </Badge>
              </Group>

              <Title order={4}>{item.title}</Title>

              <Text size="sm" c="dimmed">
                Deadline: {item.deadline}
              </Text>

              <Text fw={700} size="lg">
                {item.amount}
              </Text>

              <Progress value={item.status === "Open" ? 70 : 90} />

              <Group grow mt="sm">
                <Button
                  variant="light"
                  onClick={() => navigate("/scholarships")}
                >
                  View Details
                </Button>

                <Button
                  onClick={() => handleApply(item)}
                  loading={applyingFor === item.id}
                  disabled={applyingFor !== null && applyingFor !== item.id}
                >
                  {applyingFor === item.id ? 'Submitting...' : 'Apply'}
                </Button>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>



      {/* INTERNSHIPS */}
      <Group justify="space-between" mb="md" mt="xl">
        <Title order={3}>Recommended Internships</Title>
        <Button variant="light" onClick={() => navigate("/internships")}>
          View All Internships
        </Button>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mb="xl">
        {data.internships.map((item) => (
          <Card
            key={item.id}
            shadow="sm"
            radius="xl"
            p="0"
            withBorder
            className="card-smooth"
          >
            <Image src={item.image} height={180} alt={item.title} />

            <Stack p="lg">
              <Group justify="space-between">
                <Badge color="blue">{item.company}</Badge>

                <Badge color={item.status === "Open" ? "green" : "orange"}>
                  {item.status}
                </Badge>
              </Group>

              <Title order={4}>{item.title}</Title>

              <Text size="sm" c="dimmed">
                Location: {item.location}
              </Text>

              <Text size="sm" c="dimmed">
                Deadline: {item.deadline}
              </Text>

              <Group grow mt="sm">
                <Button
                  variant="light"
                  onClick={() => navigate(`/internship/${item.id}`)}
                >
                  View Details
                </Button>

                <Button onClick={() => navigate("/internships")}>
                  Apply
                </Button>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

            {/* APPLICATIONS */}
      {data.applications.length > 0 && (
        <Card radius="lg" p="lg" withBorder>
          <Group justify="space-between" mb="md">
            <Title order={4}>Application Status</Title>
          </Group>

          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Scholarship</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {data.applications.map((app, index) => (
                <Table.Tr 
                  key={app.id || index}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedApplication(app);
                    setApplicationModalOpened(true);
                  }}
                >
                  <Table.Td>{app.scholarship}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        app.status === "Approved"
                          ? "green"
                          : app.status === "Pending"
                          ? "yellow"
                          : "blue"
                      }
                    >
                      {app.status}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      {/* PROFILE COMPLETION */}
      <Card radius="lg" p="lg" withBorder>
        <Group justify="space-between" mb="md">
          <div>
            <Title order={4}>Profile Completion</Title>
            <Text size="sm" c="dimmed">
              Complete your profile to improve matches.
            </Text>
          </div>

          <Badge>{calculateProfileCompletion()}%</Badge>
        </Group>

        <Progress value={calculateProfileCompletion()} size="lg" />
      </Card>

      {/* APPLICATION DETAILS MODAL */}
      <Modal
        opened={applicationModalOpened}
        onClose={() => setApplicationModalOpened(false)}
        title="Application Details"
        size="lg"
        centered
      >
        {selectedApplication && (
          <Stack>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Scholarship</Text>
                <Text fw={500} size="lg">{selectedApplication.scholarship}</Text>
              </div>
              <Badge
                size="lg"
                color={
                  selectedApplication.status === "Approved"
                    ? "green"
                    : selectedApplication.status === "Pending"
                    ? "yellow"
                    : "blue"
                }
              >
                {selectedApplication.status}
              </Badge>
            </Group>

            <Divider />

            <Group>
              <div>
                <Text size="sm" c="dimmed">Application Date</Text>
                <Text>{selectedApplication.date || 'N/A'}</Text>
              </div>
              {selectedApplication.scholarshipId && (
                <div>
                  <Text size="sm" c="dimmed">Scholarship ID</Text>
                  <Text>{selectedApplication.scholarshipId}</Text>
                </div>
              )}
            </Group>

            <Divider />

            <div>
              <Text size="sm" c="dimmed" mb="xs">Application Status Details</Text>
              <Text>
                {selectedApplication.status === "Approved" && "Your application has been approved. Congratulations!"}
                {selectedApplication.status === "Pending" && "Your application is currently under review. We will notify you of any updates."}
                {selectedApplication.status === "Assessment Required" && "Please complete the required assessment to proceed with your application."}
                {selectedApplication.status === "Rejected" && "Unfortunately, your application was not successful. You can apply for other scholarships."}
              </Text>
            </div>

            <Group grow mt="md">
              <Button
                variant="light"
                onClick={() => setApplicationModalOpened(false)}
              >
                Close
              </Button>
              {selectedApplication.status === "Assessment Required" && (
                <Button onClick={() => {
                  setApplicationModalOpened(false);
                  navigate("/scholarship-assessment");
                }}>
                  Take Assessment
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
      
    </Container>
  );
 
 
    
}
