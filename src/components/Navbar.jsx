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
  ];

  return (
    <>
      {/* MOBILE NAV (Hamburger) */}
      <div className="md:hidden left-0.5">
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