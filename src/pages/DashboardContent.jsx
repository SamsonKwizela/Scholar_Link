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

                <Button onClick={() => navigate("/scholarship-assessment")}>
                  Apply
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
                <Table.Tr key={app.id || index}>
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
      
    </Container>
  );
 
 
    
}
