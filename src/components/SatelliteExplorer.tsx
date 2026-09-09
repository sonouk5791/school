import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Camera,
  MapPin,
  Sparkles,
  ZoomIn,
  History,
  Layers,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue with bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// ── 다채로운 옛 사진 인터페이스 ─────────────────────────────────
export interface NostalgiaPhoto {
  id: string;
  title: string;
  era: string; // '1960년대' | '1970년대' | '1980년대' | '1990년대'
  category: '골목·거리' | '시장·장터' | '생활·축제' | '자연·명소';
  url: string;
  caption: string;
  memoryStory: string;
}

// ── 대한민국 팔도 옛 동네 & 정겨운 고향 프리셋 ──────────────────────
export interface KoreaNeighborhood {
  id: string;
  name: string;
  region: '수도권' | '강원권' | '충청권' | '전라권' | '경상권' | '제주권';
  emoji: string;
  title: string;
  lat: number;
  lng: number;
  zoom: number;
  historicalEra: string;
  oldDescription: string;
  memoryKeywords: string[];
  photos: NostalgiaPhoto[];
}

const KOREA_NEIGHBORHOODS: KoreaNeighborhood[] = [
  // ── 수도권 ──
  {
    id: 'seoul-jongno',
    name: '서울 종로·피맛골',
    region: '수도권',
    emoji: '🏙️',
    title: '서울 종로 & 피맛골 골목길',
    lat: 37.5704,
    lng: 126.9831,
    zoom: 16,
    historicalEra: '1960~70년대',
    oldDescription: '전차가 땡땡 종을 울리며 지나가고, 좁은 피맛골 골목마다 고소한 빈대떡과 따뜻한 국밥 냄새가 가득했던 정겨운 서울의 중심지였습니다.',
    memoryKeywords: ['종로 전차', '보신각종', '피맛골 국밥', '화신백화점', '청계천 헌책방'],
    photos: [
      {
        id: 'sj-1',
        title: '종로 피맛골 한옥 골목길',
        era: '1970년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
        caption: '처마 끝 기와가 맞닿은 피맛골 좁은 골목길의 정취',
        memoryStory: '퇴근길이나 장을 보고 나서 피맛골 주막에 둘러앉아 따뜻한 막걸리 한 사발과 도토리묵을 나누어 먹던 시절이 눈에 선합니다.',
      },
      {
        id: 'sj-2',
        title: '종로 보신각과 옛 도심 전경',
        era: '1960년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1000&auto=format&fit=crop&q=80',
        caption: '새해마다 제야의 종소리를 듣기 위해 사람들이 인산인해를 이루던 보신각',
        memoryStory: '추운 섣달그믐날 목도리를 꽁꽁 두르고 라디오와 TV 앞에서 온 가족이 모여 보신각 33번의 타종 소리를 함께 세곤 했습니다.',
      },
      {
        id: 'sj-3',
        title: '청계천 옛 다리와 헌책방 골목',
        era: '1970년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1000&auto=format&fit=crop&q=80',
        caption: '학생들의 발길이 끊이지 않던 청계천 헌책방 거리와 판잣집 풍경',
        memoryStory: '새 학기가 되면 낡은 교과서와 참고서를 구하러 헌책방 골목을 뒤지며 책장 넘기는 냄새를 맡던 그 시절의 풋풋한 기억입니다.',
      },
      {
        id: 'sj-4',
        title: '종로 옛 극장가와 간판 풍경',
        era: '1980년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1000&auto=format&fit=crop&q=80',
        caption: '손으로 직접 그린 대형 영화 간판이 걸려있던 단성사와 피카디리 극장',
        memoryStory: '줄을 길게 서서 암표를 사기도 하고, 극장 안에서 삶은 계란과 칠성사이다를 먹으며 영화를 보던 낭만이 있었습니다.',
      },
    ],
  },
  {
    id: 'seoul-namdaemun',
    name: '서울 남대문 시장',
    region: '수도권',
    emoji: '🛍️',
    title: '서울 남대문 시장 & 숭례문',
    lat: 37.5592,
    lng: 126.9772,
    zoom: 16,
    historicalEra: '1970~80년대',
    oldDescription: '새벽부터 전국의 장사꾼과 손님들로 왁자지껄 활기가 넘치던 남대문 시장! 풀빵 하나 손에 쥐고 구경하던 추억의 장소입니다.',
    memoryKeywords: ['남대문 지게꾼', '도깨비 시장', '풀빵과 가락국수', '숭례문 앞 광장', '야시장 불빛'],
    photos: [
      {
        id: 'sn-1',
        title: '남대문 전통 시장의 활기찬 장터',
        era: '1970년대',
        category: '시장·장터',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
        caption: '알록달록 포목과 옷가지, 없는 게 없던 도깨비 남대문 장터',
        memoryStory: '어머니 손을 꼭 잡고 명절 빔을 맞추러 가서 시장 골목 리어카에서 달콤한 호떡 하나를 얻어먹고 행복해하던 기억이 납니다.',
      },
      {
        id: 'sn-2',
        title: '숭례문(남대문)과 옛 전차 선로',
        era: '1960년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1000&auto=format&fit=crop&q=80',
        caption: '서울 성곽의 으뜸 문, 숭례문 앞을 유유히 지나던 옛 서울 풍경',
        memoryStory: '남대문 성곽 주변으로 소달구지와 자전거, 삼륜차가 함께 지나다니던 서울의 옛 교통 풍경이 그리워집니다.',
      },
      {
        id: 'sn-3',
        title: '새벽을 여는 야시장과 가락국수',
        era: '1980년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=1000&auto=format&fit=crop&q=80',
        caption: '김이 모락모락 나던 포장마차와 훈훈한 시장 인심',
        memoryStory: '밤늦게까지 물건을 떼러 온 전국의 상인들과 함께 따끈한 멸치 국물에 고춧가루를 팍팍 쳐서 먹던 가락국수 맛이 최고였습니다.',
      },
    ],
  },
  {
    id: 'incheon-port',
    name: '인천 개항장·월미도',
    region: '수도권',
    emoji: '⚓',
    title: '인천 차이나타운 & 옛 개항장 거리',
    lat: 37.4754,
    lng: 126.6219,
    zoom: 16,
    historicalEra: '1960~70년대',
    oldDescription: '바닷바람 맞으며 붉은 벽돌 창고와 이국적인 옛 골목길을 걷던 시절, 바다 짠내와 함께 짜장면 한 그릇이 유난히 맛있던 고향입니다.',
    memoryKeywords: ['월미도 바닷가', '인천 부두 뱃고동', '개항장 벽돌집', '원조 짜장면', '연안부두 유람선'],
    photos: [
      {
        id: 'ic-1',
        title: '인천항 부두와 뱃고동 소리',
        era: '1970년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
        caption: '서해안의 관문, 갯벌과 푸른 물결이 일렁이던 옛 인천 앞바다',
        memoryStory: '연안부두에서 서해 섬들로 떠나는 여객선을 배웅하며 갈매기들에게 과자를 던져주던 추억이 가득합니다.',
      },
      {
        id: 'ic-2',
        title: '개항장 붉은 벽돌길과 일본식 가옥',
        era: '1960년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1000&auto=format&fit=crop&q=80',
        caption: '오랜 세월을 간직한 적산가옥과 붉은 벽돌 창고 골목',
        memoryStory: '돌계단을 올라 자유공원에 이르면 인천 앞바다가 한눈에 내려다보이고, 춘향전 같은 옛 가요가 흘러나왔습니다.',
      },
      {
        id: 'ic-3',
        title: '월미도 유원지와 옛 백사장',
        era: '1980년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?w=1000&auto=format&fit=crop&q=80',
        caption: '휴일이면 가족들과 나들이를 떠나던 정겨운 월미도 바닷가',
        memoryStory: '디스코팡팡과 바이킹의 신나는 음악 소리, 바다를 바라보며 먹던 조개구이와 회 한 접시의 정취가 떠오릅니다.',
      },
    ],
  },
  {
    id: 'suwon-hwaseong',
    name: '수원 화성 행궁',
    region: '수도권',
    emoji: '🏯',
    title: '수원 화성 팔달문 & 성곽 안마을',
    lat: 37.2854,
    lng: 127.0142,
    zoom: 16,
    historicalEra: '1970년대',
    oldDescription: '성곽 돌담 아래서 아이들이 비석치기를 하고, 팔달문 앞 장터에서 소달구지가 지나가던 평화로운 옛 수원 동네입니다.',
    memoryKeywords: ['화성 성곽길', '팔달문 우시장', '빨래터 시냇가', '골목길 연날리기', '수원갈비 냄새'],
    photos: [
      {
        id: 'sw-1',
        title: '수원 화성 성곽과 초가지붕 마을',
        era: '1970년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1000&auto=format&fit=crop&q=80',
        caption: '웅장한 성곽 돌담과 흙길을 따라 늘어선 초가와 기와집',
        memoryStory: '가을이면 성곽을 따라 억새가 은빛으로 물들고, 동네 아이들이 방과 후 성곽 돌계단에 걸터앉아 구슬치기를 하곤 했습니다.',
      },
      {
        id: 'sw-2',
        title: '팔달문 앞 옛 오일장과 우시장',
        era: '1960년대',
        category: '시장·장터',
        url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&auto=format&fit=crop&q=80',
        caption: '경기 남부의 최대 장터였던 팔달문 앞 우시장 풍경',
        memoryStory: '전국에서 모인 황소들의 울음소리와 장터 국밥집에서 뿜어져 나오는 구수한 연기가 시장을 가득 메웠습니다.',
      },
      {
        id: 'sw-3',
        title: '수원천 빨래터와 아이들의 멱감기',
        era: '1970년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1000&auto=format&fit=crop&q=80',
        caption: '맑은 개천가에서 방망이를 두드리며 이야기꽃을 피우던 어머니들',
        memoryStory: '여름날이면 수원천 징검다리 주변에서 송사리를 잡고 멱을 감으며 해 질 녘까지 물장구를 쳤습니다.',
      },
    ],
  },

  // ── 경상권 ──
  {
    id: 'busan-jagalchi',
    name: '부산 자갈치·남포동',
    region: '경상권',
    emoji: '🌊',
    title: '부산 자갈치 시장 & 영도다리',
    lat: 35.0968,
    lng: 129.0306,
    zoom: 16,
    historicalEra: '1960~70년대',
    oldDescription: '"오이소! 보이소! 사이소!" 자갈치 아지매들의 구수한 사투리와 영도다리가 번쩍 들릴 때마다 손을 흔들던 그 시절의 바다 동네입니다.',
    memoryKeywords: ['영도다리 도개', '자갈치 꼼장어', '남포동 극장가', '갈매기 울음소리', '용두산 타워'],
    photos: [
      {
        id: 'bj-1',
        title: '자갈치 어시장과 대야를 인 아지매들',
        era: '1970년대',
        category: '시장·장터',
        url: 'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?w=1000&auto=format&fit=crop&q=80',
        caption: '싱싱한 생선을 한가득 담고 흥정을 벌이던 정겨운 자갈치 포구',
        memoryStory: '"물 좋은 고등어 한 마리 보이소!" 갓 잡아 올린 은빛 갈치와 꼼장어 굽는 연기가 자갈치 바닷가를 가득 채웠습니다.',
      },
      {
        id: 'bj-2',
        title: '영도다리 도개(들림)와 구경 인파',
        era: '1960년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
        caption: '하루 세 번 뱃고동과 함께 하늘 높이 들리던 동양 최초의 도개교',
        memoryStory: '다리가 웅장하게 올라갈 때마다 큰 배가 지나가고, 다리 양편에 늘어선 사람들과 점집 골목의 애환이 교차했습니다.',
      },
      {
        id: 'bj-3',
        title: '남포동 PIFF 광장과 국제시장 골목',
        era: '1980년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&auto=format&fit=crop&q=80',
        caption: '수입 구제 옷과 미제 물건, 씨앗호떡과 비빔당면이 넘치던 국제시장',
        memoryStory: "영화 '국제시장'처럼 피란 시절부터 삶의 터전이 되어준 골목길마다 끈질긴 생명력과 따뜻한 정이 흘러넘쳤습니다.",
      },
      {
        id: 'bj-4',
        title: '용두산공원과 부산타워 나들이',
        era: '1970년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1000&auto=format&fit=crop&q=80',
        caption: '부산 앞바다와 오륙도가 시원하게 펼쳐지던 용두산 꽃시계',
        memoryStory: '소풍이나 데이트 코스로 빠지지 않던 용두산공원 꽃시계 앞에서 손가락으로 브이를 그리며 흑백 사진을 남겼습니다.',
      },
    ],
  },
  {
    id: 'daegu-seomun',
    name: '대구 서문시장·계산동',
    region: '경상권',
    emoji: '🏔️',
    title: '대구 서문시장 & 청라언덕 골목길',
    lat: 35.8693,
    lng: 128.5818,
    zoom: 16,
    historicalEra: '1970년대',
    oldDescription: '전국 3대 장터 중 하나였던 서문시장의 비단옷 가게들과 고즈넉한 청라언덕 골목길의 피아노 소리가 기억나는 대구의 옛 모습입니다.',
    memoryKeywords: ['서문시장 포목점', '청라언덕 사과밭', '납작만두', '약전골목 한약향', '동성로 분수대'],
    photos: [
      {
        id: 'ds-1',
        title: '서문시장 주단 포목점과 장터 골목',
        era: '1970년대',
        category: '시장·장터',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
        caption: '비단 원단과 고운 한복이 눈부시게 걸려있던 영남 최대의 장터',
        memoryStory: '혼수 장만을 위해 경상도 일대에서 서문시장을 찾았고, 양은 냄비에 끓여낸 칼제비와 납작만두를 먹으며 피로를 풀었습니다.',
      },
      {
        id: 'ds-2',
        title: '청라언덕 계산성당과 선교사 주택',
        era: '1960년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&auto=format&fit=crop&q=80',
        caption: '붉은 벽돌의 뾰족탑과 담쟁이덩굴이 고풍스럽던 언덕길',
        memoryStory: '"봄의 교향악이 울려 퍼지는 청라언덕 위에 백합 필 적에~" 노래 가사를 읊조리며 흙담길을 걷던 서정적인 동네였습니다.',
      },
      {
        id: 'ds-3',
        title: '대구 사과 과수원과 풋풋한 시절',
        era: '1980년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
        caption: '꿀맛 같은 능금(사과)이 주렁주렁 열리던 대구 외곽 들판',
        memoryStory: '빨갛게 익은 대구 사과 상자를 기차에 싣고 서울 친척집에 선물로 보내던 풍요로운 가을 풍경이 그립습니다.',
      },
    ],
  },
  {
    id: 'gyeongju-daereung',
    name: '경주 대릉원·황남동',
    region: '경상권',
    emoji: '👑',
    title: '경주 황남동 고분군 & 옛 흙담길',
    lat: 35.8354,
    lng: 129.2134,
    zoom: 16,
    historicalEra: '1970~80년대',
    oldDescription: '마을 뒤란마다 거대한 능이 푸르게 솟아있고, 봄이면 유채꽃과 벚꽃길을 따라 자전거를 타고 달리던 천년 고도의 고향 마을입니다.',
    memoryKeywords: ['황남동 흙담', '첨성대 잔디밭', '수학여행 추억', '돌담길 봉선화', '불국사 청운교'],
    photos: [
      {
        id: 'gj-1',
        title: '첨성대 앞 잔디밭과 유채꽃 풍경',
        era: '1970년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=1000&auto=format&fit=crop&q=80',
        caption: '하늘의 별을 보던 첨성대 주변으로 푸른 잔디와 봄꽃이 활짝 핀 모습',
        memoryStory: '학창 시절 교복을 입고 수학여행을 와서 첨성대를 배경으로 어깨동무를 하고 단체 사진을 찍던 그때가 엊그제 같습니다.',
      },
      {
        id: 'gj-2',
        title: '황남동 고분군 사이 한옥 돌담길',
        era: '1980년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1000&auto=format&fit=crop&q=80',
        caption: '흙담 너머로 감나무가 고개 내밀던 조용하고 아늑한 황남동 골목',
        memoryStory: '기와지붕 아래 마루에 앉아 고분 위로 붉게 물드는 저녁노을을 바라보며 시원한 수박 한 조각을 베어 물던 기억이 납니다.',
      },
      {
        id: 'gj-3',
        title: '불국사 백운교 청운교 앞 기념촬영',
        era: '1960년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1000&auto=format&fit=crop&q=80',
        caption: '국민관광지 불국사 돌계단 앞에서 삼삼오오 모여 남긴 추억',
        memoryStory: '다보탑과 석가탑의 돌조각을 만져보며 신라 천 년의 숨결을 느끼고 토함산 맑은 약수를 바가지로 마셨습니다.',
      },
    ],
  },
  {
    id: 'andong-hahoe',
    name: '안동 하회마을',
    region: '경상권',
    emoji: '🎭',
    title: '안동 낙동강 물도리동 하회마을',
    lat: 36.5392,
    lng: 128.5178,
    zoom: 16,
    historicalEra: '전통 고향 풍경',
    oldDescription: '낙동강 물줄기가 마을을 포근히 감싸 안고, 저녁이면 초가지붕 굴뚝마다 구수한 밥 짓는 연기가 모락모락 피어오르던 종갓집 마을입니다.',
    memoryKeywords: ['부용대 뗏목', '초가삼간 굴뚝연기', '마을 어귀 장승', '하회별신굿', '양진당 마루'],
    photos: [
      {
        id: 'ah-1',
        title: '부용대에서 내려다본 하회마을 전경',
        era: '1970년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop&q=80',
        caption: 'S자로 굽이치는 맑은 낙동강과 연꽃 모양으로 자리 잡은 고향 마을',
        memoryStory: '나룻배를 타고 강을 건너 부용대 절벽에 오르면 온 마을의 초가와 기와가 한눈에 들어와 가슴이 탁 트였습니다.',
      },
      {
        id: 'ah-2',
        title: '하회탈춤 별신굿 놀이마당',
        era: '1980년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1000&auto=format&fit=crop&q=80',
        caption: '양반과 각시, 백정이 어우러져 흥겨운 풍물 장단에 춤추던 마당극',
        memoryStory: '꽹과리와 징 소리에 맞춰 어깨춤을 들썩이고, 막걸리와 메밀전병을 나누어 먹으며 온 동네가 잔치 분위기였습니다.',
      },
      {
        id: 'ah-3',
        title: '고택의 정갈한 사랑채와 대청마루',
        era: '1970년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&auto=format&fit=crop&q=80',
        caption: '오랜 세월을 머금은 툇마루와 정갈한 서까래 기와집',
        memoryStory: '할아버지께서 붓글씨를 쓰시던 사랑방 냄새와 문풍지 사이로 스며들던 풀벌레 소리가 아련하게 그립습니다.',
      },
    ],
  },

  // ── 전라권 ──
  {
    id: 'jeonju-hanok',
    name: '전주 교동·풍남문',
    region: '전라권',
    emoji: '🍲',
    title: '전주 한옥마을 & 풍남문 로터리',
    lat: 35.8153,
    lng: 127.1534,
    zoom: 16,
    historicalEra: '1960~70년대',
    oldDescription: '기왓골 고샅길마다 따뜻한 정이 넘치고, 경기전 은행나무 아래서 콩나물국밥과 모주 한 사발로 하루를 시작하던 맛의 고향 전주입니다.',
    memoryKeywords: ['풍남문 옛 종소리', '경기전 은행나무', '콩나물국밥', '비빔밥 놋그릇', '오목대 달맞이'],
    photos: [
      {
        id: 'jh-1',
        title: '전주 경기전과 고즈넉한 한옥 지붕들',
        era: '1970년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&auto=format&fit=crop&q=80',
        caption: '먹빛 기와가 파도처럼 이어지던 전주 교동 한옥 골목길',
        memoryStory: '경기전 앞 커다란 은행나무 아래서 노란 잎을 밟으며 걷고, 돌담 너머로 장독대에 옹기종기 모인 된장 항아리를 보던 풍경입니다.',
      },
      {
        id: 'jh-2',
        title: '풍남문 로터리와 전주 옛 남부시장',
        era: '1960년대',
        category: '시장·장터',
        url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&auto=format&fit=crop&q=80',
        caption: '전라도의 곡창지대 쌀과 채소가 가득 모이던 남부시장',
        memoryStory: '뚝배기에 팔팔 끓여 나온 전주 콩나물국밥에 수란을 곁들여 먹으며 아침 장을 보던 상인들의 활기찬 하루가 떠오릅니다.',
      },
      {
        id: 'jh-3',
        title: '전동성당과 한복 입은 사람들의 나들이',
        era: '1980년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1000&auto=format&fit=crop&q=80',
        caption: '로마네스크 양식의 붉은 성당 돔과 푸른 하늘의 조화',
        memoryStory: '성당 종소리가 은은하게 마을에 퍼지면 일요일 미사를 마치고 나온 어르신들과 아이들이 광장에서 담소를 나누었습니다.',
      },
    ],
  },
  {
    id: 'gwangju-geumnam',
    name: '광주 금남로·무등산',
    region: '전라권',
    emoji: '🌿',
    title: '광주 금남로 옛 도청앞 & 무등산 자락',
    lat: 35.1468,
    lng: 126.9202,
    zoom: 16,
    historicalEra: '1970~80년대',
    oldDescription: '무등산 서석대가 푸르게 내려다보고, 금남로 분수대 앞 광장에서 친구를 기다리며 상추튀김을 나누어 먹던 그리운 시절의 광주입니다.',
    memoryKeywords: ['무등산 수박', '금남로 분수대', '옛 도청 분수광장', '충장로 다방', '증심사 계곡'],
    photos: [
      {
        id: 'gg-1',
        title: '무등산 서석대와 증심사 맑은 계곡',
        era: '1970년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
        caption: '어머니의 너른 품처럼 광주를 포근히 감싸 안은 푸른 무등산',
        memoryStory: '여름이면 증심사 계곡 그늘에 발을 담그고, 큼직하고 달콤한 무등산 수박을 한 입 가득 베어 물던 시원한 추억이 있습니다.',
      },
      {
        id: 'gg-2',
        title: '금남로 거리와 옛 전남도청 분수대',
        era: '1980년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1000&auto=format&fit=crop&q=80',
        caption: '광주의 가장 큰 번화가 금남로와 시원한 물줄기의 원형 분수대',
        memoryStory: '충장로 우체국 앞에서 만나기로 약속을 잡고 음악 다방에서 흘러나오는 통기타 팝송을 들으며 설레던 청춘 시절의 기억입니다.',
      },
      {
        id: 'gg-3',
        title: '양동시장 통닭과 장터 사람들',
        era: '1970년대',
        category: '시장·장터',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
        caption: '가마솥에 튀겨내던 고소한 시장 통닭 냄새와 푸짐한 덤',
        memoryStory: '월급날 아버지께서 누런 종이봉투에 포장해 오시던 양동통닭의 바삭하고 고소한 맛은 세상 무엇보다 달콤했습니다.',
      },
    ],
  },
  {
    id: 'mokpo-yudal',
    name: '목포 유달산·선창',
    region: '전라권',
    emoji: '🚢',
    title: '목포 유달산 자락 & 옛 목포항 선창가',
    lat: 34.7891,
    lng: 126.3764,
    zoom: 16,
    historicalEra: '1960~70년대',
    oldDescription: '삼학도 앞바다로 고기잡이 통통배가 떠나고, 유달산 노적봉에 올라 목포항을 바라보며 유달산 노래를 부르던 낭만 가득한 항구 마을입니다.',
    memoryKeywords: ['목포의 눈물', '유달산 노적봉', '선창 홍어 장터', '삼학도 조개잡이', '다도해 붉은 낙조'],
    photos: [
      {
        id: 'my-1',
        title: '유달산 노적봉과 다도해 풍경',
        era: '1960년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
        caption: '영산강 하구와 다도해 섬들이 보석처럼 펼쳐진 유달산 바위',
        memoryStory: '노적봉 바위에 올라 "사공의 뱃노래 가물거리며~" 목포의 눈물 노래를 흥얼거리며 서해 바다로 지는 낙조를 감상했습니다.',
      },
      {
        id: 'my-2',
        title: '목포 선창 어시장과 홍어 경매',
        era: '1970년대',
        category: '시장·장터',
        url: 'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?w=1000&auto=format&fit=crop&q=80',
        caption: '새벽 안개를 뚫고 들어온 어선들과 활어 경매의 뜨거운 열기',
        memoryStory: '흑산도 홍어와 민어, 세발낙지가 널린 선창가 평상에서 막걸리 한 사발에 짭조름한 젓갈 안주를 곁들이던 정겨운 포구입니다.',
      },
      {
        id: 'my-3',
        title: '삼학도 뱃길과 옛 목포역 광장',
        era: '1980년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1000&auto=format&fit=crop&q=80',
        caption: '세 마리 학의 전설이 깃든 삼학도와 완행열차가 닿던 목포역',
        memoryStory: '호남선의 마지막 종착역인 목포역에서 짐보따리를 이고 내리던 사람들과 남도의 따뜻한 정취가 깃들어 있습니다.',
      },
    ],
  },

  // ── 충청권 ──
  {
    id: 'daejeon-station',
    name: '대전역·중앙시장',
    region: '충청권',
    emoji: '🚂',
    title: '대전역 광장 & 중앙시장 목척교',
    lat: 36.3315,
    lng: 127.4338,
    zoom: 16,
    historicalEra: '1960~70년대',
    oldDescription: '경부선·호남선 열차가 멈출 때마다 승강장으로 뛰어나가 3분 만에 후루룩 먹던 대전역 가락국수의 잊지 못할 추억이 깃든 곳입니다.',
    memoryKeywords: ['대전발 0시 50분', '완행열차 가락국수', '목척교 개천빨래', '중앙시장 뻥튀기', '성심당 옛 빵집'],
    photos: [
      {
        id: 'ds-1',
        title: '완행열차 승강장과 대전역 가락국수',
        era: '1970년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1000&auto=format&fit=crop&q=80',
        caption: '열차 정차 3분 동안 승강장 포장마차에서 먹던 추억의 가락국수',
        memoryStory: '기관차 기적 소리가 울리면 국수를 입에 가득 넣고 허겁지겁 객차로 뛰어오르며 웃음 짓던 청춘의 추억이 생생합니다.',
      },
      {
        id: 'ds-2',
        title: '대전 중앙시장과 목척교 옛 다리',
        era: '1960년대',
        category: '시장·장터',
        url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1000&auto=format&fit=crop&q=80',
        caption: '대전천 징검다리와 중앙시장 뻥튀기 기계의 "뻥이요~" 소리',
        memoryStory: '장날이면 옥수수와 쌀을 깡통에 담아 뻥튀기 아저씨 앞에 줄을 서고, 귀를 막으며 고소한 튀밥을 한 자루 가득 담아왔습니다.',
      },
      {
        id: 'ds-3',
        title: '유성온천 족욕탕과 시골길 풍경',
        era: '1980년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1000&auto=format&fit=crop&q=80',
        caption: '따끈한 천연 온천수가 솟아오르던 효도 관광의 명소',
        memoryStory: '부모님을 모시고 유성온천에 다녀와서 피부가 매끈해졌다며 자랑하시던 온 가족의 흐뭇한 여행이 떠오릅니다.',
      },
    ],
  },
  {
    id: 'cheongju-seongandil',
    name: '청주 성안길·무심천',
    region: '충청권',
    emoji: '🌸',
    title: '청주 본정통(성안길) & 무심천 뚝방길',
    lat: 36.6358,
    lng: 127.4886,
    zoom: 16,
    historicalEra: '1970년대',
    oldDescription: '봄이면 무심천 뚝방을 따라 수양버들과 벚꽃이 흩날리고, 철당간 광장에서 비둘기 모이를 주며 거닐던 평온한 충청도 마을입니다.',
    memoryKeywords: ['무심천 징검다리', '용두사지 철당간', '육거리장터 순대', '본정통 옛 극장', '상당산성 피크닉'],
    photos: [
      {
        id: 'cs-1',
        title: '무심천 벚꽃 뚝방길과 빨래터',
        era: '1970년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1000&auto=format&fit=crop&q=80',
        caption: '봄바람에 벚꽃 잎이 눈꽃처럼 흩날리던 무심천 개천가',
        memoryStory: '돗자리를 펴고 도시락을 먹으며 친구들과 수다를 떨고, 맑은 물에 발을 담그며 버들치와 피라미를 쫓던 평화로운 봄날이었습니다.',
      },
      {
        id: 'cs-2',
        title: '청주 육거리 전통시장 순대 골목',
        era: '1960년대',
        category: '시장·장터',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
        caption: '가마솥에서 푹 끓인 육수와 푸짐한 인심의 육거리 장터',
        memoryStory: '뜨끈한 순대국밥 한 그릇에 깍두기 하나 올려 먹으면 온몸의 추위가 싹 녹아내리던 충청도의 넉넉한 정이었습니다.',
      },
      {
        id: 'cs-3',
        title: '상당산성 성곽길과 옛 초가마을',
        era: '1980년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1000&auto=format&fit=crop&q=80',
        caption: '산 능선을 따라 축조된 석성과 도토리묵 파는 산성마을',
        memoryStory: '가족들과 산성 성곽을 한 바퀴 돌고 내려와 파전과 동동주 한 잔을 나누며 푸른 청주 시내를 굽어보았습니다.',
      },
    ],
  },

  // ── 강원권 ──
  {
    id: 'chuncheon-soyangg',
    name: '춘천 소양강·명동',
    region: '강원권',
    emoji: '❄️',
    title: '춘천 소양강 나룻터 & 중앙시장 닭갈비 골목',
    lat: 37.8924,
    lng: 127.7288,
    zoom: 16,
    historicalEra: '1970년대',
    oldDescription: '소양강 처녀 노래를 흥얼거리며 안개 자욱한 소양강을 나룻배로 건너고, 둥근 드럼통 식탁에 둘러앉아 닭갈비를 볶아먹던 낭만의 춘천입니다.',
    memoryKeywords: ['소양강 처녀', '경춘선 완행열차', '나룻배 사공', '연탄불 닭갈비', '공지천 오리배'],
    photos: [
      {
        id: 'cc-1',
        title: '소양강 댐과 물안개 피는 나룻터',
        era: '1970년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
        caption: '동양 최대의 사력댐, 소양호의 푸른 물결과 뱃길',
        memoryStory: '"해 저문 소양강에 황혼이 지면~" 청평사로 향하는 배를 타고 물안개 사이로 펼쳐지는 강원도 산세를 바라보던 낭만이 가득합니다.',
      },
      {
        id: 'cc-2',
        title: '춘천 명동 닭갈비 골목과 연탄불',
        era: '1980년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=1000&auto=format&fit=crop&q=80',
        caption: '둥근 무쇠판에 양배추와 떡, 닭갈비를 푸짐하게 볶던 골목',
        memoryStory: '경춘선 기차를 타고 온 대학생들과 군인 면회객들이 어울려 사이다 한 병에 닭갈비를 배부르게 먹던 정겨운 골목길이었습니다.',
      },
      {
        id: 'cc-3',
        title: '공지천 유원지 보트장과 조각공원',
        era: '1970년대',
        category: '골목·거리',
        url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1000&auto=format&fit=crop&q=80',
        caption: '강변 버드나무 아래서 노를 젓던 공지천 나들이',
        memoryStory: '에티오피아 참전비 앞 카페에서 흘러나오는 커피 향을 맡으며 춘천의 호수를 바라보던 기억이 생생합니다.',
      },
    ],
  },
  {
    id: 'gangneung-jumunjin',
    name: '강릉 경포호·주문진',
    region: '강원권',
    emoji: '🐟',
    title: '강릉 경포대 호수 & 주문진 어시장',
    lat: 37.7951,
    lng: 128.8967,
    zoom: 16,
    historicalEra: '1960~70년대',
    oldDescription: '오징어잡이 배들이 밝히는 집어등 불빛이 밤바다를 수놓고, 소나무 솔바람을 맞으며 경포호 둘레를 산책하던 정겨운 동해안 고향입니다.',
    memoryKeywords: ['경포대 솔밭', '주문진 오징어 덕장', '동해 일출', '초당 순두부', '오죽헌 율곡나무'],
    photos: [
      {
        id: 'gj-1',
        title: '경포대 누각과 소나무 숲길',
        era: '1970년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1000&auto=format&fit=crop&q=80',
        caption: '하늘, 바다, 호수, 술잔, 님의 눈동자 다섯 개의 달이 뜬다는 경포호',
        memoryStory: '울창한 송림 숲길을 걸으며 불어오는 솔바람 소리와 파도 소리에 마음이 편안해지던 강릉의 명소였습니다.',
      },
      {
        id: 'gj-2',
        title: '주문진 포구의 오징어 건조 덕장',
        era: '1960년대',
        category: '시장·장터',
        url: 'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?w=1000&auto=format&fit=crop&q=80',
        caption: '바닷바람에 오징어가 투명하게 말라가던 은빛 덕장 풍경',
        memoryStory: '새벽 포구에 가득 찬 은빛 오징어와 갓 잡은 싱싱한 회를 초고추장에 듬뿍 찍어 먹던 동해의 짭조름한 추억입니다.',
      },
      {
        id: 'gj-3',
        title: '초당마을 전통 맷돌 순두부',
        era: '1980년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1000&auto=format&fit=crop&q=80',
        caption: '동해 깨끗한 바닷물로 간수를 맞추어 빚어낸 몽글몽글 순두부',
        memoryStory: '김이 무럭무럭 나는 하얀 순두부에 간장 양념장을 살짝 얹어 먹으면 입안에서 고소함이 사르르 퍼져나갔습니다.',
      },
    ],
  },

  // ── 제주권 ──
  {
    id: 'jeju-dongmun',
    name: '제주 동문시장·탑동',
    region: '제주권',
    emoji: '🍊',
    title: '제주 동문시장 & 탑동 먹돌 해변',
    lat: 33.5132,
    lng: 126.5273,
    zoom: 16,
    historicalEra: '1970년대',
    oldDescription: '구멍 숭숭 뚫린 현무암 돌담길 너머로 노란 감귤이 주렁주렁 열리고, 해녀 할머니들의 숨비소리가 파도에 실려오던 제주도의 정겨운 마을입니다.',
    memoryKeywords: ['올레길 돌담', '해녀 숨비소리', '탑동 몽돌밭', '동문시장 은갈치', '유채꽃밭 물허벅'],
    photos: [
      {
        id: 'jd-1',
        title: '제주 검은 돌담길과 노란 감귤밭',
        era: '1970년대',
        category: '자연·명소',
        url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1000&auto=format&fit=crop&q=80',
        caption: '바람을 막아주는 현무암 돌담과 탐스럽게 익은 겨울 귤나무',
        memoryStory: '돌담길을 따라 걷다 귤 하나를 따서 껍질을 까면 상큼한 향기가 온 동네에 가득 차던 제주의 따뜻한 고향 풍경입니다.',
      },
      {
        id: 'jd-2',
        title: '제주 해녀들의 물질과 숨비소리',
        era: '1960년대',
        category: '생활·축제',
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
        caption: '테왁을 띄우고 깊은 바다에서 소라와 전복을 따던 강인한 어머니들',
        memoryStory: '"호오이~ 호오이~" 바다 위로 올라와 내쉬는 숨비소리와 갓 건져 올린 해삼을 바위 위에서 썰어 먹던 바다 냄새가 그립습니다.',
      },
      {
        id: 'jd-3',
        title: '동문 전통시장과 은빛 갈치 장터',
        era: '1980년대',
        category: '시장·장터',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80',
        caption: '한라산 버섯과 옥돔, 오메기떡이 가득하던 제주의 큰 장터',
        memoryStory: '육지에서 온 비행기와 배를 타고 손주들이 내려오면 동문시장에서 가장 크고 좋은 옥돔을 사서 노릇하게 구워주던 할머니의 사랑이 느껴집니다.',
      },
    ],
  },
];

