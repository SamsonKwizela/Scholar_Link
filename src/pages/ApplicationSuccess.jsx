import {
  Container,
  Card,
  Title,
  Text,
  Button,
} from "@mantine/core";

import { useNavigate } from "react-router-dom";

function ApplicationSuccess() {
  const navigate = useNavigate();

  return (
    <Container size="sm" py="xl">

      <Card
        shadow="sm"
        radius="lg"
        padding="xl"
        withBorder
      >

        <Title order={2} mb="md">
          Application Submitted
        </Title>

        <Text c="dimmed" mb="lg">
          Your scholarship assessment has been submitted successfully.
        </Text>

        <Button onClick={() => navigate("/")}>
          Back Home
        </Button>

      </Card>

    </Container>
  );
}

export default ApplicationSuccess;