import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Mail, Phone, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SignupFlowProps {
  quizAnswers: Record<string, any>;
  onComplete: () => void;
}

interface CountryCode {
  code: string;
  country: string;
  dialCode: string;
}

const countryCodes: CountryCode[] = [
  { code: "AF", country: "Afghanistan", dialCode: "+93" },
  { code: "AL", country: "Albania", dialCode: "+355" },
  { code: "DZ", country: "Algeria", dialCode: "+213" },
  { code: "AS", country: "American Samoa", dialCode: "+1684" },
  { code: "AD", country: "Andorra", dialCode: "+376" },
  { code: "AO", country: "Angola", dialCode: "+244" },
  { code: "AI", country: "Anguilla", dialCode: "+1264" },
  { code: "AG", country: "Antigua and Barbuda", dialCode: "+1268" },
  { code: "AR", country: "Argentina", dialCode: "+54" },
  { code: "AM", country: "Armenia", dialCode: "+374" },
  { code: "AW", country: "Aruba", dialCode: "+297" },
  { code: "AU", country: "Australia", dialCode: "+61" },
  { code: "AT", country: "Austria", dialCode: "+43" },
  { code: "AZ", country: "Azerbaijan", dialCode: "+994" },
  { code: "BS", country: "Bahamas", dialCode: "+1242" },
  { code: "BH", country: "Bahrain", dialCode: "+973" },
  { code: "BD", country: "Bangladesh", dialCode: "+880" },
  { code: "BB", country: "Barbados", dialCode: "+1246" },
  { code: "BY", country: "Belarus", dialCode: "+375" },
  { code: "BE", country: "Belgium", dialCode: "+32" },
  { code: "BZ", country: "Belize", dialCode: "+501" },
  { code: "BJ", country: "Benin", dialCode: "+229" },
  { code: "BM", country: "Bermuda", dialCode: "+1441" },
  { code: "BT", country: "Bhutan", dialCode: "+975" },
  { code: "BO", country: "Bolivia", dialCode: "+591" },
  { code: "BA", country: "Bosnia and Herzegovina", dialCode: "+387" },
  { code: "BW", country: "Botswana", dialCode: "+267" },
  { code: "BR", country: "Brazil", dialCode: "+55" },
  { code: "BN", country: "Brunei", dialCode: "+673" },
  { code: "BG", country: "Bulgaria", dialCode: "+359" },
  { code: "BF", country: "Burkina Faso", dialCode: "+226" },
  { code: "BI", country: "Burundi", dialCode: "+257" },
  { code: "KH", country: "Cambodia", dialCode: "+855" },
  { code: "CM", country: "Cameroon", dialCode: "+237" },
  { code: "CA", country: "Canada", dialCode: "+1" },
  { code: "CV", country: "Cape Verde", dialCode: "+238" },
  { code: "KY", country: "Cayman Islands", dialCode: "+1345" },
  { code: "CF", country: "Central African Republic", dialCode: "+236" },
  { code: "TD", country: "Chad", dialCode: "+235" },
  { code: "CL", country: "Chile", dialCode: "+56" },
  { code: "CN", country: "China", dialCode: "+86" },
  { code: "CO", country: "Colombia", dialCode: "+57" },
  { code: "KM", country: "Comoros", dialCode: "+269" },
  { code: "CG", country: "Congo", dialCode: "+242" },
  { code: "CD", country: "Congo (Democratic Republic)", dialCode: "+243" },
  { code: "CK", country: "Cook Islands", dialCode: "+682" },
  { code: "CR", country: "Costa Rica", dialCode: "+506" },
  { code: "CI", country: "Côte d'Ivoire", dialCode: "+225" },
  { code: "HR", country: "Croatia", dialCode: "+385" },
  { code: "CU", country: "Cuba", dialCode: "+53" },
  { code: "CY", country: "Cyprus", dialCode: "+357" },
  { code: "CZ", country: "Czech Republic", dialCode: "+420" },
  { code: "DK", country: "Denmark", dialCode: "+45" },
  { code: "DJ", country: "Djibouti", dialCode: "+253" },
  { code: "DM", country: "Dominica", dialCode: "+1767" },
  { code: "DO", country: "Dominican Republic", dialCode: "+1809" },
  { code: "EC", country: "Ecuador", dialCode: "+593" },
  { code: "EG", country: "Egypt", dialCode: "+20" },
  { code: "SV", country: "El Salvador", dialCode: "+503" },
  { code: "GQ", country: "Equatorial Guinea", dialCode: "+240" },
  { code: "ER", country: "Eritrea", dialCode: "+291" },
  { code: "EE", country: "Estonia", dialCode: "+372" },
  { code: "ET", country: "Ethiopia", dialCode: "+251" },
  { code: "FJ", country: "Fiji", dialCode: "+679" },
  { code: "FI", country: "Finland", dialCode: "+358" },
  { code: "FR", country: "France", dialCode: "+33" },
  { code: "GF", country: "French Guiana", dialCode: "+594" },
  { code: "PF", country: "French Polynesia", dialCode: "+689" },
  { code: "GA", country: "Gabon", dialCode: "+241" },
  { code: "GM", country: "Gambia", dialCode: "+220" },
  { code: "GE", country: "Georgia", dialCode: "+995" },
  { code: "DE", country: "Germany", dialCode: "+49" },
  { code: "GH", country: "Ghana", dialCode: "+233" },
  { code: "GI", country: "Gibraltar", dialCode: "+350" },
  { code: "GR", country: "Greece", dialCode: "+30" },
  { code: "GL", country: "Greenland", dialCode: "+299" },
  { code: "GD", country: "Grenada", dialCode: "+1473" },
  { code: "GP", country: "Guadeloupe", dialCode: "+590" },
  { code: "GU", country: "Guam", dialCode: "+1671" },
  { code: "GT", country: "Guatemala", dialCode: "+502" },
  { code: "GN", country: "Guinea", dialCode: "+224" },
  { code: "GW", country: "Guinea-Bissau", dialCode: "+245" },
  { code: "GY", country: "Guyana", dialCode: "+592" },
  { code: "HT", country: "Haiti", dialCode: "+509" },
  { code: "HN", country: "Honduras", dialCode: "+504" },
  { code: "HK", country: "Hong Kong", dialCode: "+852" },
  { code: "HU", country: "Hungary", dialCode: "+36" },
  { code: "IS", country: "Iceland", dialCode: "+354" },
  { code: "IN", country: "India", dialCode: "+91" },
  { code: "ID", country: "Indonesia", dialCode: "+62" },
  { code: "IR", country: "Iran", dialCode: "+98" },
  { code: "IQ", country: "Iraq", dialCode: "+964" },
  { code: "IE", country: "Ireland", dialCode: "+353" },
  { code: "IL", country: "Israel", dialCode: "+972" },
  { code: "IT", country: "Italy", dialCode: "+39" },
  { code: "JM", country: "Jamaica", dialCode: "+1876" },
  { code: "JP", country: "Japan", dialCode: "+81" },
  { code: "JO", country: "Jordan", dialCode: "+962" },
  { code: "KZ", country: "Kazakhstan", dialCode: "+7" },
  { code: "KE", country: "Kenya", dialCode: "+254" },
  { code: "KI", country: "Kiribati", dialCode: "+686" },
  { code: "KP", country: "Korea (North)", dialCode: "+850" },
  { code: "KR", country: "Korea (South)", dialCode: "+82" },
  { code: "KW", country: "Kuwait", dialCode: "+965" },
  { code: "KG", country: "Kyrgyzstan", dialCode: "+996" },
  { code: "LA", country: "Laos", dialCode: "+856" },
  { code: "LV", country: "Latvia", dialCode: "+371" },
  { code: "LB", country: "Lebanon", dialCode: "+961" },
  { code: "LS", country: "Lesotho", dialCode: "+266" },
  { code: "LR", country: "Liberia", dialCode: "+231" },
  { code: "LY", country: "Libya", dialCode: "+218" },
  { code: "LI", country: "Liechtenstein", dialCode: "+423" },
  { code: "LT", country: "Lithuania", dialCode: "+370" },
  { code: "LU", country: "Luxembourg", dialCode: "+352" },
  { code: "MO", country: "Macao", dialCode: "+853" },
  { code: "MK", country: "Macedonia", dialCode: "+389" },
  { code: "MG", country: "Madagascar", dialCode: "+261" },
  { code: "MW", country: "Malawi", dialCode: "+265" },
  { code: "MY", country: "Malaysia", dialCode: "+60" },
  { code: "MV", country: "Maldives", dialCode: "+960" },
  { code: "ML", country: "Mali", dialCode: "+223" },
  { code: "MT", country: "Malta", dialCode: "+356" },
  { code: "MH", country: "Marshall Islands", dialCode: "+692" },
  { code: "MQ", country: "Martinique", dialCode: "+596" },
  { code: "MR", country: "Mauritania", dialCode: "+222" },
  { code: "MU", country: "Mauritius", dialCode: "+230" },
  { code: "MX", country: "Mexico", dialCode: "+52" },
  { code: "FM", country: "Micronesia", dialCode: "+691" },
  { code: "MD", country: "Moldova", dialCode: "+373" },
  { code: "MC", country: "Monaco", dialCode: "+377" },
  { code: "MN", country: "Mongolia", dialCode: "+976" },
  { code: "ME", country: "Montenegro", dialCode: "+382" },
  { code: "MS", country: "Montserrat", dialCode: "+1664" },
  { code: "MA", country: "Morocco", dialCode: "+212" },
  { code: "MZ", country: "Mozambique", dialCode: "+258" },
  { code: "MM", country: "Myanmar", dialCode: "+95" },
  { code: "NA", country: "Namibia", dialCode: "+264" },
  { code: "NR", country: "Nauru", dialCode: "+674" },
  { code: "NP", country: "Nepal", dialCode: "+977" },
  { code: "NL", country: "Netherlands", dialCode: "+31" },
  { code: "NC", country: "New Caledonia", dialCode: "+687" },
  { code: "NZ", country: "New Zealand", dialCode: "+64" },
  { code: "NI", country: "Nicaragua", dialCode: "+505" },
  { code: "NE", country: "Niger", dialCode: "+227" },
  { code: "NG", country: "Nigeria", dialCode: "+234" },
  { code: "NU", country: "Niue", dialCode: "+683" },
  { code: "NF", country: "Norfolk Island", dialCode: "+672" },
  { code: "MP", country: "Northern Mariana Islands", dialCode: "+1670" },
  { code: "NO", country: "Norway", dialCode: "+47" },
  { code: "OM", country: "Oman", dialCode: "+968" },
  { code: "PK", country: "Pakistan", dialCode: "+92" },
  { code: "PW", country: "Palau", dialCode: "+680" },
  { code: "PS", country: "Palestine", dialCode: "+970" },
  { code: "PA", country: "Panama", dialCode: "+507" },
  { code: "PG", country: "Papua New Guinea", dialCode: "+675" },
  { code: "PY", country: "Paraguay", dialCode: "+595" },
  { code: "PE", country: "Peru", dialCode: "+51" },
  { code: "PH", country: "Philippines", dialCode: "+63" },
  { code: "PL", country: "Poland", dialCode: "+48" },
  { code: "PT", country: "Portugal", dialCode: "+351" },
  { code: "PR", country: "Puerto Rico", dialCode: "+1787" },
  { code: "QA", country: "Qatar", dialCode: "+974" },
  { code: "RE", country: "Réunion", dialCode: "+262" },
  { code: "RO", country: "Romania", dialCode: "+40" },
  { code: "RU", country: "Russia", dialCode: "+7" },
  { code: "RW", country: "Rwanda", dialCode: "+250" },
  { code: "KN", country: "Saint Kitts and Nevis", dialCode: "+1869" },
  { code: "LC", country: "Saint Lucia", dialCode: "+1758" },
  { code: "VC", country: "Saint Vincent and the Grenadines", dialCode: "+1784" },
  { code: "WS", country: "Samoa", dialCode: "+685" },
  { code: "SM", country: "San Marino", dialCode: "+378" },
  { code: "ST", country: "São Tomé and Príncipe", dialCode: "+239" },
  { code: "SA", country: "Saudi Arabia", dialCode: "+966" },
  { code: "SN", country: "Senegal", dialCode: "+221" },
  { code: "RS", country: "Serbia", dialCode: "+381" },
  { code: "SC", country: "Seychelles", dialCode: "+248" },
  { code: "SL", country: "Sierra Leone", dialCode: "+232" },
  { code: "SG", country: "Singapore", dialCode: "+65" },
  { code: "SK", country: "Slovakia", dialCode: "+421" },
  { code: "SI", country: "Slovenia", dialCode: "+386" },
  { code: "SB", country: "Solomon Islands", dialCode: "+677" },
  { code: "SO", country: "Somalia", dialCode: "+252" },
  { code: "ZA", country: "South Africa", dialCode: "+27" },
  { code: "SS", country: "South Sudan", dialCode: "+211" },
  { code: "ES", country: "Spain", dialCode: "+34" },
  { code: "LK", country: "Sri Lanka", dialCode: "+94" },
  { code: "SD", country: "Sudan", dialCode: "+249" },
  { code: "SR", country: "Suriname", dialCode: "+597" },
  { code: "SZ", country: "Swaziland", dialCode: "+268" },
  { code: "SE", country: "Sweden", dialCode: "+46" },
  { code: "CH", country: "Switzerland", dialCode: "+41" },
  { code: "SY", country: "Syria", dialCode: "+963" },
  { code: "TW", country: "Taiwan", dialCode: "+886" },
  { code: "TJ", country: "Tajikistan", dialCode: "+992" },
  { code: "TZ", country: "Tanzania", dialCode: "+255" },
  { code: "TH", country: "Thailand", dialCode: "+66" },
  { code: "TL", country: "Timor-Leste", dialCode: "+670" },
  { code: "TG", country: "Togo", dialCode: "+228" },
  { code: "TK", country: "Tokelau", dialCode: "+690" },
  { code: "TO", country: "Tonga", dialCode: "+676" },
  { code: "TT", country: "Trinidad and Tobago", dialCode: "+1868" },
  { code: "TN", country: "Tunisia", dialCode: "+216" },
  { code: "TR", country: "Turkey", dialCode: "+90" },
  { code: "TM", country: "Turkmenistan", dialCode: "+993" },
  { code: "TC", country: "Turks and Caicos Islands", dialCode: "+1649" },
  { code: "TV", country: "Tuvalu", dialCode: "+688" },
  { code: "UG", country: "Uganda", dialCode: "+256" },
  { code: "UA", country: "Ukraine", dialCode: "+380" },
  { code: "AE", country: "United Arab Emirates", dialCode: "+971" },
  { code: "GB", country: "United Kingdom", dialCode: "+44" },
  { code: "US", country: "United States", dialCode: "+1" },
  { code: "UY", country: "Uruguay", dialCode: "+598" },
  { code: "UZ", country: "Uzbekistan", dialCode: "+998" },
  { code: "VU", country: "Vanuatu", dialCode: "+678" },
  { code: "VA", country: "Vatican City", dialCode: "+379" },
  { code: "VE", country: "Venezuela", dialCode: "+58" },
  { code: "VN", country: "Vietnam", dialCode: "+84" },
  { code: "VG", country: "Virgin Islands (British)", dialCode: "+1284" },
  { code: "VI", country: "Virgin Islands (U.S.)", dialCode: "+1340" },
  { code: "WF", country: "Wallis and Futuna", dialCode: "+681" },
  { code: "YE", country: "Yemen", dialCode: "+967" },
  { code: "ZM", country: "Zambia", dialCode: "+260" },
  { code: "ZW", country: "Zimbabwe", dialCode: "+263" },
];

