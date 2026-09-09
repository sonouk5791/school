/**
 * 어르신을 위한 부드럽고 자연스러운 고품질 한국어 TTS 음성 엔진
 *
 * [목소리 튕김·끊김·버벅임 방지 완벽 패치]
 * 1. 단일 연속 발화(Continuous Utterance): 문맥을 인위적인 조각(chunk)으로 쪼개지 않고,
 *    문장 부호(쉼표, 마침표)를 살려 브라우저 고유의 자연스러운 호흡으로 끊김 없이 매끄럽게 낭독
 * 2. GC(가비지 컬렉션) 조기 종료 방지: activeUtterances 배열에 인스턴스를 유지하여 재생 도중 중단 현상 방지
 * 3. Chrome/Edge 백그라운드 일시정지 해제: speechSynthesis.resume() 자동 복구
 * 4. 상황별/영상별 맞춤형 페르소나 음성(자연 톤, 어머니 톤, 노을 톤, 동화 톤) 지원
 */

export type VoicePersona = 'default' | 'warm-mother' | 'clear-nature' | 'calm-sunset' | 'cheerful-story';

class TTSManager {
  private voices: SpeechSynthesisVoice[] = [];
  private isSpeaking: boolean = false;
  private currentPlayId: number = 0;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  // GC 보호를 위한 인스턴스 보존 집합
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
   * 한국어 음성 중 페르소나에 맞는 최적의 보이스 선택
   */
  private pickVoiceForPersona(persona: VoicePersona = 'default'): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.initVoices();
    }

    const koreanVoices = this.voices.filter(
      (v) =>
        v.lang.toLowerCase().startsWith('ko') ||
        v.lang.toLowerCase().includes('korean') ||
        v.name.includes('Korean') ||
        v.name.includes('한국')
    );

    if (koreanVoices.length === 0) return null;

    if (persona === 'calm-sunset') {
      const maleVoice = koreanVoices.find(
        (v) =>
          v.name.includes('InJoon') ||
          v.name.includes('인준') ||
          v.name.includes('Yunxi') ||
          v.name.toLowerCase().includes('male') ||
          v.name.includes('남성')
      );
      if (maleVoice) return maleVoice;
    } else if (persona === 'clear-nature') {
      const clearVoice = koreanVoices.find(
        (v) =>
          v.name.includes('Google') ||
          v.name.includes('SunHi') ||
          v.name.includes('선희') ||
          v.name.includes('Yuna')
      );
      if (clearVoice) return clearVoice;
    } else if (persona === 'warm-mother' || persona === 'cheerful-story') {
      const warmVoice = koreanVoices.find(
        (v) =>
          v.name.includes('SunHi') ||
          v.name.includes('선희') ||
          v.name.includes('Yuna') ||
          v.name.includes('유나')
      );
      if (warmVoice) return warmVoice;
    }

    // 우선순위: Natural/Neural -> Google -> Default
    const naturalVoice = koreanVoices.find(
      (v) => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('neural')
    );
    if (naturalVoice) return naturalVoice;

    const googleVoice = koreanVoices.find((v) => v.name.includes('Google'));
    if (googleVoice) return googleVoice;

    return koreanVoices[0];
  }

  /**
   * 이모지 및 특수부호 제거 및 자연스러운 한글 낭독 전처리
   */
  private cleanTextForSpeech(text: string): string {
    return text
      .replace(
        /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]/gu,
        ''
      )
      .replace(/[▶➔👉★☆●■◆※①②③④~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * 끊김이나 튕김 없이 부드럽고 따뜻하게 문장을 낭독
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

    // 이전 발화 취소
    this.stop();

    const cleaned = this.cleanTextForSpeech(text);
    if (!cleaned) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    const persona = options?.persona ?? 'default';

    // 어르신이 가장 편안하게 들으실 수 있는 황금 배속과 음조
    let rate = options?.rate ?? (persona === 'calm-sunset' ? 0.85 : persona === 'clear-nature' ? 0.92 : 0.88);
    let pitch = options?.pitch ?? (persona === 'calm-sunset' ? 0.92 : persona === 'clear-nature' ? 1.05 : 1.02);

    // Chrome/Edge Web Speech API가 멈춘 상태(suspended)일 경우 자동 복구
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const playId = ++this.currentPlayId;
    this.isSpeaking = true;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    utterance.lang = 'ko-KR';

    const voice = this.pickVoiceForPersona(persona);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;

    // GC 방지: 참조 보존
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
      // 'interrupted' 또는 'canceled'는 정지 버튼 클릭 등에 의한 의도적 중단
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
