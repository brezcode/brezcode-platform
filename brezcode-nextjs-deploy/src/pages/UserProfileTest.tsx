import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TopNavigation from "@/components/TopNavigation";

// Simple test countries
const testCountries = [
  "United States",
  "Canada", 
  "United Kingdom",
  "Australia",
  "Germany"
];

const testCountryCodes = [
  { id: "us", display: "+1 (United States)" },
  { id: "ca", display: "+1 (Canada)" },
  { id: "uk", display: "+44 (United Kingdom)" },
  { id: "au", display: "+61 (Australia)" },
  { id: "de", display: "+49 (Germany)" }
];

export default function UserProfileTest() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <TopNavigation />
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Profile Dropdown Test</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Dropdowns</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            
            {/* Country Dropdown Test */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <select 
                value={selectedCountry} 
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="">Select a country</option>
                {testCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600">Selected: {selectedCountry || "None"}</p>
            </div>

            {/* Country Code Dropdown Test */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Country Code</label>
              <select 
                value={selectedCountryCode} 
                onChange={(e) => setSelectedCountryCode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="">Select a code</option>
                {testCountryCodes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.display}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600">Selected: {selectedCountryCode || "None"}</p>
            </div>
            
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={() => {
              alert(`Country: ${selectedCountry}\nCountry Code: ${selectedCountryCode}`);
            }}
          >
            Test Values
          </Button>
        </div>
      </div>
    </div>
  );
}