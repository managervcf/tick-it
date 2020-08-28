import Link from 'next/link';

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My Orders', href: '/orders' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter(linkConfig => linkConfig)
    .map(({ label, href }) => (
      <li key={href} className="nav-item">
        <Link href={href}>
          <a className="nav-link">{label}</a>
        </Link>
      </li>
    ));

  return (
    <nav className="navbar">
      <Link href="/">
        <a className="navbar-brand">TickIt</a>
      </Link>
      <div className="d-flex justify-content-end">
        {currentUser && (
          <span className="nav d-flex align-items-center">
            Logged in as {currentUser.email}
          </span>
        )}
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
