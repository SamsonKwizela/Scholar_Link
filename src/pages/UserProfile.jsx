import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
  Select,
} from "@mantine/core";

import {
  IconBook2,
  IconEdit,
  IconMail,
  IconMapPin,
  IconSchool,
  IconStarFilled,
  IconTrophy,
  IconUsersGroup,
  IconCamera,
} from "@tabler/icons-react";

import { useState } from "react";

export default function UserProfile() {
  /* ================= STATE ================= */

  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Samson Kwizela",
    role: "Computer Science Student",
    email: "samson@example.com",
    location: "Lusaka, Zambia",
    university: "Cavendish University Zambia",
    about:
      "Passionate computing student focused on software engineering, networking, and building digital solutions.",
    avatar: "https://i.pravatar.cc/300",
  });

  const [skills, setSkills] = useState([
    { name: "React.js", level: 90, color: "blue" },
    { name: "Node.js", level: 80, color: "green" },
    { name: "MongoDB", level: 75, color: "orange" },
  ]);

  /* ================= HANDLERS ================= */

  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSkillChange = (index, field, value) => {
    const updated = [...skills];
    updated[index][field] = value;
    setSkills(updated);
  };

  /* ================= AVATAR UPLOAD ================= */

  const handleAvatarChange = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };
  function SectionCard({
  title,
  id,
  activeEdit,
  setActiveEdit,
  childrenView,
  childrenEdit,
}) {
  const isEditing = activeEdit === id;

  return (
    <Card withBorder radius="lg" p="lg">

      <Group justify="space-between" mb="sm">
        <Title order={5}>{title}</Title>

        <Button
          size="xs"
          variant={isEditing ? "filled" : "light"}
          onClick={() =>
            setActiveEdit(isEditing ? null : id)
          }
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </Group>

      {isEditing ? childrenEdit : childrenView}

    </Card>
  );
}

const [activeEdit, setActiveEdit] = useState(null);
const [cvFile, setCvFile] = useState(null);

const [cvUrl, setCvUrl] = useState(null);
const handleCvUpload = (file) => {
  if (!file) return;

  setCvFile(file);

  const url = URL.createObjectURL(file);
  setCvUrl(url);
};

  return (
    <Box className="app-page">
      <Container size="xl">

        {/* ================= HEADER ================= */}
        <Card radius="xl" shadow="sm" withBorder p="xl" mb="xl" className="profile-header">
          <Grid align="center">

            {/* AVATAR */}
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Stack align="center">

                <Avatar src={profile.avatar} size={150} radius={150} />

                {isEditing && (
                  <Button
                    size="xs"
                    leftSection={<IconCamera size={14} />}
                    component="label"
                  >
                    Change Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) =>
                        handleAvatarChange(e.target.files[0])
                      }
                    />
                  </Button>
                )}

                <Badge color="green" size="lg">
                  ONLINE
                </Badge>
              </Stack>
            </Grid.Col>

            {/* DETAILS */}
            <Grid.Col span={{ base: 12, md: 9 }}>
              <Stack gap="md">

                {isEditing ? (
                  <>
                    <TextInput
                      label="Full Name"
                      value={profile.name}
                      onChange={(e) =>
                        handleProfileChange("name", e.target.value)
                      }
                    />

                    <TextInput
                      label="Role"
                      value={profile.role}
                      onChange={(e) =>
                        handleProfileChange("role", e.target.value)
                      }
                    />

                    <Group grow>
                      <TextInput
                        label="Email"
                        value={profile.email}
                        onChange={(e) =>
                          handleProfileChange("email", e.target.value)
                        }
                      />

                      <TextInput
                        label="Location"
                        value={profile.location}
                        onChange={(e) =>
                          handleProfileChange("location", e.target.value)
                        }
                      />
                    </Group>

                    <TextInput
                      label="University"
                      value={profile.university}
                      onChange={(e) =>
                        handleProfileChange("university", e.target.value)
                      }
                    />

                    <Textarea
                      label="About Me"
                      minRows={4}
                      value={profile.about}
                      onChange={(e) =>
                        handleProfileChange("about", e.target.value)
                      }
                    />
                  </>
                ) : (
                  <>
                    <Title order={2}>{profile.name}</Title>
                    <Text>{profile.role}</Text>
                    <Text size="sm">{profile.email}</Text>
                    <Text size="sm">{profile.location}</Text>
                    <Text size="sm">{profile.university}</Text>
                    <Text c="dimmed">{profile.about}</Text>
                  </>
                )}

                {/* BUTTON TOGGLE */}
                <Group mt="sm">
                  <Button
                    leftSection={<IconEdit size={16} />}
                    onClick={() => setIsEditing((prev) => !prev)}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>

                  <Button variant="outline">
                    Preview
                  </Button>
                </Group>

              </Stack>
            </Grid.Col>
          </Grid>
        </Card>

        {/* ================= REST OF YOUR UI (UNCHANGED) ================= */}
        {/* You can keep Skills, Stats, etc exactly as they are */}
        
      </Container>
      {/* ================= PROFESSIONAL PROFILE ================= */}
