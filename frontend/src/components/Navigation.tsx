import { Button } from "@/components/ui/button";
import { Menu, X, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

const JharkhandOutline = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    fill="none"
  >
    <defs>
      <linearGradient id="jh-stroke" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="hsl(147 65% 18%)" />
        <stop offset="100%" stopColor="hsl(147 55% 24%)" />
      </linearGradient>
      <filter id="jh-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="hsl(147 60% 15%)" floodOpacity="0.35" />
      </filter>
    </defs>
    <path
      d="M27 110l10-12 14 2 9-11 12 3 8-8 15 2 10-10 12 6 13-8 14 8 10 15-3 12 8 11-6 14-15 6-10 12-18 4-14-6-12 8-16-3-10-12-13-5-8-12 6-10z"
      stroke="url(#jh-stroke)"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#jh-shadow)"
    />
  </svg>
);

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();

  const navItems = [
    { name: "Destinations", href: "#destinations" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" }
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-forest-primary/90 backdrop-blur-md border-b border-white/30 shadow-lg transition-all duration-300 hover:bg-forest-dark/95">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/bed27f4e-a4ab-4957-ba32-255a03263cc8.png" 
              alt="Jharkhand Logo" 
              className="h-10 w-10 object-cover mr-3"
            />
            <div className="flex flex-col">
              <span className="text-xl font-black text-white leading-tight drop-shadow-2xl hover:scale-105 transition-transform duration-300 cursor-default">
                Incredible Jharkhand
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center ml-auto space-x-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="relative text-white hover:text-cultural-gold transition-colors font-bold drop-shadow-2xl px-3 py-2 rounded-md hover:bg-black/30 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-cultural-gold after:transition-all hover:after:w-full"
              >
                {item.name}
              </button>
            ))}
            <Button
              variant="nature"
              size="sm"
              asChild
              className="relative bg-transparent hover:bg-black/50 text-white border border-white/30 hover:border-white/50 transition-all duration-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-cultural-gold after:transition-all hover:after:w-full"
            >
              <Link to="/booking">
                <Phone className="h-4 w-4 mr-2" />
                Book Now
              </Link>
            </Button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-2 p-2 hover:bg-black/30 rounded-md transition-colors">
                <div className="flex flex-col space-y-1">
                  <div className="w-4 h-0.5 bg-white"></div>
                  <div className="w-4 h-0.5 bg-white"></div>
                  <div className="w-4 h-0.5 bg-white"></div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {isAuthenticated && user ? (
                  <>
                    <DropdownMenuLabel>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-3 py-2">
                      <div className="text-sm font-medium">Credits & Discounts</div>
                      <div className="mt-2 grid grid-cols-2 gap-3">
                        <div className="rounded-md border p-2 text-center">
                          <div className="text-xl font-bold text-forest-primary">{user.points}</div>
                          <div className="text-xs text-muted-foreground">Points</div>
                        </div>
                        <div className="rounded-md border p-2 text-center">
                          <div className="text-xl font-bold text-forest-primary">{user.discountPercent}%</div>
                          <div className="text-xs text-muted-foreground">Discount</div>
                        </div>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">View Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/bookings">My Bookings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/rewards">Rewards</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
                  </>
                                 ) : (
                   <>
                     <DropdownMenuLabel>Welcome</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                       <Link to="/signin">Sign In</Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                       <Link to="/signup">Sign Up</Link>
                     </DropdownMenuItem>
                   </>
                 )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:text-cultural-gold drop-shadow-2xl"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-4">
              {/* Mobile profile summary or auth actions */}
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-4">
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-forest-primary">{user.points}</div>
                      <div className="text-xs text-muted-foreground">Points</div>
                    </div>
                  </div>
                  <div className="px-4 grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/profile">View Profile</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/bookings">My Bookings</Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/rewards">Rewards</Link>
                    </Button>
                    <Button variant="outline" size="sm" onClick={signOut}>Sign Out</Button>
                  </div>
                </>
                             ) : (
                 <div className="px-4 grid grid-cols-2 gap-3">
                   <Button variant="outline" size="sm" asChild>
                     <Link to="/signin">Sign In</Link>
                   </Button>
                   <Button variant="outline" size="sm" asChild>
                     <Link to="/signup">Sign Up</Link>
                   </Button>
                 </div>
               )}

              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavClick(item.href);
                    setIsMenuOpen(false);
                  }}
                  className="relative text-white hover:text-cultural-gold transition-colors font-medium px-4 py-2 rounded-md hover:bg-black/30 after:absolute after:left-4 after:bottom-0 after:h-0.5 after:w-0 after:bg-cultural-gold after:transition-all hover:after:w-[calc(100%-2rem)]"
                >
                  {item.name}
                </button>
              ))}
              <div className="px-4">
                <Button 
                  variant="nature" 
                  size="sm" 
                  asChild
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full relative bg-transparent hover:bg-black/50 text-white border border-white/30 hover:border-white/50 transition-all duration-300 after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-cultural-gold after:transition-all hover:after:w-full"
                >
                  <Link to="/booking">
                    <Phone className="h-4 w-4 mr-2" />
                    Book Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
             </div>
     </nav>
  );
};

export default Navigation;