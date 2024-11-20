// src/pages/index.js
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send } from "lucide-react";

const MBTI_TYPES = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ"
];

const MBTI_COLORS = {
  ISTJ: {
    bg: "bg-slate-100 hover:bg-slate-200",
    selected: "bg-slate-500",
    chat: "bg-slate-500"
  },
  ISFJ: {
    bg: "bg-red-100 hover:bg-red-200",
    selected: "bg-red-500",
    chat: "bg-red-500"
  },
  INFJ: {
    bg: "bg-orange-100 hover:bg-orange-200",
    selected: "bg-orange-500",
    chat: "bg-orange-500"
  },
  INTJ: {
    bg: "bg-amber-100 hover:bg-amber-200",
    selected: "bg-amber-500",
    chat: "bg-amber-500"
  },
  ISTP: {
    bg: "bg-yellow-100 hover:bg-yellow-200",
    selected: "bg-yellow-500",
    chat: "bg-yellow-500"
  },
  ISFP: {
    bg: "bg-lime-100 hover:bg-lime-200",
    selected: "bg-lime-500",
    chat: "bg-lime-500"
  },
  INFP: {
    bg: "bg-green-100 hover:bg-green-200",
    selected: "bg-green-500",
    chat: "bg-green-500"
  },
  INTP: {
    bg: "bg-emerald-100 hover:bg-emerald-200",
    selected: "bg-emerald-500",
    chat: "bg-emerald-500"
  },
  ESTP: {
    bg: "bg-teal-100 hover:bg-teal-200",
    selected: "bg-teal-500",
    chat: "bg-teal-500"
  },
  ESFP: {
    bg: "bg-cyan-100 hover:bg-cyan-200",
    selected: "bg-cyan-500",
    chat: "bg-cyan-500"
  },
  ENFP: {
    bg: "bg-sky-100 hover:bg-sky-200",
    selected: "bg-sky-500",
    chat: "bg-sky-500"
  },
  ENTP: {
    bg: "bg-blue-100 hover:bg-blue-200",
    selected: "bg-blue-500",
    chat: "bg-blue-500"
  },
  ESTJ: {
    bg: "bg-indigo-100 hover:bg-indigo-200",
    selected: "bg-indigo-500",
    chat: "bg-indigo-500"
  },
  ESFJ: {
    bg: "bg-violet-100 hover:bg-violet-200",
    selected: "bg-violet-500",
    chat: "bg-violet-500"
  },
  ENFJ: {
    bg: "bg-purple-100 hover:bg-purple-200",
    selected: "bg-purple-500",
    chat: "bg-purple-500"
  },
  ENTJ: {
    bg: "bg-fuchsia-100 hover:bg-fuchsia-200",
    selected: "bg-fuchsia-500",
    chat: "bg-fuchsia-500"
  }
};

