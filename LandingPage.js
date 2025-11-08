import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle Get Started button click
  const handleGetStarted = () => {
    navigate('/dashboard'); // go to dashboard
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management System
          </Typography>
          {/* Navbar links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button color="inherit" href="#home">Home</Button>
            <Button color="inherit" href="#services">Services</Button>
            <Button color="inherit" href="#about">About</Button>
            <Button color="inherit" href="#contact">Contact</Button>
            <Button 
              color="inherit" 
              variant="outlined" 
              onClick={handleGetStarted}
              sx={{ ml: 2 }}
            >
              Get Started
            </Button>
          </Box>
          {/* Mobile menu icon */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Home Section */}
      <Box id="home" sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Welcome text and Get Started button */}
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                Manage Your Inventory
                <br />
                <span style={{ color: '#90caf9' }}>Like Never Before</span>
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', mb: 4, opacity: 0.9 }}>
                Streamline your business operations with our comprehensive inventory management system. 
                Track, analyze, and optimize your inventory in real-time.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                sx={{
                  backgroundColor: '#90caf9',
                  color: '#000',
                  px: 4,
                  py: 2,
                  fontSize: '1.2rem',
                  '&:hover': {
                    backgroundColor: '#64b5f6'
                  }
                }}
              >
                Get Started
              </Button>
            </Grid>
            {/* Banner image */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Inventory Management"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Our Services
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            {/* Service cards */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <InventoryIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    Inventory Tracking
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Real-time tracking of all your inventory items with detailed analytics and reporting.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <AnalyticsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    Analytics & Reports
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Comprehensive analytics and customizable reports to make data-driven decisions.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', textAlign: 'center' }}>
                <CardContent>
                  <SecurityIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h5" component="h3" gutterBottom>
                    Secure & Reliable
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Enterprise-grade security with 99.9% uptime guarantee for your business needs.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* About Section */}
      <Box id="about" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* About text */}
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h2" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body1" paragraph>
                We are dedicated to providing businesses with the most efficient and user-friendly 
                inventory management solutions. Our platform is designed to help you streamline 
                operations, reduce costs, and improve productivity.
              </Typography>
              <Typography variant="body1" paragraph>
                With years of experience in the industry, we understand the challenges that 
                businesses face when managing inventory. That's why we've created a solution 
                that's both powerful and easy to use.
              </Typography>
            </Grid>
            {/* About image */}
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="About Us"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box id="contact" sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Contact Us
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Get in Touch
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Have questions about our inventory management system? We're here to help!
                  </Typography>
                  {/* Contact details */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SupportIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="body1">
                      Email: support@inventorysystem.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SupportIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="body1">
                      Phone: +1 (555) 123-4567
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SupportIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="body1">
                      Address: 123 Business St, Suite 100, City, State 12345
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, backgroundColor: 'background.default', textAlign: 'center' }}>
        <Container>
          <Typography variant="body2" color="text.secondary">
            © 2024 Inventory Management System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage; 