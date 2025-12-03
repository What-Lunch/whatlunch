import { useState } from 'react';

export function useRouletteItems() {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleChange = (value: string) => {
    const trimmed = value.trim();
    setNewItem(trimmed);
    setIsDuplicate(items.includes(trimmed));
  };

  const addItem = () => {
    if (!newItem) return;
    if (isDuplicate) return;

    setItems(prev => [...prev, newItem]);
    setNewItem('');
    setIsDuplicate(false);
  };

  const removeItem = (item: string) => {
    setItems(prev => prev.filter(v => v !== item));

    setIsDuplicate(newItem.trim() !== '' && items.includes(newItem.trim()));
  };

  const reset = () => {
    setItems([]);
    setIsDuplicate(false);
  };

  return {
    items,
    newItem,
    isDuplicate,
    handleChange,
    addItem,
    removeItem,
    reset,
  };
}
