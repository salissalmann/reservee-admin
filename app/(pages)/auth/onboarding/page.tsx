"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { Country } from 'country-state-city';
import { useAuth } from '@/app/_providers/initial-load';
import { Onboarding } from '@/app/_utils/auth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Building2,
  MapPin,
  Calendar as CalendarIcon,
  UsersRound,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { OnboardingFormData } from '@/app/_types/_auth/auth-types';
import { useLocationData } from '@/app/_hooks/_auth/useLocationData';
import { onboardingValidationSchema } from '@/app/_validations/auth_validations';

// Main component
export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const allCountries = Country.getAllCountries();

  // State management
  const [countrySearch, setCountrySearch] = React.useState('');
  const [citySearch, setCitySearch] = React.useState('');
  const [date, setDate] = React.useState<Date>();
  const [formData, setFormData] = React.useState<OnboardingFormData>({
    userId: '',
    city: '',
    state: '',
    country: '',
    dob: '',
    gender: '',
  });
  const [errors, setErrors] = React.useState<Partial<OnboardingFormData>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Custom hook usage
  const { allStates, filteredCities } = useLocationData(formData, citySearch);

  // Filter countries based on search
  const filteredCountries = allCountries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Initialize user data
  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        userId: user.id?.toString() || '',
        country: user.country || '',
        state: user.state || '',
        city: user.city || '',
        dob: user.dob || '',
        gender: user.gender || '',
      }));
      if (user.dob) {
        setDate(new Date(user.dob));
      }
      setIsLoading(false);
    }
  }, [user]);

  // Form handlers
  const handleChange = (field: keyof OnboardingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      await onboardingValidationSchema.validate(formData, { abortEarly: false });

      const body = {
        city: formData.city,
        state: formData.state,
        country: formData.country,
        dob: formData.dob,
        gender: formData.gender,
      };

      const response = await Onboarding(body);

      if (response.status === 200) {
        toast.success('Onboarding successful');
        router.push('/dashboard');
      } else {
        throw new Error(response.data?.message || 'An error occurred');
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Partial<OnboardingFormData> = {};
        err.inner.forEach(error => {
          if (error.path) {
            validationErrors[error.path as keyof OnboardingFormData] = error.message;
          }
        });
        setErrors(validationErrors);
      }
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-screen h-[calc(80vh-10vh)] px-5 items-center justify-center ">
      <div
        className={cn(
          "md:max-w-lg w-full border dark:border-borderDark border-gray-200 shadow-lg h-fit p-4 md:p-8 flex  flex-col items-center justify-center space-y-8 rounded-3xl"
        )}
      >
        <div className="text-center ">
          <h1 className="dark:text-white text-tertiary font-bold text-3xl">
            Hi {user?.first_name} {user?.last_name}!
          </h1>
          <p className="dark:text-gray-400 text-gray-400 ">
            Please fill in the following details to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="grid lg:grid-cols-4 gap-4">
            <div className="border dark:border-borderDark border-gray-200 col-span-2 border-input rounded-full px-4 py-1 flex items-center justify-center  gap-1 w-full ">
              <MapPin className="text-gray-400 w-6 h-6" />
              <Select
                value={formData.country}
                onValueChange={(value) => handleChange("country", value)}
              >
                <SelectTrigger className="w-full border-none border-0 outline-none ring-0 shadow-none focus:ring-0 focus:border-0 ">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCountries &&
                    filteredCountries?.length > 0 &&
                    filteredCountries?.map((country, index) => (
                      <SelectItem key={index} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="border dark:border-borderDark border-gray-200 col-span-2 border-input rounded-full px-4 py-1 flex items-center justify-center  gap-1 w-full ">
              <MapPin className="text-gray-400 w-6 h-6" />
              <Select
                value={formData.state}
                onValueChange={(value) => handleChange("state", value)}
                disabled={!formData.country}
              >
                <SelectTrigger className="w-full border-none border-0 outline-none ring-0 shadow-none focus:ring-0 focus:border-0 ">
                  <SelectValue
                    placeholder="Select State"
                    className="text-gray-400"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Other">Other</SelectItem>
                    {allStates?.map((item, index) => (
                      <SelectItem key={index} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="border dark:border-borderDark border-gray-200 col-span-2 border-input rounded-full px-4 py-1 flex items-center justify-center  gap-1 w-full ">
            <Building2 className="text-gray-400 w-6 h-6" />
            <Select
              value={formData.city}
              onValueChange={(value) => handleChange("city", value)}
              disabled={!formData.country || !formData.state}
            >
              <SelectTrigger className="w-full border-none border-0 outline-none ring-0 shadow-none focus:ring-0 focus:border-0 ">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <Input
                  placeholder="Search cities..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="mb-2"
                />
                <SelectGroup>
                  <SelectItem value="Other">Other</SelectItem>
                  {filteredCities &&
                    filteredCities?.length > 0 &&
                    filteredCities?.map((city, index) => (
                      <SelectItem key={index} value={city.name}>
                        {city.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border dark:border-borderDark border-gray-200 col-span-2 border-input rounded-full px-4 py-1 flex items-center justify-center  gap-1 w-full ">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left bg-white dark:bg-tertiary font-normal border-0 p-0 shadow-none",
                      !formData.dob && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="text-gray-400 w-6 h-6 mr-2" />
                    {formData.dob ? (
                      format(formData.dob, "PPP")
                    ) : (
                      <span>Date of Birth</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none">
                  <Calendar
                    mode="single"
                    selected={
                      formData?.dob ? new Date(formData.dob) : undefined
                    }
                    onSelect={(value) =>
                      handleChange("dob", value?.toISOString() || "")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="border dark:border-borderDark border-gray-200 col-span-2 border-input rounded-full px-4 py-1 flex items-center justify-start  gap-1 w-full ">
              <UsersRound className="text-gray-400 w-6 h-6" />
              <Select
                onValueChange={(value) => {
                  handleChange("gender", value);
                }}
                value={formData.gender}
              >
                <SelectTrigger className="w-[180px] flex-grow border-none outline-none ring-0 shadow-none">
                  <SelectValue
                    placeholder="Choose Gender"
                    className="text-gray-400"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="na">Rather not say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col space-y-5 mt-6">
            <Button
              type="submit"
              variant="default"
              className="rounded-full text-white py-6 font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Registration"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}