import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Camera, Save, Phone, MapPin, Mail, Edit2, Globe, Building, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  id?: number;
  email?: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  bio: string;
  profilePhoto?: string;
  // Business-specific fields
  businessName?: string;
  businessType?: string;
  website?: string;
  jobTitle?: string;
  company?: string;
  industry?: string;
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

// Major countries with phone codes
const MAJOR_COUNTRIES = [
  { code: "+1", country: "United States", flag: "🇺🇸", id: "us" },
  { code: "+1", country: "Canada", flag: "🇨🇦", id: "ca" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧", id: "uk" },
  { code: "+61", country: "Australia", flag: "🇦🇺", id: "au" },
  { code: "+49", country: "Germany", flag: "🇩🇪", id: "de" },
  { code: "+33", country: "France", flag: "🇫🇷", id: "fr" },
  { code: "+81", country: "Japan", flag: "🇯🇵", id: "jp" },
  { code: "+86", country: "China", flag: "🇨🇳", id: "cn" },
  { code: "+91", country: "India", flag: "🇮🇳", id: "in" },
  { code: "+55", country: "Brazil", flag: "🇧🇷", id: "br" },
];

// Other countries alphabetically (truncated for brevity)
const OTHER_COUNTRIES = [
  { code: "+93", country: "Afghanistan", flag: "🇦🇫", id: "af" },
  { code: "+355", country: "Albania", flag: "🇦🇱", id: "al" },
  { code: "+213", country: "Algeria", flag: "🇩🇿", id: "dz" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰", id: "hk" },
  { code: "+65", country: "Singapore", flag: "🇸🇬", id: "sg" },
  { code: "+82", country: "South Korea", flag: "🇰🇷", id: "kr" },
  { code: "+66", country: "Thailand", flag: "🇹🇭", id: "th" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳", id: "vn" },
];

const ALL_COUNTRIES = [...MAJOR_COUNTRIES, ...OTHER_COUNTRIES];

const COUNTRIES_LIST = [
  "United States", "Canada", "United Kingdom", "Australia", "Germany", "France",
  "Japan", "China", "India", "Brazil", "Afghanistan", "Albania", "Algeria",
  "Hong Kong", "Singapore", "South Korea", "Thailand", "Vietnam"
];

const BUSINESS_TYPES = [
  "Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing",
  "Consulting", "Marketing", "Real Estate", "Food & Beverage", "Entertainment",
  "Non-Profit", "Government", "Other"
];

const INDUSTRIES = [
  "Software Development", "E-commerce", "Digital Marketing", "Health & Wellness",
  "Financial Services", "Education Technology", "Real Estate", "Food Service",
  "Professional Services", "Manufacturing", "Media & Entertainment", "Other"
];

interface ProfileModuleProps {
  initialData?: Partial<ProfileData>;
  mode?: 'personal' | 'business';
  onSave: (data: ProfileData) => Promise<void>;
  isLoading?: boolean;
  showEmailField?: boolean;
  title?: string;
  description?: string;
}

export default function ProfileModule({
  initialData = {},
  mode = 'personal',
  onSave,
  isLoading = false,
  showEmailField = true,
  title,
  description
}: ProfileModuleProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<ProfileData>({
    firstName: initialData.firstName || '',
    lastName: initialData.lastName || '',
    bio: initialData.bio || '',
    businessName: initialData.businessName || '',
    businessType: initialData.businessType || '',
    website: initialData.website || '',
    jobTitle: initialData.jobTitle || '',
    company: initialData.company || '',
    industry: initialData.industry || '',
    ...initialData
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData.profilePhoto || "");
  
  // Structured phone data
  const [phoneData, setPhoneData] = useState<PhoneData>(() => {
    if (initialData.phone) {
      return parsePhoneNumber(initialData.phone);
    }
    return { countryCode: "+1", areaCode: "", number: "" };
  });
  
  // Structured address data
  const [addressData, setAddressData] = useState<AddressData>(() => {
    if (initialData.address) {
      return parseAddress(initialData.address);
    }
    return { street: "", city: "", state: "", postalCode: "", country: "United States" };
  });

  // Parse phone number from stored format
  function parsePhoneNumber(phone: string): PhoneData {
    if (!phone) return { countryCode: "+1", areaCode: "", number: "" };
    
    const match = phone.match(/^(\+\d{1,4})\s*[\(\-\s]*(\d{3})\s*[\)\-\s]*(\d{3})\s*[\-\s]*(\d{4})$/);
    if (match) {
      return {
        countryCode: match[1],
        areaCode: match[2],
        number: `${match[3]}-${match[4]}`
      };
    }
    
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
  }

  // Parse address from stored format
  function parseAddress(address: string): AddressData {
    if (!address) return { street: "", city: "", state: "", postalCode: "", country: "United States" };
    
    const parts = address.split(',').map(part => part.trim());
    if (parts.length >= 3) {
      const street = parts[0];
      const city = parts[1];
      const stateZip = parts[2];
      const country = parts[3] || "United States";
      
      const stateZipMatch = stateZip.match(/^(.+?)\s+(\d+[\w\-\s]*)$/);
      const state = stateZipMatch ? stateZipMatch[1] : stateZip;
      const postalCode = stateZipMatch ? stateZipMatch[2] : "";
      
      return { street, city, state, postalCode, country };
    }
    
    return { street: address, city: "", state: "", postalCode: "", country: "United States" };
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
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
    
    const submitData: ProfileData = {
      ...formData,
      phone: formatPhoneNumber(phoneData),
      address: formatAddress(addressData)
    };
    
    try {
      await onSave(submitData);
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const getInitials = () => {
    const first = formData.firstName || 'U';
    const last = formData.lastName || 'U';
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  const defaultTitle = mode === 'business' ? 'Business Profile' : 'Personal Profile';
  const defaultDescription = mode === 'business' 
    ? 'Manage your business information and professional details' 
    : 'Manage your personal information and contact details';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title || defaultTitle}</CardTitle>
          <CardDescription>{description || defaultDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={previewUrl} alt="Profile" />
                <AvatarFallback className="text-lg font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <Camera className="h-4 w-4" />
                  <span>Change Photo</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs text-gray-500">
                  JPG, PNG or GIF (max 5MB)
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
            </div>

            {/* Email (if enabled) */}
            {showEmailField && (
              <div>
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Address</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ''}
                  className="bg-white border-gray-300"
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email address cannot be changed for security reasons
                </p>
              </div>
            )}

            {/* Business-specific fields */}
            {mode === 'business' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName" className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>Business Name</span>
                    </Label>
                    <Input
                      id="businessName"
                      value={formData.businessName || ''}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Enter business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select 
                      value={formData.businessType || ''} 
                      onValueChange={(value) => handleInputChange('businessType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUSINESS_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jobTitle" className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Job Title</span>
                    </Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle || ''}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      placeholder="Enter job title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select 
                      value={formData.industry || ''} 
                      onValueChange={(value) => handleInputChange('industry', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="website" className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>Website</span>
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}

            {/* Phone Number */}
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
                      {ALL_COUNTRIES.map((country) => (
                        <SelectItem key={country.id} value={country.code}>
                          {country.flag} {country.code} {country.country}
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

            {/* Address */}
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
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-xs text-gray-600">State/Province</Label>
                    <Input
                      id="state"
                      value={addressData.state}
                      onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                      placeholder="State/Province"
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
                      onValueChange={(value) => setAddressData({...addressData, country: value, state: "", city: ""})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES_LIST.map((country) => (
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

            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="flex items-center space-x-2">
                <Edit2 className="h-4 w-4" />
                <span>{mode === 'business' ? 'Business Description' : 'Bio'}</span>
              </Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder={mode === 'business' ? 'Describe your business...' : 'Tell us about yourself...'}
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isLoading ? 'Saving...' : 'Save Profile'}</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}