<Card radius="xl" shadow="sm" withBorder p="xl" mt="xl">

  <Group justify="space-between" mb="lg">
    <div>
      <Title order={3}>Professional Profile</Title>
      <Text size="sm" c="dimmed">
        Manage your career details efficiently
      </Text>
    </div>
  </Group>

  <Grid>

    {/* EXPERIENCE */}
    <Grid.Col span={{ base: 12, md: 6 }}>
      <SectionCard
        title="Experience"
        id="experience"
        activeEdit={activeEdit}
        setActiveEdit={setActiveEdit}
        childrenView={
          <Stack gap="xs">
            <Text fw={600}>Frontend Developer Intern</Text>
            <Text size="sm" c="dimmed">
              Tech Company Ltd • Jan 2025 - Present
            </Text>
            <Text size="sm">
              React, APIs, UI optimization, dashboard systems.
            </Text>
          </Stack>
        }
        childrenEdit={
          <>
            <TextInput label="Role" placeholder="Frontend Developer Intern" />
            <TextInput label="Company" placeholder="Tech Company Ltd" />
            <TextInput label="Duration" placeholder="Jan 2025 - Present" />
            <Textarea label="Description" minRows={3} />
          </>
        }
      />
    </Grid.Col>

    {/* PROJECTS */}
    <Grid.Col span={{ base: 12, md: 6 }}>
      <SectionCard
        title="Projects"
        id="projects"
        activeEdit={activeEdit}
        setActiveEdit={setActiveEdit}
        childrenView={
          <Stack gap="xs">
            <Text fw={600}>ScholarLink Platform</Text>
            <Text size="sm" c="dimmed">
              Full-stack academic networking system
            </Text>
            <Text size="sm">
              React • Node.js • MongoDB
            </Text>
          </Stack>
        }
        childrenEdit={
          <>
            <TextInput label="Project Name" />
            <Textarea label="Description" minRows={3} />
            <TextInput label="Tech Stack" />
          </>
        }
      />
    </Grid.Col>

    {/* CERTIFICATIONS */}
    <Grid.Col span={{ base: 12, md: 6 }}>
      <SectionCard
        title="Certifications"
        id="certifications"
        activeEdit={activeEdit}
        setActiveEdit={setActiveEdit}
        childrenView={
          <Stack gap="xs">
            <Text fw={600}>AWS Cloud Practitioner</Text>
            <Text size="sm" c="dimmed">
              Amazon Web Services • 2025
            </Text>
          </Stack>
        }
        childrenEdit={
          <>
            <TextInput label="Certificate Name" />
            <TextInput label="Issued By" />
          </>
        }
      />
    </Grid.Col>

    {/* SOCIAL LINKS */}
    <Grid.Col span={{ base: 12, md: 6 }}>
      <SectionCard
        title="Social Links"
        id="social"
        activeEdit={activeEdit}
        setActiveEdit={setActiveEdit}
        childrenView={
          <Stack gap="xs">
            <Text size="sm">GitHub: github.com/samson</Text>
            <Text size="sm">LinkedIn: linkedin.com/in/samson</Text>
            <Text size="sm">Portfolio: samson.dev</Text>
          </Stack>
        }
        childrenEdit={
          <>
            <TextInput label="GitHub" />
            <TextInput label="LinkedIn" />
            <TextInput label="Portfolio" />
          </>
        }
      />
    </Grid.Col>

    {/* CV */}
    {/* ================= CV / RESUME ================= */}
<Grid.Col span={12}>
  <Card withBorder radius="lg" p="lg">

    <Group justify="space-between" align="flex-start" wrap="wrap">

      <div>
        <Title order={5}>Resume / CV</Title>
        <Text size="sm" c="dimmed">
          Upload and manage your professional CV
        </Text>

        {cvFile && (
          <Text size="xs" mt="xs" c="blue">
            📄 {cvFile.name}
          </Text>
        )}
      </div>

      <Group wrap="wrap">

        {/* UPLOAD BUTTON */}
        <Button component="label">
          Upload CV
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              handleCvUpload(e.target.files[0])
            }
          />
        </Button>

        {/* VIEW BUTTON (ONLY IF CV EXISTS) */}
        <Button
          variant="outline"
          disabled={!cvUrl}
          onClick={() => window.open(cvUrl, "_blank")}
        >
          View CV
        </Button>

        {/* DOWNLOAD BUTTON */}
        <Button
          variant="light"
          disabled={!cvUrl}
          component="a"
          href={cvUrl}
          download={cvFile?.name || "cv.pdf"}
        >
          Download
        </Button>

      </Group>

    </Group>

    {/* MOBILE PREVIEW TIP */}
    {cvUrl && (
      <Card mt="md" withBorder radius="md" p="sm">
        <Text size="sm" c="dimmed">
          CV uploaded successfully. You can view or download it anytime.
        </Text>
      </Card>
    )}

  </Card>
</Grid.Col>
    {/* INTERESTS */}
    <Grid.Col span={12}>
      <Card withBorder radius="lg" p="lg">

        <Group justify="space-between" mb="sm">
          <Title order={5}>Interests</Title>

          <Button size="xs" variant="light">
            Edit
          </Button>
        </Group>

        <Group>
          <Badge size="lg">Web Development</Badge>
          <Badge size="lg" color="green">Networking</Badge>
          <Badge size="lg" color="orange">Chess</Badge>
          <Badge size="lg" color="red">Forex Trading</Badge>
          <Badge size="lg" color="violet">Reading</Badge>
        </Group>

      </Card>
    </Grid.Col>

  </Grid>
</Card>
    </Box>
  );
}