import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Camera, Save, ArrowLeft, Phone, MapPin, Mail, Edit2, Globe } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TopNavigation from "@/components/TopNavigation";

interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  bio?: string;
  profilePhoto?: string;
  createdAt?: string;
}

interface PhoneData {
  countryCode: string;
  areaCode: string;
  number: string;
}

interface AddressData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const COUNTRY_CODES = [
  { code: "+1", country: "US/Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+91", country: "India", flag: "🇮🇳" },
];

const COUNTRIES = [
  "United States", "Canada", "United Kingdom", "Australia", "France", "Germany", 
  "Japan", "China", "Hong Kong", "Singapore", "India", "Other"
];

export default function ProfileEditor() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  // Structured phone data
  const [phoneData, setPhoneData] = useState<PhoneData>({
    countryCode: "+1",
    areaCode: "",
    number: ""
  });
  
  // Structured address data
  const [addressData, setAddressData] = useState<AddressData>({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States"
  });

  // Fetch current user data
  const { data: currentUser, isLoading } = useQuery({
    queryKey: ['/api/me'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/me');
      const data = await response.json();
      return data.user as UserProfile;
    }
  });

  // Parse phone number from stored format
  const parsePhoneNumber = (phone: string): PhoneData => {
    if (!phone) return { countryCode: "+1", areaCode: "", number: "" };
    
    // Try to parse format like "+1 (555) 123-4567" or "+1-555-123-4567"
    const match = phone.match(/^(\+\d{1,4})\s*[\(\-\s]*(\d{3})\s*[\)\-\s]*(\d{3})\s*[\-\s]*(\d{4})$/);
    if (match) {
      return {
        countryCode: match[1],
        areaCode: match[2],
        number: `${match[3]}-${match[4]}`
      };
    }
    
    // Fallback for other formats
    const codeMatch = phone.match(/^(\+\d{1,4})/);
    const countryCode = codeMatch ? codeMatch[1] : "+1";
    const remaining = phone.replace(countryCode, '').replace(/\D/g, '');
    
    if (remaining.length >= 7) {
      return {
        countryCode,
        areaCode: remaining.slice(0, 3),
        number: `${remaining.slice(3, 6)}-${remaining.slice(6)}`
      };
    }
    
    return { countryCode, areaCode: "", number: remaining };
  };

  // Parse address from stored format
  const parseAddress = (address: string): AddressData => {
    if (!address) return { street: "", city: "", state: "", postalCode: "", country: "United States" };
    
    // Try to parse format like "123 Main St, City, State 12345, Country"
    const parts = address.split(',').map(part => part.trim());
    if (parts.length >= 3) {
      const street = parts[0];
      const city = parts[1];
      const stateZip = parts[2];
      const country = parts[3] || "United States";
      
      // Extract state and postal code
      const stateZipMatch = stateZip.match(/^(.+?)\s+(\d+[\w\-\s]*)$/);
      const state = stateZipMatch ? stateZipMatch[1] : stateZip;
      const postalCode = stateZipMatch ? stateZipMatch[2] : "";
      
      return { street, city, state, postalCode, country };
    }
    
    return { street: address, city: "", state: "", postalCode: "", country: "United States" };
  };

  // Set form data when user data loads
  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        bio: currentUser.bio || ''
      });
      
      // Parse and set phone data
      if (currentUser.phone) {
        setPhoneData(parsePhoneNumber(currentUser.phone));
      }
      
      // Parse and set address data
      if (currentUser.address) {
        setAddressData(parseAddress(currentUser.address));
      }
      
      if (currentUser.profilePhoto) {
        setPreviewUrl(currentUser.profilePhoto);
      }
    }
  }, [currentUser]);

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const response = await apiRequest('POST', '/api/profile/update', profileData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const formatPhoneNumber = (data: PhoneData): string => {
    if (!data.areaCode || !data.number) return '';
    return `${data.countryCode} (${data.areaCode}) ${data.number}`;
  };

  const formatAddress = (data: AddressData): string => {
    const parts = [data.street, data.city, `${data.state} ${data.postalCode}`.trim(), data.country]
      .filter(part => part && part.trim() !== '');
    return parts.join(', ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      phone: formatPhoneNumber(phoneData),
      address: formatAddress(addressData)
    };
    
    updateProfileMutation.mutate(submitData);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <TopNavigation />
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <TopNavigation />
      
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLocation('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Edit Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Update your personal information and profile photo
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Photo Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Profile Photo</span>
              </CardTitle>
              <CardDescription>
                Upload a profile photo to personalize your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    {previewUrl ? (
                      <AvatarImage src={previewUrl} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                        {currentUser ? 
                          `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}` : 
                          'U'
                        }
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2">
                    <Button 
                      type="button"
                      size="sm" 
                      className="rounded-full h-8 w-8 p-0"
                      onClick={triggerFileInput}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={triggerFileInput}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                  {selectedFile && (
                    <Badge variant="secondary" className="mt-2">
                      {selectedFile.name}
                    </Badge>
                  )}
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>
                Update your basic personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={currentUser?.email || ''}
                  className="bg-white border-gray-300"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email address cannot be changed for security reasons
                </p>
              </div>

              <div>
                <Label className="flex items-center space-x-2 mb-3">
                  <Phone className="h-4 w-4" />
                  <span>Phone Number</span>
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="countryCode" className="text-xs text-gray-600">Country Code</Label>
                    <Select 
                      value={phoneData.countryCode} 
                      onValueChange={(value) => setPhoneData({...phoneData, countryCode: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRY_CODES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.flag} {country.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="areaCode" className="text-xs text-gray-600">Area Code</Label>
                    <Input
                      id="areaCode"
                      type="tel"
                      value={phoneData.areaCode}
                      onChange={(e) => setPhoneData({...phoneData, areaCode: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                      placeholder="555"
                      maxLength={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber" className="text-xs text-gray-600">Phone Number</Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      value={phoneData.number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const formatted = value.length > 3 ? `${value.slice(0, 3)}-${value.slice(3, 7)}` : value;
                        setPhoneData({...phoneData, number: formatted});
                      }}
                      placeholder="123-4567"
                      maxLength={8}
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Format: {phoneData.countryCode} ({phoneData.areaCode}) {phoneData.number}
                </p>
              </div>

              <div>
                <Label className="flex items-center space-x-2 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>Address</span>
                </Label>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="street" className="text-xs text-gray-600">Street Address</Label>
                    <Input
                      id="street"
                      value={addressData.street}
                      onChange={(e) => setAddressData({...addressData, street: e.target.value})}
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="city" className="text-xs text-gray-600">City</Label>
                      <Input
                        id="city"
                        value={addressData.city}
                        onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                        placeholder="San Francisco"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-xs text-gray-600">State/Province</Label>
                      <Input
                        id="state"
                        value={addressData.state}
                        onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                        placeholder="CA"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="postalCode" className="text-xs text-gray-600">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={addressData.postalCode}
                        onChange={(e) => setAddressData({...addressData, postalCode: e.target.value})}
                        placeholder="94105"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="text-xs text-gray-600">Country</Label>
                      <Select 
                        value={addressData.country} 
                        onValueChange={(value) => setAddressData({...addressData, country: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Full address: {formatAddress(addressData) || "Complete all fields above"}
                </p>
              </div>

              <div>
                <Label htmlFor="bio" className="flex items-center space-x-2">
                  <Edit2 className="h-4 w-4" />
                  <span>Bio</span>
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          {currentUser && (
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and membership information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Member Since</span>
                    <span className="text-sm text-gray-600">
                      {currentUser.createdAt ? 
                        new Date(currentUser.createdAt).toLocaleDateString() : 
                        'Recently joined'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Account Status</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setLocation('/dashboard')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}