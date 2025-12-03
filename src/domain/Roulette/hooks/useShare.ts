export function useShare() {
  const share = async (title: string, text: string) => {
    if (!navigator.share) {
      alert('공유 기능을 지원하지 않는 브라우저입니다.');
      return;
    }

    try {
      await navigator.share({ title, text });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;

      console.error('Unexpected share error:', error);
    }
  };

  return share;
}
