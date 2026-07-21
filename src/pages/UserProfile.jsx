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
  ActionIcon,
  Tooltip,
  Modal,
  Alert,
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
  IconUser,
  IconSend,
  IconCheck,
  IconX,
} from "@tabler/icons-react";

import { useState, useEffect, useRef } from "react";
import { useNotifications } from "../context/NotificationContext";
import { submitProfileApplication } from "../utils/api";

export default function UserProfile() {
  /* ================= STATE ================= */

  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);

  // Load profile from localStorage or use empty state
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      name: "",
      role: "",
      email: "",
      location: "",
      university: "",
      about: "",
      avatar: "",
      interests: [],
    };
  });

  const [skills, setSkills] = useState([]);

  const [editingInterest, setEditingInterest] = useState(null);
  const [editingInterestValue, setEditingInterestValue] = useState("");
  const interestInputRef = useRef(null);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    // Dispatch custom event to notify other components of profile changes
    window.dispatchEvent(new CustomEvent('profileChange', { detail: profile }));
  }, [profile]);

  /* ================= HANDLERS ================= */

  const handleProfileChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSaveProfile = () => {
    addNotification({
      title: "Profile Updated",
      message: "Your profile has been successfully updated.",
      type: "success",
    });
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
      addNotification({
        title: "Profile Picture Updated",
        message: "Your profile picture has been successfully changed.",
        type: "success",
      });
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('profileChange', { detail: { avatar: reader.result } }));
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
    <Card withBorder radius="lg" p="lg" style={{ transition: 'background-color 0.3s ease, border-color 0.3s ease' }}>

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
    
    // Save CV URL to profile
    setProfile(prev => ({ ...prev, cv: url }));
    
    addNotification({
      title: "CV Uploaded",
      message: "Your CV has been successfully uploaded.",
      type: "success",
    });
  };

  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [coverLetterUrl, setCoverLetterUrl] = useState(null);
  const handleCoverLetterUpload = (file) => {
    if (!file) return;

    setCoverLetterFile(file);

    const url = URL.createObjectURL(file);
    setCoverLetterUrl(url);
    
    // Save cover letter URL to profile
    setProfile(prev => ({ ...prev, coverLetter: url }));
    
    addNotification({
      title: "Cover Letter Uploaded",
      message: "Your cover letter has been successfully uploaded.",
      type: "success",
    });
  };

  // Application submission state
  const [submitModalOpened, setSubmitModalOpened] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  const handleSubmitApplication = async () => {
    if (!selectedOpportunity) return;

    setIsSubmitting(true);

    try {
      const profileData = {
        ...profile,
        experience: [], // You can expand this to include actual experience data
        projects: [], // You can expand this to include actual project data
        certifications: [], // You can expand this to include actual certifications
        socialLinks: {}, // You can expand this to include actual social links
        skills: [], // You can expand this to include actual skills
        interests: profile.interests || [],
        cv: profile.cv || '',
        coverLetter: profile.coverLetter || '',
        otherDocuments: []
      };

      const response = await submitProfileApplication({
        opportunityId: selectedOpportunity.id,
        opportunityType: selectedOpportunity.type,
        opportunityTitle: selectedOpportunity.title,
        profileData: profileData
      });

      if (response.success) {
        addNotification({
          title: "Application Submitted Successfully",
          message: "Your profile has been submitted. You will receive a confirmation email shortly.",
          type: "success",
        });
        setSubmitModalOpened(false);
        setSelectedOpportunity(null);
      }
    } catch (error) {
      addNotification({
        title: "Submission Failed",
        message: error.message || "Failed to submit application. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="app-page" style={{ background: 'var(--bg-primary)' }}>
      <Container size="xl">

        {/* ================= HEADER ================= */}
        <Card 
          radius="2xl" 
          shadow="lg" 
          withBorder 
          p="xl" 
          mb="xl" 
          className="profile-header animate-fade-in"
          style={{ 
            background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-800) 100%)',
            border: 'none',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          
          <Grid align="center">
            {/* AVATAR */}
            <Grid.Col span={{ base: 12, md: 3 }}>
              <Stack align="center" gap="md">

                <div style={{ position: 'relative' }}>
                  <Avatar 
                    src={profile.avatar} 
                    size={150} 
                    radius="xl"
                    style={{
                      border: '4px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                    }}
                  />

                  {isEditing && (
                    <Button
                      size="xs"
                      leftSection={<IconCamera size={14} />}
                      component="label"
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: 'var(--primary-700)',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'white',
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      Change
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
                </div>

                <Badge 
                  color="green" 
                  size="lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  ● ONLINE
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
                      styles={{
                        input: {
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'var(--text-primary)',
                          '&:focus': {
                            borderColor: 'white',
                            boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)'
                          }
                        },
                        label: {
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: 600
                        }
                      }}
                    />

                    <TextInput
                      label="Role"
                      value={profile.role}
                      onChange={(e) =>
                        handleProfileChange("role", e.target.value)
                      }
                      styles={{
                        input: {
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'var(--text-primary)',
                          '&:focus': {
                            borderColor: 'white',
                            boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)'
                          }
                        },
                        label: {
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: 600
                        }
                      }}
                    />

                    <Group grow>
                      <TextInput
                        label="Email"
                        value={profile.email}
                        onChange={(e) =>
                          handleProfileChange("email", e.target.value)
                        }
                        styles={{
                          input: {
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'var(--text-primary)',
                            '&:focus': {
                              borderColor: 'white',
                              boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)'
                            }
                          },
                          label: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 600
                          }
                        }}
                      />

                      <TextInput
                        label="Location"
                        value={profile.location}
                        onChange={(e) =>
                          handleProfileChange("location", e.target.value)
                        }
                        styles={{
                          input: {
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'var(--text-primary)',
                            '&:focus': {
                              borderColor: 'white',
                              boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)'
                            }
                          },
                          label: {
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 600
                          }
                        }}
                      />
                    </Group>

                    <TextInput
                      label="University"
                      value={profile.university}
                      onChange={(e) =>
                        handleProfileChange("university", e.target.value)
                      }
                      styles={{
                        input: {
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'var(--text-primary)',
                          '&:focus': {
                            borderColor: 'white',
                            boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)'
                          }
                        },
                        label: {
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: 600
                        }
                      }}
                    />

                    <Textarea
                      label="About Me"
                      minRows={4}
                      value={profile.about}
                      onChange={(e) =>
                        handleProfileChange("about", e.target.value)
                      }
                      styles={{
                        input: {
                          background: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          color: 'var(--text-primary)',
                          '&:focus': {
                            borderColor: 'white',
                            boxShadow: '0 0 0 3px rgba(255, 255, 255, 0.2)'
                          }
                        },
                        label: {
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontWeight: 600
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Title order={2} style={{ color: 'white', fontWeight: 800, letterSpacing: '-0.02em' }}>
                      {profile.name || 'Your Name'}
                    </Title>
                    <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem', fontWeight: 500 }}>
                      {profile.role || 'Your Role'}
                    </Text>
                    <Group gap="md">
                      <Group gap="xs">
                        <IconMail size={16} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                        <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{profile.email || 'your@email.com'}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconMapPin size={16} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                        <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{profile.location || 'Your Location'}</Text>
                      </Group>
                    </Group>
                    <Group gap="xs">
                      <IconSchool size={16} style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
                      <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>{profile.university || 'Your University'}</Text>
                    </Group>
                    <Text c="dimmed" style={{ color: 'rgba(255, 255, 255, 0.75)', lineHeight: 1.6, maxWidth: '600px' }}>
                      {profile.about || 'Tell us about yourself...'}
                    </Text>
                  </>
                )}

                {/* BUTTON TOGGLE */}
                <Group mt="lg" gap="sm">
                  <Button
                    size="md"
                    radius="lg"
                    leftSection={<IconEdit size={18} />}
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile();
                      }
                      setIsEditing((prev) => !prev);
                    }}
                    styles={{
                      root: {
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: 'var(--primary-700)',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'white',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                        }
                      }
                    }}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>

                  <Button 
                    size="md"
                    radius="lg"
                    variant="outline"
                    leftSection={<IconUser size={18} />}
                    onClick={() => {
                      // Preview functionality - could open a modal or navigate to a preview page
                      alert("Preview feature coming soon!");
                    }}
                    styles={{
                      root: {
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.15)',
                          borderColor: 'rgba(255, 255, 255, 0.6)',
                          transform: 'translateY(-2px)'
                        }
                      }
                    }}
                  >
                    Preview Profile
                  </Button>

                  <Button 
                    size="md"
                    radius="lg"
                    leftSection={<IconSend size={18} />}
                    onClick={() => setSubmitModalOpened(true)}
                    styles={{
                      root: {
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
                        }
                      }
                    }}
                  >
                    Submit Application
                  </Button>
                </Group>

              </Stack>
            </Grid.Col>
          </Grid>
        </Card>

        {/* ================= REST OF YOUR UI (UNCHANGED) ================= */}
        {/* You can keep Skills, Stats, etc exactly as they are */}
        
      {/* SUBMIT APPLICATION MODAL */}
      <Modal
        opened={submitModalOpened}
        onClose={() => {
          setSubmitModalOpened(false);
          setSelectedOpportunity(null);
        }}
        title="Submit Application"
        size="md"
        centered
      >
        <Stack gap="md">
          <Alert 
            icon={<IconSend size={16} />} 
            title="Are you sure you want to submit your profile application?"
            color="blue"
          >
            This will generate a professional PDF of your profile and send it to the admin for review.
          </Alert>

          <Text size="sm" c="dimmed">
            Please ensure your profile information is complete and accurate before submitting.
          </Text>

          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              onClick={() => {
                setSubmitModalOpened(false);
                setSelectedOpportunity(null);
              }}
              leftSection={<IconX size={16} />}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitApplication}
              loading={isSubmitting}
              leftSection={<IconCheck size={16} />}
              styles={{
                root: {
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  }
                }
              }}
            >
              Confirm Submission
            </Button>
          </Group>
        </Stack>
      </Modal>

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

    {/* COVER LETTER */}
    {/* ================= COVER LETTER ================= */}
