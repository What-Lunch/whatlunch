import { fetcher } from '@/app/lib/fetcher';

function isServer() {
  return typeof window === 'undefined';
}

class FaqService {
  // 문의 등록
  postFaq(data: Faq.CreateFaqReq): Promise<{ faq: Faq.CreateFaqRes['faq'] }> {
    return fetcher<{ faq: Faq.CreateFaqRes['faq'] }>('/faq', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 문의 목록 조회
  getFaqs(): Promise<Faq.GetFaqsRes[]> {
    if (isServer()) {
      throw new Error('서버 환경에서는 별도 fetch 로직 필요');
    }
    // 클라이언트용 fetcher 사용
    return fetcher<Faq.GetFaqsRes[]>('/faq', {
      method: 'GET',
      auth: true,
    });
  }
}

export const faqService = new FaqService();
