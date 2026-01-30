import { fetcher } from '@/app/lib/fetcher';

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
    return fetcher<Faq.GetFaqsRes[]>('/faq', {
      method: 'GET',
      auth: true,
    });
  }
}

export const faqService = new FaqService();
