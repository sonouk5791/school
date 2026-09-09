/**
 * 실제 사람이 말하는 듯한 자연스러운 억양과 음의 높낮이(Prosody & Pitch Modulation)를 지원하는
 * 고품질 한국어 TTS 음성 엔진
 *
 * [주요 인간형 발화 특성]
 * 1. 문맥별 음조/속도 변조 (의문문 끝올림, 칭찬/감탄문의 생동감 있는 음조, 회상문의 포근한 속도)
 * 2. 쉼표 및 절(Clause) 단위의 자연스러운 호흡과 숨고르기(Inter-segment micro-pause)
 * 3. 영상 및 콘텐츠 맞춤형 목소리 페르소나 (맑은 자연 톤 / 다정한 어머니 톤 / 차분한 노을 톤 등) 지원
 *
 * [버그 수정] Chrome TTS 중단(튕김) 현상 방지:
 * - pause/resume keepAlive 방식 제거 (오히려 중단 유발)
 * - 짧은 세그먼트 방식으로 안정적 연속 재생
 * - utterance 참조 보존으로 GC(가비지 컬렉션) 에 의한 조기 종료 방지
 */

export type VoicePersona = 'default' | 'warm-mother' | 'clear-nature' | 'calm-sunset' | 'cheerful-story';

interface SpeechSegment {
  text: string;
  pitch: number;
  rate: number;
  pauseAfterMs: number;
}

