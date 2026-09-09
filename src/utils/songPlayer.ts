/**
 * 그 시절 대표 동요 및 어린이/어르신 동요의 따뜻한 오르간/피아노 멜로디 & 반주 연주기 (Web Audio API)
 * - 나비야, 산토끼, 반달, 고향의 봄, 어머니 마음, 섬집 아기, 따오기, 가을길, 과수원길, 오빠 생각
 */

export interface Note {
  pitch: string; // e.g. 'C3' ~ 'C5', 'REST'
  duration: number; // 박자 (1 = 1박, 0.5 = 반박, 2 = 2박 등)
  bassChord?: string; // e.g. 'C', 'G', 'F', 'Am', 'Dm', 'Em'
}

const NOTE_FREQS: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.0, A3: 220.0, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77,
  REST: 0,
};

// 따뜻한 반주 코드 구성음 (Root, 3rd, 5th in Octave 3)
const CHORD_FREQS: Record<string, number[]> = {
  C: [130.81, 164.81, 196.0], // C3, E3, G3
  G: [98.0, 146.83, 196.0],  // G2, D3, G3
  F: [110.0, 174.61, 220.0], // A2, F3, A3
  Am: [110.0, 164.81, 220.0],// A2, E3, A3
  Dm: [146.83, 174.61, 220.0],// D3, F3, A3
  Em: [164.81, 196.0, 246.94],// E3, G3, B3
};

