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
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+1", country: "Canada", flag: "🇨🇦" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+36", country: "Hungary", flag: "🇭🇺" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+40", country: "Romania", flag: "🇷🇴" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+53", country: "Cuba", flag: "🇨🇺" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+95", country: "Myanmar", flag: "🇲🇲" },
  { code: "+98", country: "Iran", flag: "🇮🇷" },
  { code: "+212", country: "Morocco", flag: "🇲🇦" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+216", country: "Tunisia", flag: "🇹🇳" },
  { code: "+218", country: "Libya", flag: "🇱🇾" },
  { code: "+220", country: "Gambia", flag: "🇬🇲" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+222", country: "Mauritania", flag: "🇲🇷" },
  { code: "+223", country: "Mali", flag: "🇲🇱" },
  { code: "+224", country: "Guinea", flag: "🇬🇳" },
  { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
  { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
  { code: "+227", country: "Niger", flag: "🇳🇪" },
  { code: "+228", country: "Togo", flag: "🇹🇬" },
  { code: "+229", country: "Benin", flag: "🇧🇯" },
  { code: "+230", country: "Mauritius", flag: "🇲🇺" },
  { code: "+231", country: "Liberia", flag: "🇱🇷" },
  { code: "+232", country: "Sierra Leone", flag: "🇸🇱" },
  { code: "+233", country: "Ghana", flag: "🇬🇭" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+235", country: "Chad", flag: "🇹🇩" },
  { code: "+236", country: "Central African Republic", flag: "🇨🇫" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+238", country: "Cape Verde", flag: "🇨🇻" },
  { code: "+239", country: "São Tomé and Príncipe", flag: "🇸🇹" },
  { code: "+240", country: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "+241", country: "Gabon", flag: "🇬🇦" },
  { code: "+242", country: "Republic of the Congo", flag: "🇨🇬" },
  { code: "+243", country: "Democratic Republic of the Congo", flag: "🇨🇩" },
  { code: "+244", country: "Angola", flag: "🇦🇴" },
  { code: "+245", country: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "+246", country: "British Indian Ocean Territory", flag: "🇮🇴" },
  { code: "+248", country: "Seychelles", flag: "🇸🇨" },
  { code: "+249", country: "Sudan", flag: "🇸🇩" },
  { code: "+250", country: "Rwanda", flag: "🇷🇼" },
  { code: "+251", country: "Ethiopia", flag: "🇪🇹" },
  { code: "+252", country: "Somalia", flag: "🇸🇴" },
  { code: "+253", country: "Djibouti", flag: "🇩🇯" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+255", country: "Tanzania", flag: "🇹🇿" },
  { code: "+256", country: "Uganda", flag: "🇺🇬" },
  { code: "+257", country: "Burundi", flag: "🇧🇮" },
  { code: "+258", country: "Mozambique", flag: "🇲🇿" },
  { code: "+260", country: "Zambia", flag: "🇿🇲" },
  { code: "+261", country: "Madagascar", flag: "🇲🇬" },
  { code: "+262", country: "Réunion", flag: "🇷🇪" },
  { code: "+263", country: "Zimbabwe", flag: "🇿🇼" },
  { code: "+264", country: "Namibia", flag: "🇳🇦" },
  { code: "+265", country: "Malawi", flag: "🇲🇼" },
  { code: "+266", country: "Lesotho", flag: "🇱🇸" },
  { code: "+267", country: "Botswana", flag: "🇧🇼" },
  { code: "+268", country: "Eswatini", flag: "🇸🇿" },
  { code: "+269", country: "Comoros", flag: "🇰🇲" },
  { code: "+290", country: "Saint Helena", flag: "🇸🇭" },
  { code: "+291", country: "Eritrea", flag: "🇪🇷" },
  { code: "+297", country: "Aruba", flag: "🇦🇼" },
  { code: "+298", country: "Faroe Islands", flag: "🇫🇴" },
  { code: "+299", country: "Greenland", flag: "🇬🇱" },
  { code: "+350", country: "Gibraltar", flag: "🇬🇮" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+352", country: "Luxembourg", flag: "🇱🇺" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+354", country: "Iceland", flag: "🇮🇸" },
  { code: "+355", country: "Albania", flag: "🇦🇱" },
  { code: "+356", country: "Malta", flag: "🇲🇹" },
  { code: "+357", country: "Cyprus", flag: "🇨🇾" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+359", country: "Bulgaria", flag: "🇧🇬" },
  { code: "+370", country: "Lithuania", flag: "🇱🇹" },
  { code: "+371", country: "Latvia", flag: "🇱🇻" },
  { code: "+372", country: "Estonia", flag: "🇪🇪" },
  { code: "+373", country: "Moldova", flag: "🇲🇩" },
  { code: "+374", country: "Armenia", flag: "🇦🇲" },
  { code: "+375", country: "Belarus", flag: "🇧🇾" },
  { code: "+376", country: "Andorra", flag: "🇦🇩" },
  { code: "+377", country: "Monaco", flag: "🇲🇨" },
  { code: "+378", country: "San Marino", flag: "🇸🇲" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+381", country: "Serbia", flag: "🇷🇸" },
  { code: "+382", country: "Montenegro", flag: "🇲🇪" },
  { code: "+383", country: "Kosovo", flag: "🇽🇰" },
  { code: "+385", country: "Croatia", flag: "🇭🇷" },
  { code: "+386", country: "Slovenia", flag: "🇸🇮" },
  { code: "+387", country: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "+389", country: "North Macedonia", flag: "🇲🇰" },
  { code: "+420", country: "Czech Republic", flag: "🇨🇿" },
  { code: "+421", country: "Slovakia", flag: "🇸🇰" },
  { code: "+423", country: "Liechtenstein", flag: "🇱🇮" },
  { code: "+500", country: "Falkland Islands", flag: "🇫🇰" },
  { code: "+501", country: "Belize", flag: "🇧🇿" },
  { code: "+502", country: "Guatemala", flag: "🇬🇹" },
  { code: "+503", country: "El Salvador", flag: "🇸🇻" },
  { code: "+504", country: "Honduras", flag: "🇭🇳" },
  { code: "+505", country: "Nicaragua", flag: "🇳🇮" },
  { code: "+506", country: "Costa Rica", flag: "🇨🇷" },
  { code: "+507", country: "Panama", flag: "🇵🇦" },
  { code: "+508", country: "Saint Pierre and Miquelon", flag: "🇵🇲" },
  { code: "+509", country: "Haiti", flag: "🇭🇹" },
  { code: "+590", country: "Guadeloupe", flag: "🇬🇵" },
  { code: "+591", country: "Bolivia", flag: "🇧🇴" },
  { code: "+592", country: "Guyana", flag: "🇬🇾" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+594", country: "French Guiana", flag: "🇬🇫" },
  { code: "+595", country: "Paraguay", flag: "🇵🇾" },
  { code: "+596", country: "Martinique", flag: "🇲🇶" },
  { code: "+597", country: "Suriname", flag: "🇸🇷" },
  { code: "+598", country: "Uruguay", flag: "🇺🇾" },
  { code: "+599", country: "Netherlands Antilles", flag: "🇧🇶" },
  { code: "+670", country: "East Timor", flag: "🇹🇱" },
  { code: "+672", country: "Norfolk Island", flag: "🇳🇫" },
  { code: "+673", country: "Brunei", flag: "🇧🇳" },
  { code: "+674", country: "Nauru", flag: "🇳🇷" },
  { code: "+675", country: "Papua New Guinea", flag: "🇵🇬" },
  { code: "+676", country: "Tonga", flag: "🇹🇴" },
  { code: "+677", country: "Solomon Islands", flag: "🇸🇧" },
  { code: "+678", country: "Vanuatu", flag: "🇻🇺" },
  { code: "+679", country: "Fiji", flag: "🇫🇯" },
  { code: "+680", country: "Palau", flag: "🇵🇼" },
  { code: "+681", country: "Wallis and Futuna", flag: "🇼🇫" },
  { code: "+682", country: "Cook Islands", flag: "🇨🇰" },
  { code: "+683", country: "Niue", flag: "🇳🇺" },
  { code: "+684", country: "American Samoa", flag: "🇦🇸" },
  { code: "+685", country: "Samoa", flag: "🇼🇸" },
  { code: "+686", country: "Kiribati", flag: "🇰🇮" },
  { code: "+687", country: "New Caledonia", flag: "🇳🇨" },
  { code: "+688", country: "Tuvalu", flag: "🇹🇻" },
  { code: "+689", country: "French Polynesia", flag: "🇵🇫" },
  { code: "+690", country: "Tokelau", flag: "🇹🇰" },
  { code: "+691", country: "Micronesia", flag: "🇫🇲" },
  { code: "+692", country: "Marshall Islands", flag: "🇲🇭" },
  { code: "+850", country: "North Korea", flag: "🇰🇵" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+853", country: "Macau", flag: "🇲🇴" },
  { code: "+855", country: "Cambodia", flag: "🇰🇭" },
  { code: "+856", country: "Laos", flag: "🇱🇦" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+886", country: "Taiwan", flag: "🇹🇼" },
  { code: "+960", country: "Maldives", flag: "🇲🇻" },
  { code: "+961", country: "Lebanon", flag: "🇱🇧" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+963", country: "Syria", flag: "🇸🇾" },
  { code: "+964", country: "Iraq", flag: "🇮🇶" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+967", country: "Yemen", flag: "🇾🇪" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+970", country: "Palestine", flag: "🇵🇸" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+973", country: "Bahrain", flag: "🇧🇭" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+975", country: "Bhutan", flag: "🇧🇹" },
  { code: "+976", country: "Mongolia", flag: "🇲🇳" },
  { code: "+977", country: "Nepal", flag: "🇳🇵" },
  { code: "+992", country: "Tajikistan", flag: "🇹🇯" },
  { code: "+993", country: "Turkmenistan", flag: "🇹🇲" },
  { code: "+994", country: "Azerbaijan", flag: "🇦🇿" },
  { code: "+995", country: "Georgia", flag: "🇬🇪" },
  { code: "+996", country: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "+998", country: "Uzbekistan", flag: "🇺🇿" }
];

const COUNTRIES_DATA = {
  "United States": {
    states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"],
    cities: {
      "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento", "Oakland", "Fresno"],
      "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse", "Yonkers"],
      "Texas": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "El Paso"],
      "Florida": ["Miami", "Tampa", "Orlando", "Jacksonville", "St. Petersburg", "Tallahassee"]
    }
  },
  "Canada": {
    states: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"],
    cities: {
      "Ontario": ["Toronto", "Ottawa", "Hamilton", "London", "Windsor", "Kingston"],
      "Quebec": ["Montreal", "Quebec City", "Laval", "Gatineau", "Sherbrooke"],
      "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond"]
    }
  },
  "United Kingdom": {
    states: ["England", "Scotland", "Wales", "Northern Ireland"],
    cities: {
      "England": ["London", "Manchester", "Birmingham", "Liverpool", "Newcastle", "Brighton"],
      "Scotland": ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Stirling"],
      "Wales": ["Cardiff", "Swansea", "Newport", "Wrexham"],
      "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newry"]
    }
  },
  "Australia": {
    states: ["New South Wales", "Victoria", "Queensland", "Western Australia", "South Australia", "Tasmania", "Northern Territory", "Australian Capital Territory"],
    cities: {
      "New South Wales": ["Sydney", "Newcastle", "Wollongong", "Central Coast"],
      "Victoria": ["Melbourne", "Geelong", "Ballarat", "Bendigo"],
      "Queensland": ["Brisbane", "Gold Coast", "Townsville", "Cairns"]
    }
  },
  "Germany": {
    states: ["Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia"],
    cities: {
      "Bavaria": ["Munich", "Nuremberg", "Augsburg", "Würzburg"],
      "North Rhine-Westphalia": ["Cologne", "Düsseldorf", "Dortmund", "Essen"],
      "Berlin": ["Berlin"]
    }
  },
  "France": {
    states: ["Auvergne-Rhône-Alpes", "Bourgogne-Franche-Comté", "Brittany", "Centre-Val de Loire", "Corsica", "Grand Est", "Hauts-de-France", "Île-de-France", "Normandy", "Nouvelle-Aquitaine", "Occitania", "Pays de la Loire", "Provence-Alpes-Côte d'Azur"],
    cities: {
      "Île-de-France": ["Paris", "Boulogne-Billancourt", "Saint-Denis", "Argenteuil"],
      "Provence-Alpes-Côte d'Azur": ["Marseille", "Nice", "Toulon", "Cannes"]
    }
  },
  "Japan": {
    states: ["Hokkaido", "Aomori", "Iwate", "Miyagi", "Akita", "Yamagata", "Fukushima", "Ibaraki", "Tochigi", "Gunma", "Saitama", "Chiba", "Tokyo", "Kanagawa", "Niigata", "Toyama", "Ishikawa", "Fukui", "Yamanashi", "Nagano", "Gifu", "Shizuoka", "Aichi", "Mie", "Shiga", "Kyoto", "Osaka", "Hyogo", "Nara", "Wakayama", "Tottori", "Shimane", "Okayama", "Hiroshima", "Yamaguchi", "Tokushima", "Kagawa", "Ehime", "Kochi", "Fukuoka", "Saga", "Nagasaki", "Kumamoto", "Oita", "Miyazaki", "Kagoshima", "Okinawa"],
    cities: {
      "Tokyo": ["Tokyo", "Shibuya", "Shinjuku", "Harajuku"],
      "Osaka": ["Osaka", "Sakai", "Higashiosaka"],
      "Kanagawa": ["Yokohama", "Kawasaki", "Sagamihara"]
    }
  },
  "China": {
    states: ["Beijing", "Tianjin", "Hebei", "Shanxi", "Inner Mongolia", "Liaoning", "Jilin", "Heilongjiang", "Shanghai", "Jiangsu", "Zhejiang", "Anhui", "Fujian", "Jiangxi", "Shandong", "Henan", "Hubei", "Hunan", "Guangdong", "Guangxi", "Hainan", "Chongqing", "Sichuan", "Guizhou", "Yunnan", "Tibet", "Shaanxi", "Gansu", "Qinghai", "Ningxia", "Xinjiang"],
    cities: {
      "Beijing": ["Beijing"],
      "Shanghai": ["Shanghai"],
      "Guangdong": ["Guangzhou", "Shenzhen", "Dongguan", "Foshan"]
    }
  },
  "Hong Kong": {
    states: ["Hong Kong Island", "Kowloon", "New Territories"],
    cities: {
      "Hong Kong Island": ["Central", "Wan Chai", "Causeway Bay", "Aberdeen"],
      "Kowloon": ["Tsim Sha Tsui", "Mong Kok", "Yau Ma Tei"],
      "New Territories": ["Sha Tin", "Tai Po", "Tsuen Wan", "Tuen Mun"]
    }
  },
  "Singapore": {
    states: ["Central Region", "East Region", "North Region", "North-East Region", "West Region"],
    cities: {
      "Central Region": ["Singapore City", "Orchard", "Marina Bay"],
      "East Region": ["Bedok", "Tampines", "Pasir Ris"],
      "West Region": ["Jurong", "Clementi", "Bukit Batok"]
    }
  }
};

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
                        {COUNTRY_CODES.map((country, index) => (
                          <SelectItem key={`${country.code}-${index}`} value={country.code}>
                            {country.flag} {country.code} ({country.country})
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
                      {COUNTRIES_DATA[addressData.country as keyof typeof COUNTRIES_DATA]?.cities?.[addressData.state] ? (
                        <Select 
                          value={addressData.city} 
                          onValueChange={(value) => setAddressData({...addressData, city: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES_DATA[addressData.country as keyof typeof COUNTRIES_DATA].cities[addressData.state].map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="city"
                          value={addressData.city}
                          onChange={(e) => setAddressData({...addressData, city: e.target.value})}
                          placeholder="City"
                        />
                      )}
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-xs text-gray-600">State/Province</Label>
                      {COUNTRIES_DATA[addressData.country as keyof typeof COUNTRIES_DATA]?.states ? (
                        <Select 
                          value={addressData.state} 
                          onValueChange={(value) => setAddressData({...addressData, state: value, city: ""})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select state/province" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES_DATA[addressData.country as keyof typeof COUNTRIES_DATA].states.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id="state"
                          value={addressData.state}
                          onChange={(e) => setAddressData({...addressData, state: e.target.value})}
                          placeholder="State/Province"
                        />
                      )}
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
                          {Object.keys(COUNTRIES_DATA).map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                          <SelectItem value="Other">Other</SelectItem>
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