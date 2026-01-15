import StaggeredMenu from './StaggeredMenu';
import VerticalPillNav from './verticalPillNav';
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
    { label: 'SPONSORS', ariaLabel: 'SPONSORS', link: 'https://sponsors.springfest.in/', target: "_blank", rel: "noopener noreferrer", isExternal: true},
    { label: 'OUR TEAM', ariaLabel: 'OUR TEAM', link: 'https://teams.springfest.in/', target: "_blank", rel: "noopener noreferrer", isExternal: true },
  ];

  return (
    <>
      {/* TEST - Remove after checking */}
      <div className="fixed top-4 left-4 z-[9999] bg-red-500 text-white p-4">
        <a href="https://sponsors.springfest.in/" target="_blank" rel="noopener noreferrer">
          Test Link - Click Me
        </a>
      </div>

      {/* MOBILE NAV (Hamburger) */}
      <div className="md:hidden">
        <StaggeredMenu
          position="left"
          items={menuItems}
          displaySocials={false}
          displayItemNumbering={false}
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen={true}
          colors={['#0a0a0f', '#1e293b']}
          accentColor="#38bdf8"
        />
      </div>

      {/* DESKTOP NAV (Vertical Pill) */}
      <div className="hidden md:block">
        <VerticalPillNav items={menuItems} />
      </div>
    </>
  );
}