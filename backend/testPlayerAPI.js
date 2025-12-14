const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Test player API endpoints
const testPlayerAPI = async () => {
  const baseURL = 'http://localhost:5000/api';
  
  try {
    // Create a session by logging in
    console.log('Logging in as admin...');
    
    // First, we need to create a session
    const loginResponse = await fetch(`${baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });
    
    // Get cookies from the response
    const cookies = loginResponse.headers.raw()['set-cookie'];
    console.log('Cookies:', cookies);
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginData.success) {
      console.log('Login failed');
      return;
    }
    
    // Use cookies for subsequent requests
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (cookies) {
      headers['Cookie'] = cookies.join('; ');
    }
    
    // Test creating a player
    console.log('\nCreating a new player...');
    const createResponse = await fetch(`${baseURL}/players`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        name: 'John Doe',
        email: 'johndoe5@example.com', // Use a completely new email
        phone: '1234567890',
        dateOfBirth: '1990-01-01',
        position: 'Forward',
        jerseyNumber: 10
      })
    });
    
    const createData = await createResponse.json();
    console.log('Create player response:', createData);
    
    if (!createData.success) {
      console.log('Failed to create player');
      return;
    }
    
    const playerId = createData.data._id;
    console.log('Created player with ID:', playerId);
    
    // Test getting all players
    console.log('\nGetting all players...');
    const getAllResponse = await fetch(`${baseURL}/players`, {
      method: 'GET',
      headers: headers
    });
    
    const getAllData = await getAllResponse.json();
    console.log('Get all players response:', getAllData);
    
    // Test getting player by ID
    console.log('\nGetting player by ID...');
    const getByIdResponse = await fetch(`${baseURL}/players/${playerId}`, {
      method: 'GET',
      headers: headers
    });
    
    const getByIdData = await getByIdResponse.json();
    console.log('Get player by ID response:', getByIdData);
    
    // Test updating player
    console.log('\nUpdating player...');
    const updateResponse = await fetch(`${baseURL}/players/${playerId}`, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify({
        name: 'John Smith',
        position: 'Midfielder'
      })
    });
    
    const updateData = await updateResponse.json();
    console.log('Update player response:', updateData);
    
    // Test deleting player
    console.log('\nDeleting player...');
    const deleteResponse = await fetch(`${baseURL}/players/${playerId}`, {
      method: 'DELETE',
      headers: headers
    });
    
    const deleteData = await deleteResponse.json();
    console.log('Delete player response:', deleteData);
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
};

testPlayerAPI();