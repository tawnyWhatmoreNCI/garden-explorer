import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useConnect } from 'wagmi';
import styles from '../styles/Navbar.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '../src/images/logo.svg';

const Navbar = () => {
const connect = useConnect();
const router = useRouter();
const { pathname } = router;

  return (
    <div className={styles.navContainer}>
      {/*When the path name is /, don't display the logo image*/}
      { pathname === '/' ? <div className={styles.emptyLogo}></div> : <Logo className={styles.logo}/>}
      <nav className={styles.mainNav}>
          <Link className={router.pathname === '/community' ? styles.active : ''} href="/community">Community</Link>
          <Link className={router.pathname === '/' ? styles.active : ''} href="/">About Us</Link>
          <Link className={router.pathname === '/userSpace' ? styles.active : ''} href="/userSpace">Your Space</Link>
      </nav>
      <ConnectButton />
    </div>
  );
}

export default Navbar;