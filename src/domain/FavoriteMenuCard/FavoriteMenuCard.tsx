'use client';
import { useState } from 'react';

import Modal from '@/shared/components/Modal';

export default function FavoriteMenuCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div>
      <section>
        <div>Favorite Menu Card Content</div>
        <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      </section>
      {isModalOpen && (
        <>
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Favorite Menu">
            <>dsd</>
          </Modal>
        </>
      )}
    </div>
    // <Modal
    //   isOpen={true}
    //   onClose={() => {}}
    //   title="Favorite Menu"
    //   description="Your favorite menu items"
    // >
    //   FavoriteMenuCard
    // </Modal>
  );
}