<Grid.Col span={12}>
  <Card withBorder radius="lg" p="lg">

    <Group justify="space-between" align="flex-start" wrap="wrap">

      <div>
        <Title order={5}>Cover Letter</Title>
        <Text size="sm" c="dimmed">
          Upload and manage your cover letter
        </Text>

        {coverLetterFile && (
          <Text size="xs" mt="xs" c="blue">
            📄 {coverLetterFile.name}
          </Text>
        )}
      </div>

      <Group wrap="wrap">

        {/* UPLOAD BUTTON */}
        <Button component="label">
          Upload Cover Letter
          <input
            type="file"
            hidden
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              handleCoverLetterUpload(e.target.files[0])
            }
          />
        </Button>

        {/* VIEW BUTTON (ONLY IF COVER LETTER EXISTS) */}
        <Button
          variant="outline"
          disabled={!coverLetterUrl}
          onClick={() => window.open(coverLetterUrl, "_blank")}
        >
          View Cover Letter
        </Button>

        {/* DOWNLOAD BUTTON */}
        <Button
          variant="light"
          disabled={!coverLetterUrl}
          component="a"
          href={coverLetterUrl}
          download={coverLetterFile?.name || "cover-letter.pdf"}
        >
          Download
        </Button>

      </Group>

    </Group>

    {/* MOBILE PREVIEW TIP */}
    {coverLetterUrl && (
      <Card mt="md" withBorder radius="md" p="sm">
        <Text size="sm" c="dimmed">
          Cover letter uploaded successfully. You can view or download it anytime.
        </Text>
      </Card>
    )}

  </Card>
