import { useState } from "react";
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
  Modal,
} from "@mantine/core";
import { useNotifications } from "../context/NotificationContext";
import { applyToOpportunity } from "../utils/api";

function ScholarshipDetails() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [confirmModalOpened, setConfirmModalOpened] = useState(false);

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
          onClick={() => setConfirmModalOpened(true)}>
          
          Apply Scholarship
        </Button>

      </Card>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmModalOpened}
        onClose={() => setConfirmModalOpened(false)}
        title="Confirm Application"
        centered
        size="md"
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to apply for this scholarship?
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="default"
              onClick={() => setConfirmModalOpened(false)}
            >
              Cancel
            </Button>
            <Button onClick={async () => {
              setConfirmModalOpened(false);
              try {
                await applyToOpportunity({
                  scholarshipId: 'global-leaders-scholarship',
                  type: 'scholarship'
                });
                addNotification({
                  title: "Application Submitted Successfully",
                  message: "Your profile information, CV, assessment results, and documents have been sent for review.",
                  type: "success",
                });
                navigate(`/apply/global-leaders-scholarship`);
              } catch (error) {
                addNotification({
                  title: "Application Failed",
                  message: error.message || "Failed to submit application. Please try again.",
                  type: "error",
                });
              }
            }}>
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

export default ScholarshipDetails;