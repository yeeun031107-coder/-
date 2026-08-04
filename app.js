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
        name: '매물 1 (신수동 원룸 302호)',
        address: '서울시 마포구 신수동 100-1',
        features: '채광 우수, 보증금 8천/월세 45, 관리비 5만원 (인터넷 포함)',
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
    { term: '근저당권설정', desc: '집주인이 집을 담보로 은행 대출을 받았을 때, 은행이 우선 변제받을 권리를 등록한 기록입니다.' },
    { term: '갑구 (등기부등본)', desc: '소유권(집주인 이름, 가압류, 가처분, 신탁등기)에 관한 기록입니다.' },
    { term: '을구 (등기부등본)', desc: '소유권 이외의 권리(근저당권, 전세권, 임차권등기명령)에 관한 기록입니다.' },
    { term: '신탁등기', desc: '소유권이 신탁회사로 넘어가 있는 매물로, 신탁회사 서면 동의 없는 계약은 무효가 됩니다.' },
    { term: '임차권등기명령', desc: '계약 만료 후 보증금을 못 받고 이사할 때 기존 집의 대항력을 유지해 주는 법적 장치입니다.' },
    { term: '대항력', desc: '집주인이 바뀌거나 경매 시 보증금을 받을 때까지 거주할 수 있는 법적 권리입니다. (전입신고 익일 0시 발생)' }
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
    bLoading.innerHTML = `<img src="assets/bot_character.png" class="bot-avatar-img" alt="AI 캐릭터"><div class="message-bubble" style="font-style:italic;">Gemini AI 답변 작성 중...</div>`;
    if (chatMessagesBox) chatMessagesBox.appendChild(bLoading);
    if (chatMessagesBox) chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;

    try {
      const res = await fetch('/api/chat-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      if (chatMessagesBox) chatMessagesBox.removeChild(bLoading);

      const bMsg = document.createElement('div');
      bMsg.className = 'message bot';
      bMsg.innerHTML = `<img src="assets/bot_character.png" class="bot-avatar-img" alt="AI 캐릭터"><div class="message-bubble">${data.reply.replace(/\n/g, '<br>')}</div>`;
      if (chatMessagesBox) chatMessagesBox.appendChild(bMsg);
      if (chatMessagesBox) chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
    } catch (e) {
      if (chatMessagesBox) chatMessagesBox.removeChild(bLoading);
    }
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
      item.style.padding = '8px 0';
      item.style.borderBottom = '1px solid var(--border-color)';
      item.innerHTML = `<h5 style="color:var(--primary); font-size:0.82rem; margin-bottom:2px;">${g.term}</h5><p style="font-size:0.75rem; color:var(--text-sub);">${g.desc}</p>`;
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

  // Initial renders
  renderRoadmapSteps('monthly');
  renderProfileView();
});
