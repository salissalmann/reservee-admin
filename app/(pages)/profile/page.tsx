'use client'

import { useEffect, useState } from 'react'
import { CalendarIcon, ChevronRight, Loader2, LockKeyhole, MapPin, Pencil, User } from 'lucide-react'
import { Calendar } from "@/components/ui/calendar";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/_providers/initial-load'
import { City, Country, ICity, IState, State } from 'country-state-city'

import { PhoneInput, ParsedCountry } from "react-international-phone";
import "react-international-phone/style.css";
import Loader from '@/app/_components/_layout-components/loader'
import { useFileUpload } from '@/app/_hooks/_file-upload/useFileUpload'
import toast from 'react-hot-toast'
import { updateProfileAPI } from '@/app/_apis/auth-apis'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'

export default function PersonalInformation() {

    // const [isPending, startTransition] = useFormState()
    const [avatar, setAvatar] = useState<string>("https://r2.fair-ticket.com/4ec4ebe3-f2ab-480f-aa0e-f707a8d3633e.profile_3")
    const [isPublic, setIsPublic] = useState(true)

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatar(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }
    const [isLoading, setIsLoading] = useState(false)

    const { uploadFile, isUploading: isImageUploading } = useFileUpload({ showToast: false });

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_no: "",
        profile_picture: "",
        city: "",
        state: "",
        country: "",
        dob: "",
        gender: "",
        is_public: true,
        country_code: "",
    })

    const { user } = useAuth()
    const [isLoadingState, setIsLoadingState] = useState(true)
    const PopulateForm = () => {
        setForm({
            ...form,
            first_name: user?.first_name,
            last_name: user?.last_name,
            email: user?.email ?? "",
            phone_no: user?.phone_no ?? "",
            profile_picture: user?.image ?? "",
            city: user?.city ?? "",
            state: user?.state ?? "",
            country: user?.country ?? "",
            dob: user?.dob ?? "",
            gender: user?.gender ?? "",
            is_public: user?.is_public ?? true,
            country_code: user?.country_code ?? "",
        })
        setAvatar(user?.image ?? "")
        setIsLoadingState(false)
    }

    useEffect(() => {
        PopulateForm()
    }, [user])

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
    }

    const allCountries = Country.getAllCountries();

    const [countrySearch, setCountrySearch] = useState("");
    const filteredCountries = allCountries?.filter((country) =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
    const [allCities, setAllCities] = useState<ICity[] | []>([]);
    const [allStates, setAllStates] = useState<IState[] | []>([]);
    useEffect(() => {
        if (form.country) {
            const citiesData =
                City.getCitiesOfCountry(
                    allCountries.find((c) => c.name === form.country)?.isoCode || ""
                ) || [];
            setAllCities(citiesData);
        }
    }, [form.country]);

    // Modify this useEffect to handle States based on Country
    useEffect(() => {
        if (form.country) {
            const selectedCountry = allCountries.find(
                (c) => c.name === form.country
            );
            if (selectedCountry) {
                const states = State.getStatesOfCountry(selectedCountry.isoCode) || [];
                setAllStates(states);

                // Only reset state and city if the country has changed
                setForm((prev) => ({
                    ...prev,
                    state: prev.country !== form.country ? "" : prev.state,
                    city: prev.country !== form.country ? "" : prev.city,
                }));
            }
        }
    }, [form.country]);

    // Modify this useEffect to handle Cities based on State
    useEffect(() => {
        if (form.country && form.state) {
            const selectedCountry = allCountries.find(
                (c) => c.name === form.country
            );
            const selectedState = allStates.find((s) => s.name === form.state);

            if (selectedCountry && selectedState) {
                const cities =
                    City.getCitiesOfState(
                        selectedCountry.isoCode,
                        selectedState.isoCode
                    ) || [];
                setAllCities(cities);

                // Only reset city if the state has changed
                setForm((prev) => ({
                    ...prev,
                    city: prev.state !== form.state ? "" : prev.city,
                }));
            }
        }
    }, [form.country, form.state]);
    const [calendarDate, setCalendarDate] = useState<Date>(new Date());

    const generateYears = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let year = currentYear; year >= 1900; year--) {
            years.push(year);
        }
        return years;
    };
    const handlePhoneChange = (
        value: string,
        meta: {
            country: ParsedCountry;
            inputValue: string;
        }
    ) => {
        const country = meta?.country;

        setForm({
            ...form,
            phone_no: value,
            country_code: country?.dialCode,
        });
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // If a new avatar file is selected, upload it first
            let profilePictureUrl = form.profile_picture;
            const avatarInput = document.getElementById('avatar') as HTMLInputElement;

            if (avatarInput && avatarInput.files && avatarInput.files.length > 0) {
                const file = avatarInput.files[0];
                const uploadedUrl = await uploadFile(file, `profile_${user?.id}`);

                if (uploadedUrl) {
                    profilePictureUrl = uploadedUrl;
                }
            }

            // Prepare the form data for submission
            const updateData = {
                ...form,
                image: profilePictureUrl
            };

            // console.log("updateData", updateData)

            // Send the update request
            const response = await updateProfileAPI(updateData);
            if (response.statusCode === 200) {
                toast.success('Profile updated successfully');
            }
            else {
                toast.error('Failed to update profile');
            }

        } catch (error) {
            console.error('Profile update error:', error);
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    }

    const router = useRouter()
    return (
        <>
            {isLoadingState ? <Loader /> :
                <div className="mx-auto max-w-7xl p-6">
                    <div className="flex items-center space-x-2 text-muted-foreground dark:text-white">
                        <span onClick={() => router.push("/")} className="cursor-pointer hover:text-primary transition-all duration-300">Home</span>
                        <ChevronRight className="h-4 w-4" />
                        <span>Profile</span>
                    </div>

                    <h1 className="text-3xl font-bold mt-4">Profile</h1>

                    <div className="grid gap-8 md:grid-cols-[2fr_1fr] mt-4">
                        <div className="space-y-6 rounded-lg p-6 border dark:border-borderDark border-gray-200 rounded-lg p-6">
                            <div>
                                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
                            </div>

                            <div className="mx-auto flex justify-start gap-4 items-center">
                                <div className="relative">
                                    <img
                                        src={avatar || "/images/default-avatar.png"}
                                        alt="Profile picture"
                                        className="h-32 w-32 object-cover border-2 border-gray-100 rounded-full"
                                        onError={(e) => {
                                            const imgElement = e.target as HTMLImageElement;
                                            imgElement.src = "/images/default-avatar.png";
                                        }}
                                    />
                                    <Button
                                        variant="ghost"
                                        className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-white/10 px-4 py-1.5 text-sm text-gray-400 backdrop-blur-sm transition hover:scale-110 hover:text-gray-500"
                                        onClick={() => {
                                            document.getElementById('avatar')?.click()
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <Button
                                        className='bg-tertiary text-white rounded-full flex items-center gap-2 hover:scale-105 transition-all duration-300 cursor-pointer'
                                        onClick={() => {
                                            document.getElementById('avatar')?.click()
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                        <span className='text-sm'>Change Profile Picture</span>
                                    </Button>
                                    <Input
                                        id="avatar"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                    <p className="mt-2 text-center text-sm text-gray-600">
                                        Recommended size: 500 x 500 px
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={updateProfile} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm text-gray-500">
                                            First Name:
                                        </Label>
                                        <Input
                                            id="first_name"
                                            name="first_name"
                                            type="text"
                                            defaultValue={form.first_name}
                                            className="rounded-full border-gray-200"
                                            onChange={handleFormChange}
                                            required
                                            autoComplete='off'
                                            autoFocus
                                            placeholder='Enter your first name'
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm text-gray-500">
                                            Last Name:
                                        </Label>
                                        <Input
                                            id="last_name"
                                            name="last_name"
                                            type="text"
                                            defaultValue={form.last_name}
                                            className="rounded-full border-gray-200"
                                            onChange={handleFormChange}
                                            required
                                            autoComplete='off'
                                            placeholder='Enter your last name'
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm text-gray-500">
                                        Email Address:
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        disabled={true}
                                        defaultValue={form.email}
                                        className="rounded-full border-gray-200"
                                        onChange={handleFormChange}
                                        required
                                        autoComplete='off'
                                        placeholder='Enter your email address'
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="space-y-2">
                                        <Label htmlFor="country" className="text-sm text-gray-500">
                                            Country:
                                        </Label>
                                        <div className="border dark:border-borderDark border-gray-100 col-span-2 border-input rounded-full px-4 flex items-center justify-center  gap-1 w-full ">
                                            <MapPin className="text-gray-400 w-5 h-5" />
                                            <Select
                                                defaultValue={form.country}
                                                onValueChange={(value) => {
                                                    setForm({ ...form, country: value })
                                                }}
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
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="state" className="text-sm text-gray-500">
                                            State:
                                        </Label>
                                        <div className="border dark:border-borderDark border-gray-100 col-span-2 border-input rounded-full px-4 flex items-center justify-center  gap-1 w-full ">
                                            <MapPin className="text-gray-400 w-5 h-5" />

                                            <Select
                                                disabled={!form.country}
                                                defaultValue={form.state}
                                                onValueChange={(value) => {
                                                    setForm({ ...form, state: value })
                                                }}
                                            >
                                                <SelectTrigger className="w-full border-none">
                                                    <SelectValue placeholder="State" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allStates &&
                                                        allStates?.length > 0 &&
                                                        allStates?.map((state, index) => (
                                                            <SelectItem key={index} value={state.name}>
                                                                {state.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="text-sm text-gray-500">
                                            City:
                                        </Label>
                                        <div className="border dark:border-borderDark border-gray-100 col-span-2 border-input rounded-full px-4 flex items-center justify-center  gap-1 w-full ">
                                            <MapPin className="text-gray-400 w-5 h-5" />

                                            <Select
                                                disabled={!form.state}
                                                defaultValue={form.city}
                                                onValueChange={(value) => {
                                                    setForm({ ...form, city: value })
                                                }}
                                            >
                                                <SelectTrigger className="w-full border-none">
                                                    <SelectValue placeholder="Select city" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allCities &&
                                                        allCities?.length > 0 &&
                                                        allCities?.map((city, index) => (
                                                            <SelectItem key={index} value={city.name}>
                                                                {city.name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dob" className="text-sm text-gray-400">
                                            Date of Birth:
                                        </Label>
                                        {/* <Input
                                            id="dob"
                                            name="dob"
                                            type="date"
                                            defaultValue={form.dob}
                                            className="rounded-full border-gray-200"
                                            onChange={handleFormChange}
                                        /> */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal border px-4 py-1 shadow-none rounded-full border-gray-200",
                                                    !form.dob && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {form.dob ? (
                                                    format(form.dob, "PPP")
                                                ) : (
                                                    <span>Date of Birth</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 border-none">
                                            <div className="p-3 border-b">
                                                <div className="flex justify-between gap-2">
                                                    <Select
                                                        onValueChange={(value) => {
                                                            const year = parseInt(value);
                                                            const month = calendarDate.getMonth();
                                                            const day = form.dob ? new Date(form.dob).getDate() : 1;

                                                            const newDate = new Date(year, month, day);
                                                            setCalendarDate(newDate);

                                                            if (form.dob) {
                                                                const utcDate = new Date(Date.UTC(
                                                                    year,
                                                                    month,
                                                                    day,
                                                                    12,
                                                                    0,
                                                                    0,
                                                                    0
                                                                ));
                                                                setForm({ ...form, dob: utcDate.toISOString() });
                                                            }
                                                        }}
                                                        value={calendarDate.getFullYear().toString()}
                                                    >
                                                        <SelectTrigger className="w-[110px] h-8">
                                                            <SelectValue placeholder="Year" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {generateYears().map((year) => (
                                                                <SelectItem key={year} value={year.toString()}>
                                                                    {year}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <Select
                                                        onValueChange={(value) => {
                                                            const year = calendarDate.getFullYear();
                                                            const month = parseInt(value);
                                                            const day = form.dob ? new Date(form.dob).getDate() : 1;

                                                            const newDate = new Date(year, month, day);
                                                            setCalendarDate(newDate);

                                                            if (form.dob) {
                                                                const utcDate = new Date(Date.UTC(
                                                                    year,
                                                                    month,
                                                                    day,
                                                                    12,
                                                                    0,
                                                                    0,
                                                                    0
                                                                ));
                                                                setForm({ ...form, dob: utcDate.toISOString() });
                                                            }
                                                        }}
                                                        value={calendarDate.getMonth().toString()}
                                                    >
                                                        <SelectTrigger className="w-[110px] h-8">
                                                            <SelectValue placeholder="Month" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: 12 }, (_, i) => (
                                                                <SelectItem key={i} value={i.toString()}>
                                                                    {new Date(2000, i, 1).toLocaleString('default', { month: 'long' })}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <Calendar
                                                mode="single"
                                                selected={form.dob ? new Date(form.dob) : undefined}
                                                onSelect={(value: any) => {
                                                    if (value) {
                                                        // Ensure we preserve the exact date by handling timezone
                                                        const newDate = new Date(value);
                                                        const utcDate = new Date(Date.UTC(
                                                            newDate.getFullYear(),
                                                            newDate.getMonth(),
                                                            newDate.getDate(),
                                                            12, // Set to noon UTC to avoid timezone issues
                                                            0,
                                                            0,
                                                            0
                                                        ));
                                                        setCalendarDate(newDate);
                                                        setForm({ ...form, dob: utcDate.toISOString() });
                                                    }
                                                }}
                                                month={calendarDate}
                                                onMonthChange={setCalendarDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    </div> 

                                </div>


                                <div className="space-y-2">
                                    <Label htmlFor="gender" className="text-sm text-gray-600">
                                        Gender:
                                    </Label>
                                    <div className="border dark:border-borderDark border-gray-200 col-span-2 border-input rounded-full px-4 py-1 flex items-center justify-center  gap-1 w-full ">
                                        <LockKeyhole className="text-gray-400 w-6 h-6" />
                                        <Select
                                            name='gender'
                                            defaultValue={form.gender}
                                            onValueChange={(value) => {
                                                setForm({ ...form, gender: value });
                                            }}
                                        >
                                            <SelectTrigger className="w-full border-none outline-none ring-0 shadow-none">
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
                                <div className="space-y-2">
                                    <Label htmlFor="phone_no" className="text-sm text-gray-600">
                                        Phone Number:
                                    </Label>
                                    <PhoneInput
                                        placeholder="Enter phone number"
                                        value={form.phone_no}
                                        onChange={handlePhoneChange}
                                        defaultCountry={form.country_code || 'us'}
                                        className="border dark:border-borderDark border-gray-200 rounded-full px-4 py-1 flex items-center justify-start gap-1 w-full"
                                        style={{ backgroundColor: "transparent" }}
                                        inputProps={{
                                            className: "w-full bg-transparent border-none focus:outline-none",
                                        }}
                                    />
                                </div>
                                <div className="space-y-2 mt-6">
                                    <Label className="text-sm text-gray-600">Profile Visibility:</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                name="isPublic"
                                                checked={form.is_public}
                                                onCheckedChange={(value) => {
                                                    setForm({ ...form, is_public: value })
                                                }}
                                            />
                                            <span className="text-sm text-gray-600">
                                                {form.is_public ? 'Public' : 'Private'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        When public, other users can view your name and avatar.
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || isImageUploading}
                                    className="w-fit bg-primary text-white rounded-full py-4 px-6 font-bold px-10 hover:scale-105 transition-all duration-300 cursor-pointer"
                                >
                                    {(isLoading || isImageUploading) ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                                </Button>
                            </form>
                        </div>

                        <div className="rounded-lg bg-white p-6 border dark:border-borderDark border-gray-200 h-fit">
                            <div className="flex items-center gap-3">
                                <User className="h-6 w-6 text-blue-600" />
                                <div className="space-y-1">
                                    <h2 className="text-lg font-medium">
                                        View and update your personal information.
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Manage the details that others see and ensure your profile is up to
                                        date.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }


        </>
    )
}

