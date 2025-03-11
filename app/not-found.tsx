import Link from "next/link"
import Button from "@/app/_components/_layout-components/button"
import { Ghost, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="h-[100dvh] w-full bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <div className="container max-w-md text-center space-y-8">
        {/* Animated Ghost Icon */}
        <div className="relative">
          <Ghost className="w-24 h-24 mx-auto text-primary animate-float" />
          <div className="w-24 h-3 mx-auto mt-4 rounded-full bg-muted-foreground/20 animate-pulse" />
        </div>
        
        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-7xl font-bold tracking-tighter">404</h1>
          <h2 className="text-2xl font-medium text-muted-foreground">
            Page not found
          </h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for has vanished into thin air.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button btnStyle="rounded-fill" btnCover="primary-button" className="gap-2" icon={<Home className="w-4 h-4" />}>
            <Link href="/dashboard">
              Return Home
            </Link>
          </Button>
          <Button btnStyle="rounded-fill" btnCover="secondary-button" className="gap-2" icon={<ArrowLeft className="w-4 h-4" />}>
            <Link href="/dashboard">
              Go Back
            </Link>
          </Button>
        </div>
      </div>

    
    </div>
  )
}

