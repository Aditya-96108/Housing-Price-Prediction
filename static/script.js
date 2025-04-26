async function predictPrice() {
    const area = document.getElementById('area').value;
    const bedrooms = document.getElementById('bedrooms').value;
    const location = document.getElementById('location').value;
    const resultDiv = document.getElementById('result');
    const locationInfoDiv = document.getElementById('location-info');
  
    if (!area || area <= 0) {
      resultDiv.innerHTML = '<span class="error">Please enter a valid area.</span>';
      return;
    }
  
    createSparkles();
  
    resultDiv.innerHTML = 'Predicting...';
    locationInfoDiv.innerHTML = '';
  
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          area: parseFloat(area),
          bedrooms: parseInt(bedrooms),
          location: location
        })
      });
  
      const data = await response.json();
      if (response.ok) {
        const price = data.price;
        resultDiv.innerHTML = `Predicted Price: ₹${price.toFixed(2)} Lakhs`;
        
        const locationInfo = await fetchLocationInfo(location);
        locationInfoDiv.innerHTML = `<strong>About ${location}:</strong> ${locationInfo}`;
      } else {
        resultDiv.innerHTML = `<span class="error">Error: ${data.error}</span>`;
      }
    } catch (error) {
      resultDiv.innerHTML = '<span class="error">Error connecting to server.</span>';
    }
  }
  
  async function fetchLocationInfo(location) {
    try {
      const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_OPENAI_API_KEY'
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are an expert travel guide for Mumbai." },
            { role: "user", content: `Tell me about ${location} in Mumbai, short and crisp.` }
          ],
          temperature: 0.7
        })
      });
  
      const openAiData = await openAiResponse.json();
      return openAiData.choices[0].message.content;
    } catch (error) {
      return "Unable to fetch information about the location.";
    }
  }
  
  function createSparkles() {
    const button = document.querySelector('button');
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    button.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }
// Define info for each location
const locationDetails = {
    "Andheri West": "Andheri West is a popular residential and commercial hub with great connectivity and vibrant nightlife.",
    "Bandra West": "Bandra West is known for its posh neighborhoods, shopping streets, and seaside promenade.",
    "Borivali East": "Borivali East offers peaceful residential areas with easy access to national parks and metro stations.",
    "Chembur": "Chembur is a well-connected suburb with a blend of residential colonies and industrial hubs.",
    "Dadar West": "Dadar West is a key transport hub, famous for Shivaji Park and proximity to major parts of Mumbai.",
    "Goregaon East": "Goregaon East houses many film studios and is an important commercial center in the suburbs.",
    "Juhu": "Juhu is famous for its beautiful beach, luxurious homes, and Bollywood celebrity residences.",
    "Khar West": "Khar West is a high-end locality offering premium housing and proximity to Bandra.",
    "Malad West": "Malad West is a growing residential and IT hub with malls, parks, and excellent infrastructure.",
    "Powai": "Powai is known for its upscale apartments, Powai Lake, and the Hiranandani business and residential complexes.",
    "Santacruz West": "Santacruz West is a prime area known for elite residential options and proximity to the airport.",
    "Vile Parle West": "Vile Parle West combines residential charm with access to top educational institutions.",
    "Worli": "Worli is a posh locality famous for luxury skyscrapers and the Bandra-Worli Sea Link."
  };
  
  // Handle location change
  document.getElementById('location').addEventListener('change', function() {
    const selectedLocation = this.value;
    const infoDiv = document.getElementById('location-info');
  
    if (locationDetails[selectedLocation]) {
      infoDiv.innerHTML = `<p>${locationDetails[selectedLocation]}</p>`;
    } else {
      infoDiv.innerHTML = '';
    }
  });
    