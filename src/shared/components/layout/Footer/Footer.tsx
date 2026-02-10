'use client';
import { Github } from 'lucide-react';
import styles from './Footer.module.scss';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const teamMembers = [
    { name: 'ramong26', github: 'https://github.com/ramong26' },
    { name: 'Parkchanyoung0710', github: 'https://github.com/Parkchanyoung0710' },
  ];

  return (
    <footer className={styles['footer']}>
      <div className={styles['footer__container']}>
        <div className={styles['footer__content']}>
          {/* 프로젝트 정보 */}
          <section className={styles['footer__section']}>
            <h3 className={styles['footer__section__title']}>WhatLunch</h3>
            <p className={styles['footer__project__desc']}>
              오늘 뭐먹지? 함께하는 음식 선택, 실시간 채팅과 함께 이용하세요.
            </p>
            <a
              href="https://github.com/What-Lunch/whatlunch"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['footer__github__link']}
            >
              <Github size={20} />
              Main Repository
            </a>
          </section>

          {/* 팀원 */}
          <section className={styles['footer__section']}>
            <h3 className={styles['footer__section__title']}>Team Members</h3>
            <nav className={styles['footer__nav']}>
              {teamMembers.map(member => (
                <a
                  key={member.name}
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['footer__link']}
                >
                  <Github size={20} />
                  {member.name}
                </a>
              ))}
            </nav>
          </section>
        </div>

        <div className={styles['footer__divider']} />

        <div className={styles['footer__bottom']}>
          <p className={styles['footer__copyright']}>
            © {currentYear} WhatLunch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