class TTSManager {
  private voices: SpeechSynthesisVoice[] = [];
  private isSpeaking: boolean = false;
  private currentPlayId: number = 0;
  // Chrome GC 방지: 현재 utterance 참조 보존
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!('speechSynthesis' in window)) return;
    const v = window.speechSynthesis.getVoices();
    if (v.length > 0) this.voices = v;
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

    // 기본 우선순위
    const naturalVoice = koreanVoices.find(
      (v) => v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('neural')
    );
    if (naturalVoice) return naturalVoice;

    const googleVoice = koreanVoices.find((v) => v.name.includes('Google'));
    if (googleVoice) return googleVoice;

    return koreanVoices[0];
  }

  /**
   * 이모지 및 부호 제거 및 읽기 전처리
   */
  private cleanTextForSpeech(text: string): string {
    return text
      .replace(
        /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]/gu,
        ''
      )
      .replace(/[▶➔👉★☆●■◆※①②③④]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * 텍스트를 분석하여 사람이 말하는 듯한 음의 높낮이(Pitch)와 속도(Rate), 숨고르기 간격을 가진 절(Segment)들로 분할
   */
  private parseProsodySegments(
    rawText: string,
    baseRate: number,
    basePitch: number,
    persona: VoicePersona
  ): SpeechSegment[] {
    const cleaned = this.cleanTextForSpeech(rawText);
    if (!cleaned) return [];

    const rawClauses = cleaned
      .split(/([,?.!\n~]+)/)
      .map((s) => s.trim())
      .filter(Boolean);

    const segments: SpeechSegment[] = [];
    let currentClause = '';

    for (let i = 0; i < rawClauses.length; i++) {
      const token = rawClauses[i];
      if (/^[,?.!\n~]+$/.test(token)) {
        currentClause += token;
        if (currentClause.trim()) {
          segments.push(this.analyzeClauseProsody(currentClause.trim(), segments.length, baseRate, basePitch, persona));
          currentClause = '';
        }
      } else {
        if (currentClause) {
          segments.push(this.analyzeClauseProsody(currentClause.trim(), segments.length, baseRate, basePitch, persona));
        }
        currentClause = token;
      }
    }

    if (currentClause.trim()) {
      segments.push(this.analyzeClauseProsody(currentClause.trim(), segments.length, baseRate, basePitch, persona));
    }

    return segments.length > 0
      ? segments
      : [{ text: cleaned, pitch: basePitch, rate: baseRate, pauseAfterMs: 50 }];
  }

  private analyzeClauseProsody(
    clauseText: string,
    segmentIndex: number,
    baseRate: number,
    basePitch: number,
    persona: VoicePersona
  ): SpeechSegment {
    let pitch = basePitch;
    let rate = baseRate;
    let pauseAfterMs = 150;

    const text = clauseText.trim();
    const isFirst = segmentIndex === 0;
    const isQuestion =
      text.endsWith('?') ||
      text.includes('인가요') ||
      text.includes('나요') ||
      text.includes('까요') ||
      text.includes('무엇일까요') ||
      text.includes('골라보세요');

    const isExclamation =
      text.endsWith('!') ||
      text.includes('참 잘하셨습니다') ||
      text.includes('정답입니다') ||
      text.includes('화이팅') ||
      text.includes('반갑습니다');

    const isCommaClause = text.endsWith(',') || text.endsWith('며') || text.endsWith('고');
    const isReflective = text.includes('추억') || text.includes('그 시절') || text.includes('기억');

    // 페르소나별 기본 음조/속도 미세 조율
    if (persona === 'clear-nature') {
      pitch += 0.05;
      rate *= 1.02;
    } else if (persona === 'calm-sunset') {
      pitch -= 0.08;
      rate *= 0.95;
    } else if (persona === 'warm-mother') {
      pitch += 0.02;
    }

    if (isQuestion) {
      pitch += 0.12;
      rate *= 0.98;
      pauseAfterMs = 280;
    } else if (isExclamation) {
      pitch += 0.08;
      rate *= 1.02;
      pauseAfterMs = 260;
    } else if (isFirst) {
      pitch += 0.04;
      pauseAfterMs = 180;
    } else if (isCommaClause) {
      pitch += 0.02;
      pauseAfterMs = 200;
    } else {
      pitch = Math.max(0.85, pitch - 0.04);
      rate *= 0.97;
      pauseAfterMs = 300;
    }

    if (isReflective) {
      rate = Math.max(0.80, rate * 0.95);
    }

    return {
      text,
      pitch: Number(pitch.toFixed(2)),
      rate: Number(rate.toFixed(2)),
      pauseAfterMs,
    };
  }

  /**
   * 문장들을 사람이 이야기하듯 억양과 높낮이를 살려 순차적으로 낭독
   * [Chrome TTS 튕김 방지]
   * - keepAlive pause/resume 제거 (역효과)
   * - currentUtterance 참조 보존으로 GC 방지
   * - 세그먼트별 짧은 단위 재생으로 안정성 확보
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
    if (!('speechSynthesis' in window)) {
      if (options?.onError) options.onError();
      return;
    }

    this.stop();

    const persona = options?.persona ?? 'default';
    const baseRate = options?.rate ?? (persona === 'calm-sunset' ? 0.84 : persona === 'clear-nature' ? 0.90 : 0.88);
    const basePitch = options?.pitch ?? (persona === 'calm-sunset' ? 0.92 : persona === 'clear-nature' ? 1.08 : 1.02);

    const segments = this.parseProsodySegments(text, baseRate, basePitch, persona);
    if (segments.length === 0) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    this.isSpeaking = true;
    const playId = ++this.currentPlayId;
    if (options?.onStart) options.onStart();

    const voice = this.pickVoiceForPersona(persona);

    let currentIndex = 0;

    const speakNextSegment = () => {
      if (playId !== this.currentPlayId || !this.isSpeaking) return;

      if (currentIndex >= segments.length) {
        this.cleanup();
        if (options?.onEnd) options.onEnd();
        return;
      }

      const segment = segments[currentIndex];
      currentIndex++;

      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.lang = 'ko-KR';
      if (voice) {
        utterance.voice = voice;
      }
      utterance.pitch = segment.pitch;
      utterance.rate = segment.rate;

      // GC 방지: 현재 utterance 참조 보존
      this.currentUtterance = utterance;

      utterance.onend = () => {
        if (playId !== this.currentPlayId || !this.isSpeaking) return;

        if (currentIndex < segments.length) {
          window.setTimeout(() => {
            speakNextSegment();
          }, segment.pauseAfterMs);
        } else {
          this.cleanup();
          if (options?.onEnd) options.onEnd();
        }
      };

      utterance.onerror = (e) => {
        // 'interrupted' 에러는 stop()으로 인한 정상 중단 - 무시
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        if (playId === this.currentPlayId) {
          this.cleanup();
          if (options?.onError) options.onError();
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNextSegment();
  }

  private cleanup() {
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  public stop() {
    this.currentPlayId++;
    this.isSpeaking = false;
    this.currentUtterance = null;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking || (typeof window !== 'undefined' && window.speechSynthesis?.speaking);
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }
}

export const ttsManager = new TTSManager();
