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
} from "@mantine/core";

import { useEffect, useState } from "react";

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // FETCH FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/scholars");
        const data = await res.json();
        console.log(data.scholars);


        setScholarships(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        Available Scholarships
      </Title>

      <Grid>
        {scholarships.map((item) => (
          <Grid.Col
            key={item._id || item.id}
            span={{ base: 12, sm: 6, md: 4 }}
          >
            <Card shadow="sm" padding="lg" radius="md" withBorder>

              <Group justify="space-between" mb="xs">
                <Text fw={600}>
                  {item.title}
                </Text>

                <Badge color="green">
                  {item.funding || "Open"}
                </Badge>
              </Group>

              <Text size="sm">
                Country: {item.location || item.country}
              </Text>

              <Text size="sm">
                Type: {item.type || item.level}
              </Text>

              <Text size="sm" mb="md">
                Deadline: {item.deadline}
              </Text>

              <Group grow>
                <Button
                  variant="light"
                  onClick={() => setSelected(item)}
                >
                  View Details
                </Button>

                <Button color="blue">
                  Apply
                </Button>
              </Group>

            </Card>
          </Grid.Col>
        ))}
      </Grid>

      {/* DETAILS MODAL */}
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

            <Text>
              {selected.description}
            </Text>

            <Text>
              <b>Category:</b> {selected.category}
            </Text>

            <Text>
              <b>Deadline:</b> {selected.deadline}
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