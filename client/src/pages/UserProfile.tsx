import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Select from "react-select";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Camera, MapPin, Phone, Save } from "lucide-react";
import TopNavigation from "@/components/TopNavigation";
import worldCountries from "world-countries";

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
  
  // Phone number in E.164 format
  phoneNumber: z.string().min(1, "Phone number is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Generate country options from world-countries library
const countryOptions = worldCountries
  .map(country => ({
    value: country.name.common,
    label: country.name.common,
    flag: country.flag
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

// Generate country code options from world-countries library
const countryCodeOptions = worldCountries
  .filter(country => country.idd?.root && country.idd?.suffixes)
  .map(country => {
    const root = country.idd.root;
    const suffix = country.idd.suffixes[0] || '';
    const code = root + suffix;
    return {
      value: country.cca2.toLowerCase(),
      label: `${country.flag} ${code} ${country.name.common}`,
      code: code,
      flag: country.flag
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label));

export default function UserProfile() {
  const { toast } = useToast();
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery<any>({
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
    // Convert country code ID back to actual code for storage
    const selectedCountryCode = countryCodeOptions.find(item => item.value === data.countryCode);
    const actualCountryCode = selectedCountryCode ? selectedCountryCode.code : "+1";
    
    saveProfile({ 
      ...data, 
      countryCode: actualCountryCode,
      profilePhoto 
    });
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
                        <FormControl>
                          <Select
                            options={countryOptions}
                            value={countryOptions.find(option => option.value === field.value)}
                            onChange={(selected) => field.onChange(selected?.value || "")}
                            placeholder="Select your country"
                            isSearchable
                            className="react-select-container"
                            classNamePrefix="react-select"
                            formatOptionLabel={(option) => (
                              <div className="flex items-center">
                                <span className="mr-2">{option.flag}</span>
                                {option.label}
                              </div>
                            )}
                          />
                        </FormControl>
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
              <CardContent>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="Enter phone number"
                          value={field.value}
                          onChange={field.onChange}
                          defaultCountry="US"
                          className="phone-input"
                        />
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