// ── 지도 스타일 모드 ────────────────────────────────────────────
type MapStyleMode = 'hd-satellite' | 'street-satellite' | 'vintage-memory';

interface MapStyleOption {
  id: MapStyleMode;
  name: string;
  badge: string;
  desc: string;
}

const MAP_STYLES: MapStyleOption[] = [
  {
    id: 'hd-satellite',
    name: '🔍 초고화질 항공사진',
    badge: '선명한 골목/건물',
    desc: '우리 동네 골목길, 집 지붕, 밭과 산까지 18단계 줌으로 가장 선명하게 봅니다.',
  },
  {
    id: 'street-satellite',
    name: '🗺️ 위성 + 한글 지명 도로',
    badge: '동네 이름·길 이름',
    desc: '고화질 위성사진 위에 큰 한글 지명과 도로 이름을 겹쳐 함께 확인합니다.',
  },
  {
    id: 'vintage-memory',
    name: '📜 흑백 추억 옛 지도',
    badge: '1970년대 분위기',
    desc: '신문과 옛 사진 느낌의 흑백 세피아 톤으로 고향의 옛 정취를 느껴봅니다.',
  },
];

// ── 지도 중심 이동 컨트롤러 ────────────────────────────────────
interface MapControllerProps {
  center: [number, number];
  zoom: number;
}

