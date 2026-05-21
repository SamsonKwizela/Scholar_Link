import { useNavigate } from "react-router-dom";

import {
  Container,
  Title,
  Text,
  Card,
  Badge,
  Button,
  Stack,
  Group,
} from "@mantine/core";

function ScholarshipDetails() {
  const navigate = useNavigate();

  return (
    <Container size="md" py="xl">

      <Card
        shadow="sm"
        radius="lg"
        padding="xl"
        withBorder
      >

        <Group justify="space-between" mb="md">
          <Title order={2}>
            Global Leaders Scholarship
          </Title>

          <Badge color="green">
            Open
          </Badge>
        </Group>

        <Stack gap="sm">

          <Text>
            This scholarship supports students
            with leadership potential and strong
            academic performance.
          </Text>

          <Text>
            <strong>Level:</strong> Undergraduate
          </Text>

          <Text>
            <strong>Field:</strong> Business
          </Text>

          <Text>
            <strong>Deadline:</strong> 30 June 2026
          </Text>

        </Stack>

        <Button
          mt="xl"
          size="md"
          onClick={() => navigate(`/apply/${scholarship.id}`)}>
        
          Apply Scholarship
        </Button>

      </Card>

    </Container>
  );
}

export default ScholarshipDetails;