import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Play, Flame } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ user }) => { 
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-50/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Play className="w-5 h-5 text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">YT Focus</span>
        </Link>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-6">
          {user ? (
            // --- LOGGED IN VIEW ---
            <div className="flex items-center gap-4">
              {/* Streak Badge */}
              <div className="hidden sm:flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-sm font-semibold border border-orange-100">
                <Flame className="w-4 h-4 fill-current animate-pulse" />
                {user.streak || 0} Day Streak
              </div>
              
              {/* Profile Link */}
              <Link to="/profile">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full border-2 border-slate-200 hover:border-blue-400 transition-colors object-cover" 
                    title="View Profile"
                  />
                ) : (
                  <div 
                    className="w-10 h-10 rounded-full border-2 border-slate-200 hover:border-blue-400 transition-colors bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold"
                    title="View Profile"
                  >
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
              </Link>
            </div>
          ) : (
            // --- GUEST VIEW ---
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium text-sm hidden sm:block">
                Login
              </Link>
              <Link to="/signup">
                <Button variant="primary" className="py-2 px-5 text-sm">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
