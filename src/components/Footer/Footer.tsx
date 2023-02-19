import React from 'react';
import styles from './Footer.module.css';
import Image from 'next/image'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className={styles.root}>
      <small>Copyright &copy; 2000-2023 JetBrains</small>
      <Link href="https://www.jetbrains.com/">
        <Image
          src="icons/logo.svg"
          width={36}
          height={36}
          alt="JetBrains Logo"
        />
      </Link>
    </footer>
  );
};
