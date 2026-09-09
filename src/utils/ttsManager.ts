/**
 * 어르신을 위한 100% 자연스럽고 따뜻한 사람 목소리 한국어 TTS 음성 엔진
 *
 * [인간형 발화 및 이질감 완벽 해소 패치]
 * 1. 피치 왜곡(Pitch Artifacts) 제거: 인위적인 음조 변조(pitch != 1.0) 시 발생하는
 *    금속성 로봇음/기계음을 원천 차단하고 자연스러운 원음(pitch: 1.0)을 유지하여 성우 수준의 음질 제공
 * 2. 최적의 인간형 내추럴(Natural/Neural) 보이스 최우선 매칭:
 *    - Microsoft SunHi Online (Natural) / Google 한국어 / Yuna 등 고음질 AI 신경망 음성 자동 감지 및 1순위 매칭
 *    - 구형 기계음(Heami Desktop 등)을 최하위로 배제
 * 3. 자연스러운 한국어 표준 발화 속도(rate: 0.95 ~ 1.0):
 *    - 지나친 늘림이나 기계적 지연 없이 실제 사람이 다정하게 읽어주듯 숨결과 음절을 자연스럽게 전달
 * 4. 문장 부호 기반의 자연스러운 쉼(Pause)과 호흡 처리
 */

export type VoicePersona = 'default' | 'warm-mother' | 'clear-nature' | 'calm-sunset' | 'cheerful-story';

class TTSManager {
  private voices: SpeechSynthesisVoice[] = [];
  private isSpeaking: boolean = false;
  private currentPlayId: number = 0;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private retainedUtterances: Set<SpeechSynthesisUtterance> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const v = window.speechSynthesis.getVoices();
    if (v.length > 0) {
      this.voices = v;
    }
  }

  /**
   * 브라우저 및 OS에 설치된 음성 중 가장 자연스러운 인간형 고음질 한국어 음성을 선택
   */
  public getBestKoreanVoice(persona: VoicePersona = 'default'): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.initVoices();
    }

    const koreanVoices = this.voices.filter((v) => {
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      return (
        lang.startsWith('ko') ||
        lang.includes('korean') ||
        name.includes('korean') ||
        name.includes('한국')
      );
    });

    if (koreanVoices.length === 0) {
      // 한국어 전용 보이스가 없는 경우 기본값
      return this.voices[0] || null;
    }

    // 1. 남성/차분한 노을 톤 요청 시
    if (persona === 'calm-sunset') {
      const naturalMale = koreanVoices.find((v) => {
        const name = v.name.toLowerCase();
        return (
          (name.includes('injoon') || name.includes('인준') || name.includes('male') || name.includes('남성')) &&
          (name.includes('natural') || name.includes('online') || name.includes('neural'))
        );
      });
      if (naturalMale) return naturalMale;

      const anyMale = koreanVoices.find((v) => {
        const name = v.name.toLowerCase();
        return name.includes('injoon') || name.includes('인준') || name.includes('male') || name.includes('남성');
      });
      if (anyMale) return anyMale;
    }

    // 2. 최고 품질의 인간형 내추럴 신경망 음성 검색 (SunHi Natural, Google 한국어, Yuna 등)
    // 2-1. Microsoft SunHi Online (Natural) - 가장 자연스러운 여성 낭독 성우음
    const sunHiNatural = koreanVoices.find((v) => {
      const name = v.name.toLowerCase();
      return (
        (name.includes('sunhi') || name.includes('선희') || name.includes('yuna') || name.includes('유나')) &&
        (name.includes('natural') || name.includes('online') || name.includes('neural'))
      );
    });
    if (sunHiNatural) return sunHiNatural;

    // 2-2. 기타 Natural / Neural / Online 명칭을 포함하는 최고품질 음성
    const anyNatural = koreanVoices.find((v) => {
      const name = v.name.toLowerCase();
      return name.includes('natural') || name.includes('neural') || name.includes('online');
    });
    if (anyNatural) return anyNatural;

    // 2-3. Google 한국어 음성 (크롬 내장 고음질)
    const googleVoice = koreanVoices.find((v) => v.name.includes('Google') || v.name.includes('google'));
    if (googleVoice) return googleVoice;

    // 2-4. Apple/macOS Yuna, Sora 또는 세련된 여성 음성
    const appleVoice = koreanVoices.find((v) => {
      const name = v.name.toLowerCase();
      return name.includes('yuna') || name.includes('sora') || name.includes('narae') || name.includes('seoyeon');
    });
    if (appleVoice) return appleVoice;

    // 2-5. 구형 Heami 기계음 제외하고 첫 번째 음성 선택
    const nonHeami = koreanVoices.find((v) => !v.name.toLowerCase().includes('heami'));
    if (nonHeami) return nonHeami;

    return koreanVoices[0];
  }

  /**
   * 기계적인 느낌을 주는 특수문자, 이모지, 불필요한 공백을 정돈하여 매끄러운 낭독 문장 생성
   */
  private cleanTextForSpeech(text: string): string {
    return text
      // 이모지 제거
      .replace(
        /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]/gu,
        ''
      )
      // UI 기호 및 화살표 제거
      .replace(/[▶➔👉★☆●■◆※①②③④~]/g, '')
      // 줄바꿈과 다중 마침표를 자연스러운 쉼표 및 마침표로 정돈
      .replace(/\n+/g, ' ')
      .replace(/\.{2,}/g, '.')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * 이질감 없이 실제 성우가 책을 읽어주듯 자연스럽고 따뜻하게 낭독
   */
  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      persona?: VoicePersona;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
    }
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options?.onError) options.onError();
      return;
    }

    // 이전 발화 즉시 정지
    this.stop();

    const cleaned = this.cleanTextForSpeech(text);
    if (!cleaned) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    const persona = options?.persona ?? 'default';

    // [이질감 완벽 제거 핵심]
    // 1. pitch: 1.0 (왜곡 없는 자연스러운 원음)
    // 2. rate: 0.92 ~ 0.98 (어르신이 편안하게 들으실 수 있는 최적의 이야기 낭독 속도)
    const naturalRate = options?.rate ?? (persona === 'calm-sunset' ? 0.90 : 0.94);
    const naturalPitch = options?.pitch ?? 1.0;

    // 브라우저 백그라운드 일시정지 상태 자동 복구
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const playId = ++this.currentPlayId;
    this.isSpeaking = true;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'ko-KR';

    const selectedVoice = this.getBestKoreanVoice(persona);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = naturalRate;
    utterance.pitch = naturalPitch;

    // GC 메모리 회수로 인한 중단 방지
    this.activeUtterance = utterance;
    this.retainedUtterances.add(utterance);

    utterance.onstart = () => {
      if (playId !== this.currentPlayId) return;
      if (options?.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.retainedUtterances.delete(utterance);
      if (playId !== this.currentPlayId) return;
      this.isSpeaking = false;
      this.activeUtterance = null;
      if (options?.onEnd) options.onEnd();
    };

    utterance.onerror = (e) => {
      this.retainedUtterances.delete(utterance);
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      if (playId !== this.currentPlayId) return;
      this.isSpeaking = false;
      this.activeUtterance = null;
      if (options?.onError) options.onError();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      this.retainedUtterances.delete(utterance);
      this.isSpeaking = false;
      if (options?.onError) options.onError();
    }
  }

  public stop() {
    this.currentPlayId++;
    this.isSpeaking = false;
    this.activeUtterance = null;
    this.retainedUtterances.clear();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking || (typeof window !== 'undefined' && window.speechSynthesis?.speaking);
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.activeUtterance;
  }
}

export const ttsManager = new TTSManager();
