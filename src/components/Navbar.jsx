import StaggeredMenu from './StaggeredMenu';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'Events', ariaLabel: 'View events', link: '/events' },
    { label: 'Gallery', ariaLabel: 'View gallery', link: '/gallery' },
    { label: 'Aftermovie', ariaLabel: 'Watch aftermovie', link: '/aftermovie' },
    { label: 'Accommodation', ariaLabel: 'Accommodation details', link: '/accommodation' },
    { label: 'Merch', ariaLabel: 'Buy merchandise', link: '/merch' },
    { label: 'FAQ', ariaLabel: 'Frequently Asked Questions', link: '/faq' },
  ];

  const socialItems = [
    {
      label: 'Instagram',
      link: 'https://instagram.com/springfest.iitkgp',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      )
    },
    {
      label: 'Facebook',
      link: 'https://facebook.com/springfest.iitkgp',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    },
    {
      label: 'YouTube',
      link: 'https://youtube.com/springfest',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" />
        </svg>
      )
    }
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 0, zIndex: 9999 }}>
      <StaggeredMenu
        position="left"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor="#fff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#18181b', '#042f2e']} // Zinc-900 to Emerald-950
        logoUrl=""
        accentColor="#10b981" // Emerald-500
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />
    </div>
  );
}