</Grid.Col>
    {/* INTERESTS */}
    <Grid.Col span={12}>
      <Card withBorder radius="lg" p="lg">

        <Group justify="space-between" mb="sm">
          <div>
            <Title order={5}>Interests</Title>
            <Text size="xs" c="dimmed">
              {profile.interests?.length || 0} interests added
            </Text>
          </div>

          <Group gap="xs">
            {isEditing && profile.interests && profile.interests.length > 0 && (
              <Button
                size="xs"
                variant="light"
                color="red"
                onClick={() => {
                  if (confirm('Are you sure you want to clear all interests?')) {
                    setProfile({ ...profile, interests: [] });
                  }
                }}
              >
                Clear All
              </Button>
            )}
            <Button
              size="xs"
              variant={isEditing ? "filled" : "light"}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done" : "Edit"}
            </Button>
          </Group>
        </Group>

        {isEditing ? (
          <Stack>
            <TextInput
              ref={interestInputRef}
              label="Add Interest"
              placeholder="Type an interest and press Enter"
              description="Press Enter to add, or click the + button"
              rightSection={
                <ActionIcon
                  size="sm"
                  color="blue"
                  onClick={() => {
                    if (interestInputRef.current && interestInputRef.current.value.trim()) {
                      const currentInterests = profile.interests || [];
                      setProfile({
                        ...profile,
                        interests: [...currentInterests, interestInputRef.current.value.trim()]
                      });
                      interestInputRef.current.value = '';
                    }
                  }}
                >
                  +
                </ActionIcon>
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  const currentInterests = profile.interests || [];
                  setProfile({
                    ...profile,
                    interests: [...currentInterests, e.target.value.trim()]
                  });
                  e.target.value = '';
                }
              }}
            />
            <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }}>
              {profile.interests && profile.interests.map((interest, index) => (
                <Badge
                  key={index}
                  size="lg"
                  variant="light"
                  color={["blue", "green", "orange", "red", "violet", "cyan", "pink", "yellow"][index % 8]}
                  style={{ 
                    paddingRight: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    height: 'auto',
                    minHeight: '32px'
                  }}
                  rightSection={
                    <Group gap={2} style={{ marginLeft: '4px' }}>
                      <Tooltip label="Edit">
                        <ActionIcon
                          size="xs"
                          variant="transparent"
                          color="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingInterest(index);
                            setEditingInterestValue(interest);
                          }}
                        >
                          <IconEdit size={12} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="Delete">
                        <ActionIcon
                          size="xs"
                          variant="transparent"
                          color="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            setProfile({
                              ...profile,
                              interests: profile.interests.filter((_, i) => i !== index)
                            });
                          }}
                        >
                          ×
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  }
                >
                  {editingInterest === index ? (
                    <TextInput
                      size="xs"
                      defaultValue={editingInterestValue}
                      autoFocus
                      onBlur={(e) => {
                        const newValue = e.target.value.trim();
                        if (newValue) {
                          const updatedInterests = [...profile.interests];
                          updatedInterests[index] = newValue;
                          setProfile({
                            ...profile,
                            interests: updatedInterests
                          });
                        }
                        setEditingInterest(null);
                        setEditingInterestValue("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const newValue = e.target.value.trim();
                          if (newValue) {
                            const updatedInterests = [...profile.interests];
                            updatedInterests[index] = newValue;
                            setProfile({
                              ...profile,
                              interests: updatedInterests
                            });
                          }
                          setEditingInterest(null);
                          setEditingInterestValue("");
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      style={{ width: '120px', minWidth: '80px' }}
                    />
                  ) : (
                    interest
                  )}
                </Badge>
              ))}
            </SimpleGrid>
            {(!profile.interests || profile.interests.length === 0) && (
              <Card p="md" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-light)' }}>
                <Stack align="center" spacing="xs">
                  <Text c="dimmed" size="sm" ta="center">
                    No interests added yet
                  </Text>
                  <Text size="xs" c="dimmed" ta="center">
                    Add your interests above to showcase your passions!
                  </Text>
                </Stack>
              </Card>
            )}
          </Stack>
        ) : (
          <Stack>
            <SimpleGrid cols={{ base: 2, sm: 3, md: 4, lg: 5 }}>
              {profile.interests && profile.interests.map((interest, index) => (
                <Badge
                  key={index}
                  size="lg"
                  variant="filled"
                  color={["blue", "green", "orange", "red", "violet", "cyan", "pink", "yellow"][index % 8]}
                  style={{ 
                    height: 'auto',
                    minHeight: '32px'
                  }}
                >
                  {interest}
                </Badge>
              ))}
            </SimpleGrid>
            {(!profile.interests || profile.interests.length === 0) && (
              <Card p="md" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-light)' }}>
                <Stack align="center" spacing="xs">
                  <Text c="dimmed" size="sm" ta="center">
                    No interests added yet
                  </Text>
                  <Text size="xs" c="dimmed" ta="center">
                    Click Edit to add your interests and showcase your passions!
                  </Text>
                </Stack>
              </Card>
            )}
          </Stack>
        )}

      </Card>
    </Grid.Col>

  </Grid>
</Card>
    </Box>
  );
}