// 동요 멜로디 및 반주 악보 데이터
export const SONG_MELODIES: Record<string, { tempo: number; notes: Note[] }> = {
  // ── [동요관 8곡] ──
  // 1. 나비야 (rhyme-1)
  'rhyme-1': {
    tempo: 96,
    notes: [
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'E4', duration: 2 },
      { pitch: 'F4', duration: 1, bassChord: 'G' }, { pitch: 'D4', duration: 1 }, { pitch: 'D4', duration: 2 },
      { pitch: 'C4', duration: 1, bassChord: 'C' }, { pitch: 'D4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'F4', duration: 1 },
      { pitch: 'G4', duration: 1, bassChord: 'G' }, { pitch: 'G4', duration: 1 }, { pitch: 'G4', duration: 2, bassChord: 'C' },

      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'E4', duration: 1 },
      { pitch: 'F4', duration: 1, bassChord: 'G' }, { pitch: 'D4', duration: 1 }, { pitch: 'D4', duration: 2 },
      { pitch: 'C4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'G4', duration: 1 },
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'E4', duration: 2 },

      { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'D4', duration: 1 }, { pitch: 'D4', duration: 1 }, { pitch: 'D4', duration: 1 },
      { pitch: 'D4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'F4', duration: 2 },
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'E4', duration: 1 },
      { pitch: 'E4', duration: 1 }, { pitch: 'F4', duration: 1 }, { pitch: 'G4', duration: 2, bassChord: 'G' },

      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'E4', duration: 2 },
      { pitch: 'F4', duration: 1, bassChord: 'G' }, { pitch: 'D4', duration: 1 }, { pitch: 'D4', duration: 2 },
      { pitch: 'C4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'G4', duration: 1 },
      { pitch: 'C4', duration: 1, bassChord: 'C' }, { pitch: 'C4', duration: 1 }, { pitch: 'C4', duration: 2 },
    ],
  },

  // 2. 산토끼 (rhyme-2)
  'rhyme-2': {
    tempo: 104,
    notes: [
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 0.5 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'C4', duration: 0.5 },
      { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'E4', duration: 0.5 }, { pitch: 'D4', duration: 0.5 }, { pitch: 'C4', duration: 1 }, { pitch: 'D4', duration: 1 },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'C5', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'C5', duration: 1 },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 0.5 }, { pitch: 'G4', duration: 0.5 }, { pitch: 'D4', duration: 0.5 }, { pitch: 'F4', duration: 0.5 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'D4', duration: 0.5 }, { pitch: 'C4', duration: 2, bassChord: 'C' },

      { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'D4', duration: 0.5 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'C4', duration: 1 }, { pitch: 'D4', duration: 0.5 }, { pitch: 'E4', duration: 0.5 },
      { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'E4', duration: 0.5 }, { pitch: 'G4', duration: 0.5 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 1 },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 0.5 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'C4', duration: 0.5 },
      { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'E4', duration: 0.5 }, { pitch: 'D4', duration: 0.5 }, { pitch: 'C4', duration: 1 }, { pitch: 'D4', duration: 1 }, { pitch: 'C4', duration: 2, bassChord: 'C' },
    ],
  },

  // 3. 반달 (rhyme-3)
  'rhyme-3': {
    tempo: 72,
    notes: [
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 0.5 }, { pitch: 'A4', duration: 0.5 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'C5', duration: 2, bassChord: 'Am' },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'C5', duration: 0.5 }, { pitch: 'A4', duration: 0.5 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 2, bassChord: 'C' },
      { pitch: 'D4', duration: 1, bassChord: 'Dm' }, { pitch: 'E4', duration: 0.5 }, { pitch: 'G4', duration: 0.5 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' },
      { pitch: 'C4', duration: 1, bassChord: 'C' }, { pitch: 'D4', duration: 0.5 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'D4', duration: 1 }, { pitch: 'C4', duration: 3, bassChord: 'C' },

      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 0.5 }, { pitch: 'A4', duration: 0.5 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'C5', duration: 2, bassChord: 'Am' },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'C5', duration: 0.5 }, { pitch: 'A4', duration: 0.5 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 2, bassChord: 'C' },
      { pitch: 'D4', duration: 1, bassChord: 'Dm' }, { pitch: 'E4', duration: 0.5 }, { pitch: 'G4', duration: 0.5 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' },
      { pitch: 'C4', duration: 1, bassChord: 'C' }, { pitch: 'D4', duration: 0.5 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'D4', duration: 1 }, { pitch: 'C4', duration: 3, bassChord: 'C' },
    ],
  },

  // 4. 고향의 봄 (rhyme-4 & song-1)
  'rhyme-4': {
    tempo: 76,
    notes: [
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'F4', duration: 0.5 }, { pitch: 'G4', duration: 1 },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 2, bassChord: 'C' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'C5', duration: 1 }, { pitch: 'G4', duration: 0.5 }, { pitch: 'A4', duration: 0.5 }, { pitch: 'G4', duration: 1 },
      { pitch: 'E4', duration: 1, bassChord: 'Am' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'F4', duration: 0.5 }, { pitch: 'G4', duration: 1 },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 2, bassChord: 'C' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'C5', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 1, bassChord: 'G' },
      { pitch: 'C4', duration: 3, bassChord: 'C' },
    ],
  },
  'song-1': {
    tempo: 76,
    notes: [
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'F4', duration: 0.5 }, { pitch: 'G4', duration: 1 },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 2, bassChord: 'C' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'C5', duration: 1 }, { pitch: 'G4', duration: 0.5 }, { pitch: 'A4', duration: 0.5 }, { pitch: 'G4', duration: 1 },
      { pitch: 'E4', duration: 1, bassChord: 'Am' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 0.5 }, { pitch: 'F4', duration: 0.5 }, { pitch: 'G4', duration: 1 },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 2, bassChord: 'C' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'C5', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 1, bassChord: 'G' },
      { pitch: 'C4', duration: 3, bassChord: 'C' },
    ],
  },

  // 5. 어머니 마음 (rhyme-5)
  'rhyme-5': {
    tempo: 68,
    notes: [
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'C5', duration: 2, bassChord: 'Am' },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'C5', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 2, bassChord: 'C' },
      { pitch: 'D4', duration: 1, bassChord: 'Dm' }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' },
      { pitch: 'C4', duration: 1, bassChord: 'C' }, { pitch: 'D4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2 }, { pitch: 'C4', duration: 3, bassChord: 'C' },

      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'C5', duration: 1 }, { pitch: 'B4', duration: 1, bassChord: 'Em' }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 2, bassChord: 'C' },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'C5', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 2, bassChord: 'C' },
      { pitch: 'D4', duration: 1, bassChord: 'Dm' }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' },
      { pitch: 'C4', duration: 1, bassChord: 'C' }, { pitch: 'D4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2 }, { pitch: 'C4', duration: 3, bassChord: 'C' },
    ],
  },

  // 6. 섬집 아기 (rhyme-6 & song-3)
  'rhyme-6': {
    tempo: 70,
    notes: [
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'G4', duration: 2 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 2, bassChord: 'F' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' }, { pitch: 'C4', duration: 4, bassChord: 'C' },
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'G4', duration: 2 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 2, bassChord: 'F' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' }, { pitch: 'C4', duration: 4, bassChord: 'C' },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'C5', duration: 1 }, { pitch: 'C5', duration: 2 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 2, bassChord: 'C' },
      { pitch: 'D4', duration: 1, bassChord: 'Dm' }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 2 }, { pitch: 'D4', duration: 4, bassChord: 'G' },
    ],
  },
  'song-3': {
    tempo: 70,
    notes: [
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'G4', duration: 2 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 2, bassChord: 'F' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' }, { pitch: 'C4', duration: 4, bassChord: 'C' },
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'G4', duration: 2 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 2, bassChord: 'F' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' }, { pitch: 'C4', duration: 4, bassChord: 'C' },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'C5', duration: 1 }, { pitch: 'C5', duration: 2 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 2, bassChord: 'C' },
      { pitch: 'D4', duration: 1, bassChord: 'Dm' }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 2 }, { pitch: 'D4', duration: 4, bassChord: 'G' },
    ],
  },

  // 7. 따오기 (rhyme-7)
  'rhyme-7': {
    tempo: 75,
    notes: [
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 2, bassChord: 'C' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'C5', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 2, bassChord: 'C' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 2, bassChord: 'C' },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 1 }, { pitch: 'C4', duration: 1 }, { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2 },

      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'C5', duration: 1 }, { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1, bassChord: 'C' },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'C5', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'C4', duration: 2, bassChord: 'C' },
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'C4', duration: 3, bassChord: 'C' },
    ],
  },

  // 8. 가을길 (rhyme-8)
  'rhyme-8': {
    tempo: 84,
    notes: [
      { pitch: 'C4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 2 }, { pitch: 'C4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 2 },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'F4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' },
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'C5', duration: 2 },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2, bassChord: 'G' },
      { pitch: 'C4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'A4', duration: 2 },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 1 }, { pitch: 'C4', duration: 1 }, { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 1 }, { pitch: 'C4', duration: 3, bassChord: 'C' },
    ],
  },

  // 과수원길 (song-2)
  'song-2': {
    tempo: 80,
    notes: [
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'C4', duration: 1 },
      { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2 }, { pitch: 'C4', duration: 2, bassChord: 'C' },
      { pitch: 'E4', duration: 1, bassChord: 'C' }, { pitch: 'G4', duration: 1 }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 1 },
      { pitch: 'C5', duration: 2, bassChord: 'Am' }, { pitch: 'D5', duration: 1 }, { pitch: 'C5', duration: 3, bassChord: 'F' },
      { pitch: 'A4', duration: 1, bassChord: 'F' }, { pitch: 'C5', duration: 1 }, { pitch: 'G4', duration: 2, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'C4', duration: 1 },
      { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2 }, { pitch: 'C4', duration: 2, bassChord: 'C' },
    ],
  },

  // 오빠 생각 (song-4)
  'song-4': {
    tempo: 72,
    notes: [
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'C4', duration: 2 },
      { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2 },
      { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'A4', duration: 1 }, { pitch: 'G4', duration: 1 }, { pitch: 'E4', duration: 1 }, { pitch: 'C4', duration: 2 },
      { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'E4', duration: 1 }, { pitch: 'C4', duration: 2, bassChord: 'C' },
      { pitch: 'C5', duration: 1, bassChord: 'Am' }, { pitch: 'A4', duration: 1 }, { pitch: 'C5', duration: 2 }, { pitch: 'G4', duration: 1, bassChord: 'C' }, { pitch: 'E4', duration: 1 }, { pitch: 'G4', duration: 2 },
      { pitch: 'D4', duration: 1, bassChord: 'G' }, { pitch: 'E4', duration: 1 }, { pitch: 'D4', duration: 2 }, { pitch: 'C4', duration: 4, bassChord: 'C' },
    ],
  },
};

class SongPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentSongId: string | null = null;
  private scheduledTimeouts: number[] = [];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playSong(
    songId: string,
    onProgress?: (noteIndex: number, totalNotes: number) => void,
    onEnded?: () => void
  ) {
    this.stop();
    this.initCtx();
    if (!this.ctx) return;

    const melodyData = SONG_MELODIES[songId] || SONG_MELODIES['rhyme-1'] || SONG_MELODIES['song-1'];
    this.isPlaying = true;
    this.currentSongId = songId;

    const beatDurationSec = 60 / melodyData.tempo;
    let accumulatedTime = 0.05; // 약간의 시작 딜레이

    melodyData.notes.forEach((note, index) => {
      const durationSec = note.duration * beatDurationSec;
      const startTime = this.ctx!.currentTime + accumulatedTime;

      const tId = window.setTimeout(() => {
        if (this.isPlaying && onProgress) {
          onProgress(index, melodyData.notes.length);
        }
      }, accumulatedTime * 1000);
      this.scheduledTimeouts.push(tId);

      // 1. 멜로디 연주
      if (note.pitch !== 'REST' && NOTE_FREQS[note.pitch]) {
        this.scheduleWarmTone(NOTE_FREQS[note.pitch], startTime, durationSec * 0.92);
      }

      // 2. 부드러운 화음/베이스 반주 (코드가 지정된 경우)
      if (note.bassChord && CHORD_FREQS[note.bassChord]) {
        this.scheduleSoftChord(CHORD_FREQS[note.bassChord], startTime, durationSec * 1.5);
      }

      accumulatedTime += durationSec;
    });

    const endTimerId = window.setTimeout(() => {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.currentSongId = null;
        if (onEnded) onEnded();
      }
    }, (accumulatedTime + 0.5) * 1000);
    this.scheduledTimeouts.push(endTimerId);
  }

  /**
   * 따뜻하고 포근한 아날로그 오르간/피아노 리드 멜로디 음향
   */
  private scheduleWarmTone(freq: number, startTime: number, duration: number) {
    if (!this.ctx) return;

    try {
      // 1. 기본음 (온화한 사인파)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, startTime);

      // 2. 풍성한 배음 (삼각파)
      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq, startTime);

      // 게인 엔벨로프 (부드러운 타건 및 감쇠)
      const gain1 = this.ctx.createGain();
      gain1.gain.setValueAtTime(0.001, startTime);
      gain1.gain.linearRampToValueAtTime(0.24, startTime + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      const gain2 = this.ctx.createGain();
      gain2.gain.setValueAtTime(0.001, startTime);
      gain2.gain.linearRampToValueAtTime(0.14, startTime + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc1.start(startTime);
      osc1.stop(startTime + duration);

      osc2.start(startTime);
      osc2.stop(startTime + duration);
    } catch {
      // Ignore
    }
  }

  /**
   * 부드러운 배경 반주 화음 (하모니 패드)
   */
  private scheduleSoftChord(freqs: number[], startTime: number, duration: number) {
    if (!this.ctx) return;

    try {
      freqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.06, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Ignore
    }
  }

  public stop() {
    this.isPlaying = false;
    this.currentSongId = null;
    this.scheduledTimeouts.forEach((id) => clearTimeout(id));
    this.scheduledTimeouts = [];
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentSongId(): string | null {
    return this.currentSongId;
  }
}

export const songPlayer = new SongPlayer();
