import { useEffect, useState } from "react";
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Badge,
  Group,
  Button,
  Loader,
  Center,
  Alert,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useDataManager } from "../utils/dataManager";

export default function FiledApplications() {
  const { applications: applicationsManager } = useDataManager();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplications = () => {
      try {
        const data = applicationsManager.getAll();
        setApplications(data);
      } catch (error) {
        console.error("Error loading applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();

    // Listen for data changes
    const handleDataChange = () => {
      loadApplications();
    };

    window.addEventListener('dataChange', handleDataChange);
    window.addEventListener('storage', handleDataChange);

    return () => {
      window.removeEventListener('dataChange', handleDataChange);
      window.removeEventListener('storage', handleDataChange);
    };
  }, []);

  if (loading) {
    return (
      <Center h="60vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Filed Applications
      </Title>

      {applications.length === 0 ? (
        <Alert
          icon={<IconAlertCircle size={18} />}
          color="blue"
          title="No Applications Found"
        >
          You have not submitted any scholarship applications yet.
        </Alert>
      ) : (
        <Grid>
          {applications.map((app) => (
            <Grid.Col
              key={app._id}
              span={{ base: 12, sm: 6, md: 4 }}
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
              >
                <Group justify="space-between" mb="xs">
                  <Text fw={600}>
                    {app.title || "Untitled Application"}
                  </Text>

                  <Badge
                    color={
                      app.status === "Accepted"
                        ? "green"
                        : app.status === "Rejected"
                        ? "red"
                        : "yellow"
                    }
                  >
                    {app.status || "Pending"}
                  </Badge>
                </Group>

                <Text size="sm">
                  Country: {app.country || "N/A"}
                </Text>

                <Text size="sm">
                  Level: {app.level || "N/A"}
                </Text>

                <Text size="sm" mb="md">
                  Applied:{" "}
                  {app.appliedDate
                    ? new Date(
                        app.appliedDate
                      ).toLocaleDateString()
                    : "N/A"}
                </Text>

                <Button variant="light" fullWidth>
                  View Application
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
}