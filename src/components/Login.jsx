import { TextInput, PasswordInput, Button, Box } from "@mantine/core";
import { useForm } from "@mantine/form";

export default function Login() {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values) => {
    console.log(values);

    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <Box maw={400} mx="auto">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          placeholder="you@gmail.com"
          {...form.getInputProps("email")}
        />

        <PasswordInput
          label="Password"
          mt="md"
          {...form.getInputProps("password")}
        />

        <Button fullWidth mt="xl" type="submit">
          Login
        </Button>
      </form>
    </Box>
  );
}