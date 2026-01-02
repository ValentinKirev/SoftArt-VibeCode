// Simple API test file
export default function TestAPI() {
  const testAPI = async () => {
    console.log('Testing API call...');
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify({
          name: 'Test Tool',
          description: 'Test Description',
          status: 'active'
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test</h1>
      <button onClick={testAPI}>Test API Call</button>
    </div>
  );
}
