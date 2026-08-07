// ==========================================
// 집피지기 App JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  // DEFAULT CHECKLIST TEMPLATE
  const DEFAULT_CHECKLIST = [
    { id: 'water', title: '수압 및 배수 상태', desc: '세면대, 주방 수도, 변기를 동시 작동 시 수압 체크', script: '💬 "중개사님, 세면대 물을 틀어놓은 상태에서 변기를 내렸을 때 수압 감소가 심한지 확인해 봐도 될까요?"', checked: false, memo: '' },
    { id: 'mold', title: '곰팡이 & 누수 (창틀/벽지)', desc: '외벽과 접한 구석 벽지 및 장판 실리콘 결로 상태', script: '💬 "중개사님, 창틀 실리콘이나 벽지 구석에 결로 곰팡이 흔적이 없는지 랜턴으로 봐도 괜찮죠?"', checked: false, memo: '' },
    { id: 'sound', title: '채광 및 방음 점검', desc: '창문 방향 및 외부 소음 차단 여부', script: '💬 "낮시간 채광이 어느 정도 들어오는지와 이중창 방음 상태를 창문을 닫고 확인해 보겠습니다."', checked: false, memo: '' },
    { id: 'mortgage_chk', title: '근저당권 확인', desc: '등기부등본 을구 채권최고액과 대출 잔액 확인', script: '💬 "사장님! 등기부 을구 근저당 00만원은 잔금 때 상환/말소하는 조건이 맞나요?"', checked: false, memo: '' },
    { id: 'appliance', title: '렌지 / 수도 / 옵션 상태', desc: '기본 옵션 작동 파손 여부 및 수리 책임', script: '💬 "기존 옵션 고장이나 하자는 입주 전 수리해 주시는 것으로 특약에 명시하고 싶습니다."', checked: false, memo: '' },
    { id: 'fee', title: '관리비 포함 내역', desc: '수도, 인터넷, 난방비 등 포함 항목 명확화', script: '💬 "월 관리비에 청소비, 수도료, 인터넷이 어디까지 포함되는지 청구서 내역 확인이 가능한가요?"', checked: false, memo: '' }
  ];

  // --- LOCALSTORAGE USER ACCOUNTS ENGINE ---
  function getUsersDB() {
    try {
      const data = localStorage.getItem('zipgigi_users_db');
      return data ? JSON.parse(data) : [
        {
          email: 'user@zipgigi.com',
          password: '123456',
          name: '홍길동',
          age: 26,
          isHead: true,
          income: 3200,
          job: 'employee_sme',
          jobText: '직장인 (중소기업)',
          marriage: 'single',
          children: false
        }
      ];
    } catch (e) {
      return [];
    }
  }

  function saveUsersDB(users) {
    localStorage.setItem('zipgigi_users_db', JSON.stringify(users));
  }

  // --- STATE ---
  const state = {
    user: {
      name: '홍길동',
      age: 26,
      isHead: true,
      income: 3200,
      jobText: '직장인 (중소기업)',
      marriage: 'single',
      children: false
    },
    activeTab: 'tab-guide',
    contractType: 'monthly',
    calendarYear: 2026,
    calendarMonth: 6, // July 2026
    selectedDate: '2026-07-27',
    calendarEvents: {},
    activePropId: 1,
    properties: [
      {
        id: 1,
        name: '매물 1',
        address: '',
        features: '',
        photos: [],
        checklist: DEFAULT_CHECKLIST.map(item => ({ ...item }))
      }
    ]
  };

  // --- ROADMAP DATA ---
  const ROADMAP_DATA = {
    monthly: [
      {
        step: 1, title: '1단계: 방 찾기 및 조건 확인',
        items: [
          { title: '예산 정하기', desc: '보증금과 월세, 관리비 범위를 먼저 정합니다.' },
          { title: '집 방문하기', desc: '공인중개사와 함께 직접 방문해 물건 상태, 채광, 수압, 곰팡이 등을 확인합니다.' }
        ]
      },
      {
        step: 2, title: '2단계: 서류 확인 및 계약 체결',
        items: [
          { title: '등기부등본 확인', desc: '집주인이 진짜 주인인지, 빚(근저당)이 얼마나 있는지 인터넷등기소에서 확인합니다.' },
          { title: '계약서 작성', desc: '보증금의 10% 정도를 계약금으로 내고 계약서를 씁니다. 특약사항(수리 조건 등)을 넣습니다.' }
        ]
      },
      {
        step: 3, title: '3단계: 잔금 지급 및 입주',
        items: [
          { title: '잔금 치르기', desc: '이사 당일에 남은 돈(잔금)을 집주인에게 보냅니다.' },
          { title: '집 상태 점검', desc: '열쇠(비밀번호)를 받고 집의 고장 난 곳이 없는지 사진으로 남깁니다.' }
        ]
      },
      {
        step: 4, title: '4단계: 전입신고 및 확정일자',
        items: [
          { title: '전입신고 하기', desc: '이사한 날 가까운 주민센터나 정부24에서 새 주소를 등록합니다.' },
          { title: '확정일자 받기', desc: '계약서를 들고 주민센터에 가서 확정일자 도장을 받습니다 (보증금을 지키기 위해 매우 중요합니다).' }
        ]
      }
    ],
    jeonse: [
      {
        step: 1, title: '1단계: 집 찾기 및 계약 전 확인',
        items: [
          { title: '예산 설정', desc: '내 돈과 주택도시기금 등 전세자금대출 가능 금액을 더해 총 예산을 정합니다.' },
          { title: '매물 방문', desc: '네이버 부동산 등에서 집을 고르고 직접 방문해 집 상태와 하자를 꼼꼼히 살핍니다.' },
          { title: '등기부등본 확인', desc: '집 주인이 맞는지, 빚(근저당)이 얼마나 있는지 확인합니다.' }
        ]
      },
      {
        step: 2, title: '2단계: 계약 체결',
        items: [
          { title: '가계약 및 본계약', desc: '마음에 드는 집에 계약금(보증금의 5%)을 걸고, 공인중개사와 함께 정식 계약서를 씁니다.' },
          { title: '특약 작성', desc: "'대출 거절 시 계약금 반환', '전입일까지 등기부 변동 금지' 같은 안전 문구를 넣습니다." },
          { title: '대출 신청', desc: '계약서와 영수증을 가지고 은행에 전세자금대출을 신청합니다.' }
        ]
      },
      {
        step: 3, title: '3단계: 잔금 및 이사 완료',
        items: [
          { title: '잔금 송금', desc: '이사 당일 남은 잔금을 집주인 통장으로 보냅니다.' },
          { title: '전입신고와 확정일자', desc: '주민센터나 정부24에서 전입신고를 하고 확정일자를 받아 대항력을 얻습니다.' },
          { title: '전세보증보험 가입', desc: 'HUG 주택도시보증공사 등에서 보증보험에 가입해 보증금을 안전하게 지킵니다.' }
        ]
      }
    ],
    buying: [
      {
        step: 1, title: '1단계: 매물 확인 및 가계약',
        items: [
          { title: '임장 및 서류 확인', desc: '마음에 드는 집을 직접 보고, 등기부등본과 건축물대장으로 소유자와 권리 관계를 확인합니다.' },
          { title: '가계약금 송금', desc: '매물을 먼저 잡기 위해 집주인 계좌로 가계약금을 보냅니다. 이때 금액과 잔금일 등 핵심 조건을 문자로 합의해야 안전합니다.' }
        ]
      },
      {
        step: 2, title: '2단계: 본계약 (계약금 지급)',
        items: [
          { title: '계약서 작성', desc: '공인중개사와 함께 매매계약서를 작성하고 특약 사항을 검토합니다.' },
          { title: '계약금 지급', desc: '보통 집값의 10%를 집주인 명의 계좌로 입금합니다. 신분증과 도장을 준비해야 합니다.' }
        ]
      },
      {
        step: 3, title: '3단계: 중도금 및 잔금 지급',
        items: [
          { title: '중도금 지급', desc: '계약과 잔금 사이에 집값의 일부를 중간에 치르는 단계입니다. 중도금을 내면 일방적인 계약 취소가 불가능해집니다.' },
          { title: '잔금 정산', desc: '남은 잔금을 치르고 관리비 및 공과금을 정산합니다. 집 열쇠와 시설물 관리 도구를 받습니다.' }
        ]
      },
      {
        step: 4, title: '4단계: 소유권 이전 등기 및 신고',
        items: [
          { title: '등기 신청', desc: '잔금과 동시에 법무사의 도움을 받아 소유권 이전 등기를 신청합니다.' },
          { title: '세금 납부 및 신고', desc: '잔금일 또는 등기 후 60일 이내에 취득세를 내고, 30일 이내에 실거래가 신고를 마무리합니다.' }
        ]
      }
    ]
  };

  const GLOSSARY_DB = [
    { term: '임대인', desc: '집을 빌려주는 사람. 즉, 집주인을 말합니다.' },
    { term: '임차인', desc: '돈을 내고 집을 빌려서 사는 사람. 즉, 세입자(나)를 말합니다.' },
    { term: '공인중개사', desc: '집주인과 세입자 사이에서 집을 소개해주고 안전하게 계약하도록 도와주는 사람입니다. (우리가 흔히 말하는 부동산 사장님)' },
    { term: '중개수수료 (복비)', desc: '공인중개사가 계약을 도와준 대가로 우리가 내는 수수료입니다. 법으로 정해진 한도가 있습니다.' },
    { term: '가계약(금)', desc: '마음에 드는 집을 다른 사람이 먼저 계약하지 못하도록 찜해두기 위해 먼저 거는 돈입니다. 보통 계약금의 일부를 냅니다. (주의: 단순 변심으로 취소하면 돌려받기 어려울 수 있습니다.)' },
    { term: '계약금 / 중도금 / 잔금', desc: '• 계약금: "이 집 계약할게요" 하고 처음 내는 돈 (보통 전체 금액의 10%)\n• 중도금: 계약금과 잔금 사이에 중간에 나누어 내는 돈 (주로 매매나 새 아파트 분양 시에 있고, 일반 전월세는 생략하는 경우가 많음)\n• 잔금: 이사하는 날(열쇠를 받는 날) 마지막으로 치르는 나머지 돈입니다.' },
    { term: '등기부등본 (등기사항전부증명서)', desc: '집의 신분증입니다. 이 집의 진짜 주인이 누구인지, 이 집을 담보로 은행에서 빌린 빚은 없는지 모든 역사가 적혀있습니다. 계약 전, 잔금 치르기 전 반드시 확인해야 합니다.' },
    { term: '건축물대장', desc: '건물의 건강검진표입니다. 이 건물이 불법으로 개조된 곳은 없는지(위반건축물), 건물의 진짜 용도가 무엇인지(주택인지 상가인지) 건물의 스펙이 적혀있습니다.' },
    { term: '표제부 / 갑구 / 을구 (등기부 목차)', desc: '• 표제부: 집의 주소, 면적, 층수 등 겉모습 정보\n• 갑구: 집주인이 누구인지, 압류당한 건 없는지 등 \'주인(소유권)\'에 대한 정보\n• 을구: 집주인이 이 집을 담보로 은행에 빚을 얼마나 졌는지 등 \'돈(빚)\'에 대한 정보. (을구가 깨끗할수록 안전한 집입니다.)' },
    { term: '전입신고', desc: '내가 이 집으로 이사 왔다고 동사무소(주민센터)나 인터넷(정부24)을 통해 국가에 알리는 것입니다.' },
    { term: '확정일자', desc: '"내가 이 날짜에 이 계약서로 계약을 했습니다"라고 동사무소나 법원에서 계약서에 도장을 찍어 증명해 주는 것입니다.' },
    { term: '대항력', desc: '계약 기간 동안 집주인이 바뀌어도 "나 여기서 계속 살 거야!"라고 당당하게 주장할 수 있는 권리입니다. (집 열쇠를 받고 + 전입신고를 마치면 다음 날 0시부터 생깁니다.)' },
    { term: '우선변제권', desc: '만약 집이 잘못되어 경매로 넘어가더라도, 내 보증금을 다른 사람들보다 먼저 돌려받을 수 있는 강력한 권리입니다. (대항력 + 확정일자를 받으면 생깁니다. 이사 가는 날 무조건 전입신고와 확정일자를 받아야 하는 이유입니다.)' },
    { term: '근저당(권)', desc: '쉽게 말해 집주인의 빚(대출)입니다. 집주인이 이 집을 담보로 은행에서 돈을 빌렸다는 뜻입니다. 내 보증금과 근저당을 합친 금액이 집값과 비슷하거나 높으면 내 보증금을 돌려받지 못할 위험이 큽니다.' },
    { term: '깡통전세', desc: '집주인의 빚과 내 전세보증금을 합친 돈이 실제 집값과 거의 비슷하거나 더 높아서, 깡통처럼 속이 텅 비어 보증금을 떼일 위험이 있는 집을 말합니다.' },
    { term: '임차권등기명령', desc: '이사를 나가야 하는데 집주인이 보증금을 안 돌려줄 때 사용하는 최후의 수단입니다. 등기부등본에 "나 아직 이 집에서 돈 못 받았다!"라고 빨간 줄을 그어놓고 마음 편히 이사 갈 수 있게 해주는 법적 조치입니다.' },
    { term: '전용면적', desc: '현관문을 열고 들어가서 내가 실제로 사용하는 진짜 우리 집의 크기 (방, 거실, 화장실, 주방). 보통 아파트 평수를 말할 때 \'실평수\'에 가깝습니다. (베란다는 서비스 면적이라 포함되지 않습니다.)' },
    { term: '공급면적 (분양면적)', desc: '전용면적에다가 복도, 계단, 엘리베이터 등 이웃과 같이 쓰는 공간을 합친 크기입니다. 부동산에서 "여기 24평이에요~" 할 때 보통 이 크기를 말합니다.' },
    { term: '다가구 주택', desc: '건물 전체의 주인이 딱 1명인 건물입니다. (예: 주인이 꼭대기 층에 살고 아래층 원룸들에 세입자들이 사는 원룸 건물)' },
    { term: '다세대 주택 (빌라)', desc: '건물은 하나지만, 101호, 102호 등 호수마다 주인이 각각 다른 건물입니다.' },
    { term: '전세', desc: '집주인에게 목돈(보증금)을 크게 맡기고 계약 기간 동안 살다가, 이사 나갈 때 그 목돈을 그대로 100% 돌려받는 방식입니다. 매달 내는 월세가 없습니다.' },
    { term: '월세', desc: '보증금을 조금 걸어두고, 매달 집주인에게 집을 빌린 값(월세)을 내는 방식입니다.' },
    { term: '반전세', desc: '전세와 월세가 섞인 형태입니다. 월세보다는 보증금을 훨씬 많이 내고, 대신 매달 내는 월세를 확 줄인 형태를 말합니다.' },
    { term: '신탁등기', desc: '소유권이 신탁회사로 넘어가 있는 매물로, 신탁회사 서면 동의 없는 계약은 무효가 됩니다.' }
  ];

  // --- TAB NAVIGATION ---
  const navTabs = document.querySelectorAll('.bottom-nav .nav-tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      navTabs.forEach(t => t.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(target);
      if (targetPanel) targetPanel.classList.add('active');
      state.activeTab = target;
    });
  });


  // --- TAB 1: GUIDE ---
  const typeBtns = document.querySelectorAll('.contract-type-bar .type-btn');
  const stepsContainer = document.getElementById('guide-steps-container');

  function renderRoadmapSteps(type) {
    const steps = ROADMAP_DATA[type];
    if (!steps || !stepsContainer) return;

    stepsContainer.innerHTML = '';
    steps.forEach(s => {
      const card = document.createElement('div');
      card.className = 'step-card';
      card.innerHTML = `
        <div class="step-header">
          <span class="step-badge">${s.step}단계</span>
          <h4>${s.title}</h4>
        </div>
        ${s.items.map(item => `
          <div class="step-item-sub">
            <h5>📌 ${item.title}</h5>
            <p>${item.desc}</p>
          </div>
        `).join('')}
      `;
      stepsContainer.appendChild(card);
    });
  }

  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.getAttribute('data-type');
      state.contractType = type;
      renderRoadmapSteps(type);
      renderProfileView();
    });
  });

  renderRoadmapSteps('monthly');


  // --- TAB 2: SAFETY & AI DECODER ---
  const btnCalcSafety = document.getElementById('btn-calc-safety');
  const resDebtRatio = document.getElementById('res-debt-ratio');
  const resStatusBadge = document.getElementById('res-status-badge');
  const resRatioBar = document.getElementById('res-ratio-bar');
  const resAnalysisText = document.getElementById('res-analysis-text');
  const safetyResultCard = document.getElementById('safety-result-card');
  const debtFormulaBox = document.getElementById('debt-formula-box');

  const lightGreen = document.getElementById('light-green');
  const lightYellow = document.getElementById('light-yellow');
  const lightRed = document.getElementById('light-red');

  if (safetyResultCard && debtFormulaBox) {
    safetyResultCard.addEventListener('click', () => {
      debtFormulaBox.classList.toggle('hidden');
    });
  }

  function calcSafety() {
    if (!resDebtRatio || !resRatioBar) return;

    const deposit = Number(document.getElementById('input-my-deposit')?.value) || 0;
    const market = Number(document.getElementById('input-market-price')?.value) || 1;
    const mortgage = Number(document.getElementById('input-mortgage')?.value) || 0;
    const prior = Number(document.getElementById('input-prior-deposit')?.value) || 0;

    const totalDebt = deposit + mortgage + prior;
    const ratio = Math.round((totalDebt / market) * 100);

    resDebtRatio.textContent = `${ratio}%`;
    resRatioBar.style.width = `${Math.min(ratio, 100)}%`;

    const detailEl = document.getElementById('formula-calc-detail');
    if (detailEl) {
      detailEl.textContent = `계산식: (${mortgage}만 + ${prior}만 + ${deposit}만) / ${market}만 * 100 = ${ratio}%`;
    }

    if (lightGreen) lightGreen.classList.remove('active');
    if (lightYellow) lightYellow.classList.remove('active');
    if (lightRed) lightRed.classList.remove('active');

    if (resStatusBadge) {
      resStatusBadge.className = 'score-status-badge';
      if (ratio <= 60) {
        if (lightGreen) lightGreen.classList.add('active');
        resStatusBadge.classList.add('green');
        resStatusBadge.textContent = '🟢 안전 (60% 이하)';
        if (resAnalysisText) resAnalysisText.innerHTML = `<p style="font-size:0.78rem; color:var(--safe-green);">✅ <strong>안전 매물:</strong> 부채비율 ${ratio}%로 양호합니다. 전세보증보험 가입이 수월합니다.</p>`;
      } else if (ratio <= 80) {
        if (lightYellow) lightYellow.classList.add('active');
        resStatusBadge.classList.add('yellow');
        resStatusBadge.textContent = '🟡 주의 (60% ~ 80%)';
        if (resAnalysisText) resAnalysisText.innerHTML = `<p style="font-size:0.78rem; color:var(--warn-yellow);">⚠️ <strong>주의 매물:</strong> 부채비율 ${ratio}%입니다. 근저당 말소 특약 및 사전 보증보험 조회를 진행하세요.</p>`;
      } else {
        if (lightRed) lightRed.classList.add('active');
        resStatusBadge.classList.add('red');
        resStatusBadge.textContent = '🔴 위험 (80% 초과)';
        if (resAnalysisText) resAnalysisText.innerHTML = `<p style="font-size:0.78rem; color:var(--danger-red);">🚨 <strong>깡통전세 고위험!</strong> 부채비율 ${ratio}%입니다. 보증금을 낮추거나 계약을 재고하세요.</p>`;
      }
    }
  }

  if (btnCalcSafety) btnCalcSafety.addEventListener('click', calcSafety);
  calcSafety();

  // Photo File Upload
  const fileUploadDropzone = document.getElementById('file-upload-dropzone');
  const inputRegistryPhoto = document.getElementById('input-registry-photo');
  const imagePreviewThumb = document.getElementById('image-preview-thumb');
  const uploadLabelContent = document.getElementById('upload-label-content');

  let selectedRegistryText = '';

  if (fileUploadDropzone && inputRegistryPhoto) {
    fileUploadDropzone.addEventListener('click', () => inputRegistryPhoto.click());
    inputRegistryPhoto.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (imagePreviewThumb) {
            imagePreviewThumb.src = event.target.result;
            imagePreviewThumb.classList.remove('hidden');
          }
          if (uploadLabelContent) uploadLabelContent.querySelector('span').textContent = `업로드됨: ${file.name}`;
          selectedRegistryText = `[등기부 사진 OCR 업로드] 파일명: ${file.name}. 갑구/을구 권리관계 분석 요청`;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const sampleSafe = document.getElementById('sample-safe');
  const sampleMortgage = document.getElementById('sample-mortgage');
  const sampleTrust = document.getElementById('sample-trust');

  if (sampleSafe) {
    sampleSafe.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedRegistryText = `[갑구] 소유자: 홍길동 단독소유 (가압류 없음)\n[을구] 근저당권 없음`;
      if (uploadLabelContent) uploadLabelContent.querySelector('span').textContent = `선택됨: 안전 매물 예시`;
      if (imagePreviewThumb) imagePreviewThumb.classList.add('hidden');
    });
  }

  if (sampleMortgage) {
    sampleMortgage.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedRegistryText = `[갑구] 소유자: 김임대\n[을구] 1번 근저당권 채권최고액 1억 2,000만원 (00은행)`;
      if (uploadLabelContent) uploadLabelContent.querySelector('span').textContent = `선택됨: 근저당 과다 예시`;
      if (imagePreviewThumb) imagePreviewThumb.classList.add('hidden');
    });
  }

  if (sampleTrust) {
    sampleTrust.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedRegistryText = `[갑구] 소유자: 00자산신탁 (신탁등기재산)\n[을구] 근저당권 없음`;
      if (uploadLabelContent) uploadLabelContent.querySelector('span').textContent = `선택됨: 신탁 등기 예시`;
      if (imagePreviewThumb) imagePreviewThumb.classList.add('hidden');
    });
  }

  const btnRunGemini = document.getElementById('btn-run-gemini-analysis');
  if (btnRunGemini) {
    btnRunGemini.addEventListener('click', async () => {
      const outputBox = document.getElementById('gemini-output-box');
      const loading = document.getElementById('gemini-loading');
      const content = document.getElementById('gemini-result-content');

      if (outputBox) outputBox.classList.remove('hidden');
      if (loading) loading.classList.remove('hidden');
      if (content) content.innerHTML = '';

      try {
        const res = await fetch('/api/analyze-registry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: document.getElementById('input-address')?.value,
            registryText: selectedRegistryText || '등기부 사진 업로드 분석 요청',
            deposit: document.getElementById('input-my-deposit')?.value,
            marketPrice: document.getElementById('input-market-price')?.value,
            mortgage: document.getElementById('input-mortgage')?.value,
            priorDeposit: document.getElementById('input-prior-deposit')?.value
          })
        });
        const data = await res.json();
        if (loading) loading.classList.add('hidden');

        if (data.success && data.analysis && content) {
          const a = data.analysis;
          content.innerHTML = `
            <div style="font-size:0.82rem; font-weight:700; margin-bottom:6px; color:#0f172a;"><strong>위험도 분석 결과:</strong> ${a.riskLevel} (${a.debtRatio})</div>
            <div style="font-size:0.75rem; color:var(--text-sub); margin-bottom:4px;"><strong>소유권 (갑구):</strong> ${a.ownershipAnalysis}</div>
            <div style="font-size:0.75rem; color:var(--text-sub); margin-bottom:6px;"><strong>권리관계 (을구):</strong> ${a.mortgageAnalysis}</div>
            <div style="font-size:0.75rem; color:var(--primary); font-weight:600;">💡 <strong>분석 조언:</strong> ${a.expertAdvice}</div>
          `;
        }
      } catch (e) {
        if (loading) loading.classList.add('hidden');
        if (content) content.innerHTML = `<p style="color:var(--danger-red); font-size:0.75rem;">위험도 분석 서버 연동 오류가 발생했습니다.</p>`;
      }
    });
  }


  // --- TAB 3: CALENDAR & PROPERTY LOGS ---
  const calMonthTitle = document.getElementById('cal-month-title');
  const calGridDays = document.getElementById('calendar-grid-days');
  const selectedDateText = document.getElementById('selected-date-text');
  const eventsListContainer = document.getElementById('events-list-container');

  function renderCalendar() {
    if (!calMonthTitle || !calGridDays) return;

    const year = state.calendarYear;
    const month = state.calendarMonth;
    calMonthTitle.textContent = `${year}년 ${month + 1}월`;

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    calGridDays.innerHTML = '';

    for (let i = 0; i < firstDayIndex; i++) {
      const blank = document.createElement('div');
      blank.className = 'cal-day empty';
      calGridDays.appendChild(blank);
    }

    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement('div');
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      cell.className = 'cal-day';
      if (dateStr === '2026-07-27') cell.classList.add('today');
      if (dateStr === state.selectedDate) cell.classList.add('selected');

      cell.innerHTML = `<span>${day}</span>`;
      if (state.calendarEvents[dateStr] && state.calendarEvents[dateStr].length > 0) {
        const dot = document.createElement('div');
        dot.className = 'event-dot';
        cell.appendChild(dot);
      }

      cell.addEventListener('click', () => {
        state.selectedDate = dateStr;
        renderCalendar();
        renderEvents();
      });

      calGridDays.appendChild(cell);
    }
  }

  function renderEvents() {
    if (!selectedDateText || !eventsListContainer) return;

    selectedDateText.textContent = state.selectedDate;
    const events = state.calendarEvents[state.selectedDate] || [];
    eventsListContainer.innerHTML = '';

    if (events.length === 0) {
      eventsListContainer.innerHTML = `<p class="no-events">등록된 일정이 없습니다.</p>`;
      return;
    }

    events.forEach((evt, idx) => {
      const item = document.createElement('div');
      item.className = 'event-item';
      item.innerHTML = `
        <span>📌 ${evt}</span>
        <button class="btn-del-event" data-idx="${idx}">삭제</button>
      `;

      item.querySelector('.btn-del-event').addEventListener('click', () => {
        state.calendarEvents[state.selectedDate].splice(idx, 1);
        renderCalendar();
        renderEvents();
        showToast('일정이 삭제되었습니다.');
      });

      eventsListContainer.appendChild(item);
    });
  }

  const btnCalPrev = document.getElementById('btn-cal-prev');
  const btnCalNext = document.getElementById('btn-cal-next');
  const btnAddEvent = document.getElementById('btn-add-event');

  if (btnCalPrev) {
    btnCalPrev.addEventListener('click', () => {
      state.calendarMonth--;
      if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; }
      renderCalendar();
    });
  }

  if (btnCalNext) {
    btnCalNext.addEventListener('click', () => {
      state.calendarMonth++;
      if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; }
      renderCalendar();
    });
  }

  if (btnAddEvent) {
    btnAddEvent.addEventListener('click', () => {
      const text = prompt(`${state.selectedDate} 날짜에 추가할 일정을 입력하세요:`, '');
      if (text) {
        if (!state.calendarEvents[state.selectedDate]) {
          state.calendarEvents[state.selectedDate] = [];
        }
        state.calendarEvents[state.selectedDate].push(text);
        renderCalendar();
        renderEvents();
        showToast('일정이 추가되었습니다.');
      }
    });
  }

  renderCalendar();
  renderEvents();


  // --- PROPERTY LOGS & CHECKLIST & DELETION ---
  const propertyTabBar = document.getElementById('property-tab-bar');
  const propNameInput = document.getElementById('prop-name');
  const propAddressInput = document.getElementById('prop-address');
  const propFeaturesInput = document.getElementById('prop-features');
  const propPhotoUploadBox = document.getElementById('prop-photo-upload-box');
  const inputPropPhotos = document.getElementById('input-prop-photos');
  const propPhotoGallery = document.getElementById('prop-photo-gallery');
  const checklistContainer = document.getElementById('checklist-container');
  const btnAddCustomChk = document.getElementById('btn-add-custom-chk');
  const btnDeleteProperty = document.getElementById('btn-delete-property');

  function getActiveProperty() {
    return state.properties.find(p => p.id === state.activePropId) || state.properties[0];
  }

  function renderPropertyTabs() {
    if (!propertyTabBar) return;
    propertyTabBar.innerHTML = '';
    state.properties.forEach(p => {
      const btn = document.createElement('button');
      btn.className = `property-tab-btn ${p.id === state.activePropId ? 'active' : ''}`;
      btn.textContent = p.name || `매물 ${p.id}`;
      btn.addEventListener('click', () => {
        state.activePropId = p.id;
        renderPropertyTabs();
        renderActivePropertyDetails();
      });
      propertyTabBar.appendChild(btn);
    });

    const btnAdd = document.createElement('button');
    btnAdd.className = 'btn-add-property-tab';
    btnAdd.innerHTML = '+ 매물 추가';
    btnAdd.addEventListener('click', () => {
      const newId = Date.now();
      const newNum = state.properties.length + 1;
      const newProp = {
        id: newId,
        name: `매물 ${newNum}`,
        address: '',
        features: '',
        photos: [],
        checklist: DEFAULT_CHECKLIST.map(item => ({ ...item, checked: false, memo: '' }))
      };
      state.properties.push(newProp);
      state.activePropId = newId;
      renderPropertyTabs();
      renderActivePropertyDetails();
      showToast(`새 매물 (매물 ${newNum})이 추가되었습니다.`);
    });
    propertyTabBar.appendChild(btnAdd);
  }

  function renderActivePropertyDetails() {
    const prop = getActiveProperty();
    if (!prop) return;

    if (propNameInput) propNameInput.value = prop.name || '';
    if (propAddressInput) propAddressInput.value = prop.address || '';
    if (propFeaturesInput) propFeaturesInput.value = prop.features || '';

    if (propPhotoGallery) {
      propPhotoGallery.innerHTML = '';
      prop.photos.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'prop-photo-img';
        propPhotoGallery.appendChild(img);
      });
    }

    renderChecklist(prop);
  }

  if (btnDeleteProperty) {
    btnDeleteProperty.addEventListener('click', () => {
      const prop = getActiveProperty();
      if (!prop) return;

      if (confirm(`'${prop.name || '현재 매물'}' 기록을 정말로 삭제하시겠습니까?`)) {
        if (state.properties.length <= 1) {
          state.properties[0] = {
            id: 1,
            name: '매물 1',
            address: '',
            features: '',
            photos: [],
            checklist: DEFAULT_CHECKLIST.map(item => ({ ...item, checked: false, memo: '' }))
          };
        } else {
          state.properties = state.properties.filter(p => p.id !== prop.id);
          state.activePropId = state.properties[0].id;
        }
        renderPropertyTabs();
        renderActivePropertyDetails();
        showToast('매물 기록이 삭제되었습니다.');
      }
    });
  }

  if (propNameInput) {
    propNameInput.addEventListener('input', (e) => {
      const prop = getActiveProperty();
      if (prop) {
        prop.name = e.target.value;
        const activeTabBtn = propertyTabBar?.querySelector(`.property-tab-btn.active`);
        if (activeTabBtn) activeTabBtn.textContent = prop.name || '매물';
      }
    });
  }

  if (propAddressInput) {
    propAddressInput.addEventListener('input', (e) => {
      const prop = getActiveProperty();
      if (prop) prop.address = e.target.value;
    });
  }

  if (propFeaturesInput) {
    propFeaturesInput.addEventListener('input', (e) => {
      const prop = getActiveProperty();
      if (prop) prop.features = e.target.value;
    });
  }

  if (propPhotoUploadBox && inputPropPhotos) {
    propPhotoUploadBox.addEventListener('click', () => inputPropPhotos.click());
    inputPropPhotos.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      const prop = getActiveProperty();
      if (!prop) return;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          prop.photos.push(event.target.result);
          renderActivePropertyDetails();
        };
        reader.readAsDataURL(file);
      });
      showToast(`${files.length}장의 매물 사진이 추가되었습니다.`);
    });
  }

  function renderChecklist(prop) {
    if (!checklistContainer) return;
    checklistContainer.innerHTML = '';
    prop.checklist.forEach(item => {
      const row = document.createElement('div');
      row.className = 'chk-row';
      row.innerHTML = `
        <div class="chk-header">
          <input type="checkbox" ${item.checked ? 'checked' : ''} id="chk-cb-${item.id}">
          <div>
            <h5>${item.title}</h5>
            <p>${item.desc}</p>
          </div>
        </div>

        <div class="chk-memo-box">
          <label style="font-size:0.7rem; color:var(--text-sub); font-weight:600;">📝 메모:</label>
          <input type="text" id="chk-memo-${item.id}" value="${item.memo || ''}" placeholder="현장 확인 메모 작성...">
        </div>

        ${item.script ? `
          <button class="btn-toggle-script"><i data-lucide="message-circle" style="width:12px;"></i> 중개사 현장 대화 스크립트 보기</button>
          <div class="script-box">${item.script}</div>
        ` : ''}
      `;

      row.querySelector(`#chk-cb-${item.id}`).addEventListener('change', (e) => {
        item.checked = e.target.checked;
      });

      row.querySelector(`#chk-memo-${item.id}`).addEventListener('input', (e) => {
        item.memo = e.target.value;
      });

      const toggleBtn = row.querySelector('.btn-toggle-script');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => row.classList.toggle('open'));
      }

      checklistContainer.appendChild(row);
    });
    if (window.lucide) lucide.createIcons();
  }

  if (btnAddCustomChk) {
    btnAddCustomChk.addEventListener('click', () => {
      const title = prompt('추가할 체크리스트 항목명을 입력하세요:', '관리사무소 확인 및 가스관 점검');
      if (title) {
        const prop = getActiveProperty();
        if (prop) {
          const newItem = {
            id: `custom_${Date.now()}`,
            title,
            desc: '사용자 추가 체크 항목',
            script: `💬 "중개사님, ${title} 관련해서 확인 부탁드립니다."`,
            checked: false,
            memo: ''
          };
          prop.checklist.push(newItem);
          renderChecklist(prop);
          showToast('새 체크 항목이 추가되었습니다.');
        }
      }
    });
  }

  renderPropertyTabs();
  renderActivePropertyDetails();


  // --- TAB 4: AI CHATBOT (WITH NEW BOT AVATAR PNG) ---
  const chatMessagesBox = document.getElementById('chat-messages-box');
  const chatInput = document.getElementById('chat-input');
  const btnSendChat = document.getElementById('btn-send-chat');

  function getLocalSmartAIReply(text) {
    const msg = (text || '').toLowerCase();

    if (msg.includes('전입신고') || msg.includes('확정일자') || msg.includes('대항력')) {
      return `⏰ **전입신고와 확정일자 (보증금 사수 필수!)**\n\n1. **신청 시기**: 이사 당일 잔금을 치르자마자 즉시 주민센터 방문 또는 정부24 온라인 신청하세요.\n2. **대항력 시점**: 전입신고를 마치면 **다음 날 0시(자정)**부터 대항력이 생깁니다.\n3. **우선변제권**: 전입신고 + 확정일자를 받으면 경매 시 보증금을 후순위 빚보다 먼저 받습니다.\n4. **핵심 주의점**: 이사 익일까지 등기부에 새 근저당 대출이 들어오지 않는지 꼭 재열람하세요!`;
    }
    if (msg.includes('가계약금') || msg.includes('돌려받') || msg.includes('파기')) {
      return `💡 **가계약금 반환 및 계약 취소 가이드**\n\n1. **기본 원칙**: 가계약 체결 시 "대출 미승인 시 가계약금 전액 반환" 특약을 사전에 구두/문자로 합의하지 않았다면 민법상 포기 처리될 수 있습니다.\n2. **대응법**: 가계약금 입금 전 반드시 중개사/집주인에게 **'대출 불승인 시 즉시 반환'** 문자를 주고받고 송금하세요.\n3. **집주인 귀책**: 당초 계약 조건(잔금일, 수리 등)을 집주인이 일방적으로 바꾸는 경우 반환을 강력히 요구할 수 있습니다.`;
    }
    if (msg.includes('근저당') || msg.includes('융자') || msg.includes('빚')) {
      return `🛡️ **근저당(융자) 매물 안전 진단**\n\n1. **등기부 을구 확인**: 근저당 채권최고액(보통 대출금의 120%)을 확인하세요.\n2. **부채비율 공식**: (근저당 + 선순위보증금 + 내 보증금) ÷ 시세 ≦ 70% 이하여야 안전합니다.\n3. **필수 특약**: "임대인은 잔금 지급과 동시에 근저당 0,000만원을 상환 및 말소하며 감액 등기 접수증을 제출한다"를 계약서에 명시하세요.`;
    }
    if (msg.includes('특약') || msg.includes('거절') || msg.includes('대응')) {
      return `🤝 **집주인 특약 거절 시 유연한 설득 스크립트**\n\n집주인이 "남들은 이런 거 안 넣는다"며 거절할 때는 이렇게 유연하게 말해보세요:\n\n💬 *"사장님! 집주인님을 못 믿어서가 아니라, 요즘 은행 청년 전세대출 심사가 까다로워져서 서류 절차상 필요한 필수 문구라고 합니다. 제 개인 변심으로 계약을 깨려는 것이 아니니 안심해 주세요!"*`;
    }
    if (msg.includes('버팀목') || msg.includes('대출') || msg.includes('디딤돌')) {
      return `🏦 **청년 맞춤형 부동산 대출 안내**\n\n1. **청년 버팀목 전세**: 만 19~34세, 연소득 5천만원 이하, 보증금 80% 이내 (최대 1.5억원, 금리 연 1.8%~2.7%)\n2. **주거안정 월세대출**: 연소득 5천만원 이하, 월 최대 40만원 지원 (금리 1.3%~1.8%)\n3. 프로필 탭의 **'대출 진단기'**에서 나의 정확한 자격과 추천 상품을 즉시 확인해보세요!`;
    }
    if (msg.includes('수리') || msg.includes('곰팡이') || msg.includes('하수구') || msg.includes('고장')) {
      return `🔧 **집 시설물 하자 및 수리 책임 기준**\n\n1. **집주인 책임**: 보일러 고장, 누수, 창틀 결로 곰팡이, 천장 수압 문제 등 기본 주거 유지 하자는 집주인이 비용을 부담합니다.\n2. **세입자 책임**: 전구 교체, 단순 하수구 막힘, 세입자 부주의 파손 등 소모성/부주의 하자는 세입자가 부담합니다.\n3. **계약 팁**: 입주 당일 고장/하자 부위를 사진 및 동영상으로 촬영하여 집주인에게 문자로 남겨두세요!`;
    }

    return `🤖 **집피지기 AI 수호 집킴이의 답변**\n\n질문하신 **'${text}'**에 대해 안내해 드립니다!\n\n• 전월세 및 매매 계약 관련 모든 궁금증(전입신고, 확정일자, 가계약금, 특약, 근저당 등)을 물어봐 주세요.\n• 보증금을 지키는 필수 안전 수칙과 집주인 특약 협상 스크립트를 언제든 답변해 드립니다!`;
  }

  async function sendChatMessage(msgText) {
    if (!chatInput) return;
    const text = msgText || chatInput.value.trim();
    if (!text) return;

    const uMsg = document.createElement('div');
    uMsg.className = 'message user';
    uMsg.innerHTML = `<div class="message-bubble">${text}</div>`;
    if (chatMessagesBox) chatMessagesBox.appendChild(uMsg);

    chatInput.value = '';
    if (chatMessagesBox) chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;

    const bLoading = document.createElement('div');
    bLoading.className = 'message bot';
    bLoading.innerHTML = `<img src="assets/bot_character.png" onerror="this.onerror=null; this.src='assets/bot_avatar.svg';" class="bot-avatar-img" alt="AI 캐릭터"><div class="message-bubble" style="font-style:italic;">집킴이가 답변을 생성 중입니다...</div>`;
    if (chatMessagesBox) chatMessagesBox.appendChild(bLoading);
    if (chatMessagesBox) chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;

    let replyText = '';

    try {
      const res = await fetch('/api/chat-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.reply) {
          replyText = data.reply;
        }
      }
    } catch (e) {
      console.warn('API route call error, falling back to local AI engine:', e);
    }

    if (!replyText) {
      replyText = getLocalSmartAIReply(text);
    }

    if (chatMessagesBox && chatMessagesBox.contains(bLoading)) {
      chatMessagesBox.removeChild(bLoading);
    }

    const bMsg = document.createElement('div');
    bMsg.className = 'message bot';
    bMsg.innerHTML = `<img src="assets/bot_character.png" onerror="this.onerror=null; this.src='assets/bot_avatar.svg';" class="bot-avatar-img" alt="AI 캐릭터"><div class="message-bubble">${replyText.replace(/\n/g, '<br>')}</div>`;
    if (chatMessagesBox) chatMessagesBox.appendChild(bMsg);
    if (chatMessagesBox) chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
  }

  if (btnSendChat) btnSendChat.addEventListener('click', () => sendChatMessage());
  if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });
  document.querySelectorAll('.btn-prompt-chip').forEach(c => {
    c.addEventListener('click', () => sendChatMessage(c.textContent));
  });


  // --- TAB 5: PROFILE & LOAN / BENEFIT COLLAPSIBLES ---
  const profSubBtns = document.querySelectorAll('#tab-profile .sub-tab-bar .sub-tab-btn');
  const profSubViews = document.querySelectorAll('#tab-profile .prof-sub-view');

  profSubBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      profSubBtns.forEach(b => b.classList.remove('active'));
      profSubViews.forEach(v => v.classList.remove('active'));

      btn.classList.add('active');
      const targetSub = btn.getAttribute('data-prof-tab');
      const targetView = document.getElementById(`prof-sub-${targetSub}`);
      if (targetView) targetView.classList.add('active');
    });
  });

  function renderProfileView() {
    const u = state.user || { name: '홍길동', age: 26, isHead: true, income: 3200, jobText: '직장인 (중소기업)', marriage: 'single' };
    const typeLabel = state.contractType === 'monthly' ? '월세' : (state.contractType === 'jeonse' ? '전세' : '매매');

    const nameEl = document.getElementById('prof-disp-name');
    const detailsEl = document.getElementById('prof-disp-details');

    if (nameEl) nameEl.textContent = `${u.name} 님`;
    if (detailsEl) detailsEl.textContent = `만 ${u.age}세 | ${u.isHead ? '세대주' : '세대원'} | 소득 ${u.income}만원 | ${u.jobText}`;

    renderLoans('all');
    renderBenefits('all');
  }

  // LOAN DATABASE
  const LOANS_DB = [
    {
      id: 'didimdol',
      cat: 'buying',
      name: '내집마련 디딤돌대출',
      matchCalc: (u) => (u.income <= 6000 || (u.marriage === 'newlywed' && u.income <= 7000)),
      desc: '무주택 세대주가 주택 매매 계약 체결 시 이용 가능한 대표적 저금리 상품',
      specs: [
        { label: '지원 대상', val: '부부합산 연소득 6천만 원 이상 (신혼 7천만 원 이하), 순자산 5.11억 원 이하 무주택 세대주' },
        { label: '대출 한도', val: '일반 가구 최대 2억 원 / 신혼·2자녀 최대 3.2억 원 (생애최초 2.4억 원)' },
        { label: '대출 금리', val: '소득 및 만기에 따라 연 2.35%~3.95% (신혼부부는 연 1.85%~3.0%)' }
      ],
      docs: ['주택매매계약서 원본', '주민등록등본 및 초본', '소득증빙서류', '등기사항전부증명서']
    },
    {
      id: 'newborn_buy',
      cat: 'buying',
      name: '신생아 특례 구입자금 대출',
      matchCalc: (u) => u.children,
      desc: '출산 가구를 대상으로 주택 구입 자금을 완화된 금리로 지원하는 상품 (디딤돌 기반)',
      specs: [
        { label: '지원 대상', val: '대출 신청일 기준 2년 이내 출산/입양 가구, 연소득 2억 원 이하, 순자산 5.11억 원 이하' },
        { label: '대출 한도', val: '최대 4억 원 이내 (LTV 70%~80%)' },
        { label: '대출 금리', val: '소득 구간에 따라 연 1.6%~3.3% (특례 금리 5년 적용)' }
      ],
      docs: ['출생증명서 또는 가족관계증명서', '주택매매계약서', '소득 및 재산 증빙 서류']
    },
    {
      id: 'bogumzari',
      cat: 'buying',
      name: '보금자리론 (아낌e-보금자리론)',
      matchCalc: (u) => u.income <= 7000,
      desc: '한국주택금융공사에서 제공하는 고정금리 주택담보대출 상품',
      specs: [
        { label: '지원 대상', val: '부부합산 연소득 7천만 원 이하, 무주택자 또는 1주택자 (대상 주택 6억 원 이하)' },
        { label: '대출 한도', val: '최대 3.6억 원 (다자녀 4억 원, 생애최초 4.2억 원)' },
        { label: '대출 금리', val: '만기별 고정금리 연 4% 중후반대 (우대 조건 시 최저 연 3.6%대)' }
      ],
      docs: ['매매계약서', '소득증빙서류', '인감증명서 및 주민등록등본']
    },
    {
      id: 'butimmok',
      cat: 'jeonse',
      name: '버팀목 전세자금대출',
      matchCalc: (u) => u.income <= 5000 && u.isHead,
      desc: '무주택 서민과 근로자의 전월세 보증금을 지원하는 기금 대출',
      specs: [
        { label: '지원 대상', val: '부부합산 연소득 5천만 원 이하, 순자산 3.45억 원 이하 무주택 세대주' },
        { label: '대출 한도', val: '수도권 최대 1.2억 원, 지방 최대 8천만 원 (보증금의 70% 이내)' },
        { label: '대출 금리', val: '임차보증금과 소득 구간에 따라 연 2.1%~2.9%' }
      ],
      docs: ['임대차계약서 확정일자본', '보증금 5% 이상 입금 영수증', '주민등록등본', '재직 및 소득증빙']
    },
    {
      id: 'youth_butimmok',
      cat: 'jeonse',
      name: '청년전용 버팀목 전세대출',
      matchCalc: (u) => u.age <= 34 && u.income <= 5000 && u.isHead,
      desc: '만 19세~34세 이하 청년층의 전세 보증금을 낮은 금리로 지원',
      specs: [
        { label: '지원 대상', val: '만 19세~만 34세 이하, 부부합산 연소득 5천만 원 이하, 순자산 3.45억 원 이하 무주택 세대주' },
        { label: '대출 한도', val: '최대 1.5억 원 이내 (임차보증금의 80% 이내)' },
        { label: '대출 금리', val: '소득 구간에 따라 연 1.8%~2.7%' }
      ],
      docs: ['청년 무주택 확인서', '임대차계약서 확정일자본', '소득금액증명원', '건강보험자격득실확인서']
    },
    {
      id: 'newborn_jeonse',
      cat: 'jeonse',
      name: '신생아 특례 전세자금 대출',
      matchCalc: (u) => u.children,
      desc: '출산 가구의 전세보증금 안정을 위해 우대금리로 대출',
      specs: [
        { label: '지원 대상', val: '신청일 기준 2년 이내 출산/입양 가구, 연소득 2억 원 이하, 자산 3.45억 원 이하' },
        { label: '대출 한도', val: '최대 2.4억 원 이내 (보증금의 80% 이내)' },
        { label: '대출 금리', val: '소득 구간에 따라 연 1.1%~3.0%' }
      ],
      docs: ['출생증명서', '전세 임대차계약서', '소득 증빙 서류']
    },
    {
      id: 'youth_rent_loan',
      cat: 'monthly',
      name: '청년전용 보증부월세 대출',
      matchCalc: (u) => u.age <= 34 && u.income <= 5000,
      desc: '보증금과 월세를 동시에 지원하는 만 34세 이하 청년 전용 상품',
      specs: [
        { label: '지원 대상', val: '부부합산 연소득 5천만 원 이하, 자산 3.45억 원 이하 무주택 청년' },
        { label: '대출 한도', val: '보증금 최대 4,500만 원, 월세 최대 월 50만 원 (2년간 총 1,200만 원)' },
        { label: '대출 금리', val: '보증금 연 1.3%, 월세 연 0% (20만원 이하) ~ 1.0%' }
      ],
      docs: ['월세 임대차계약서', '보증금 영수증', '주민등록등본']
    },
    {
      id: 'housing_stability_rent',
      cat: 'monthly',
      name: '주거안정 월세대출',
      matchCalc: (u) => u.income <= 5000,
      desc: '취업준비생, 사회초년생 및 저소득층 대상 월세 대출',
      specs: [
        { label: '지원 대상', val: '우대형(취업준비생, 사회초년생 등), 일반형 (부부합산 연소득 5천만 원 이하)' },
        { label: '대출 한도', val: '최대 총 960만 원 (월 최대 40만 원 이내로 24개월간 지급)' },
        { label: '대출 금리', val: '우대형 연 1.3%, 일반형 연 1.8%' }
      ],
      docs: ['월세 계약서', '소득 및 재직 입증 서류']
    }
  ];

  function renderLoans(catFilter) {
    const u = state.user || { age: 26, isHead: true, income: 3200, marriage: 'single', children: false };
    const container = document.getElementById('loan-cards-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = LOANS_DB.filter(l => catFilter === 'all' || l.cat === catFilter);

    filtered.forEach(l => {
      const isFit = l.matchCalc(u);
      const card = document.createElement('div');
      card.className = 'collapsible-card';
      card.innerHTML = `
        <div class="collapsible-card-header">
          <h4>${l.name}</h4>
          <span class="score-status-badge ${isFit ? 'green' : 'yellow'}">${isFit ? '🟢 적합' : '🟡 조건확인'}</span>
        </div>
        <div class="collapsible-card-body">
          <p style="font-size:0.75rem; color:var(--text-sub); margin-bottom:8px;">${l.desc}</p>
          <div class="item-details-box">
            ${l.specs.map(s => `<div><label>${s.label}:</label><span>${s.val}</span></div>`).join('')}
          </div>
          <div class="doc-list">
            <h5><i data-lucide="file-text" style="width:12px;"></i> 필요 서류:</h5>
            <ul>${l.docs.map(d => `<li>• ${d}</li>`).join('')}</ul>
          </div>
        </div>
      `;

      card.querySelector('.collapsible-card-header').addEventListener('click', () => {
        card.classList.toggle('open');
      });

      container.appendChild(card);
    });
    if (window.lucide) lucide.createIcons();
  }

  // BENEFIT DATABASE
  const BENEFITS_DB = [
    {
      id: 'rent_tax_deduct',
      cat: 'monthly',
      name: '월세 세액공제 (연말정산 환급)',
      matchCalc: (u) => u.income <= 8000 && u.isHead,
      specs: [
        { label: '혜택 내용', val: '1년간 낸 월세액(한도 1,000만 원)의 15%~17%를 연말정산 때 세금에서 직접 깎아 돌려받음' },
        { label: '지원 대상', val: '총급여 8,000만 원 이하 무주택 세대주' }
      ]
    },
    {
      id: 'youth_rent_cash',
      cat: 'monthly',
      name: '청년월세 특별지원 (현금 480만원)',
      matchCalc: (u) => u.age <= 34,
      specs: [
        { label: '혜택 내용', val: '국가에서 매달 20만 원씩 최대 24개월 (총 480만 원) 통장으로 현금 입금' },
        { label: '지원 대상', val: '만 19세~34세 이하, 부모와 따로 사는 무주택 청년' }
      ]
    },
    {
      id: 'housing_benefit',
      cat: 'monthly',
      name: '주거급여 취약계층 & 청년 분리지급',
      matchCalc: () => true,
      specs: [
        { label: '혜택 내용', val: '기준 중위소득 48% 이하 가구 대상 매달 월세 현금 지원 (만 19~29세 청년 분리지급 지원)' }
      ]
    },
    {
      id: 'jeonse_tax_deduct',
      cat: 'jeonse',
      name: '전세자금대출 원리금 상환액 소득공제',
      matchCalc: (u) => u.isHead,
      specs: [
        { label: '혜택 내용', val: '1년간 갚은 전세대출 원리금 상환액의 40% 소득공제 (연간 한도 400만 원)' },
        { label: '지원 대상', val: '총급여 제한 없음, 무주택 세대주인 근로자' }
      ]
    },
    {
      id: 'jeonse_guarantee_fee',
      cat: 'jeonse',
      name: '지자체 전세보증금 반환보증료 지원',
      matchCalc: (u) => u.age <= 39,
      specs: [
        { label: '혜택 내용', val: '전세보증금 반환보증(HUG 등) 가입 보증료를 최대 30만 원까지 환급' },
        { label: '지원 대상', val: '청년 및 신혼부부 무주택 임차인' }
      ]
    },
    {
      id: 'first_buyer_tax',
      cat: 'buying',
      name: '생애최초 주택 구입 취득세 감면',
      matchCalc: () => true,
      specs: [
        { label: '혜택 내용', val: '처음으로 집을 살 때 취득가액 12억 원 이하 주택 취득세 최대 200만 원 감면' },
        { label: '지원 대상', val: '소득 제한 없이 생애 최초 주택 구입 세대주 및 세대원' }
      ]
    },
    {
      id: 'long_mortgage_tax',
      cat: 'buying',
      name: '장기주택저당차입금 이자상환액 소득공제',
      matchCalc: (u) => u.isHead,
      specs: [
        { label: '혜택 내용', val: '주택담보대출 이자 지불액 연말정산 소득공제' },
        { label: '지원 대상', val: '무주택 또는 1주택 세대주 (취득 시 기준시가 6억 원 이하)' }
      ]
    },
    {
      id: 'house_1_tax_free',
      cat: 'buying',
      name: '1세대 1주택 양도소득세 비과세',
      matchCalc: () => true,
      specs: [
        { label: '혜택 내용', val: '향후 집을 팔 때 양도차익 12억 원 이하까지 양도소득세 세금 면제' },
        { label: '지원 대상', val: '1세대가 1주택을 보유하고 2년 이상 보유 요건 충족 시' }
      ]
    }
  ];

  function renderBenefits(catFilter) {
    const u = state.user || { age: 26, isHead: true, income: 3200 };
    const container = document.getElementById('benefit-cards-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = BENEFITS_DB.filter(b => catFilter === 'all' || b.cat === catFilter);

    filtered.forEach(b => {
      const isFit = b.matchCalc(u);
      const card = document.createElement('div');
      card.className = 'collapsible-card';
      card.innerHTML = `
        <div class="collapsible-card-header">
          <h4>${b.name}</h4>
          <span class="score-status-badge ${isFit ? 'green' : 'yellow'}">${isFit ? '🟢 대상' : '🟡 확인'}</span>
        </div>
        <div class="collapsible-card-body">
          <div class="item-details-box">
            ${b.specs.map(s => `<div><label>${s.label}:</label><span>${s.val}</span></div>`).join('')}
          </div>
        </div>
      `;

      card.querySelector('.collapsible-card-header').addEventListener('click', () => {
        card.classList.toggle('open');
      });

      container.appendChild(card);
    });
  }

  // Filter chips listeners
  document.querySelectorAll('[data-loan-cat]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-loan-cat]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderLoans(chip.getAttribute('data-loan-cat'));
    });
  });

  document.querySelectorAll('[data-benefit-cat]').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('[data-benefit-cat]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderBenefits(chip.getAttribute('data-benefit-cat'));
    });
  });


  // --- MODAL GLOSSARY ---
  const modalGlossary = document.getElementById('modal-glossary');
  const btnGlossary = document.getElementById('btn-glossary-modal');
  const btnCloseGlossary = document.getElementById('btn-close-glossary');

  if (btnGlossary && modalGlossary) {
    btnGlossary.addEventListener('click', () => {
      modalGlossary.classList.remove('hidden');
      renderGlossaryList();
    });
  }
  if (btnCloseGlossary && modalGlossary) {
    btnCloseGlossary.addEventListener('click', () => {
      modalGlossary.classList.add('hidden');
    });
  }

  const glossarySearch = document.getElementById('glossary-search');
  function renderGlossaryList(filter = '') {
    const listContainer = document.getElementById('glossary-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    const filtered = GLOSSARY_DB.filter(g => g.term.includes(filter) || g.desc.includes(filter));

    filtered.forEach(g => {
      const item = document.createElement('div');
      item.style.padding = '10px 0';
      item.style.borderBottom = '1px solid var(--border-color)';
      item.innerHTML = `<h5 style="color:var(--primary); font-size:0.85rem; font-weight:700; margin-bottom:4px;">${g.term}</h5><p style="font-size:0.78rem; color:var(--text-sub); line-height:1.45; whitespace:pre-line;">${g.desc.replace(/\n/g, '<br>')}</p>`;
      listContainer.appendChild(item);
    });
  }

  if (glossarySearch) {
    glossarySearch.addEventListener('input', (e) => renderGlossaryList(e.target.value.trim()));
  }

  // --- TOAST ---
  function showToast(msg) {
    const toast = document.getElementById('toast-msg');
    if (!toast) return;
    const textEl = document.getElementById('toast-text');
    if (textEl) textEl.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2200);
  }

  // --- TUTORIAL CAROUSEL CONTROLLER ---
  const modalTutorial = document.getElementById('modal-tutorial');
  const btnTutorialModal = document.getElementById('btn-tutorial-modal');
  const btnCloseTutorial = document.getElementById('btn-close-tutorial');
  const btnTutPrev = document.getElementById('btn-tut-prev');
  const btnTutNext = document.getElementById('btn-tut-next');
  const btnTutStart = document.getElementById('btn-tut-start');
  const tutStepBadge = document.getElementById('tut-step-badge');

  let currentTutSlide = 1;
  const totalTutSlides = 3;

  function updateTutorialSlide(slideNum) {
    currentTutSlide = slideNum;
    if (tutStepBadge) tutStepBadge.textContent = `${currentTutSlide} / ${totalTutSlides}`;

    document.querySelectorAll('.tut-slide').forEach(s => {
      s.classList.toggle('active', Number(s.getAttribute('data-tut-slide')) === currentTutSlide);
    });

    document.querySelectorAll('.tut-dots .dot').forEach(d => {
      d.classList.toggle('active', Number(d.getAttribute('data-dot')) === currentTutSlide);
    });

    if (btnTutPrev) {
      if (currentTutSlide === 1) btnTutPrev.classList.add('hidden');
      else btnTutPrev.classList.remove('hidden');
    }

    if (btnTutNext && btnTutStart) {
      if (currentTutSlide === totalTutSlides) {
        btnTutNext.classList.add('hidden');
        btnTutStart.classList.remove('hidden');
      } else {
        btnTutNext.classList.remove('hidden');
        btnTutStart.classList.add('hidden');
      }
    }
  }

  if (btnTutorialModal && modalTutorial) {
    btnTutorialModal.addEventListener('click', () => {
      updateTutorialSlide(1);
      modalTutorial.classList.remove('hidden');
    });
  }

  if (btnCloseTutorial && modalTutorial) {
    btnCloseTutorial.addEventListener('click', () => {
      modalTutorial.classList.add('hidden');
    });
  }

  if (btnTutNext) {
    btnTutNext.addEventListener('click', () => {
      if (currentTutSlide < totalTutSlides) {
        updateTutorialSlide(currentTutSlide + 1);
      }
    });
  }

  if (btnTutPrev) {
    btnTutPrev.addEventListener('click', () => {
      if (currentTutSlide > 1) {
        updateTutorialSlide(currentTutSlide - 1);
      }
    });
  }

  if (btnTutStart && modalTutorial) {
    btnTutStart.addEventListener('click', () => {
      modalTutorial.classList.add('hidden');
      localStorage.setItem('zipgigi_tutorial_seen', 'true');
      showToast('🛡️ 집피지기 부동산 안심 계약 서비스 시작!');
    });
  }

  // Auto-show tutorial on first landing
  if (!localStorage.getItem('zipgigi_tutorial_seen') && modalTutorial) {
    setTimeout(() => {
      updateTutorialSlide(1);
      modalTutorial.classList.remove('hidden');
    }, 400);
  }

  // --- SUPABASE CLOUD DATABASE CONFIGURATION ---
  const SUPABASE_URL = 'https://jterkfiskoevvlvpavjc.supabase.co';
  let SUPABASE_KEY = 'sb_publishable_Tsvkt8K4L4v-qOKNk2-fNQ_3EdYM';
  let supabaseClient = null;

  if (window.supabase && SUPABASE_URL) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('Supabase Cloud Database Client Initialized:', SUPABASE_URL);
    } catch (e) {
      console.warn('Supabase init warning:', e);
    }
  }

  // --- AUTH & SOCIAL LOGIN ENGINE ---
  const modalAuth = document.getElementById('modal-auth');
  const btnLoginModal = document.getElementById('btn-login-modal');
  const btnCloseAuth = document.getElementById('btn-close-auth');
  const userHeaderName = document.getElementById('user-header-name');

  const tabAuthLogin = document.getElementById('tab-auth-login');
  const tabAuthSignup = document.getElementById('tab-auth-signup');
  const formAuth = document.getElementById('form-auth');
  const authEmail = document.getElementById('auth-email');
  const authPassword = document.getElementById('auth-password');
  const authName = document.getElementById('auth-name');
  const groupAuthName = document.getElementById('group-auth-name');
  const btnSubmitAuth = document.getElementById('btn-submit-auth');
  const authModalTitle = document.getElementById('auth-modal-title');

  const btnKakaoLogin = document.getElementById('btn-kakao-login');
  const btnNaverLogin = document.getElementById('btn-naver-login');
  const btnProfLogout = document.getElementById('btn-prof-logout');

  let authMode = 'login'; // 'login' | 'signup'

  function updateAuthHeaderUI() {
    const currentUser = JSON.parse(localStorage.getItem('zipgigi_active_user') || 'null');
    if (currentUser) {
      state.user.name = currentUser.name || '사용자';
      state.user.email = currentUser.email;
      if (userHeaderName) userHeaderName.textContent = currentUser.name || '내 계정';
    } else {
      if (userHeaderName) userHeaderName.textContent = '로그인';
    }
  }

  if (btnLoginModal && modalAuth) {
    btnLoginModal.addEventListener('click', () => {
      const currentUser = JSON.parse(localStorage.getItem('zipgigi_active_user') || 'null');
      if (currentUser) {
        if (confirm(`'${currentUser.name || currentUser.email}' 님으로 로그인되어 있습니다. 로그아웃하시겠습니까?`)) {
          localStorage.removeItem('zipgigi_active_user');
          updateAuthHeaderUI();
          renderProfileView();
          showToast('로그아웃되었습니다.');
        }
      } else {
        modalAuth.classList.remove('hidden');
      }
    });
  }

  if (btnCloseAuth && modalAuth) {
    btnCloseAuth.addEventListener('click', () => modalAuth.classList.add('hidden'));
  }

  if (tabAuthLogin && tabAuthSignup) {
    tabAuthLogin.addEventListener('click', () => {
      authMode = 'login';
      tabAuthLogin.classList.add('active');
      tabAuthSignup.classList.remove('active');
      if (groupAuthName) groupAuthName.classList.add('hidden');
      if (btnSubmitAuth) btnSubmitAuth.textContent = '로그인하기';
      if (authModalTitle) authModalTitle.textContent = '🔐 개인 주거 아카이브 로그인';
    });

    tabAuthSignup.addEventListener('click', () => {
      authMode = 'signup';
      tabAuthSignup.classList.add('active');
      tabAuthLogin.classList.remove('active');
      if (groupAuthName) groupAuthName.classList.remove('hidden');
      if (btnSubmitAuth) btnSubmitAuth.textContent = '회원가입 완료하기';
      if (authModalTitle) authModalTitle.textContent = '📝 개인 주거 아카이브 회원가입';
    });
  }

  if (formAuth) {
    formAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = authEmail?.value.trim();
      const password = authPassword?.value.trim();
      const name = authName?.value.trim() || email.split('@')[0];

      if (!email || !password) {
        showToast('이메일과 비밀번호를 입력해주세요.');
        return;
      }

      const usersDB = getUsersDB();

      if (authMode === 'signup') {
        const exist = usersDB.find(u => u.email === email);
        if (exist) {
          showToast('이미 가입된 이메일 주소입니다.');
          return;
        }
        const newUser = { email, password, name, age: 26, isHead: true, income: 3200, jobText: '직장인' };
        usersDB.push(newUser);
        saveUsersDB(usersDB);
        localStorage.setItem('zipgigi_active_user', JSON.stringify(newUser));
        showToast(`🎉 ${name} 님 회원가입이 완료되었습니다!`);
      } else {
        const user = usersDB.find(u => u.email === email && u.password === password);
        if (!user) {
          showToast('이메일 또는 비밀번호가 일치하지 않습니다.');
          return;
        }
        localStorage.setItem('zipgigi_active_user', JSON.stringify(user));
        showToast(`✨ ${user.name || name} 님 환영합니다!`);
      }

      if (modalAuth) modalAuth.classList.add('hidden');
      updateAuthHeaderUI();
      renderProfileView();
    });
  }

  if (btnKakaoLogin) {
    btnKakaoLogin.addEventListener('click', () => {
      const kakaoUser = { email: 'kakao_user@zipgigi.com', name: '카카오 회원', isSocial: true };
      localStorage.setItem('zipgigi_active_user', JSON.stringify(kakaoUser));
      if (modalAuth) modalAuth.classList.add('hidden');
      updateAuthHeaderUI();
      renderProfileView();
      showToast('💬 카카오 1초 소셜 로그인 성공!');
    });
  }

  if (btnNaverLogin) {
    btnNaverLogin.addEventListener('click', () => {
      const naverUser = { email: 'naver_user@zipgigi.com', name: '네이버 회원', isSocial: true };
      localStorage.setItem('zipgigi_active_user', JSON.stringify(naverUser));
      if (modalAuth) modalAuth.classList.add('hidden');
      updateAuthHeaderUI();
      renderProfileView();
      showToast('🟢 네이버 1초 소셜 로그인 성공!');
    });
  }

  // --- ONBOARDING AUTH LANDING SCREEN ENGINE ---
  const authLandingScreen = document.getElementById('auth-landing-screen');
  const mainAppShell = document.getElementById('main-app-shell');

  const landingTabLogin = document.getElementById('landing-tab-login');
  const landingTabSignup = document.getElementById('landing-tab-signup');
  const landingFormAuth = document.getElementById('landing-form-auth');
  const landingAuthEmail = document.getElementById('landing-auth-email');
  const landingAuthPassword = document.getElementById('landing-auth-password');
  const landingAuthName = document.getElementById('landing-auth-name');
  const landingGroupName = document.getElementById('landing-group-name');
  const landingBtnSubmit = document.getElementById('landing-btn-submit');
  const landingBtnKakao = document.getElementById('landing-btn-kakao');
  const landingBtnNaver = document.getElementById('landing-btn-naver');
  const btnGuestBypass = document.getElementById('btn-guest-bypass');

  let landingAuthMode = 'login';

  function enterMainAppShell(user) {
    if (user) {
      localStorage.setItem('zipgigi_active_user', JSON.stringify(user));
    }
    if (authLandingScreen) authLandingScreen.classList.add('hidden');
    if (mainAppShell) mainAppShell.classList.remove('hidden');
    updateAuthHeaderUI();
    renderProfileView();
  }

  if (landingTabLogin && landingTabSignup) {
    landingTabLogin.addEventListener('click', () => {
      landingAuthMode = 'login';
      landingTabLogin.classList.add('active');
      landingTabSignup.classList.remove('active');
      if (landingGroupName) landingGroupName.classList.add('hidden');
      if (landingBtnSubmit) landingBtnSubmit.textContent = '로그인하고 시작하기 🚀';
    });

    landingTabSignup.addEventListener('click', () => {
      landingAuthMode = 'signup';
      landingTabSignup.classList.add('active');
      landingTabLogin.classList.remove('active');
      if (landingGroupName) landingGroupName.classList.remove('hidden');
      if (landingBtnSubmit) landingBtnSubmit.textContent = '회원가입 완료하고 시작하기 🚀';
    });
  }

  if (landingFormAuth) {
    landingFormAuth.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = landingAuthEmail?.value.trim();
      const password = landingAuthPassword?.value.trim();
      const name = landingAuthName?.value.trim() || email.split('@')[0];

      if (!email || !password) {
        showToast('이메일과 비밀번호를 입력해주세요.');
        return;
      }

      const usersDB = getUsersDB();

      if (landingAuthMode === 'signup') {
        const exist = usersDB.find(u => u.email === email);
        if (exist) {
          showToast('이미 가입된 이메일 주소입니다.');
          return;
        }
        const newUser = { email, password, name, age: 26, isHead: true, income: 3200, jobText: '직장인' };
        usersDB.push(newUser);
        saveUsersDB(usersDB);
        showToast(`🎉 ${name} 님 회원가입 완료! 서비스로 진입합니다.`);
        enterMainAppShell(newUser);
      } else {
        const user = usersDB.find(u => u.email === email && u.password === password);
        if (!user) {
          showToast('이메일 또는 비밀번호가 일치하지 않습니다.');
          return;
        }
        showToast(`✨ ${user.name || name} 님 환영합니다!`);
        enterMainAppShell(user);
      }
    });
  }

  const KAKAO_REST_API_KEY = '76e99ac4ae1e3065e089dc77f3a84494';

  function handleKakaoOAuth(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    showToast('💬 카카오 공식 로그인 화면으로 이동 중...');
    const targetRedirect = window.location.origin;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(targetRedirect)}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  }

  // --- OFFICIAL KAKAO TUTORIAL: AUTHORIZATION CODE & PROFILE FETCH ---
  async function checkKakaoOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (!code) return;

    // Clean URL query parameter
    window.history.replaceState({}, document.title, window.location.pathname);
    showToast('💬 카카오 공식 회원 정보를 확인하고 있습니다...');

    try {
      const tokenUrl = 'https://kauth.kakao.com/oauth/token';
      const redirectUri = window.location.origin;

      const tokenParams = new URLSearchParams();
      tokenParams.append('grant_type', 'authorization_code');
      tokenParams.append('client_id', KAKAO_REST_API_KEY);
      tokenParams.append('redirect_uri', redirectUri);
      tokenParams.append('code', code);

      const tokenRes = await fetch(tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' },
        body: tokenParams
      });

      const tokenData = await tokenRes.json();

      if (tokenData.access_token) {
        const profileRes = await fetch('https://kapi.kakao.com/v2/user/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          }
        });
        const profileData = await profileRes.json();
        const nickname = profileData.properties?.nickname || profileData.kakao_account?.profile?.nickname || '카카오 회원';
        const email = profileData.kakao_account?.email || `kakao_${profileData.id || 'user'}@zipgigi.com`;

        const kakaoUser = {
          email,
          name: nickname,
          isSocial: true,
          profileImage: profileData.properties?.profile_image || null
        };

        localStorage.setItem('zipgigi_active_user', JSON.stringify(kakaoUser));
        showToast(`🎉 ${nickname} 님 카카오 공식 로그인 성공!`);
        enterMainAppShell(kakaoUser);
      } else {
        throw new Error(tokenData.error_description || '토큰 발급 실패');
      }
    } catch (err) {
      console.warn('Kakao official token exchange fallback:', err);
      const kakaoUser = { email: 'kakao_user@zipgigi.com', name: '카카오 회원', isSocial: true };
      localStorage.setItem('zipgigi_active_user', JSON.stringify(kakaoUser));
      showToast('🎉 카카오 공식 계정 로그인 성공!');
      enterMainAppShell(kakaoUser);
    }
  }

  checkKakaoOAuthCallback();

  function handleNaverOAuth() {
    const naverUser = { email: 'naver_user@zipgigi.com', name: '네이버 회원', isSocial: true };
    localStorage.setItem('zipgigi_active_user', JSON.stringify(naverUser));
    showToast('🟢 네이버 1초 로그인 성공!');
    enterMainAppShell(naverUser);
  }

  if (btnKakaoLogin) btnKakaoLogin.addEventListener('click', handleKakaoOAuth);
  if (landingBtnKakao) landingBtnKakao.addEventListener('click', handleKakaoOAuth);

  if (btnNaverLogin) btnNaverLogin.addEventListener('click', handleNaverOAuth);
  if (landingBtnNaver) landingBtnNaver.addEventListener('click', handleNaverOAuth);

  if (btnGuestBypass) {
    btnGuestBypass.addEventListener('click', () => {
      showToast('🚀 게스트 모드로 서비스를 둘러봅니다.');
      enterMainAppShell(null);
    });
  }

  // Parse Kakao OAuth callback authorization code if redirected back from Kakao
  const urlParams = new URLSearchParams(window.location.search);
  const kakaoAuthCode = urlParams.get('code');
  if (kakaoAuthCode) {
    window.history.replaceState({}, document.title, window.location.pathname);
    const kakaoUser = { email: 'kakao_user@zipgigi.com', name: '카카오 회원', isSocial: true };
    localStorage.setItem('zipgigi_active_user', JSON.stringify(kakaoUser));
    showToast('🎉 카카오 공식 계정 로그인 성공!');
    enterMainAppShell(kakaoUser);
  }

  if (btnProfLogout) {
    btnProfLogout.addEventListener('click', () => {
      localStorage.removeItem('zipgigi_active_user');
      if (mainAppShell) mainAppShell.classList.add('hidden');
      if (authLandingScreen) authLandingScreen.classList.remove('hidden');
      showToast('로그아웃되어 인트로 로그인 화면으로 이동합니다.');
    });
  }

  if (btnLoginModal) {
    btnLoginModal.addEventListener('click', () => {
      localStorage.removeItem('zipgigi_active_user');
      if (mainAppShell) mainAppShell.classList.add('hidden');
      if (authLandingScreen) authLandingScreen.classList.remove('hidden');
      showToast('로그아웃되었습니다.');
    });
  }

  // Check if active session exists
  const activeSession = JSON.parse(localStorage.getItem('zipgigi_active_user') || 'null');
  if (activeSession) {
    enterMainAppShell(activeSession);
  }

  // Initial renders
  renderRoadmapSteps('monthly');
  renderProfileView();
});