const MapController: React.FC<MapControllerProps> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.8,
      easeLinearity: 0.25,
    });
  }, [map, center, zoom]);
  return null;
};

// ── 메인 컴포넌트 ──────────────────────────────────────────────
export const SatelliteExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'map-mode' | 'all-photos-mode'>('map-mode');
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [selectedTown, setSelectedTown] = useState<KoreaNeighborhood>(KOREA_NEIGHBORHOODS[0]);
  const [mapStyle, setMapStyle] = useState<MapStyleMode>('hd-satellite');

  // 사진 갤러리 상태
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number>(0);
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [photoFilterCategory, setPhotoFilterCategory] = useState<string>('전체');

  // 대한민국 영역 제한
  const koreaBounds: L.LatLngBoundsExpression = [
    [33.0, 124.5],
    [38.6, 131.0],
  ];

  const regions = ['전체', '수도권', '경상권', '전라권', '충청권', '강원권', '제주권'];

  const filteredTowns =
    selectedRegion === '전체'
      ? KOREA_NEIGHBORHOODS
      : KOREA_NEIGHBORHOODS.filter((t) => t.region === selectedRegion);

  const handleSelectTown = (town: KoreaNeighborhood) => {
    setSelectedTown(town);
    setCurrentPhotoIndex(0); // 동네 변경 시 첫 번째 사진으로 리셋
  };

  const currentPhoto = selectedTown.photos[currentPhotoIndex] || selectedTown.photos[0];

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : selectedTown.photos.length - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev < selectedTown.photos.length - 1 ? prev + 1 : 0));
  };

  // 전국 모든 사진 목록 추출 (모아보기 탭용)
  const allPhotosList = KOREA_NEIGHBORHOODS.flatMap((town) =>
    town.photos.map((photo) => ({
      ...photo,
      townName: town.name,
      townEmoji: town.emoji,
      region: town.region,
      townObj: town,
    }))
  );

  const filteredAllPhotos = allPhotosList.filter((p) => {
    const regionMatch = selectedRegion === '전체' || p.region === selectedRegion;
    const catMatch = photoFilterCategory === '전체' || p.category === photoFilterCategory;
    return regionMatch && catMatch;
  });

  return (
    <div className="korea-satellite-app">
      {/* 1. 상단 인트로 & 탭 전환 */}
      <section className="sat-intro-card anim-pop">
        <div className="intro-badge">
          <Sparkles size={24} color="#D97706" />
          <span>대한민국 팔도강산 우리 동네 고화질 위성 &amp; 다채로운 추억 사진관</span>
        </div>
        <h1 className="intro-title">
          🌸 그리운 우리 동네 옛 모습 &amp; 추억 사진 앨범
        </h1>
        <p className="intro-desc">
          초고화질 항공사진으로 집 앞 골목길을 찾아보고, <strong>1960~80년대 다채로운 옛 장터, 골목, 축제 사진</strong>을 넘겨보며 고향의 정취를 느껴보세요.
        </p>

        {/* 상단 뷰 모드 전환 버튼 */}
        <div className="view-mode-tabs">
          <button
            className={`view-mode-btn ${activeTab === 'map-mode' ? 'active' : ''}`}
            onClick={() => setActiveTab('map-mode')}
          >
            <MapPin size={22} />
            <span>🗺️ 우리 동네 고화질 지도 &amp; 사진관</span>
          </button>
          <button
            className={`view-mode-btn ${activeTab === 'all-photos-mode' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-photos-mode')}
          >
            <ImageIcon size={22} />
            <span>📷 전국 옛 사진 다채롭게 모아보기 ({allPhotosList.length}장)</span>
          </button>
        </div>
      </section>

      {/* ── [모드 1] 고화질 지도 & 동네별 추억 사진관 ── */}
      {activeTab === 'map-mode' && (
        <>
          {/* 2. 지역 선택 (팔도 권역 탭 + 동네 큰 버튼) */}
          <section className="region-selector-card">
            <div className="region-tabs-header">
              <h2 className="section-title">📍 어느 지역의 동네를 찾아볼까요?</h2>
              <div className="region-tabs">
                {regions.map((reg) => (
                  <button
                    key={reg}
                    className={`reg-tab-btn ${selectedRegion === reg ? 'active' : ''}`}
                    onClick={() => setSelectedRegion(reg)}
                  >
                    {reg === '전체' ? '🗺️ 전국 전체' : reg}
                  </button>
                ))}
              </div>
            </div>

            <div className="town-grid">
              {filteredTowns.map((town) => {
                const isSelected = selectedTown.id === town.id;
                return (
                  <button
                    key={town.id}
                    className={`town-card-btn ${isSelected ? 'town-selected' : ''}`}
                    onClick={() => handleSelectTown(town)}
                    aria-label={`${town.name} 위성사진 및 추억 사진 보기`}
                  >
                    <div className="town-card-top">
                      <span className="town-emoji">{town.emoji}</span>
                      <span className="town-region-badge">{town.region}</span>
                    </div>
                    <div className="town-name">{town.name}</div>
                    <div className="town-photo-count">📷 추억 사진 {town.photos.length}장</div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. 지도 보기 모드 선택기 */}
          <section className="map-style-bar">
            <div className="style-bar-left">
              <Layers size={24} color="#0F766E" />
              <span className="style-bar-label">지도 보기 방식:</span>
            </div>
            <div className="style-buttons">
              {MAP_STYLES.map((style) => (
                <button
                  key={style.id}
                  className={`style-btn ${mapStyle === style.id ? 'active' : ''}`}
                  onClick={() => setMapStyle(style.id)}
                  title={style.desc}
                >
                  <span className="style-btn-name">{style.name}</span>
                  <span className="style-btn-badge">{style.badge}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 4. 고화질 대한민국 지도 영역 */}
          <section className="sat-map-container">
            <div className="map-info-header">
              <div className="map-current-title">
                <MapPin size={28} color="#FEF08A" />
                <span>
                  {selectedTown.emoji} <strong>{selectedTown.title}</strong> 고화질 지도
                </span>
              </div>
              <div className="map-actions">
                <button
                  className="open-memory-btn"
                  onClick={() => setShowPhotoModal(true)}
                  aria-label="그 시절 추억 앨범 크게 열기"
                >
                  <Camera size={22} />
                  <span>📷 이 동네 사진 {selectedTown.photos.length}장 크게 보기</span>
                </button>
              </div>
            </div>

            <div className={`map-wrapper ${mapStyle === 'vintage-memory' ? 'vintage-filter' : ''}`}>
              <MapContainer
                center={[selectedTown.lat, selectedTown.lng]}
                zoom={selectedTown.zoom}
                maxBounds={koreaBounds}
                minZoom={7}
                maxZoom={18}
                className="leaflet-map-view"
                scrollWheelZoom={true}
                zoomControl={true}
              >
                {/* 1. 기본 초고화질 항공사진 */}
                <TileLayer
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                  attribution='&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics'
                  maxZoom={18}
                  maxNativeZoom={18}
                />

                {/* 2. 한글 지명 및 도로 레이블 오버레이 */}
                {mapStyle === 'street-satellite' && (
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
                    maxZoom={18}
                    opacity={0.9}
                  />
                )}

                {/* 3. 현재 선택 동네 마커 및 말풍선 */}
                <Marker position={[selectedTown.lat, selectedTown.lng]}>
                  <Popup>
                    <div className="marker-popup-content">
                      <div className="popup-emoji">{selectedTown.emoji}</div>
                      <h3 className="popup-title">{selectedTown.name}</h3>
                      <p className="popup-text">{selectedTown.oldDescription}</p>
                      <div className="popup-keywords">
                        {selectedTown.memoryKeywords.map((kw) => (
                          <span key={kw} className="popup-tag">#{kw}</span>
                        ))}
                      </div>
                    </div>
                  </Popup>
                </Marker>

                <MapController center={[selectedTown.lat, selectedTown.lng]} zoom={selectedTown.zoom} />
              </MapContainer>

              <div className="map-overlay-tips">
                <span>💡 마우스로 지도를 끌거나 휠을 굴려 집과 골목을 더 크게 확대해보세요!</span>
              </div>
            </div>
          </section>

          {/* 5. 다채로운 동네 추억 사진 슬라이드 갤러리 */}
          <section className="town-memory-card anim-pop">
            <div className="memory-card-header">
              <div className="memory-header-left">
                <History size={30} color="#0F766E" />
                <div>
                  <h2 className="memory-town-name">
                    {selectedTown.emoji} {selectedTown.title} · 추억 사진관 ({currentPhotoIndex + 1}/{selectedTown.photos.length})
                  </h2>
                  <span className="memory-subtitle">여러 장의 옛 사진을 넘겨보며 도란도란 이야기를 나누어보세요</span>
                </div>
              </div>

              {/* 이전/다음 사진 넘기기 버튼 */}
              <div className="photo-nav-buttons">
                <button
                  className="photo-nav-btn"
                  onClick={handlePrevPhoto}
                  aria-label="이전 옛 사진 보기"
                >
                  <ChevronLeft size={24} />
                  <span>이전 사진</span>
                </button>
                <button
                  className="photo-nav-btn"
                  onClick={handleNextPhoto}
                  aria-label="다음 옛 사진 보기"
                >
                  <span>다음 사진</span>
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            {/* 갤러리 썸네일 스트립 */}
            <div className="photo-thumbnail-strip">
              {selectedTown.photos.map((p, idx) => (
                <button
                  key={p.id}
                  className={`photo-thumb-item ${idx === currentPhotoIndex ? 'thumb-active' : ''}`}
                  onClick={() => setCurrentPhotoIndex(idx)}
                >
                  <img src={p.url} alt={p.title} className="thumb-img" />
                  <div className="thumb-info">
                    <span className="thumb-era">{p.era}</span>
                    <span className="thumb-title">{p.title}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* 현재 선택된 사진 & 상세 회상 스토리 */}
            <div className="memory-card-body">
              <div className="memory-photo-box" onClick={() => setShowPhotoModal(true)}>
                <img
                  src={currentPhoto.url}
                  alt={`${currentPhoto.title}`}
                  className="memory-thumb-img"
                />
                <div className="photo-badge-top">
                  <span className="era-badge">{currentPhoto.era}</span>
                  <span className="cat-badge">{currentPhoto.category}</span>
                </div>
                <div className="photo-zoom-hint">
                  <ZoomIn size={22} />
                  <span>사진 크게 보기</span>
                </div>
                <p className="photo-caption-text">
                  📷 <strong>{currentPhoto.title}</strong> — {currentPhoto.caption}
                </p>
              </div>

              <div className="memory-text-box">
                <div className="story-quote-box">
                  <h3 className="story-title">📖 그 시절의 생생한 기억:</h3>
                  <p className="memory-story-paragraph">
                    "{currentPhoto.memoryStory}"
                  </p>
                </div>

                <div className="memory-tags-section">
                  <span className="tag-label">그 시절 떠오르는 정겨운 낱말:</span>
                  <div className="tag-chips">
                    {selectedTown.memoryKeywords.map((word) => (
                      <span key={word} className="memory-chip">
                        ✨ {word}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="memory-talk-prompt">
                  💬 <strong>함께 이야기해 보아요:</strong> "어르신께서는 이 시절 {currentPhoto.title} 같은 풍경을 보신 기억이 나시나요?"
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── [모드 2] 전국 옛 사진 다채롭게 모아보기 ── */}
      {activeTab === 'all-photos-mode' && (
        <section className="all-photos-section anim-pop">
          <div className="all-photos-filters">
            {/* 권역별 필터 */}
            <div className="filter-group">
              <span className="filter-label">📍 지역 선택:</span>
              <div className="filter-chips">
                {regions.map((reg) => (
                  <button
                    key={reg}
                    className={`filter-chip ${selectedRegion === reg ? 'active' : ''}`}
                    onClick={() => setSelectedRegion(reg)}
                  >
                    {reg === '전체' ? '전국' : reg}
                  </button>
                ))}
              </div>
            </div>

            {/* 사진 테마 필터 */}
            <div className="filter-group">
              <span className="filter-label">🎨 테마별 보기:</span>
              <div className="filter-chips">
                {['전체', '골목·거리', '시장·장터', '생활·축제', '자연·명소'].map((cat) => (
                  <button
                    key={cat}
                    className={`filter-chip ${photoFilterCategory === cat ? 'active' : ''}`}
                    onClick={() => setPhotoFilterCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="all-photos-grid">
            {filteredAllPhotos.map((item) => (
              <div
                key={item.id}
                className="gallery-photo-card anim-pop"
                onClick={() => {
                  setSelectedTown(item.townObj);
                  const idx = item.townObj.photos.findIndex((p) => p.id === item.id);
                  setCurrentPhotoIndex(idx >= 0 ? idx : 0);
                  setShowPhotoModal(true);
                }}
              >
                <div className="card-img-wrap">
                  <img src={item.url} alt={item.title} className="card-img" />
                  <div className="card-overlay-badge">
                    <span>{item.townEmoji} {item.townName}</span>
                    <span className="card-era">{item.era}</span>
                  </div>
                </div>
                <div className="card-desc-wrap">
                  <h3 className="card-photo-title">{item.title}</h3>
                  <p className="card-caption">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. 사진 크게 보기 모달 (슬라이더 지원) */}
      {showPhotoModal && (
        <div className="photo-modal-backdrop" onClick={() => setShowPhotoModal(false)}>
          <div className="photo-modal-content anim-pop" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <span className="modal-emoji">{selectedTown.emoji}</span>
                <h3 className="modal-title">
                  {selectedTown.title} · {currentPhoto.title} ({currentPhotoIndex + 1}/{selectedTown.photos.length})
                </h3>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowPhotoModal(false)}
                aria-label="닫기"
              >
                ✕ 닫기
              </button>
            </div>

            <div className="modal-img-container">
              <button
                className="modal-arrow-btn arrow-left"
                onClick={handlePrevPhoto}
                aria-label="이전 사진 보기"
              >
                ◀
              </button>

              <img
                src={currentPhoto.url}
                alt={`${currentPhoto.title} 고화질 옛 사진`}
                className="modal-full-img"
              />

              <button
                className="modal-arrow-btn arrow-right"
                onClick={handleNextPhoto}
                aria-label="다음 사진 보기"
              >
                ▶
              </button>
            </div>

            <div className="modal-footer-caption">
              <div className="modal-caption-badges">
                <span className="modal-badge-era">📅 {currentPhoto.era}</span>
                <span className="modal-badge-cat">🏷️ {currentPhoto.category}</span>
              </div>
              <h4 className="modal-caption-main">{currentPhoto.caption}</h4>
              <p className="modal-story-sub">"{currentPhoto.memoryStory}"</p>

              {/* 모달 내 썸네일 바 */}
              <div className="modal-thumb-bar">
                {selectedTown.photos.map((p, idx) => (
                  <button
                    key={p.id}
                    className={`modal-thumb-btn ${idx === currentPhotoIndex ? 'active' : ''}`}
                    onClick={() => setCurrentPhotoIndex(idx)}
                  >
                    <img src={p.url} alt={p.title} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 스타일 ──────────────────────────────────────────── */}
      <style>{`
        .korea-satellite-app {
          width: 100%;
          max-width: 1160px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 8px 0 24px 0;
          color: #0F172A;
        }

        /* 상단 인트로 */
        .sat-intro-card {
          background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
          border: 4px solid #F59E0B;
          border-radius: 26px;
          padding: 24px 28px;
          text-align: center;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.15);
        }

        .intro-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          border: 2px solid #FBBF24;
          border-radius: 20px;
          padding: 6px 18px;
          font-size: 18px;
          font-weight: 800;
          color: #B45309;
          margin-bottom: 12px;
        }

        .intro-title {
          font-size: clamp(28px, 4.5vw, 38px);
          font-weight: 900;
          color: #78350F;
          margin: 0 0 10px 0;
          letter-spacing: -0.5px;
        }

        .intro-desc {
          font-size: clamp(18px, 2.8vw, 22px);
          font-weight: 700;
          color: #451A03;
          line-height: 1.6;
          margin: 0 0 18px 0;
        }

        /* 뷰 모드 탭 */
        .view-mode-tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .view-mode-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          font-size: 20px;
          font-weight: 900;
          border: 3px solid #D97706;
          border-radius: 16px;
          background: #FFFFFF;
          color: #78350F;
          cursor: pointer;
          transition: all 0.2s;
        }

        .view-mode-btn:hover {
          background: #FEF3C7;
          transform: translateY(-2px);
        }

        .view-mode-btn.active {
          background: #D97706;
          color: #FFFFFF;
          box-shadow: 0 6px 16px rgba(217, 119, 6, 0.35);
        }

        /* 지역 선택 카드 */
        .region-selector-card {
          background: #FFFFFF;
          border: 3px solid #CBD5E1;
          border-radius: 26px;
          padding: 22px 24px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
        }

        .region-tabs-header {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 18px;
        }

        .section-title {
          font-size: clamp(22px, 3.5vw, 26px);
          font-weight: 900;
          color: #0F766E;
          margin: 0;
        }

        .region-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .reg-tab-btn {
          padding: 10px 20px;
          font-size: 19px;
          font-weight: 800;
          border: 2.5px solid #CBD5E1;
          border-radius: 14px;
          background: #F8FAFC;
          color: #334155;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reg-tab-btn:hover {
          border-color: #0F766E;
          background: #F0FDF4;
        }

        .reg-tab-btn.active {
          background: #0F766E;
          border-color: #115E59;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.25);
        }

        /* 동네 그리드 */
        .town-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }

        .town-card-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 16px 16px;
          border: 3px solid #E2E8F0;
          border-radius: 18px;
          background: #F8FAFC;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .town-card-btn:hover {
          transform: translateY(-3px);
          border-color: #38BDF8;
          box-shadow: 0 8px 18px rgba(14, 165, 233, 0.2);
        }

        .town-card-btn.town-selected {
          background: linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%);
          border-color: #1E40AF;
          color: #FFFFFF;
          box-shadow: 0 8px 22px rgba(30, 58, 138, 0.35);
          transform: translateY(-2px);
        }

        .town-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-bottom: 6px;
        }

        .town-emoji {
          font-size: 30px;
          line-height: 1;
        }

        .town-region-badge {
          font-size: 13px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 8px;
          background: #E2E8F0;
          color: #475569;
        }

        .town-selected .town-region-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #FFFFFF;
        }

        .town-name {
          font-size: 20px;
          font-weight: 900;
          line-height: 1.25;
          margin-bottom: 4px;
        }

        .town-photo-count {
          font-size: 14px;
          font-weight: 700;
          color: #0F766E;
          background: #CCFBF1;
          padding: 2px 8px;
          border-radius: 6px;
        }

        .town-selected .town-photo-count {
          background: rgba(255, 255, 255, 0.25);
          color: #FEF08A;
        }

        /* 지도 스타일 선택 바 */
        .map-style-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          background: #FFFFFF;
          border: 3px solid #CCFBF1;
          border-radius: 20px;
          padding: 14px 20px;
        }

        .style-bar-left {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 20px;
          font-weight: 900;
          color: #0F766E;
        }

        .style-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .style-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border: 2.5px solid #CBD5E1;
          border-radius: 14px;
          background: #F8FAFC;
          cursor: pointer;
          transition: all 0.2s;
        }

        .style-btn:hover {
          border-color: #0F766E;
          background: #F0FDF4;
        }

        .style-btn.active {
          background: #0F766E;
          border-color: #115E59;
          color: #FFFFFF;
        }

        .style-btn-name {
          font-size: 17px;
          font-weight: 800;
        }

        .style-btn-badge {
          font-size: 13px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 6px;
          background: #E2E8F0;
          color: #334155;
        }

        .style-btn.active .style-btn-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
        }

        /* 지도 컨테이너 */
        .sat-map-container {
          border: 4px solid #1E3A8A;
          border-radius: 26px;
          overflow: hidden;
          background: #0F172A;
          box-shadow: 0 12px 30px rgba(30, 58, 138, 0.25);
        }

        .map-info-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 22px;
          background: linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%);
          color: #FFFFFF;
          flex-wrap: wrap;
          gap: 10px;
        }

        .map-current-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: clamp(20px, 3vw, 24px);
          font-weight: 800;
        }

        .open-memory-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          font-size: 18px;
          font-weight: 900;
          color: #1E3A8A;
          background: #FEF08A;
          border: 2.5px solid #FBBF24;
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .open-memory-btn:hover {
          background: #FDE047;
          transform: scale(1.03);
        }

        .map-wrapper {
          width: 100%;
          height: 480px;
          position: relative;
        }

        .leaflet-map-view {
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .vintage-filter .leaflet-map-view {
          filter: sepia(0.35) contrast(1.15) brightness(0.95);
        }

        .map-overlay-tips {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.85);
          color: #FEF08A;
          font-size: 16px;
          font-weight: 800;
          padding: 8px 20px;
          border-radius: 20px;
          z-index: 999;
          pointer-events: none;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(254, 240, 138, 0.4);
          text-align: center;
        }

        /* 팝업 스타일 */
        .marker-popup-content {
          padding: 6px;
          max-width: 240px;
        }

        .popup-emoji {
          font-size: 32px;
          margin-bottom: 4px;
        }

        .popup-title {
          font-size: 20px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 6px 0;
        }

        .popup-text {
          font-size: 15px;
          font-weight: 600;
          color: #334155;
          line-height: 1.4;
          margin: 0 0 8px 0;
        }

        .popup-keywords {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .popup-tag {
          font-size: 12px;
          font-weight: 800;
          background: #CCFBF1;
          color: #0F766E;
          padding: 2px 6px;
          border-radius: 6px;
        }

        /* ── 추억 사진관 & 슬라이더 ── */
        .town-memory-card {
          background: #FFFFFF;
          border: 3px solid #99F6E4;
          border-radius: 26px;
          padding: 24px 26px;
          box-shadow: 0 8px 24px rgba(15, 118, 110, 0.1);
        }

        .memory-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid #E2E8F0;
          padding-bottom: 16px;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .memory-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .memory-town-name {
          font-size: clamp(22px, 3.5vw, 26px);
          font-weight: 900;
          color: #0F766E;
          margin: 0;
        }

        .memory-subtitle {
          font-size: 16px;
          font-weight: 700;
          color: #64748B;
        }

        .photo-nav-buttons {
          display: flex;
          gap: 10px;
        }

        .photo-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          font-size: 18px;
          font-weight: 900;
          border: 2px solid #0F766E;
          border-radius: 14px;
          background: #CCFBF1;
          color: #0F766E;
          cursor: pointer;
          transition: all 0.2s;
        }

        .photo-nav-btn:hover {
          background: #0F766E;
          color: #FFFFFF;
          transform: translateY(-2px);
        }

        /* 썸네일 스트립 */
        .photo-thumbnail-strip {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 14px;
          margin-bottom: 18px;
        }

        .photo-thumb-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border: 2.5px solid #E2E8F0;
          border-radius: 14px;
          background: #F8FAFC;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .photo-thumb-item:hover {
          border-color: #0F766E;
        }

        .photo-thumb-item.thumb-active {
          border-color: #0F766E;
          background: #CCFBF1;
          box-shadow: 0 4px 12px rgba(15, 118, 110, 0.2);
        }

        .thumb-img {
          width: 50px;
          height: 40px;
          object-fit: cover;
          border-radius: 8px;
        }

        .thumb-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .thumb-era {
          font-size: 12px;
          font-weight: 800;
          color: #D97706;
        }

        .thumb-title {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
        }

        .memory-card-body {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 24px;
          align-items: start;
        }

        .memory-photo-box {
          position: relative;
          cursor: pointer;
          border-radius: 20px;
          overflow: hidden;
          border: 3px solid #CBD5E1;
          background: #F1F5F9;
          transition: transform 0.2s;
        }

        .memory-photo-box:hover {
          transform: scale(1.02);
          border-color: #0F766E;
        }

        .memory-thumb-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          display: block;
        }

        .photo-badge-top {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          gap: 6px;
        }

        .era-badge {
          background: #F59E0B;
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
        }

        .cat-badge {
          background: rgba(15, 23, 42, 0.85);
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
        }

        .photo-zoom-hint {
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(15, 23, 42, 0.8);
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .photo-caption-text {
          font-size: 15px;
          font-weight: 700;
          color: #334155;
          padding: 10px 14px;
          margin: 0;
          background: #F8FAFC;
          text-align: center;
          border-top: 1px solid #E2E8F0;
        }

        .memory-text-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .story-quote-box {
          background: #F8FAFC;
          border-left: 6px solid #0F766E;
          border-radius: 16px;
          padding: 16px 20px;
        }

        .story-title {
          font-size: 18px;
          font-weight: 900;
          color: #0F766E;
          margin: 0 0 8px 0;
        }

        .memory-story-paragraph {
          font-size: clamp(20px, 3vw, 24px);
          font-weight: 800;
          color: #1E293B;
          line-height: 1.6;
          margin: 0;
        }

        .memory-tags-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tag-label {
          font-size: 16px;
          font-weight: 800;
          color: #64748B;
        }

        .tag-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .memory-chip {
          background: #FEF3C7;
          border: 2px solid #FCD34D;
          color: #92400E;
          font-size: 17px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 12px;
        }

        .memory-talk-prompt {
          background: #EFF6FF;
          border: 2.5px solid #93C5FD;
          border-radius: 16px;
          padding: 14px 20px;
          font-size: 19px;
          font-weight: 800;
          color: #1E40AF;
        }

        /* ── [모드 2] 전국 사진 모아보기 그리드 ── */
        .all-photos-section {
          background: #FFFFFF;
          border: 3px solid #CBD5E1;
          border-radius: 26px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .all-photos-filters {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #F8FAFC;
          border: 2px solid #E2E8F0;
          border-radius: 18px;
          padding: 16px 20px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-label {
          font-size: 18px;
          font-weight: 900;
          color: #334155;
          min-width: 100px;
        }

        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-chip {
          padding: 8px 16px;
          font-size: 17px;
          font-weight: 800;
          border: 2px solid #CBD5E1;
          border-radius: 12px;
          background: #FFFFFF;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-chip:hover {
          border-color: #0F766E;
          background: #F0FDF4;
        }

        .filter-chip.active {
          background: #0F766E;
          border-color: #115E59;
          color: #FFFFFF;
        }

        .all-photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        .gallery-photo-card {
          border: 3px solid #E2E8F0;
          border-radius: 20px;
          overflow: hidden;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s;
        }

        .gallery-photo-card:hover {
          transform: translateY(-4px);
          border-color: #0F766E;
          box-shadow: 0 10px 24px rgba(15, 118, 110, 0.18);
        }

        .card-img-wrap {
          position: relative;
          width: 100%;
          height: 180px;
          background: #0F172A;
        }

        .card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .card-overlay-badge {
          position: absolute;
          bottom: 8px;
          left: 8px;
          right: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.85);
          color: #FFFFFF;
          padding: 4px 10px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 800;
        }

        .card-era {
          color: #FEF08A;
        }

        .card-desc-wrap {
          padding: 12px 16px;
        }

        .card-photo-title {
          font-size: 18px;
          font-weight: 900;
          color: #0F172A;
          margin: 0 0 4px 0;
        }

        .card-caption {
          font-size: 14px;
          font-weight: 600;
          color: #64748B;
          margin: 0;
          line-height: 1.4;
        }

        /* ── 모달 창 (슬라이더 지원) ── */
        .photo-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(15, 23, 42, 0.88);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .photo-modal-content {
          background: #FFFFFF;
          border-radius: 28px;
          max-width: 900px;
          width: 100%;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.45);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          background: #0F766E;
          color: #FFFFFF;
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .modal-emoji {
          font-size: 30px;
        }

        .modal-title {
          font-size: 22px;
          font-weight: 900;
          margin: 0;
        }

        .modal-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid #FFFFFF;
          color: #FFFFFF;
          font-size: 18px;
          font-weight: 900;
          padding: 6px 16px;
          border-radius: 12px;
          cursor: pointer;
        }

        .modal-close-btn:hover {
          background: #FFFFFF;
          color: #0F766E;
        }

        .modal-img-container {
          position: relative;
          width: 100%;
          height: 420px;
          background: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-full-img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .modal-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(15, 23, 42, 0.75);
          border: 2px solid rgba(255, 255, 255, 0.6);
          color: #FFFFFF;
          font-size: 26px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }

        .modal-arrow-btn:hover {
          background: #0F766E;
          border-color: #FFFFFF;
          transform: translateY(-50%) scale(1.1);
        }

        .arrow-left {
          left: 16px;
        }

        .arrow-right {
          right: 16px;
        }

        .modal-footer-caption {
          padding: 18px 24px;
          background: #F8FAFC;
        }

        .modal-caption-badges {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .modal-badge-era {
          background: #FEF3C7;
          border: 1.5px solid #F59E0B;
          color: #92400E;
          font-size: 14px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 8px;
        }

        .modal-badge-cat {
          background: #CCFBF1;
          border: 1.5px solid #0F766E;
          color: #0F766E;
          font-size: 14px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 8px;
        }

        .modal-caption-main {
          font-size: 20px;
          font-weight: 900;
          color: #0F766E;
          margin: 0 0 6px 0;
        }

        .modal-story-sub {
          font-size: 18px;
          font-weight: 700;
          color: #334155;
          line-height: 1.5;
          margin: 0 0 14px 0;
        }

        .modal-thumb-bar {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-top: 6px;
        }

        .modal-thumb-btn {
          width: 60px;
          height: 48px;
          border: 2px solid #CBD5E1;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          padding: 0;
          background: #000;
          opacity: 0.6;
          transition: all 0.2s;
        }

        .modal-thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-thumb-btn.active {
          border-color: #0F766E;
          opacity: 1;
          transform: scale(1.05);
        }

        /* 반응형 */
        @media (max-width: 768px) {
          .memory-card-body {
            grid-template-columns: 1fr;
          }

          .map-wrapper {
            height: 360px;
          }

          .town-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .modal-img-container {
            height: 280px;
          }
        }
      `}</style>
    </div>
  );
};
