import {
  Container,
  Card,
  SimpleGrid,
  Badge,
  Button,
  Stack,
  Title,
  Table,
  Progress,
  Image,
  Text,
  Group,
  TextInput,
  Select,
  Modal,
  Divider,
  Alert,
} from "@mantine/core";
import { IconAlertCircle, IconSearch, IconFilter } from "@tabler/icons-react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useDataManager } from "../utils/dataManager";
import { getApiCollection, getDashboardStats } from "../utils/api";

// Dynamically import all images from the photos folder
const photosContext = import.meta.glob('/src/photos/*', { eager: true });
const photosArray = Object.values(photosContext).map(photo => photo.default || photo);

// Default placeholder image if no photos available
const DEFAULT_PLACEHOLDER = 'https://via.placeholder.com/400x200?text=No+Image+Available';

// Custom hook for managing rotating images
const useRotatingImages = (items, photos) => {
  const [currentImages, setCurrentImages] = useState({});

  // Initialize random images for each item
  useEffect(() => {
    if (items.length === 0) return;

    const initialImages = {};
    items.forEach(item => {
      const itemId = item._id || item.id;
      if (photos.length > 0) {
        initialImages[itemId] = photos[Math.floor(Math.random() * photos.length)];
      } else {
        initialImages[itemId] = DEFAULT_PLACEHOLDER;
      }
    });
    setCurrentImages(initialImages);
  }, [items, photos]);

  // Rotate images every 10 seconds
  useEffect(() => {
    if (items.length === 0 || photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImages(prevImages => {
        const newImages = { ...prevImages };
        items.forEach(item => {
          const itemId = item._id || item.id;
          // Get a different random image
          let newImage;
          do {
            newImage = photos[Math.floor(Math.random() * photos.length)];
          } while (newImage === prevImages[itemId] && photos.length > 1);
          newImages[itemId] = newImage;
        });
        return newImages;
      });
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [items, photos]);

  const getImageForItem = useCallback((item) => {
    const itemId = item._id || item.id;
    return currentImages[itemId] || DEFAULT_PLACEHOLDER;
  }, [currentImages]);

  return { getImageForItem };
};

export default function DashboardContent() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { scholarships, applications, assessments, internships } = useDataManager();

  const [data, setData] = useState({
    scholarships: [],
    applications: [],
    assessments: [],
    internships: [],
  });

  const [stats, setStats] = useState({
    scholarships: 0,
    applications: 0,
    assessments: 0,
    internships: 0,
  });

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationModalOpened, setApplicationModalOpened] = useState(false);
  const [applyingFor, setApplyingFor] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Memoize photos array to prevent unnecessary re-renders
  const photos = useMemo(() => photosArray, []);

  // Initialize rotating images for scholarships
  const { getImageForItem: getScholarshipImage } = useRotatingImages(data.scholarships, photos);

  // Initialize rotating images for internships
  const { getImageForItem: getInternshipImage } = useRotatingImages(data.internships, photos);

  const loadData = async () => {
    try {
      const [scholarshipsData, internshipsData, statsData] = await Promise.all([
        getApiCollection('/scholarships'),
        getApiCollection('/internships'),
        getDashboardStats()
      ]);

      const applicationsData = applications.getAll();
      const assessmentsData = assessments.getAll();

      setData({
        scholarships: scholarshipsData,
        applications: applicationsData,
        assessments: assessmentsData,
        internships: internshipsData,
      });

      setStats({
        scholarships: statsData.scholarships || scholarshipsData.length,
        applications: statsData.applications || applicationsData.length,
        assessments: statsData.assessments || assessmentsData.length,
        internships: statsData.internships || internshipsData.length,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const calculateProfileCompletion = () => {
    const userProfile = localStorage.getItem('userProfile');
    if (!userProfile) return 0;

    const profile = JSON.parse(userProfile);
    const fields = ['name', 'role', 'email', 'location', 'university', 'about'];
    const completedFields = fields.filter(field => profile[field] && profile[field].trim() !== '');

    // Check if avatar is set (not the default)
    const hasAvatar = profile.avatar && !profile.avatar.includes('pravatar.cc');
    if (hasAvatar) completedFields.push('avatar');

    return Math.round((completedFields.length / (fields.length + 1)) * 100);
  };

  const handleApply = async (scholarship) => {
    setApplyingFor(scholarship.id);
    setSendingEmail(true);

    try {
      // Import the applyToOpportunity function
      const { applyToOpportunity } = await import('../utils/api');
      
      // Call the backend API
      const response = await applyToOpportunity({
        scholarshipId: scholarship.id,
        scholarshipTitle: scholarship.title,
        type: 'scholarship'
      });

      if (response.success) {
        // Add application to localStorage for tracking
        applications.add({
          scholarship: scholarship.title,
          status: 'Pending',
          date: new Date().toISOString().split('T')[0],
          scholarshipId: scholarship.id,
        });

        // Show success notification
        addNotification({
          title: "Application Submitted Successfully",
          message: "Your profile information, CV, assessment results, and documents have been sent for review.",
          type: "success",
        });
      }

    } catch (error) {
      console.error('Error submitting application:', error);
      addNotification({
        title: "Application Failed",
        message: error.message || "Failed to submit application. Please try again.",
        type: "error",
      });
    } finally {
      setApplyingFor(null);
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Image Card Component with rotation animation
  const ImageCard = ({ item, imageSrc, index, type }) => {
    const [imageKey, setImageKey] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Update image key when source changes
    useEffect(() => {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setImageKey(prev => prev + 1);
        setIsTransitioning(false);
      }, 300); // Match CSS transition duration

      return () => clearTimeout(timer);
    }, [imageSrc]);

    return (
      <Card
        key={item._id || item.id}
        shadow="md"
        radius="xl"
        p="0"
        withBorder
        className="card-smooth animate-fade-in"
        style={{ 
          transition: 'all 0.3s ease',
          animationDelay: `${index * 0.05}s`,
          overflow: 'hidden'
        }}
      >
        <div style={{ 
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Image 
            key={imageKey}
            src={imageSrc} 
            height={{ base: 160, sm: 200 }} 
            alt={item.title}
            style={{
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              opacity: isTransitioning ? 0.5 : 1,
              transform: isTransitioning ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px'
          }}>
            <Badge 
              color={item.status === "Open" ? "green" : "orange"} 
              size="sm"
              style={{
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            >
              {item.status}
            </Badge>
          </div>
        </div>

        <Stack p={{ base: "md", sm: "lg" }}>
          <Group justify="space-between" align="flex-start">
            <Badge 
              color={type === 'scholarship' ? "blue" : "cyan"} 
              size={{ base: "xs", sm: "sm" }}
              variant="light"
              style={{ fontWeight: 600 }}
            >
              {type === 'scholarship' ? item.field : (item.field || item.company)}
            </Badge>
          </Group>

          <Title 
            order={{ base: 5, sm: 4 }} 
            fw={700}
            style={{ 
              letterSpacing: '-0.01em',
              lineHeight: 1.3
            }}
          >
            {item.title}
          </Title>

          <Text size={{ base: "xs", sm: "sm" }} c="dimmed">
            Deadline: {item.deadline}
          </Text>

          <Text 
            fw={800} 
            size={{ base: "md", sm: "lg" }}
            style={{
              background: type === 'scholarship' 
                ? 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)'
                : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {type === 'scholarship' ? item.amount : (item.stipend || item.amount || "Competitive")}
          </Text>

          <Progress 
            value={item.status === "Open" ? 70 : 90} 
            size="sm" 
            style={{
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden'
            }}
          />

          <Group grow mt="md" gap="sm">
            <Button
              variant="light"
              size="sm"
              radius="md"
              onClick={(e) => {
                e.preventDefault();
                navigate(type === 'scholarship' ? "/scholarships" : "/internships");
              }}
              styles={{
                root: {
                  fontWeight: 600,
                  '&:hover': {
                    background: 'var(--bg-tertiary)',
                  }
                }
              }}
            >
              View Details
            </Button>

            <Button
              size="sm"
              radius="md"
              onClick={(e) => {
                e.preventDefault();
                if (type === 'scholarship') {
                  handleApply(item);
                } else {
                  navigate("/internships");
                }
              }}
              loading={type === 'scholarship' && applyingFor === item.id}
              disabled={type === 'scholarship' && applyingFor !== null && applyingFor !== item.id}
              styles={{
                root: {
                  background: type === 'scholarship'
                    ? 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)'
                    : 'linear-gradient(135deg, var(--accent-cyan) 0%, #0891b2 100%)',
                  fontWeight: 600,
                  '&:hover': {
                    background: type === 'scholarship'
                      ? 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)'
                      : 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: type === 'scholarship'
                      ? 'var(--shadow-md), 0 0 15px rgba(59, 130, 246, 0.3)'
                      : 'var(--shadow-md), 0 0 15px rgba(6, 182, 212, 0.3)',
                  }
                }
              }}
            >
              {type === 'scholarship' && applyingFor === item.id ? 'Submitting...' : 'Apply Now'}
            </Button>
          </Group>
        </Stack>
      </Card>
    );
  };

  return (
    <Container fluid>
      {/* WELCOME CARD */}
      <Card
        radius="xl"
        p={{ base: "md", sm: "xl" }}
        mb="xl"
        withBorder
        className="card-welcome animate-fade-in"
        style={{ 
          background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--bg-secondary) 100%)',
          border: '1px solid var(--border-color)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, var(--primary-200) 0%, transparent 70%)',
          opacity: 0.3,
          pointerEvents: 'none'
        }} />
        
        <Group justify="space-between" align={{ base: "flex-start", sm: "center" }}>
          <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
            <Title 
              order={{ base: 3, sm: 2 }} 
              fw={800}
              style={{ 
                letterSpacing: '-0.02em',
                marginBottom: '8px'
              }}
            >
              Welcome back! 👋
            </Title>
            <Text 
              mt="sm" 
              c="dimmed" 
              size={{ base: "sm", sm: "md" }}
              style={{ 
                lineHeight: 1.6,
                maxWidth: '500px'
              }}
            >
              Explore scholarships and complete your assessments to achieve your academic goals.
            </Text>
          </div>

          <Button 
            onClick={(e) => {
              e.preventDefault();
              navigate("/scholarships");
            }} 
            mt={{ base: "sm", sm: 0 }}
            size="md"
            radius="lg"
            styles={{
              root: {
                background: 'linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%)',
                padding: '10px 24px',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--primary-700) 0%, var(--primary-800) 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: 'var(--shadow-lg), 0 0 20px rgba(59, 130, 246, 0.3)',
                }
              }
            }}
          >
            Explore Scholarships
          </Button>
        </Group>
      </Card>

      {/* SCHOLARSHIPS */}
      <Group justify="space-between" mb="lg" mt="xl">
        <div>
          <Title 
            order={3} 
            fw={800}
            style={{ 
              letterSpacing: '-0.02em',
              marginBottom: '4px'
            }}
          >
            Recommended Scholarships
          </Title>
          <Text size="sm" c="dimmed">
            Discover opportunities tailored for you
          </Text>
        </div>
        <Group>
          <TextInput 
            placeholder="Search..." 
            w={{ base: 150, sm: 220 }} 
            leftSection={<IconSearch size={16} />}
            display={{ base: "none", sm: "block" }}
            styles={{
              input: {
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                '&:focus': {
                  borderColor: 'var(--primary-500)',
                  boxShadow: '0 0 0 3px var(--primary-100)'
                }
              }
            }}
          />
          <Select
            placeholder="Filter"
            leftSection={<IconFilter size={16} />}
            data={["Technology", "Engineering", "Business"]}
            w={{ base: 130, sm: 180 }}
            display={{ base: "none", sm: "block" }}
            styles={{
              input: {
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                '&:focus': {
                  borderColor: 'var(--primary-500)',
                  boxShadow: '0 0 0 3px var(--primary-100)'
                }
              }
            }}
          />
        </Group>
      </Group>
      {data.scholarships.length === 0 ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="No Scholarships Available"
          color="blue"
          variant="light"
          mb="xl"
        >
          No scholarships are currently available in the database. Check back later for new opportunities.
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mb="xl">
          {data.scholarships.map((item, index) => (
            <ImageCard
              key={item._id || item.id}
              item={item}
              imageSrc={getScholarshipImage(item)}
              index={index}
              type="scholarship"
            />
          ))}
        </SimpleGrid>
      )}



      {/* INTERNSHIPS */}
      <Group justify="space-between" mb="lg" mt="xl">
        <div>
          <Title 
            order={3} 
            fw={800}
            style={{ 
              letterSpacing: '-0.02em',
              marginBottom: '4px'
            }}
          >
            Recommended Internships
          </Title>
          <Text size="sm" c="dimmed">
            Gain real-world experience with top companies
          </Text>
        </div>
        <Button
          variant="light"
          size="sm"
          radius="md"
          onClick={(e) => {
            e.preventDefault();
            navigate("/internships");
          }}
          styles={{
            root: {
              fontWeight: 600,
              '&:hover': {
                background: 'var(--bg-tertiary)',
              }
            }
          }}
        >
          View All →
        </Button>
      </Group>
      {data.internships.length === 0 ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="No Internships Available"
          color="blue"
          variant="light"
          mb="xl"
        >
          No internships are currently available in the database. Check back later for new opportunities.
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} mb="xl">
          {data.internships.slice(0, 3).map((item, index) => (
            <ImageCard
              key={item._id || item.id}
              item={item}
              imageSrc={getInternshipImage(item)}
              index={index}
              type="internship"
            />
          ))}
        </SimpleGrid>
      )}

            {/* APPLICATIONS */}
      {data.applications.length > 0 && (
        <Card 
          radius="xl" 
          p={{ base: "md", sm: "lg" }} 
          withBorder 
          className="animate-fade-in"
          style={{ 
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.3s ease',
            marginTop: '3rem'
          }}
        >
          <Group justify="space-between" mb="lg">
            <div>
              <Title 
                order={{ base: 5, sm: 4 }} 
                fw={700}
                style={{ 
                  letterSpacing: '-0.01em',
                  marginBottom: '4px'
                }}
              >
                Application Status
              </Title>
              <Text size="sm" c="dimmed">
                Track your scholarship applications
              </Text>
            </div>
            <Badge 
              size="lg" 
              color="blue" 
              variant="light"
              style={{ fontWeight: 600 }}
            >
              {data.applications.length} {data.applications.length === 1 ? 'Application' : 'Applications'}
            </Badge>
          </Group>

          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ fontWeight: 700 }}>Scholarship</Table.Th>
                <Table.Th style={{ fontWeight: 700 }}>Status</Table.Th>
                <Table.Th style={{ fontWeight: 700 }}>Date</Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {data.applications.map((app, index) => (
                <Table.Tr 
                  key={app._id || app.id || index}
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => {
                    setSelectedApplication(app);
                    setApplicationModalOpened(true);
                  }}
                >
                  <Table.Td fw={600}>{app.scholarship}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        app.status === "Approved"
                          ? "green"
                          : app.status === "Pending"
                          ? "yellow"
                          : "blue"
                      }
                      size="sm"
                      variant="light"
                      style={{ fontWeight: 600 }}
                    >
                      {app.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td c="dimmed">{app.date || 'N/A'}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      )}

      {/* PROFILE COMPLETION */}
      <Card 
        radius="xl" 
        p={{ base: "md", sm: "lg" }} 
        withBorder 
        className="animate-fade-in"
        style={{ 
          background: 'linear-gradient(135deg, var(--primary-50) 0%, var(--bg-secondary) 100%)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          transition: 'all 0.3s ease',
          marginTop: '3rem'
        }}
      >
        <Group justify="space-between" mb="md">
          <div>
            <Title 
              order={{ base: 5, sm: 4 }} 
              fw={700}
              style={{ 
                letterSpacing: '-0.01em',
                marginBottom: '4px'
              }}
            >
              Profile Completion
            </Title>
            <Text size={{ base: "xs", sm: "sm" }} c="dimmed">
              Complete your profile to improve matches and opportunities
            </Text>
          </div>

          <Badge 
            size="lg" 
            color="blue" 
            variant="light"
            style={{ 
              fontWeight: 700,
              fontSize: '1rem',
              padding: '8px 16px'
            }}
          >
            {calculateProfileCompletion()}%
          </Badge>
        </Group>

        <Progress 
          value={calculateProfileCompletion()} 
          size="xl"
          style={{
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            height: '12px'
          }}
        />
      </Card>

      {/* APPLICATION DETAILS MODAL */}
      <Modal
        opened={applicationModalOpened}
        onClose={() => setApplicationModalOpened(false)}
        title="Application Details"
        size="lg"
        centered
      >
        {selectedApplication && (
          <Stack>
            <Group justify="space-between">
              <div>
                <Text size="sm" c="dimmed">Scholarship</Text>
                <Text fw={500} size="lg">{selectedApplication.scholarship}</Text>
              </div>
              <Badge
                size="lg"
                color={
                  selectedApplication.status === "Approved"
                    ? "green"
                    : selectedApplication.status === "Pending"
                    ? "yellow"
                    : "blue"
                }
              >
                {selectedApplication.status}
              </Badge>
            </Group>

            <Divider />

            <Group>
              <div>
                <Text size="sm" c="dimmed">Application Date</Text>
                <Text>{selectedApplication.date || 'N/A'}</Text>
              </div>
              {selectedApplication.scholarshipId && (
                <div>
                  <Text size="sm" c="dimmed">Scholarship ID</Text>
                  <Text>{selectedApplication.scholarshipId}</Text>
                </div>
              )}
            </Group>

            <Divider />

            <div>
              <Text size="sm" c="dimmed" mb="xs">Application Status Details</Text>
              <Text>
                {selectedApplication.status === "Approved" && "Your application has been approved. Congratulations!"}
                {selectedApplication.status === "Pending" && "Your application is currently under review. We will notify you of any updates."}
                {selectedApplication.status === "Assessment Required" && "Please complete the required assessment to proceed with your application."}
                {selectedApplication.status === "Rejected" && "Unfortunately, your application was not successful. You can apply for other scholarships."}
              </Text>
            </div>

            <Group grow mt="md">
              <Button
                variant="light"
                onClick={() => setApplicationModalOpened(false)}
              >
                Close
              </Button>
              {selectedApplication.status === "Assessment Required" && (
                <Button onClick={() => {
                  setApplicationModalOpened(false);
                  navigate("/scholarship-assessment");
                }}>
                  Take Assessment
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Modal>
      
    </Container>
  );
  
  
    
}