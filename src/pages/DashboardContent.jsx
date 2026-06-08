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

const scholarships = [
  {
    id: 1,
    title: "Women in Tech Scholarship",
    field: "Technology",
    deadline: "12 June 2026",
    status: "Open",
    amount: "$5,000",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
  {
    id: 2,
    title: "STEM Excellence Grant",
    field: "Engineering",
    deadline: "25 June 2026",
    status: "Closing Soon",
    amount: "$8,000",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
  {
    id: 3,
    title: "Global Leaders Program",
    field: "Business",
    deadline: "5 July 2026",
    status: "Open",
    amount: "$10,000",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644",
  },
];

const applications = [
  { scholarship: "Women in Tech Scholarship", status: "Pending" },
  { scholarship: "STEM Excellence Grant", status: "Assessment Required" },
  { scholarship: "Africa Education Fund", status: "Approved" },
];

export default function DashboardContent() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

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
          <Title order={2}>24</Title>
        </Card>

        <Card withBorder p="lg">
          <Text size="sm" c="dimmed">
            Applications
          </Text>
          <Title order={2}>6</Title>
        </Card>

        <Card withBorder p="lg">
          <Text size="sm" c="dimmed">
            Assessments
          </Text>
          <Title order={2}>2</Title>
        </Card>

        <Card withBorder p="lg">
          <Text size="sm" c="dimmed">
            Notifications
          </Text>
          <Title order={2}>5</Title>
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
        {scholarships.map((item) => (
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
                  onClick={() => navigate(`/scholarship/${item.id}`)}
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

      {/* APPLICATIONS */}
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
            {applications.map((app, index) => (
              <Table.Tr key={index}>
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

      {/* PROGRESS */}
      <Card radius="lg" p="lg" withBorder mt="xl">
        <Group justify="space-between" mb="md">
          <div>
            <Title order={4}>Profile Completion</Title>
            <Text size="sm" c="dimmed">
              Complete your profile to improve matches.
            </Text>
          </div>

          <Badge>75%</Badge>
        </Group>

        <Progress value={75} size="lg" />
      </Card>
    </Container>
  );
}
