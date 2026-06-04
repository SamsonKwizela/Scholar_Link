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

export default function FiledApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/applications"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch applications");
        }

        setApplications(
          Array.isArray(data.applications)
            ? data.applications
            : []
        );
      } catch (error) {
        console.error("Error fetching applications:", error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
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