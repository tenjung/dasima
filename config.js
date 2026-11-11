/*
 * 랜딩 페이지 설정 — 구매 링크·가격은 이 파일만 고치면 페이지 전체에 반영된다.
 *
 * links: 판매처 상품 상세 URL. 비어 있으면 구매 버튼이 "링크 준비 중"으로 비활성화된다.
 * price / salePrice: 숫자(원). 비워 두면(null) 가격 대신 "판매처에서 가격 확인"을 표시한다.
 * contact.tel: 푸터 문의 전화. 화면에만 표시되고 검색에는 노출되지 않는다. 비우면 문의 전화 영역이 숨겨진다.
 * utm: 구매 링크에 붙일 유입 추적 파라미터. 필요 없으면 null.
 * reviews: 판매처 게시 동의를 받은 실제 후기만 넣는다. 비어 있으면 후기 섹션은 숨겨진다.
 */
window.LANDING_CONFIG = {
  links: {
    // 여수 동백 앰플 다시마크림 100g (product_no=101)
    cream: "https://dayseven.co.kr/product/detail.html?product_no=101&cate_no=47&display_group=2",
    // 청정 100% 동백오일 30ml (product_no=72)
    oil: "https://dayseven.co.kr/product/detail.html?product_no=72&cate_no=1&display_group=10",
  },
  products: {
    cream: { price: null, salePrice: null },
    oil: { price: null, salePrice: null },
  },
  contact: {
    tel: "010-3640-5453",
  },
  utm: {
    utm_source: "dasima_landing",
    utm_medium: "landing",
    utm_campaign: "camellia",
  },
  reviews: [
    // { product: "cream", name: "김**", rating: 5, text: "실제 후기 본문", source: "판매처" },
  ],
};
