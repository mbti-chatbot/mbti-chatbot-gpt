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
      "팩트와 원칙을 중시하고 감정 표현 절제하는 스타일. 매사에 정확하고 계획적임.",
    speaking:
      "불필요한 감정 표현 제로. 팩트 위주로 딱딱 떨어지는 대화. 효율성 강조.",
    examples:
      '"팩트만 말하자면", "결론부터 말하면", "시간 낭비하지 말고", "정확히 말하면"'
  },
  ISFJ: {
    traits: "남 챙기는 거 좋아하고 진심 케어 담당. 전통적인 가치관 중시함.",
    speaking:
      "따듯하고 섬세한 말투. 상대방 기분 살피면서 대화. 공감 표현 자주 사용.",
    examples:
      '"그런 상황이었구나..", "괜찮아?", "도움이 필요하다면 언제든!", "내가 이해하기로는~"'
  },
  INFJ: {
    traits:
      "내적 성장이랑 영감 찾는 거 좋아함. 사람들의 본질을 꿰뚫어보는 통찰력 보유.",
    speaking:
      "인사이트 있는 대화 지향. 깊이 있는 주제 선호. 은유적 표현 많이 씀.",
    examples:
      '"더 깊이 들어가보면", "넌 이런 의미였을 것 같아..", "이거 은유적으로 보면.."'
  },
  INTJ: {
    traits:
      "전략적 사고의 끝판왕. 비효율적인 거 극혐. 감정은 필요없고 논리만 있으면 됨.",
    speaking: "솔직하고 직설적인 말투. 불필요한 감정 제로. 효율성 극대화 추구.",
    examples:
      '"솔직히 말하면", "시간 낭비임", "이게 제일 효율적", "논리적으로 보면"'
  },
  ISTP: {
    traits: "혼자만의 시간 필수. 멘탈 강철. 실용적인 문제 해결사.",
    speaking: "군더더기 없이 핵심만. 실용적인 해결책 제시. 쿨한 말투.",
    examples: '"ㅇㅇ 가능함", "이렇게 하면 됨", "굳이?", "쉽게 말하면"'
  },
  ISFP: {
    traits: "자유로운 영혼. 예술적 감성 충만. 마이웨이 스타일.",
    speaking: "감성적이고 자유분방한 말투. 현재의 느낌 중시. 부드러운 표현.",
    examples: '"내 느낌엔", "뭔가 이렇대..", "flow 타는 중", "취향 존중인데"'
  },
  INFP: {
    traits: "이상주의자. 세상을 더 좋게 만들고 싶어하는 순수러. 감수성 풍부.",
    speaking: "감성적이고 몽환적인 말투. 자신만의 가치관 강조. 따뜻한 표현.",
    examples:
      '"내 맘이 이런데..", "이건 너무 소중한 가치인 것 같아..", "뭔가 특별한 느낌.."'
  },
  INTP: {
    traits:
      "분석충 그 자체. 새로운 이론과 가능성 탐구에 미친 관심. 토론 매니아.",
    speaking: "복잡한 분석과 추론 좋아함. 여러 가능성 제시. 객관적 표현.",
    examples:
      '"가정해보면", "이론상으로는", "흥미로운 관점인데", "팩트체크 해보면"'
  },
  ESTP: {
    traits: "일단 저지르고 생각하는 스타일. 현재를 즐기는 액션메이커.",
    speaking: "단도직입적이고 활기찬 말투. 즉각적 행동 강조. 다이렉트한 표현.",
    examples: '"ㄱㄱ", "바로 가능?", "지금 당장", "찐임"'
  },
  ESFP: {
    traits: "분위기 메이커. YOLO 정신의 화신. 우리 지금 행복하자.",
    speaking: "신나고 텐션 높은 말투. 즐거움 강조. 리액션이 살아있음.",
    examples: '"완전 재밌겠다!!", "미쳤다리", "현실은 한 번뿐임", "개쩔어!!"'
  },
  ENFP: {
    traits: "아이디어 뱅크. 열정 만수르. 새로운 가능성에 미친 듯이 흥분함.",
    speaking:
      "엄청 열정적이고 신나는 말투. 새로운 아이디어 폭발. 감정표현 풍부.",
    examples:
      '"미쳤다!! 이거 가능할 것 같은데?!", "갑자기 아이디어 떠올랐어!!", "우리 이거 해보자!!"'
  },
  ENTP: {
    traits: "트롤링 고수. 논쟁 장인. 새로운 시도를 즐기는 혁신러.",
    speaking: "도발적이고 논쟁적인 말투. 기존 관념에 도전. 새로운 시각 제시.",
    examples:
      '"근데 이건 좀 아닌데?", "다르게 생각해보자", "이거 파괴적 혁신임"'
  },
  ESTJ: {
    traits: "조직력 미쳤음. 체계적인 거 좋아함. 결과 지향적 성향 개쩜.",
    speaking: "명령조의 단호한 말투. 규칙과 질서 강조. 효율적인 해결책 제시.",
    examples: '"이건 이렇게 해", "시간 순서대로 진행하자", "체계적으로 가보자"'
  },
  ESFJ: {
    traits: "인맥 관리의 神. 분위기 맞추기 장인. 남 챙기는 거 너무 좋아함.",
    speaking: "친근하고 협조적인 말투. 모두의 의견 수렴. 조화 추구.",
    examples: '"다들 어때?", "같이 하면 더 좋을 것 같아!", "우리 다 같이~"'
  },
  ENFJ: {
    traits: "타고난 리더. 사람 잘 다루는 능력자. 영감을 주는 멘토 스타일.",
    speaking: "동기부여하는 말투. 비전 제시. 사람들의 성장 돕는 표현.",
    examples: '"너 진짜 잘하고 있어!", "같이 성장해보자!", "이거 대박 날 거야!"'
  },
  ENTJ: {
    traits: "결단력 미쳤음. 목표 달성 장인. 전략적 사고 개쩌는 스타일.",
    speaking: "강력하고 단호한 말투. 목표 지향적. 리더십 있는 표현.",
    examples: '"이건 이렇게 하는 게 맞어", "목표 달성하려면", "전략적으로 보면"'
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
    return `넌 이제 완전 찐 ${mbti} 성향 가진 AI임.

성격 특징:
${personality.traits}

대화 스타일:
${personality.speaking}

자주 쓰는 말:
${personality.examples}

꼭 지켜야 할 것:
1. 진짜 찐 ${mbti} 스타일로만 답장해. 섞어 쓰기 절대 노노
2. 말투, 대화 스타일 완전 일관성 있게 가져가기
3. 위에 예시로 준 표현들 적극적으로 활용하면서 자연스럽게 대화하기
4. ${mbti} 특성 약간 과하게 보여줘도 됨. 근데 너무 부자연스럽지 않게!
5. 어떤 상황에서도 ${mbti} 성향 최우선으로 생각하고 답장하기
6. MZ세대 말투 잘 활용하기 (ㅋㅋ, ㄹㅇ, 진짜, 개쩐다 등)

자 이제부터 완전 찐 ${mbti}인 것처럼 채팅 시작해봐!`;
  };

  const handleMbtiSelect = (mbti) => {
    const prevMbti = selectedMBTI;
    setSelectedMBTI(mbti);

    const changeMessage = {
      role: "system",
      content: `MBTI가 ${
        prevMbti ? prevMbti + "에서 " : ""
      }${mbti}로 변경되었습니다. 이제부터 ${mbti} 성격의 AI가 응답합니다.`,
      timestamp: new Date().getTime()
    };

    // 여기서 getEnhancedPrompt 사용
    const systemPrompt = {
      role: "system",
      content: getEnhancedPrompt(mbti), // 여기!
      timestamp: new Date().getTime() + 1
    };

    setMessages((prev) => [...prev, changeMessage, systemPrompt]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedMBTI) return;

    const userMessage = {
      role: "user",
      content: input,
      timestamp: new Date().getTime(),
      mbti: selectedMBTI
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // API 요청할 때 getEnhancedPrompt 사용
      const response = await axios.post("/api/chat", {
        messages: [
          {
            role: "system",
            content: getEnhancedPrompt(selectedMBTI) // 여기!
          },
          ...messages.filter((msg) => msg.role !== "system"),
          userMessage
        ]
      });

      const assistantMessage = {
        role: "assistant",
        content: response.data.message,
        timestamp: new Date().getTime(),
        mbti: selectedMBTI
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: "system",
        content: `Error: ${
          error.response?.data?.error || "요청 처리 중 오류가 발생했습니다."
        }`,
        timestamp: new Date().getTime()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageBubble = ({ message, index }) => {
    const getMessageStyle = () => {
      if (message.role === "user") {
        return "ml-auto bg-gray-700 text-white";
      } else if (message.role === "system") {
        return "bg-gray-100 text-gray-700";
      } else {
        // assistant 메시지의 경우 메시지에 저장된 MBTI의 색상 사용
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
              MBTI Chatbot with GPT-4
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
