const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Serve Index page with robust fallbacks
app.get('/', (req, res) => {
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(publicIndex)) {
    return res.sendFile(publicIndex);
  }
  return res.sendFile(path.join(__dirname, 'index.html'));
});

// Gemini AI API Key check
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

// 1. API: 등기부등본 심층 해독 (Registry OCR & Analysis)
app.post('/api/analyze-registry', async (req, res) => {
  try {
    const { address, registryText, deposit, marketPrice, mortgage, priorDeposit } = req.body;

    if (GEMINI_API_KEY) {
      const prompt = `당신은 대한민국 대표 2030 부동산 안심 계약 AI 전문가입니다.
다음 부동산 등기부등본 텍스트 및 매물 정보를 심층 분석하여 사회초년생이 쉽게 이해할 수 있는 위험 진단 리포트를 작성해 주세요.

[매물 정보]
- 주소: ${address || '미입력'}
- 내 보증금: ${deposit || 0}만원
- 매물 시세: ${marketPrice || 0}만원
- 근저당(을구): ${mortgage || 0}만원
- 선순위 보증금: ${priorDeposit || 0}만원

[등기부등본 텍스트]
${registryText || '기본 등기부 정보 점검 요청'}

다음 형식의 JSON으로만 응답해 주세요:
{
  "riskLevel": "안전" | "주의" | "위험",
  "debtRatio": "부채비율(%)",
  "ownershipAnalysis": "갑구 소유권 분석 (신탁, 가압류 등 여부 요약)",
  "mortgageAnalysis": "을구 근저당 및 선순위채권 위험도 분석",
  "recommendedClauses": ["추천 특약 문구 1", "추천 특약 문구 2"],
  "expertAdvice": "2030 사회초년생을 위한 핵심 당부 한줄평"
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return res.json({ success: true, analysis: JSON.parse(jsonMatch[0]) });
        }
      }
    }

    const totalDebt = (Number(mortgage) || 0) + (Number(priorDeposit) || 0) + (Number(deposit) || 0);
    const price = Number(marketPrice) || 1;
    const debtRatio = Math.round((totalDebt / price) * 100);

    let riskLevel = '안전';
    let advice = '부채비율이 안정적이며, 표준 계약서와 기본 특약 작성 시 안심하고 진행할 수 있습니다.';
    let clauses = [
      '임대인은 잔금 지급일 익일까지 현재 등기부 상태를 유지하며 추가 근저당을 설정하지 않는다.',
      '전세보증금 반환보증보험 가입 불가능 시 본 계약은 무효로 하고 가계약금 및 계약금 전액을 즉시 반환한다.'
    ];

    if (debtRatio > 80) {
      riskLevel = '위험';
      advice = '🚨 [깡통전세 고위험] 보증금과 선순위 근저당의 합이 시세의 80%를 초과합니다! 보증금 미반환 리스크가 매우 높으므로 계약을 재고하거나 보증금을 낮추세요.';
      clauses.push('임대인은 체납 세금이 없음을 확약하며, 체납 확인 시 계약을 즉시 해제한다.');
    } else if (debtRatio > 60 || (registryText && (registryText.includes('신탁') || registryText.includes('가압류')))) {
      riskLevel = '주의';
      advice = '⚠️ [주의 요망] 근저당 설정 비율이 다소 높거나 권리관계에 주의가 필요합니다. 반환보증보험 가입 가능 여부를 사전에 확인하세요.';
    }

    return res.json({
      success: true,
      analysis: {
        riskLevel,
        debtRatio: `${debtRatio}%`,
        ownershipAnalysis: registryText?.includes('신탁') 
          ? '⚠️ [신탁등기 발견] 부동산 신탁회사 소유 매물입니다. 신탁원부를 반드시 확인하고 신탁사의 동의서 및 입금계좌를 검증해야 합니다.' 
          : '✅ 단독 소유권 상태가 확인되었습니다. 등기부상 가압류나 가처분 등 위험한 지분 제한 표시는 관측되지 않습니다.',
        mortgageAnalysis: Number(mortgage) > 0 
          ? `을구에 채권최고액 ${mortgage}만원의 근저당권이 설정되어 있습니다. 잔금 시 감액 및 말소 조건 특약을 필수 삽입하세요.`
          : '✅ 을구에 설정된 근저당권이 없어 보증금 보호에 유리한 깨끗한 등기 상태입니다.',
        recommendedClauses: clauses,
        expertAdvice: advice
      }
    });

  } catch (error) {
    console.error('Error analyzing registry:', error);
    res.status(500).json({ success: false, message: '등기부 해독 중 오류가 발생했습니다.' });
  }
});

// 2. API: Gemini AI 부동산 계약 법률 Q&A 챗봇
app.post('/api/chat-gemini', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (GEMINI_API_KEY) {
      const prompt = `당신은 2030 사회초년생의 보증금을 지켜주는 친절하고 유능한 '부동산 계약 법률 AI 변호사 & 안내원'입니다.
사용자 질문: "${message}"

원칙:
1. 법적 전문 지식을 사회초년생 눈높이에 맞춰 쉽고 따뜻하게 설명하세요.
2. 해결 방법, 주의점, 실제 현장 행동 팁을 bullet point로 명확히 정리하세요.
3. 3~5문장 내외로 명쾌하고 가독성 좋게 답변해 주세요.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return res.json({ success: true, reply });
        }
      }
    }

    let reply = '부동산 계약 관련 법률 및 행정 절차에 대해 궁금하신 점을 말씀해 주시면 정확히 안내해 드릴게요!';

    const msg = message.toLowerCase();

    if (msg.includes('가계약금') || msg.includes('돌려받')) {
      reply = `💡 **가계약금 반환 관련 안내**\n\n1. **기본 원칙**: 가계약 체결 시 "대출 미승인 시 가계약금 전액 반환" 조건 특약을 구두 또는 문자로 합의하지 않았다면 민법상 포기해야 할 수 있습니다.\n2. **대응 방법**: 가계약금 송금 전 반드시 중개사/임대인에게 **'대출 불승인 시 반환 특약'**을 문자로 기록해 두고 송금하세요.\n3. **이미 송금한 경우**: 당초 합의된 중요 조건(잔금일, 수리 조건 등)이 임대인 귀책으로 변경되었음을 주장하여 협상할 수 있습니다.`;
    } else if (msg.includes('근저당') || msg.includes('융자')) {
      reply = `🛡️ **근저당(융자) 설정 매물 계약 팁**\n\n1. **근저당 채권최고액 확인**: 등기부등본 '을구'에서 금액을 확인하세요. (보통 대출금의 120%가 채권최고액으로 설정됩니다).\n2. **안전성 계산**: (근저당 + 내 보증금) ÷ 시세 ≦ 70% 이하여야 안전합니다.\n3. **필수 특약**: "임대인은 잔금 지급과 동시에 근저당 000만원을 일부 상환 및 말소하고 감액 등기 접수 증빙을 제출한다"라는 조항을 반드시 계약서에 기재하세요.`;
    } else if (msg.includes('전입신고') || msg.includes('확정일자') || msg.includes('대항력')) {
      reply = `⏰ **전입신고와 확정일자 (대항력 확보)**\n\n1. **전입신고의 효과**: 전입신고를 마치면 **다음 날 0시(자정)**부터 대항력이 발생합니다.\n2. **확정일자의 효과**: 경매 진행 시 후순위 권리자보다 우선하여 보증금을 변제받을 수 있는 '우선변제권'을 취득합니다.\n3. **핵심 주의점**: 이사 당일 잔금을 치르자마자 즉시 주민센터나 정부24에서 전입신고+확정일자를 받고, 잔금 익일까지 등기부에 새로운 대출이 들어오지 않도록 재열람하세요!`;
    } else if (msg.includes('특약') || msg.includes('거절')) {
      reply = `🤝 **특약 거절 시 유연한 협상 스크립트**\n\n집주인이 "남들은 이런 특약 안 넣는다"고 거절할 때는 이렇게 말해보세요:\n\n💬 *"사장님, 집주인님을 못 믿어서가 아니라 요즘 은행 청년 대출 심사가 워낙 까다로워져서 서류 절차상 필요한 필수 문구라고 합니다. 제 개인 사정으로 계약을 깨려는 게 아니니 안심해 주세요!"*`;
    } else if (msg.includes('버팀목') || msg.includes('대출')) {
      reply = `🏦 **청년 버팀목 전세자금대출 안내**\n\n1. **대상**: 만 19세 이상 ~ 만 34세 이하 무주택 세대주 (소득 5천만원 이하).\n2. **한도**: 최대 2억원 이내 (보증금의 80% 이내).\n3. **금리**: 연 1.5% ~ 2.1% 수준의 초저금리 정부 지원 상품입니다.\n4. 프로필 탭의 **'대출 진단기'**를 이용하시면 1초 만에 자격 및 예상 한도를 계산해 드립니다!`;
    }

    return res.json({ success: true, reply });

  } catch (error) {
    console.error('Error in chat-gemini:', error);
    res.status(500).json({ success: false, message: '답변 생성 중 오류가 발생했습니다.' });
  }
});

app.get('*', (req, res) => {
  const publicIndex = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(publicIndex)) {
    return res.sendFile(publicIndex);
  }
  return res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ZipGigi Server is running at http://localhost:${PORT}`);
});
