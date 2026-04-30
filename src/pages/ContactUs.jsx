import { Button, Group, Paper, SimpleGrid, Text, Textarea, TextInput } from '@mantine/core';
import './ContactUs.css';

function ContactUs() {
    const handleSubmit = (event) => {
        event.preventDefault(); 
        const formData = new FormData(event.target);
        const data = {
            name: formData.get('name'), 
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };
        console.log('Form Data:', data);
    };
  return (
    <Paper shadow="md" radius="lg">
      <div className="wrapper">
        
        <div className="contacts" style={{ backgroundColor: "#2c3e50" }}>
          <Text fz="lg" fw={700} className="title" c="#fff">
            Contact information
          </Text>

          {/* ContactIconsList was commented out, so remove or uncomment properly */}
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <Text fz="lg" fw={700} className="title">
            Get in touch
          </Text>

          <div className="fields">
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput label="Your name" placeholder="Your name" />
              <TextInput label="Your email" placeholder="hello@mantine.dev" required />
            </SimpleGrid>

            <TextInput mt="md" label="Subject" placeholder="Subject" required />

            <Textarea
              mt="md"
              label="Your message"
              placeholder="Please include all relevant information"
              minRows={3}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit" className="control">
                Send message
              </Button>
            </Group>
          </div>
        </form>
      </div>
    </Paper>
  );
}

export default ContactUs;