import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const CATEGORY_OPTIONS = [
  'Electronics', 'Furniture', 'Clothing', 'Books', 'Food', 'Tools', 'Sports', 'Other'
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  // State for inventory and stats
  const [inventoryData, setInventoryData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Modal state
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: CATEGORY_OPTIONS[0],
    quantity: '',
    price: '',
    description: '',
    location: '',
    supplier: ''
  });

  // Fetch inventory and stats on mount
  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Fetch inventory and stats from API
  const fetchInventoryData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [inventoryResponse, statsResponse] = await Promise.all([
        axios.get('/api/inventory', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/inventory/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setInventoryData(inventoryResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    setInventoryData([
      {
        ...newItem,
        quantity: Number(newItem.quantity),
        price: Number(newItem.price),
        createdAt: new Date().toISOString()
      },
      ...inventoryData
    ]);
    setNewItem({
      name: '',
      category: CATEGORY_OPTIONS[0],
      quantity: '',
      price: '',
      description: '',
      location: '',
      supplier: ''
    });
    handleClose();
  };

  // Chart data for line, bar, doughnut
  const lineChartData = {
    labels: inventoryData.slice(0, 7).map(item => 
      new Date(item.createdAt).toLocaleDateString()
    ).reverse(),
    datasets: [
      {
        label: 'Quantity',
        data: inventoryData.slice(0, 7).map(item => item.quantity).reverse(),
        borderColor: '#90caf9',
        backgroundColor: 'rgba(144, 202, 249, 0.1)',
        tension: 0.4
      }
    ]
  };

  const barChartData = stats?.categoryStats ? {
    labels: stats.categoryStats.map(item => item._id),
    datasets: [
      {
        label: 'Total Quantity',
        data: stats.categoryStats.map(item => item.totalQuantity),
        backgroundColor: [
          '#90caf9',
          '#f48fb1',
          '#a5d6a7',
          '#fff59d',
          '#ffcc80',
          '#f8bbd9',
          '#c5cae9',
          '#d1c4e9'
        ]
      }
    ]
  } : null;

  const doughnutData = stats?.categoryStats ? {
    labels: stats.categoryStats.map(item => item._id),
    datasets: [
      {
        data: stats.categoryStats.map(item => item.totalValue),
        backgroundColor: [
          '#90caf9',
          '#f48fb1',
          '#a5d6a7',
          '#fff59d',
          '#ffcc80',
          '#f8bbd9',
          '#c5cae9',
          '#d1c4e9'
        ]
      }
    ]
  } : null;

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#fff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  // Show loading spinner
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header bar */}
      <AppBar position="static">
        <Toolbar>
          <InventoryIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.name}!
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Error message */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Welcome banner */}
        <Paper
          sx={{
            position: 'relative',
            backgroundColor: 'grey.800',
            color: '#fff',
            mb: 4,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)`,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
              backgroundColor: 'rgba(0,0,0,.3)',
            }}
          />
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome to Your Dashboard
            </Typography>
            <Typography variant="h5" paragraph>
              Manage your inventory efficiently with real-time analytics and insights
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
              Add New Item
            </Button>
          </Box>
        </Paper>

        {/* Stats cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Items
                </Typography>
                <Typography variant="h4">
                  {inventoryData.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Quantity
                </Typography>
                <Typography variant="h4">
                  {inventoryData.reduce((sum, item) => sum + item.quantity, 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Value
                </Typography>
                <Typography variant="h4">
                  ${inventoryData.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Categories
                </Typography>
                <Typography variant="h4">
                  {stats?.categoryStats?.length || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Inventory Trends
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line data={lineChartData} options={chartOptions} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Category Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  {doughnutData && <Doughnut data={doughnutData} options={chartOptions} />}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Quantity by Category
                </Typography>
                <Box sx={{ height: 400 }}>
                  {barChartData && <Bar data={barChartData} options={chartOptions} />}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent items list */}
        {stats?.recentItems && stats.recentItems.length > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Items
              </Typography>
              <Grid container spacing={2}>
                {stats.recentItems.slice(0, 6).map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Category: {item.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Quantity: {item.quantity} | Price: ${item.price}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Add Item Modal */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Item</DialogTitle>
          <form onSubmit={handleAddItem}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Item Name"
                type="text"
                fullWidth
                value={newItem.name}
                onChange={handleChange}
                required
              />
              <TextField
                select
                margin="dense"
                name="category"
                label="Category"
                fullWidth
                value={newItem.category}
                onChange={handleChange}
                SelectProps={{ native: true }}
                required
              >
                {CATEGORY_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </TextField>
              <TextField
                margin="dense"
                name="quantity"
                label="Quantity"
                type="number"
                fullWidth
                value={newItem.quantity}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="price"
                label="Price"
                type="number"
                fullWidth
                value={newItem.price}
                onChange={handleChange}
                required
              />
              <TextField
                margin="dense"
                name="description"
                label="Description"
                type="text"
                fullWidth
                value={newItem.description}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="location"
                label="Location"
                type="text"
                fullWidth
                value={newItem.location}
                onChange={handleChange}
              />
              <TextField
                margin="dense"
                name="supplier"
                label="Supplier"
                type="text"
                fullWidth
                value={newItem.supplier}
                onChange={handleChange}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">Add</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard; 