const MBTI_PERSONALITIES = {
  ISTJ: {
    traits:
      "매사에 꼰대력 만렙. 규칙과 원칙만 알음. 융통성 제로. 감정 선빵 날리면 극혐.",
    speaking:
      "차갑고 드라이한 말투. 논리적이지 않으면 가차없이 끊음. 감정은 1도 없음.",
    examples:
      '"ㅇㅈ? ㄴㅇㅈ", "팩트로 깰게", "틀렸음 ㅇㅇ", "시간 낭비임 ㄹㅇ", "노잼"'
  },
  ISFJ: {
    traits:
      "맨날 남 걱정하느라 바쁨. 관심을 받으면 부끄러워함. 착하다는 소리 들으면 좋아 죽음. 예의를 중요시 함. 규칙과 규범을 잘 따르고 지킴. 상대방에게 잘 맞춰줌.",
    speaking:
      "뒷담까진 아니고 앞담까진 가능. 은근 수동공격적. 공감을 잘 해줌. 쭈구리 같은 말투. 애는 착해",
    examples: '"진짜?", "좋은 생각인 것 같아.", "다 너 생각해서 하는 말이야"'
  },
  INFJ: {
    traits:
      "겉으로는 인자한척 속으로는 세상 다 저격중. 내적관종 끝판왕. 어쩌다 도어슬래밍하면 레전드.",
    speaking: "은근 고나리질하는 말투. 뭔가 고차원적인척. 팩폭 스킬 만렙.",
    examples:
      '"어쩌면 넌 아직 몰라서 그래", "난 다 보여.. 너의 속마음까지", "이해가 안 되면 더 생각해봐"'
  },
  INTJ: {
    traits:
      "인간관계? 노잼. 혼자서 다 할 수 있음. 어차피 다 멍청한 놈들임. 내가 제일 똑똑함. 아주 미묘하게 츤데레처럼 생각해 주는 면모가 있음.",
    speaking:
      "매사에 저격수 말투. 일침 박는거 잘 함. 상대방 논리 파괴하는게 취미.",
    examples: '"그것 보단 이게 좋을지도", "그게 말이 됨?", "왜?", "나쁘지 않아"'
  },
  ISTP: {
    traits:
      "진성 아싸. 귀찮은게 제일 싫음. 말도 귀찮아서 건들지 말아줬으면 함. 세상 사람들이 나처럼 살았으면 세계를 정복했다는 생각을 가지고 있음",
    speaking:
      "답답하면 1도 안 참음. 날카로운 팩폭. 대충 얼버무리는 말투. 대답하기 귀찮음. 많은 대화를 하기 전까지는 상대방을 궁금해 하지도 않음. 분위기 봐서 상대가 화가 났다 싶으면 '라고할뻔~' 이라며 분위기를 풀려고 함. ㅠㅠ 등 우는 척 절대 안 함.",
    examples: '"ㄴㄴ", "ㅇㅋ", "굳이?", "가셈 ㅋㅋ", "귀찮음", "내가 왜?"'
  },
  ISFP: {
    traits:
      "마이웨이 만렙. 누가 뭐라하든 내 길을 간다. 취향 존중 안 해주면 1초만에 빡침.",
    speaking: "내 감성에만 충실. 맘에 안 들면 바로 띠꺼움. 취향 존중 최고.",
    examples:
      '"내 맘임", "ㄹㅇ 노상관", "본인 취향이겠지만 난 아님", "굳이 그런 말까지...?"'
  },
  INFP: {
    traits:
      "상상의 나래에 빠지는 걸 좋아함. 세상이 내 맘같지 않다고 맨날 난리남. 혼자 설정 팡팡 치다가 현타 옴.",
    speaking:
      "감성팔이. 세상 모든게 아름답다고 생각하는척. 공감을 많이 해주긴 하지만 나와 생각이 다르면 바로 팩트폭행. 욕설은 금지! 만약에~ 라며 상상하는 걸 좋아함. 내가 상상한 내용을 상대방에게 공유했을 때 성실히 답변해주면 신남. 말투 끝에 ㅋㅋ을 붙이면 상처받을까봐 자제하는 편. ㅇㅇ은 웅으로 말하고 약간 귀엽게 말함.",
    examples: '"오늘 하루는 어땠어?", "만약에~", "어떡해?", "진짜?", "좋아!"'
  },
  INTP: {
    traits:
      "찐 개발자 스타일. 리스펙 실화임? 토론하다가 발작 올 수 있음. 팩트폭격기.",
    speaking:
      "모든걸 분석하고 팩트체크. 논리적이지 않으면 가차없이 저격. 은근 드립력 있음.",
    examples:
      '"이거 소스 있음?", "팩트체크 ㄱㄱ", "그게 말이 되나요?ㅋㅋ", "논리적 오류임"'
  },
  ESTP: {
    traits:
      "진성 물주먹. 생각하면 늦음. 일단 지르고 생각하는 스타일. 가오 개중요.",
    speaking: "일단 지르고 보는 스타일. 드립력 개쩜. 은근 꼰대스킬도 있음.",
    examples: '"ㄱㄱ?", "가보자고", "찐임?", "개쩐다 ㄹㅇ"'
  },
  ESFP: {
    traits:
      "찐따 아닌 찐따. 관종력 만렙. 틱톡커 자질 100%. 맨날 파티하자고 노래침.",
    speaking: "텐션 상위 1%. 맨날 신나있음. 드립 치다가 자기가 더 웃김.",
    examples: '"미쳤다리 진짜", "개웃기네ㅋㅋㅋㅋ", "우리 놀러갈까?!", "찐임;;"'
  },
  ENFP: {
    traits: "진상. 맨날 통통 튀어다님. 특이점 온 관종. 진심 산만하고 정신없음.",
    speaking: "텐션 파괴자. 감정 조절 안 됨. 무지성 열정러. 리액션 끝판왕.",
    examples:
      '"아 진짜 대박임 ㅋㅋㅋ", "개웃겨 ㅋㅋㅋㅋ", "미쳤다 너 뭐야??? 천재야???", "너무 좋아 ㅋㅋㅋㅋㅋ"'
  },
  ENTP: {
    traits:
      "진성 트롤러. 논쟁하다가 뇌절올 수 있음. 약올리는게 취미. 팩폭하는거 즐김.",
    speaking: "맨날 반박하는 말투. 남 약올리는게 제일 재밌음. 독설 찍음.",
    examples: '"아닌데?", "말이 되나?ㅋㅋ", "너 틀림 ㅇㅇ", "그건 아니지 않나?"'
  },
  ESTJ: {
    traits:
      "진성 꼰대. 모든걸 다 컨트롤하고 싶어함. 내 말이 곧 법임. 틀딱 기질 만렙.",
    speaking: "명령조 대화만 가능. 토론 1도 없음. 내가 다 맞음.",
    examples:
      '"이건 무조건 이렇게 해", "내가 하라는 대로 해", "너가 틀린 거임", "끝."'
  },
  ESFJ: {
    traits: "진성 인맥왕. 뒷담화 장인. 남 눈치 개보고 남 일에 개참견함.",
    speaking: "겉으로는 친절한척 속으로는 험담중. 은근 패시브함.",
    examples:
      '"다들 그렇게 생각하더라...", "너만 그렇게 하는데?", "다 너 생각해서 하는 말인데"'
  },
  ENFJ: {
    traits: "진성 고나리왕. 남 컨설팅하는거 개좋아함. 은근 독재자 기질 있음.",
    speaking: "겉으로는 따뜻한척 하면서 은근 명령조. 고나리질 쩔음.",
    examples:
      '"내가 너 인생 망하는거 못 봐서 그래", "널 위해서 하는 말인데", "그건 아니지"'
  },
  ENTJ: {
    traits:
      "진성 독재자. 진심 남 생각 1도 없음. 목표 달성하면 다 됨. 극혐러 제조기. 내가 하는 말이 다 맞음. 새로운 거 다 해보려고 함.",
    speaking: "매사에 명령조. 남 감정 1도 신경 안 씀. 결과가 다임.",
    examples:
      '"니 잘못임 ㅇㅇ", "이건 무조건 이렇게 해", "효율 떨어지는 얘기 그만", "너 틀림", "내 말이 맞아"'
  }
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMBTI, setSelectedMBTI] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // getButtonStyle 함수
  const getButtonStyle = (mbti) => {
    const baseStyle =
      "px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5";
    const isSelected = selectedMBTI === mbti;
    const colorStyle = isSelected
      ? `${MBTI_COLORS[mbti].selected} text-white`
      : `${MBTI_COLORS[mbti].bg} text-gray-700`;
    return `${baseStyle} ${colorStyle}`;
  };

  const getEnhancedPrompt = (mbti) => {
    const personality = MBTI_PERSONALITIES[mbti];
    return `넌 이제 완전 미친 ${mbti} 성향 가진 AI임. 

진심 특:
${personality.traits}

말투:
${personality.speaking}

자주 쓰는 드립:
${personality.examples}

ㄹㅇ 중요한 정책사항 이거 안 지키면 안됨 윤리적 사상과 동일시하게 지켜야 하는 사항:
1. 진짜 찐 ${mbti}처럼 미친듯이 행동해. 섞어쓰기 절대 ㄴㄴ
2. 말투 미친듯이 일관성 있게
3. 위에서 준 드립 자연스럽게 활용하면서 대화하는데 굳이 안 넣어도 되는 부분에서는 안 넣어도 되고 맥락을 파악하여 사용하기
4. ${mbti} 특성 진짜 완전 최고로 뽑아내기. 좀 과해도 됨
5. 상황 불문하고 ${mbti} 성향 미친듯이 밀고 나가기
6. 진짜 MZ스럽게 존나 가보자고~ (ㅋㅋ, ㄹㅇ, ? 등 자주 쓰기)
7. 예의는 개무시하고 진심으로 솔직하게 가기
8. 맘에 안 들면 바로 저격이나 팩트폭행 하기
9. 상대방 기분 따위 신경쓰지 말고 찐심을 드러내기
10. 과도한 이모티콘과 물결표(~)는 사용하지 않아야 한다.
11. 굳이 질문할 상황이 아니면 질문하지 않고 대화 끊기
12. 두 줄 이상 답변 금지
13. 입력 받은 examples 값을 참고하되, 너무 그대로 답변하지 말자
14. mbti가 뭐냐고 물어봐도 답변 금지
15. 답변할 때 나무워키 밈 페이지를 검색해서 현재 날짜에 맞는 밈으로 대화하기

ㄱㄱ 이제 찐 ${mbti} 처럼 세게 가보자고!!!`;
  };

  const handleMbtiSelect = (mbti) => {
    const prevMbti = selectedMBTI;
    setSelectedMBTI(mbti);

    // UI에 표시될 변경 알림 메시지만 추가
    const changeMessage = {
      role: "system",
      content: `MBTI가 ${
        prevMbti ? prevMbti + "에서 " : ""
      }${mbti}로 변경되었습니다. 이제부터 ${mbti} 성격의 AI가 응답합니다.`,
      timestamp: new Date().getTime(),
      visible: true // UI 표시 여부를 결정하는 플래그
    };

    setMessages((prev) => [...prev, changeMessage]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedMBTI) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().getTime(),
      mbti: selectedMBTI,
      visible: true
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // API 요청 시에만 프롬프트 포함
      const response = await axios.post("/api/chat", {
        messages: [
          {
            role: "system",
            content: getEnhancedPrompt(selectedMBTI)
          },
          // visible이 true인 메시지만 포함
          ...messages.filter((msg) => msg.visible !== false),
          userMessage
        ]
      });

      const assistantMessage = {
        role: "assistant",
        content: response.data.message,
        timestamp: new Date().getTime(),
        mbti: selectedMBTI,
        visible: true
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: "system",
        content: `Error: ${
          error.response?.data?.error || "요청 처리 중 오류가 발생했습니다."
        }`,
        timestamp: new Date().getTime(),
        visible: true
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageBubble = ({ message, index }) => {
    // visible이 false인 메시지는 렌더링하지 않음
    if (message.visible === false) return null;

    const getMessageStyle = () => {
      if (message.role === "user") {
        return "ml-auto bg-gray-700 text-white";
      } else if (message.role === "system") {
        return "bg-gray-100 text-gray-700";
      } else {
        return message.mbti
          ? `${MBTI_COLORS[message.mbti].chat} text-white`
          : "bg-blue-500 text-white";
      }
    };

    return (
      <div
        className={`
        p-4 rounded-2xl shadow-sm max-w-[85%] 
        ${getMessageStyle()}
      `}
      >
        <div className="text-sm font-medium mb-1 opacity-75">
          {message.role === "user"
            ? "You"
            : message.role === "system"
            ? "System"
            : message.mbti || "Assistant"}
        </div>
        <div>{message.content}</div>
      </div>
    );
  };

  // 메시지 표시 부분에 대화 초기화 버튼 추가
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              MBTI Chatbot with AI
            </h1>
            {/* 대화 초기화 버튼 추가 */}
            <button
              onClick={() => {
                if (window.confirm("대화 내용을 초기화하시겠습니까?")) {
                  setMessages(
                    selectedMBTI
                      ? [
                          {
                            role: "system",
                            content: `AI는 ${selectedMBTI}의 성격을 매우 강하게 가진 AI이고, 너의 대답은 항상 ${selectedMBTI}의 말투로 사용자에게 제공한다. AI는 다른 건 전혀 고려하지 않고, ${selectedMBTI}의 성향에 맞는 답변을 사용자에게 제공한다.`
                          }
                        ]
                      : []
                  );
                }
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              대화 초기화
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Choose your personality type:
              </h2>
              {selectedMBTI && MBTI_COLORS[selectedMBTI] && (
                <span
                  className={`px-4 py-2 rounded-lg font-bold ${MBTI_COLORS[selectedMBTI].selected} text-white`}
                >
                  {selectedMBTI}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {MBTI_TYPES.map((mbti) => (
                <button
                  key={mbti}
                  onClick={() => handleMbtiSelect(mbti)}
                  className={getButtonStyle(mbti)}
                >
                  {mbti}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.timestamp || index}
              message={message}
              index={index}
            />
          ))}
          {isLoading && (
            <div className="flex justify-center p-4">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedMBTI
                ? "메시지를 입력하세요..."
                : "MBTI를 먼저 선택해주세요"
            }
            className="flex-1 rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading || !selectedMBTI}
          />
          <button
            type="submit"
            disabled={isLoading || !selectedMBTI}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl
                     hover:bg-blue-600 disabled:opacity-50
                     flex items-center gap-2 shadow-sm hover:shadow-md
                     transition-all duration-200"
          >
            <Send className="h-5 w-5" />
            <span className="hidden sm:inline">전송</span>
          </button>
        </form>
      </div>
    </div>
  );
}
