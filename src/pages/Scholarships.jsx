import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Badge,
  Button,
  Group,
  Loader,
  Center,
  Modal,
  Stack,
  Divider,
  ThemeIcon,
  Alert,
} from "@mantine/core";

import {
  IconSchool,
  IconMapPin,
  IconCategory,
  IconCalendar,
  IconAlertCircle,
} from "@tabler/icons-react";

import { useEffect, useState } from "react";

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [applyingId, setApplyingId] = useState(null);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/scholars");
        const data = await res.json();

        setScholarships(
          Array.isArray(data)
            ? data
            : Array.isArray(data?.scholars)
            ? data.scholars
            : []
        );
      } catch (err) {
        console.error("Fetch error:", err);
        setScholarships([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // APPLY ACTION (RESPONSIVE BUTTON)
  const handleApply = async (id) => {
    setApplyingId(id);

    try {
      // simulate request (replace with real API later)
      await new Promise((res) => setTimeout(res, 1000));

      alert("Application submitted successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setApplyingId(null);
    }
  };

  // LOADING STATE
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
        Available Scholarships
      </Title>

      {/* EMPTY STATE (IMPORTANT) */}
      {scholarships.length === 0 ? (
        <Alert
          icon={<IconAlertCircle size={18} />}
          title="No Scholarships Available"
          color="blue"
          variant="light"
        >
          There are currently no scholarships posted. Please check back later.
        </Alert>
      ) : (
        <Grid>
          {scholarships.map((item) => (
            <Grid.Col
              key={item._id || item.id}
              span={{ base: 12, sm: 6, md: 4 }}
            >
              <Card shadow="sm" padding="lg" radius="md" withBorder>

                {/* HEADER */}
                <Group justify="space-between" mb="xs">
                  <Group>
                    <ThemeIcon variant="light" color="blue">
                      <IconSchool size={18} />
                    </ThemeIcon>

                    <Text fw={600} lineClamp={1}>
                      {item.title || "Untitled"}
                    </Text>
                  </Group>

                  <Badge color="green" variant="light">
                    {item.funding || "Open"}
                  </Badge>
                </Group>

                <Divider my="sm" />

                {/* INFO */}
                <Stack gap="xs">

                  <Group gap="xs">
                    <IconMapPin size={16} />
                    <Text size="sm">
                      {item.location || item.country || "N/A"}
                    </Text>
                  </Group>

                  <Group gap="xs">
                    <IconCategory size={16} />
                    <Text size="sm">
                      {item.category || item.type || "General"}
                    </Text>
                  </Group>

                  <Group gap="xs">
                    <IconCalendar size={16} />
                    <Text size="sm">
                      {item.deadline || "No deadline"}
                    </Text>
                  </Group>

                </Stack>

                <Divider my="sm" />

                {/* ACTIONS */}
                <Group grow>

                  <Button
                    variant="light"
                    onClick={() => setSelected(item)}
                  >
                    View Details
                  </Button>

                  {/* RESPONSIVE APPLY BUTTON */}
                  <Button
                    loading={applyingId === item._id || item.id}
                    disabled={applyingId !== null}
                    onClick={() => handleApply(item._id || item.id)}
                  >
                    Apply
                  </Button>

                </Group>

              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}

      {/* MODAL */}
      <Modal
        opened={!!selected}
        onClose={() => setSelected(null)}
        title="Scholarship Details"
        size="lg"
      >
        {selected && (
          <Stack>

            <Title order={3}>
              {selected.title}
            </Title>

            <Divider />

            <Text size="sm">
              {selected.description || "No description available."}
            </Text>

            <Group>
              <Badge>{selected.category || "General"}</Badge>
              <Badge color="blue">
                {selected.location || "Global"}
              </Badge>
              <Badge color="green">
                {selected.funding || "Open"}
              </Badge>
            </Group>

            <Text>
              <b>Deadline:</b> {selected.deadline || "N/A"}
            </Text>

            <Button fullWidth mt="md">
              Apply Now
            </Button>

          </Stack>
        )}
      </Modal>

    </Container>
  );
}