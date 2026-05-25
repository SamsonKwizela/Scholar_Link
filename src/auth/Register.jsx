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
import "./Register.css";

  const API_URL = "http://localhost:8000/api/auth/register"



function Register() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      user: {
        firstName: "",
        lastName: "",
      },
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  console.log(form)

  




  // NEXT STEP (with basic validation)
  const nextStep = () => {
    const values = form.getValues();

    if (active === 0) {
      if (!values.user.firstName || !values.user.lastName) {
        setError("Please enter first and last name");
        return;
      }
    }

    if (active === 1) {
      if (!values.email & !values.phoneNumber) {
        setError("Email or phonenumber is required");
        return;
      }
    }

    setError("");
    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

const handleSubmit = async (values) => {
  setLoading(true);
  setError("");

  try {
    if (!values.terms) {
      setError("You must accept terms and conditions");
      return;
    }

    const userData = {
      firstName: values.user.firstName,
      lastName: values.user.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      password: values.password,
    };

    const res = await fetch("http://localhost:8000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || "Failed to create user");
    }

    console.log("User created:", data);

    form.reset();
    setActive(0);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <Box className="create-user-container">
      <Paper shadow="md" radius="lg" p="xl" className="form-card">

        <Title order={2} ta="center" mb="lg" className="form-title">
          Create Account
        </Title>

        {/* ERROR DISPLAY */}
        {error && (
          <div style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
            {error}
          </div>
        )}

        <Stepper active={active} onStepClick={setActive} className="stepper">

          {/* STEP 1 */}
          <Stepper.Step label="Account" description="Basic info">
            <Stack className="step-content">
              <TextInput
                label="First name"
                placeholder="Enter first name"
                {...form.getInputProps("user.firstName")}
              />

              <TextInput
                label="Last name"
                placeholder="Enter last name"
                {...form.getInputProps("user.lastName")}
              />

             
            </Stack>
          </Stepper.Step>

          {/* STEP 2 */}
          <Stepper.Step label="Email" description="Contact info">
            <Stack className="step-content">
              <TextInput
                label="Email address"
                placeholder="you@email.com"
                {...form.getInputProps("email")}
              />
            </Stack>
             <Stack className="step-content">
              <TextInput
                label="PhoneNumber"
                placeholder="phoneNumber"
                {...form.getInputProps("phoneNumber")}
              />
            </Stack>
          </Stepper.Step>

          {/* STEP 3 */}
          <Stepper.Step label="Security" description="Password">
            <Stack className="step-content">
              <PasswordInput
                label="Password"
                placeholder="Enter strong password"
                {...form.getInputProps("password")}
              />
            </Stack>
          </Stepper.Step>

          {/* DONE */}
          <Stepper.Completed>
            <Title order={4} ta="center">
              All steps completed!
            </Title>
          </Stepper.Completed>

        </Stepper>

        <Group justify="space-between" mt="xl" className="button-group">

          <Button variant="default" onClick={prevStep}>
            Back
          </Button>

          {active === 2 ? (
            <Button onClick={form.onSubmit(handleSubmit)} loading={loading}>
              Submit
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
            </Button>
          )}

        </Group>

      </Paper>
    </Box>
  );
}

export default Register;