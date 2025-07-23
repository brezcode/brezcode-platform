import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Camera, MapPin, Phone, Save } from "lucide-react";
import TopNavigation from "@/components/TopNavigation";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  profilePhoto: z.string().optional(),
  
  // Address fields
  streetAddress: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  
  // Phone number with country code
  countryCode: z.string().min(1, "Country code is required"),
  areaCode: z.string().min(1, "Area code is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Countries list in alphabetical order
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

// Country codes with country names - using unique keys
const countryCodes = [
  { country: "United States", code: "+1", id: "us" },
  { country: "Canada", code: "+1", id: "ca" },
  { country: "United Kingdom", code: "+44", id: "uk" },
  { country: "Australia", code: "+61", id: "au" },
  { country: "Germany", code: "+49", id: "de" },
  { country: "France", code: "+33", id: "fr" },
  { country: "Italy", code: "+39", id: "it" },
  { country: "Spain", code: "+34", id: "es" },
  { country: "Netherlands", code: "+31", id: "nl" },
  { country: "Belgium", code: "+32", id: "be" },
  { country: "Switzerland", code: "+41", id: "ch" },
  { country: "Austria", code: "+43", id: "at" },
  { country: "Sweden", code: "+46", id: "se" },
  { country: "Norway", code: "+47", id: "no" },
  { country: "Denmark", code: "+45", id: "dk" },
  { country: "Finland", code: "+358", id: "fi" },
  { country: "Ireland", code: "+353", id: "ie" },
  { country: "Poland", code: "+48", id: "pl" },
  { country: "Czech Republic", code: "+420", id: "cz" },
  { country: "Hungary", code: "+36", id: "hu" },
  { country: "Greece", code: "+30", id: "gr" },
  { country: "Portugal", code: "+351", id: "pt" },
  { country: "Russia", code: "+7", id: "ru" },
  { country: "Ukraine", code: "+380", id: "ua" },
  { country: "Japan", code: "+81", id: "jp" },
  { country: "South Korea", code: "+82", id: "kr" },
  { country: "China", code: "+86", id: "cn" },
  { country: "India", code: "+91", id: "in" },
  { country: "Singapore", code: "+65", id: "sg" },
  { country: "Malaysia", code: "+60", id: "my" },
  { country: "Thailand", code: "+66", id: "th" },
  { country: "Philippines", code: "+63", id: "ph" },
  { country: "Indonesia", code: "+62", id: "id" },
  { country: "Vietnam", code: "+84", id: "vn" },
  { country: "New Zealand", code: "+64", id: "nz" },
  { country: "Brazil", code: "+55", id: "br" },
  { country: "Argentina", code: "+54", id: "ar" },
  { country: "Chile", code: "+56", id: "cl" },
  { country: "Mexico", code: "+52", id: "mx" },
  { country: "South Africa", code: "+27", id: "za" },
  { country: "Egypt", code: "+20", id: "eg" },
  { country: "Israel", code: "+972", id: "il" },
  { country: "United Arab Emirates", code: "+971", id: "ae" },
  { country: "Saudi Arabia", code: "+966", id: "sa" },
  { country: "Turkey", code: "+90", id: "tr" }
].sort((a, b) => a.country.localeCompare(b.country));

export default function UserProfile() {
  const { toast } = useToast();
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/user/profile"],
  });

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: (data: ProfileFormData) => apiRequest("POST", "/api/user/profile", data),
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    },
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      profilePhoto: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      countryCode: "+1",
      areaCode: "",
      phoneNumber: "",
    },
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        profilePhoto: profile.profilePhoto || "",
        streetAddress: profile.streetAddress || "",
        city: profile.city || "",
        state: profile.state || "",
        postalCode: profile.postalCode || "",
        country: profile.country || "",
        countryCode: profile.countryCode || "+1",
        areaCode: profile.areaCode || "",
        phoneNumber: profile.phoneNumber || "",
      });
      setProfilePhoto(profile.profilePhoto || "");
    }
  }, [profile, form]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setProfilePhoto(base64);
        form.setValue("profilePhoto", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    saveProfile({ ...data, profilePhoto });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <TopNavigation />
        <div className="container mx-auto py-8 px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <TopNavigation />
      
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Edit Personal Profile</h1>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Profile Photo Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-blue-600" />
                  <span>Profile Photo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all" onClick={() => fileInputRef.current?.click()}>
                  {profilePhoto ? (
                    <AvatarImage src={profilePhoto} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                      {form.getValues("firstName")?.[0] || ""}{form.getValues("lastName")?.[0] || ""}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Upload Photo</span>
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>Address</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your state or province" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your postal code" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Phone Number */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>Phone Number</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="countryCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country Code</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countryCodes.map((item) => (
                            <SelectItem key={item.id} value={item.code}>
                              {item.code} ({item.country})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="areaCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Area code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                type="submit"
                disabled={isPending}
                className="flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isPending ? "Saving..." : "Save Profile"}</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}