export default function SignupFlow({ quizAnswers, onComplete }: SignupFlowProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  
  const { toast } = useToast();

  const sendEmailCodeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/send-email-verification", { email });
    },
    onSuccess: () => {
      toast({
        title: "Verification code sent",
        description: "Please check your email for the 6-digit verification code.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/verify-email", { email, code: emailCode });
    },
    onSuccess: () => {
      setIsEmailVerified(true);
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified.",
      });
    },
    onError: (error) => {
      toast({
        title: "Invalid code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sendPhoneCodeMutation = useMutation({
    mutationFn: async () => {
      const selectedCountryCode = countryCodes.find(c => c.code === selectedCountry);
      const fullPhone = `${selectedCountryCode?.dialCode}${phoneNumber}`;
      await apiRequest("POST", "/api/auth/send-phone-verification", { phone: fullPhone });
    },
    onSuccess: () => {
      toast({
        title: "SMS sent",
        description: "Please check your phone for the 6-digit verification code.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: async () => {
      const selectedCountryCode = countryCodes.find(c => c.code === selectedCountry);
      const fullPhone = `${selectedCountryCode?.dialCode}${phoneNumber}`;
      await apiRequest("POST", "/api/auth/verify-phone", { phone: fullPhone, code: phoneCode });
    },
    onSuccess: () => {
      setIsPhoneVerified(true);
      toast({
        title: "Phone verified",
        description: "Your phone number has been successfully verified.",
      });
    },
    onError: (error) => {
      toast({
        title: "Invalid code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async () => {
      const selectedCountryCode = countryCodes.find(c => c.code === selectedCountry);
      const fullPhone = `${selectedCountryCode?.dialCode}${phoneNumber}`;
      
      await apiRequest("POST", "/api/auth/signup", {
        email,
        password,
        phone: fullPhone,
        phoneCountryCode: selectedCountryCode?.dialCode,
        quizAnswers,
      });
    },
    onSuccess: () => {
      toast({
        title: "Account created successfully",
        description: "Welcome to BrezCode! You can now access your personalized health dashboard.",
      });
      onComplete();
    },
    onError: (error) => {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStepProgress = () => {
    switch (step) {
      case 1: return 25;
      case 2: return 50;
      case 3: return 75;
      case 4: return 100;
      default: return 0;
    }
  };

  const canProceedFromStep1 = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && 
           password.length >= 8 && 
           password === confirmPassword;
  };

  const canProceedFromStep3 = () => {
    // Support international formats: 6-15 digits, only numbers
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    return digitsOnly.length >= 6 && digitsOnly.length <= 15;
  };

  const handleNextStep = () => {
    if (step === 1 && canProceedFromStep1()) {
      setStep(2);
      // Auto-send email verification
      sendEmailCodeMutation.mutate();
    } else if (step === 2 && isEmailVerified) {
      setStep(3);
    } else if (step === 3 && canProceedFromStep3()) {
      setStep(4);
      // Auto-send phone verification
      sendPhoneCodeMutation.mutate();
    } else if (step === 4 && isPhoneVerified) {
      signupMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-gray-800">
            Create Your Account
          </CardTitle>
          <div className="mt-4">
            <Progress value={getStepProgress()} className="h-2" />
            <p className="text-center text-sm text-gray-600 mt-2">
              Step {step} of 4
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Email & Password</h3>
                <p className="text-sm text-gray-600">
                  Let's start by setting up your login credentials
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleNextStep} 
                disabled={!canProceedFromStep1()}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Mail className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold mb-2">Verify Your Email</h3>
                <p className="text-sm text-gray-600">
                  We sent a 6-digit code to {email}
                </p>
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                  <strong>Testing Mode:</strong> Check the server console for your verification code
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailCode">Verification Code</Label>
                <Input
                  id="emailCode"
                  type="text"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => verifyEmailMutation.mutate()}
                  disabled={emailCode.length !== 6 || verifyEmailMutation.isPending}
                  className="flex-1"
                >
                  {verifyEmailMutation.isPending ? "Verifying..." : "Verify"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => sendEmailCodeMutation.mutate()}
                  disabled={sendEmailCodeMutation.isPending}
                >
                  {sendEmailCodeMutation.isPending ? "Sending..." : "Resend"}
                </Button>
              </div>

              {isEmailVerified && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Email verified successfully!</span>
                </div>
              )}

              <Button 
                onClick={handleNextStep} 
                disabled={!isEmailVerified}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
                <p className="text-sm text-gray-600">
                  We'll send you important health reminders and alerts
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.country} ({country.dialCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex space-x-2">
                  <div className="w-20 bg-gray-100 border rounded-md flex items-center justify-center text-sm">
                    {countryCodes.find(c => c.code === selectedCountry)?.dialCode}
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 15))}
                    placeholder={selectedCountry === "HK" ? "12345678" : "1234567890"}
                    className="flex-1"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {selectedCountry === "HK" ? "Hong Kong: 8 digits" : 
                   selectedCountry === "US" || selectedCountry === "CA" ? "10 digits (without area code prefix)" :
                   "6-15 digits (numbers only)"}
                </p>
              </div>

              <Button 
                onClick={handleNextStep} 
                disabled={!canProceedFromStep3()}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Phone className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold mb-2">Verify Your Phone</h3>
                <p className="text-sm text-gray-600">
                  We sent a 6-digit code to {countryCodes.find(c => c.code === selectedCountry)?.dialCode}{phoneNumber}
                </p>
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                  <strong>Testing Mode:</strong> Check the server console for your SMS verification code
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneCode">Verification Code</Label>
                <Input
                  id="phoneCode"
                  type="text"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>

              <div className="flex space-x-2">
                <Button 
                  onClick={() => verifyPhoneMutation.mutate()}
                  disabled={phoneCode.length !== 6 || verifyPhoneMutation.isPending}
                  className="flex-1"
                >
                  {verifyPhoneMutation.isPending ? "Verifying..." : "Verify"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => sendPhoneCodeMutation.mutate()}
                  disabled={sendPhoneCodeMutation.isPending}
                >
                  {sendPhoneCodeMutation.isPending ? "Sending..." : "Resend"}
                </Button>
              </div>

              {isPhoneVerified && (
                <div className="flex items-center justify-center space-x-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Phone verified successfully!</span>
                </div>
              )}

              <Button 
                onClick={handleNextStep} 
                disabled={!isPhoneVerified || signupMutation.isPending}
                className="w-full"
              >
                {signupMutation.isPending ? "Creating Account..." : "Complete Signup"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}