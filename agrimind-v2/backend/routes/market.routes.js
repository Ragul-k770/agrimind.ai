import express from 'express';

const router = express.Router();

router.get('/regions', (req, res) => {
  const regions = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat", "Bomdila"],
    "Assam": ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur"],
    "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia"],
    "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Raigarh"],
    "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
    "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Karnal"],
    "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Mandi", "Solan"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    "Maharashtra": ["Pune", "Mumbai", "Nashik", "Nagpur", "Aurangabad"],
    "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Ukhrul"],
    "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongpoh", "Baghmara"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
    "Sikkim": ["Gangtok", "Namchi", "Geyzing", "Mangan", "Singtam"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar", "Belonia"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Meerut"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
    "West Bengal": ["Kolkata", "Howrah", "Darjeeling", "Siliguri", "Asansol"],
    "Andaman and Nicobar": ["Port Blair", "Diglipur", "Mayabunder", "Rangat", "Ferrargunj"],
    "Chandigarh": ["Chandigarh"],
    "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa", "Amli"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"],
    "Jammu and Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Kathua"],
    "Ladakh": ["Leh", "Kargil"],
    "Lakshadweep": ["Kavaratti", "Agatti", "Amini", "Minicoy", "Andrott"],
    "Puducherry": ["Puducherry", "Oulgaret", "Karaikal", "Yanam", "Mahe"]
  };
  res.json(regions);
});

router.get('/', (req, res) => {
  try {
    const { state, district } = req.query;
    
    // Base prices for crops
    const basePrices = {
      'Wheat': 2200, 'Rice': 3500, 'Tomato': 1500, 'Onion': 2000, 
      'Potato': 1200, 'Cotton': 6000, 'Sugarcane': 300, 'Soybean': 4000,
      'Maize': 1800, 'Mustard': 5000, 'Groundnut': 5500
    };
    
    // Choose 5 random crops consistently for a given region using a simple hash
    const regionKey = `${state || 'all'}-${district || 'all'}`;
    let hash = 0;
    for (let i = 0; i < regionKey.length; i++) {
        hash = ((hash << 5) - hash) + regionKey.charCodeAt(i);
        hash |= 0;
    }
    
    const cropKeys = Object.keys(basePrices);
    const selectedCrops = [];
    for (let i = 0; i < 5; i++) {
        const index = Math.abs((hash + i) % cropKeys.length);
        selectedCrops.push(cropKeys[index]);
    }

    // Dynamic but stable randomness based on time (changes every hour) and region
    const timeFactor = Math.floor(Date.now() / 3600000); 
    
    const trends = selectedCrops.map((crop, index) => {
      const randValue = Math.sin(hash + index + timeFactor) * 100;
      const percentage = parseFloat(Math.abs(randValue % 15).toFixed(1));
      
      let trend = 'stable';
      if (randValue > 5) trend = 'up';
      else if (randValue < -5) trend = 'down';
      
      let currentPrice = basePrices[crop];
      if (trend === 'up') currentPrice += (currentPrice * percentage / 100);
      else if (trend === 'down') currentPrice -= (currentPrice * percentage / 100);
      
      return {
        crop,
        currentPrice: Math.round(currentPrice),
        trend,
        percentage: trend === 'stable' ? 0.0 : percentage
      };
    });

    res.json(trends);
  } catch (error) {
    console.error("Market Error:", error);
    res.status(500).json({ error: "Failed to fetch market trends." });
  }
});

export default router;
