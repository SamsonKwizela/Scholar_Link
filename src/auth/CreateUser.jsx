import { useState } from "react";
import {
  Stepper,
  Button,
  Group,
  TextInput,
  PasswordInput,
  Box,
  Checkbox,
  Title,
  Paper,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import "./CreateUser.css";

function CreateUser() {
  const [active, setActive] = useState(0);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      terms: false,
      user: {
        firstName: "",
        lastName: "",
      },
      email: "",
      password: "",
    },
  });

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async (values) => {
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      console.log("User created:", data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box className="create-user-container">
      <Paper shadow="md" radius="lg" p="xl" className="form-card">
        
        <Title order={2} ta="center" mb="lg" className="form-title">
          Create Account
        </Title>

        <Stepper active={active} onStepClick={setActive} className="stepper">

          {/* STEP 1 */}
          <Stepper.Step label="Account" description="Basic info">
            <Stack className="step-content">
              <TextInput
                label="First name"
                placeholder="Enter first name"
                key={form.key("user.firstName")}
                {...form.getInputProps("user.firstName")}
              />

              <TextInput
                label="Last name"
                placeholder="Enter last name"
                key={form.key("user.lastName")}
                {...form.getInputProps("user.lastName")}
              />

              <Checkbox
                label="I accept terms and conditions"
                key={form.key("terms")}
                {...form.getInputProps("terms", { type: "checkbox" })}
              />
            </Stack>
          </Stepper.Step>

          {/* STEP 2 */}
          <Stepper.Step label="Email" description="Contact info">
            <Stack className="step-content">
              <TextInput
                label="Email address"
                placeholder="you@email.com"
                key={form.key("email")}
                {...form.getInputProps("email")}
              />
            </Stack>
          </Stepper.Step>

          {/* STEP 3 */}
          <Stepper.Step label="Security" description="Password">
            <Stack className="step-content">
              <PasswordInput
                label="Password"
                placeholder="Enter strong password"
                key={form.key("password")}
                {...form.getInputProps("password")}
              />
            </Stack>
          </Stepper.Step>

          {/* FINAL */}
          <Stepper.Completed>
            <Title order={4} ta="center">
               All steps completed!
            </Title>
          </Stepper.Completed>

        </Stepper>

        {/* BUTTONS */}
        <Group justify="space-between" mt="xl" className="button-group">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>

          {active === 3 ? (
            <Button
              onClick={form.onSubmit(handleSubmit)}
              className="submit-btn"
            >
              Submit
            </Button>
          ) : (
            <Button onClick={nextStep} className="next-btn">
              Next
            </Button>
          )}
        </Group>

      </Paper>
    </Box>
  );
}

export default CreateUser;