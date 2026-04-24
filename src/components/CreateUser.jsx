import { useState } from "react";
import {
  Stepper,
  Button,
  Group,
  TextInput,
  PasswordInput,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";

function CreateUser() {
  const [active, setActive] = useState(0);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
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
    <Box maw={400} mx="auto">
      <Stepper active={active} onStepClick={setActive}>
        {/* STEP 1 */}
        <Stepper.Step label="Account" description="Basic info">
          <TextInput
            label="Name"
            placeholder="Your name"
            mt="md"
            {...form.getInputProps("name")}
          />
        </Stepper.Step>

        {/* STEP 2 */}
        <Stepper.Step label="Email" description="Contact info">
          <TextInput
            label="Email"
            placeholder="you@email.com"
            mt="md"
            {...form.getInputProps("email")}
          />
        </Stepper.Step>

        {/* STEP 3 */}
        <Stepper.Step label="Security" description="Password">
          <PasswordInput
            label="Password"
            placeholder="Enter password"
            mt="md"
            {...form.getInputProps("password")}
          />
        </Stepper.Step>

        {/* FINAL STEP */}
        <Stepper.Completed>
          All steps completed 🎉 Click submit to create account.
        </Stepper.Completed>
      </Stepper>

      <Group justify="space-between" mt="xl">
        <Button variant="default" onClick={prevStep}>
          Back
        </Button>

        {active === 2 ? (
          <Button onClick={form.onSubmit(handleSubmit)}>Submit</Button>
        ) : (
          <Button onClick={nextStep}>Next</Button>
        )}
      </Group>
    </Box>
  );
}

export default CreateUser;