import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart3, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Settings,
  Bell,
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Shield,
  FileText
} from 'lucide-react';
import { cn } from '../../utils/helpers';
import type { NavItem } from '../../types';

const navigation: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { 
    name: 'Cases', 
    href: '/cases', 
    icon: FolderOpen,
    children: [
      { name: 'All Cases', href: '/cases', icon: FileText },
      { name: 'Create Case', href: '/cases/create', icon: FolderOpen },
      { name: 'AML Cases', href: '/cases?type=AML', icon: Shield },
      { name: 'Fraud Cases', href: '/cases?type=FRAUD', icon: AlertTriangle },
      { name: 'Sanctions', href: '/cases?type=SANCTIONS', icon: Shield },
    ]
  },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare, badge: 5 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Notifications', href: '/notifications', icon: Bell, badge: 3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Cases']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const filteredNavigation = navigation.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.children?.some(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const isCurrentPath = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
      {/* Logo and Brand */}
      <div className="px-4 py-5 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Shield className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-semibold text-gray-900">Alert Detect</h1>
            <p className="text-xs text-gray-500">Crime Investigation</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={cn(
                    'w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900',
                    isCurrentPath(item.href)
                      ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                      : 'text-gray-600'
                  )}
                >
                  <item.icon className="flex-shrink-0 h-5 w-5 mr-3" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2">
                      {item.badge}
                    </span>
                  )}
                  {expandedItems.includes(item.name) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedItems.includes(item.name) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        to={child.href}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-50 hover:text-gray-900',
                          isCurrentPath(child.href)
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-600'
                        )}
                      >
                        <child.icon className="flex-shrink-0 h-4 w-4 mr-3" />
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 hover:text-gray-900',
                  isCurrentPath(item.href)
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                    : 'text-gray-600'
                )}
              >
                <item.icon className="flex-shrink-0 h-5 w-5 mr-3" />
                {item.name}
                {item.badge && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="text-xs text-gray-500 mb-2">Quick Stats</div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Active Cases:</span>
            <span className="font-medium">24</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">My Tasks:</span>
            <span className="font-medium">8</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Pending Approval:</span>
            <span className="font-medium text-orange-600">3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
