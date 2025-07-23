import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Camera, Edit2, Check, X } from "lucide-react";
import TopNavigation from "@/components/TopNavigation";

// Inline Edit Component
function InlineEditField({ label, value, placeholder, onSave }: {
  label: string;
  value: string;
  placeholder: string;
  onSave: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleSave = () => {
    onSave(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {isEditing ? (
        <div className="flex items-center space-x-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
            autoFocus
            onKeyDown={handleKeyDown}
          />
          <Button size="sm" onClick={handleSave} className="px-2">
            <Check className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel} className="px-2">
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div 
          className="flex items-center justify-between p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors group"
          onClick={() => setIsEditing(true)}
        >
          <span className={value ? "text-gray-900" : "text-gray-400"}>
            {value || placeholder}
          </span>
          <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
}

export default function UserProfile() {
  const { toast } = useToast();
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ["/api/user/profile"],
  });

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/user/profile", data),
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

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        setProfilePhoto(base64);
        saveProfile({ profilePhoto: base64 });
      };
      reader.readAsDataURL(file);
    }
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
            <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          </div>
        </div>

        {/* Profile Overview with Inline Editing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile Information</CardTitle>
            <p className="text-gray-600">Click any field to edit. Changes save automatically.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Photo Section */}
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <Avatar className="h-20 w-20 cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all" onClick={() => fileInputRef.current?.click()}>
                  {profilePhoto || profile?.profilePhoto ? (
                    <AvatarImage src={profilePhoto || profile?.profilePhoto} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
                      {profile?.firstName?.[0] || ""}{profile?.lastName?.[0] || ""}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {profile?.firstName || 'First'} {profile?.lastName || 'Last'}
                </h3>
                <p className="text-gray-600">{profile?.email}</p>
              </div>
            </div>

            {/* Inline Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* First Name */}
              <InlineEditField
                label="First Name"
                value={profile?.firstName || ''}
                placeholder="Enter first name"
                onSave={(value) => saveProfile({ firstName: value })}
              />

              {/* Last Name */}
              <InlineEditField
                label="Last Name"
                value={profile?.lastName || ''}
                placeholder="Enter last name"
                onSave={(value) => saveProfile({ lastName: value })}
              />

              {/* Street Address */}
              <InlineEditField
                label="Street Address"
                value={profile?.streetAddress || ''}
                placeholder="Enter street address"
                onSave={(value) => saveProfile({ streetAddress: value })}
              />

              {/* City */}
              <InlineEditField
                label="City"
                value={profile?.city || ''}
                placeholder="Enter city"
                onSave={(value) => saveProfile({ city: value })}
              />

              {/* State */}
              <InlineEditField
                label="State/Province"
                value={profile?.state || ''}
                placeholder="Enter state or province"
                onSave={(value) => saveProfile({ state: value })}
              />

              {/* Postal Code */}
              <InlineEditField
                label="Postal Code"
                value={profile?.postalCode || ''}
                placeholder="Enter postal code"
                onSave={(value) => saveProfile({ postalCode: value })}
              />

              {/* Country */}
              <InlineEditField
                label="Country"
                value={profile?.country || ''}
                placeholder="Enter country"
                onSave={(value) => saveProfile({ country: value })}
              />

              {/* Phone Number */}
              <InlineEditField
                label="Phone Number"
                value={profile?.phoneNumber || ''}
                placeholder="Enter phone number"
                onSave={(value) => saveProfile({ phoneNumber: value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}