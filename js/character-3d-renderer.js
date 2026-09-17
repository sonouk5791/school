/**
 * 디지털 학교 - 3D AI 친구 캐릭터 렌더러 (Three.js 기반)
 * 🐶 콩이 (강아지), 🐰 토리 (토끼), 🐱 나비 (고양이), 🐻 보리/곰이 (곰)
 * - 저용량/0ms 즉시 생성 절차적 로우폴리 3D 모델
 * - 진입/클릭 시 사랑스러운 손인사 & 통통 튀기 애니메이션 (2~3초)
 * - 대기 시 시니어 친화적 편안한 숨쉬기 (Idle) 모션
 * - WebGL 미지원/오류 시 2D 이미지 자동 Fallback
 */

(() => {
  'use strict';

  // 캐릭터별 팔레트 및 디자인 테마
  const THEMES = {
    kongi: {
      name: '콩이',
      animal: '강아지',
      bodyColor: 0xF7D070,      // 골드 옐로우
      hoodieColor: 0xFBC02D,    // 산뜻한 옐로우 트레이닝복
      heartColor: 0xF57C00,     // 주황 하트
      bellyColor: 0xFFF9C4,     // 밝은 크림
      earColor: 0xE0A33A,       // 처진 귀 짙은 옐로우
      snoutColor: 0xFFF8E1,     // 주둥이
      noseColor: 0x2C1D11,      // 짙은 갈색 코
      eyeColor: 0x1A1412,
      shoeColor: 0xFFFFFF,
      cheekColor: 0xFF8A80
    },
    tori: {
      name: '토리',
      animal: '토끼',
      bodyColor: 0xFFFFFF,      // 순백색
      hoodieColor: 0xF8BBD0,    // 베이비 핑크 트레이닝복
      heartColor: 0xEC407A,     // 핑크 하트
      bellyColor: 0xFFFFFF,
      earColor: 0xFFFFFF,
      earInnerColor: 0xFF80AB,  // 귀 안쪽 핑크
      snoutColor: 0xFFFFFF,
      noseColor: 0xFF5252,      // 핑크 코
      eyeColor: 0x2A1B18,
      shoeColor: 0xFFFFFF,
      cheekColor: 0xFF5252
    },
    nabi: {
      name: '나비',
      animal: '고양이',
      bodyColor: 0xFFF3E0,      // 따뜻한 크림/삼색
      hoodieColor: 0xD1C4E9,    // 라일락 보라 트레이닝복
      heartColor: 0x7E57C2,     // 보라 하트
      bellyColor: 0xFFFFFF,
      earColor: 0xFFB74D,       // 삼색 귀 패턴 (주황)
      earInnerColor: 0xF48FB1,  // 귀 안쪽
      snoutColor: 0xFFFFFF,
      noseColor: 0xE91E63,      // 핑크 코
      eyeColor: 0x1B5E20,       // 에메랄드 눈빛
      shoeColor: 0xFFFFFF,
      cheekColor: 0xFF80AB
    },
    bori: {
      name: '보리',
      animal: '곰',
      bodyColor: 0xBCAAA4,      // 포근한 카라멜 브라운
      hoodieColor: 0xBBDEFB,    // 스카이블루 트레이닝복
      heartColor: 0x1E88E5,     // 블루 하트
      bellyColor: 0xEFEBE9,     // 밝은 베이지
      earColor: 0x8D6E63,       // 둥근 곰 귀
      snoutColor: 0xD7CCC8,     // 베이지 주둥이
      noseColor: 0x261C14,      // 짙은 코
      eyeColor: 0x212121,
      shoeColor: 0xFFFFFF,
      cheekColor: 0xFF8A80
    }
  };

  class Character3DRenderer {
    constructor() {
      this.container = null;
      this.canvas = null;
      this.fallbackImg = null;
      this.renderer = null;
      this.scene = null;
      this.camera = null;
      this.characterGroup = null;
      this.parts = {};
      this.activeId = 'kongi';
      
      this.animState = 'greeting'; // 'greeting' | 'idle'
      this.animStartTime = 0;
      this.greetingDuration = 2.8; // 2.8초간 인사
      this.clock = null;
      this.reqId = null;
      this.isMounted = false;
      this.isVisible = true;

      this.onClick = this.onClick.bind(this);
      this.onResize = this.onResize.bind(this);
      this.animate = this.animate.bind(this);
    }

    // WebGL 지원 여부 검사
    isWebGLAvailable() {
      try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    }

    // 초기 마운트
    mount(containerEl, fallbackImgEl, initialId = 'kongi') {
      if (!containerEl) return false;
      this.container = containerEl;
      this.fallbackImg = fallbackImgEl;
      this.activeId = THEMES[initialId] ? initialId : 'kongi';

      if (!window.THREE || !this.isWebGLAvailable()) {
        console.warn('3D Renderer: WebGL not supported or Three.js missing. Using 2D fallback.');
        this.showFallback();
        return false;
      }

      try {
        this.initThree();
        this.buildCharacter(this.activeId);
        this.triggerGreeting();
        this.startLoop();
        this.bindEvents();
        this.isMounted = true;
        this.hideFallback();
        return true;
      } catch (err) {
        console.error('3D Renderer init error:', err);
        this.showFallback();
        return false;
      }
    }

    initThree() {
      const THREE = window.THREE;
      const width = this.container.clientWidth || 320;
      const height = this.container.clientHeight || 320;

      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
      this.camera.position.set(0, 0.4, 4.2);
      this.camera.lookAt(0, 0.1, 0);

      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.renderer.outputEncoding = THREE.sRGBEncoding;

      this.canvas = this.renderer.domElement;
      this.canvas.className = 'character-3d-canvas';
      this.canvas.setAttribute('role', 'img');
      this.canvas.setAttribute('aria-label', `3D 움직이는 AI 친구 ${THEMES[this.activeId].name}`);
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.canvas.style.display = 'block';
      this.canvas.style.cursor = 'pointer';
      this.canvas.style.userSelect = 'none';
      this.canvas.style.touchAction = 'manipulation';

      this.container.innerHTML = '';
      this.container.appendChild(this.canvas);

      // 따뜻하고 화사한 스튜디오 조명 (시니어 친화적)
      const ambientLight = new THREE.AmbientLight(0xFFFAF0, 0.85);
      this.scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xFFFFFF, 0.85);
      mainLight.position.set(2, 4, 3);
      this.scene.add(mainLight);

      const fillLight = new THREE.DirectionalLight(0xFFE0B2, 0.4);
      fillLight.position.set(-3, 1, 2);
      this.scene.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xFFFFFF, 0.35);
      rimLight.position.set(0, 3, -3);
      this.scene.add(rimLight);

      this.clock = new THREE.Clock();
    }

    // 캐릭터 메쉬 빌드 (절차적 로우폴리 큐트 스타일)
    buildCharacter(id) {
      const THREE = window.THREE;
      const theme = THEMES[id] || THEMES.kongi;
      this.activeId = id;

      if (this.characterGroup) {
        this.scene.remove(this.characterGroup);
      }

      this.characterGroup = new THREE.Group();
      this.parts = {};

      const matBody = new THREE.MeshStandardMaterial({ color: theme.bodyColor, roughness: 0.5, metalness: 0.05 });
      const matHoodie = new THREE.MeshStandardMaterial({ color: theme.hoodieColor, roughness: 0.55, metalness: 0.05 });
      const matHeart = new THREE.MeshStandardMaterial({ color: theme.heartColor, roughness: 0.3, metalness: 0.1 });
      const matBelly = new THREE.MeshStandardMaterial({ color: theme.bellyColor, roughness: 0.6 });
      const matEar = new THREE.MeshStandardMaterial({ color: theme.earColor, roughness: 0.55 });
      const matSnout = new THREE.MeshStandardMaterial({ color: theme.snoutColor, roughness: 0.5 });
      const matNose = new THREE.MeshStandardMaterial({ color: theme.noseColor, roughness: 0.3, metalness: 0.1 });
      const matEye = new THREE.MeshStandardMaterial({ color: theme.eyeColor, roughness: 0.1, metalness: 0.8 });
      const matEyeHighlight = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const matCheek = new THREE.MeshBasicMaterial({ color: theme.cheekColor, transparent: true, opacity: 0.65 });
      const matShoe = new THREE.MeshStandardMaterial({ color: theme.shoeColor, roughness: 0.4 });

      // 1. 몸통 (후드 트레이닝복 입은 둥글둥글한 형태)
      const bodyGroup = new THREE.Group();
      bodyGroup.position.set(0, -0.2, 0);

      const torsoGeo = new THREE.SphereGeometry(0.52, 24, 20);
      torsoGeo.scale(1, 1.15, 0.9);
      const torso = new THREE.Mesh(torsoGeo, matHoodie);
      bodyGroup.add(torso);

      // 배 패치
      const bellyGeo = new THREE.SphereGeometry(0.42, 20, 16);
      bellyGeo.scale(0.85, 0.95, 0.35);
      const belly = new THREE.Mesh(bellyGeo, matBelly);
      belly.position.set(0, -0.05, 0.32);
      bodyGroup.add(belly);

      // 하트 엠블럼 (상징 패치)
      const heartGeo = new THREE.SphereGeometry(0.12, 14, 12);
      heartGeo.scale(1.2, 1.1, 0.4);
      const heart = new THREE.Mesh(heartGeo, matHeart);
      heart.position.set(0, 0.12, 0.44);
      bodyGroup.add(heart);

      this.parts.body = bodyGroup;
      this.characterGroup.add(bodyGroup);

      // 2. 머리 (사랑스러운 동물 얼굴)
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.55, 0);

      const headGeo = new THREE.SphereGeometry(0.56, 26, 22);
      headGeo.scale(1.08, 1, 0.98);
      const head = new THREE.Mesh(headGeo, matBody);
      headGroup.add(head);

      // 주둥이 / 볼
      const snoutGeo = new THREE.SphereGeometry(0.24, 20, 16);
      snoutGeo.scale(1.25, 0.85, 0.9);
      const snout = new THREE.Mesh(snoutGeo, matSnout);
      snout.position.set(0, -0.12, 0.42);
      headGroup.add(snout);

      // 코
      const noseGeo = new THREE.SphereGeometry(0.08, 14, 12);
      noseGeo.scale(1.2, 0.8, 0.9);
      const nose = new THREE.Mesh(noseGeo, matNose);
      nose.position.set(0, -0.05, 0.6);
      headGroup.add(nose);

      // 눈 (좌/우 & 반짝이는 하이라이트)
      const makeEye = (x) => {
        const eyeGroup = new THREE.Group();
        eyeGroup.position.set(x, 0.05, 0.48);
        const eyeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 14), matEye);
        eyeMesh.scale.set(0.9, 1.1, 0.5);
        eyeGroup.add(eyeMesh);

        // 반짝이 하이라이트
        const hl = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), matEyeHighlight);
        hl.position.set(0.02, 0.025, 0.04);
        eyeGroup.add(hl);
        return eyeGroup;
      };
      headGroup.add(makeEye(-0.21));
      headGroup.add(makeEye(0.21));

      // 발그레한 볼터치
      const makeCheek = (x) => {
        const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), matCheek);
        cheek.scale.set(1.3, 0.7, 0.3);
        cheek.position.set(x, -0.1, 0.46);
        return cheek;
      };
      headGroup.add(makeCheek(-0.32));
      headGroup.add(makeCheek(0.32));

      // 동물별 특화 귀 및 소품 구조
      const earGroupLeft = new THREE.Group();
      const earGroupRight = new THREE.Group();

      if (id === 'kongi') {
        // 🐶 콩이: 사랑스럽게 처진 강아지 귀
        const earGeo = new THREE.SphereGeometry(0.22, 16, 14);
        earGeo.scale(0.8, 1.7, 0.6);
        
        const earL = new THREE.Mesh(earGeo, matEar);
        earL.position.set(0, -0.2, 0);
        earGroupLeft.position.set(-0.48, 0.35, 0);
        earGroupLeft.rotation.z = 0.35;
        earGroupLeft.add(earL);

        const earR = new THREE.Mesh(earGeo, matEar);
        earR.position.set(0, -0.2, 0);
        earGroupRight.position.set(0.48, 0.35, 0);
        earGroupRight.rotation.z = -0.35;
        earGroupRight.add(earR);
      } else if (id === 'tori') {
        // 🐰 토리: 쫑긋하고 기다란 토끼 귀
        const earGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.75, 18);
        earGeo.scale(0.85, 1, 0.4);
        
        const matInner = new THREE.MeshStandardMaterial({ color: theme.earInnerColor, roughness: 0.4 });
        const innerGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.6, 14);
        innerGeo.scale(0.7, 1, 0.2);

        const earL = new THREE.Mesh(earGeo, matEar);
        const inL = new THREE.Mesh(innerGeo, matInner);
        inL.position.set(0, 0, 0.03);
        earGroupLeft.position.set(-0.24, 0.5, 0);
        earGroupLeft.rotation.z = 0.18;
        earGroupLeft.add(earL);
        earGroupLeft.add(inL);

        const earR = new THREE.Mesh(earGeo, matEar);
        const inR = new THREE.Mesh(innerGeo, matInner);
        inR.position.set(0, 0, 0.03);
        earGroupRight.position.set(0.24, 0.5, 0);
        earGroupRight.rotation.z = -0.18;
        earGroupRight.add(earR);
        earGroupRight.add(inR);
      } else if (id === 'nabi') {
        // 🐱 나비: 뾰족한 삼색 고양이 귀 & 수염
        const earGeo = new THREE.ConeGeometry(0.2, 0.34, 16);
        earGeo.scale(1, 1, 0.6);
        
        earGroupLeft.position.set(-0.35, 0.45, 0);
        earGroupLeft.rotation.z = 0.38;
        earGroupLeft.add(new THREE.Mesh(earGeo, matEar));

        earGroupRight.position.set(0.35, 0.45, 0);
        earGroupRight.rotation.z = -0.38;
        earGroupRight.add(new THREE.Mesh(earGeo, matEar));

        // 고양이 꼬리
        const tailGroup = new THREE.Group();
        const tailGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.6, 14);
        const tailMesh = new THREE.Mesh(tailGeo, matEar);
        tailMesh.position.set(0, 0.25, 0);
        tailGroup.position.set(0, -0.4, -0.45);
        tailGroup.rotation.x = -0.8;
        tailGroup.add(tailMesh);
        this.parts.tail = tailGroup;
        bodyGroup.add(tailGroup);
      } else {
        // 🐻 곰이/보리: 둥글둥글한 곰 귀
        const earGeo = new THREE.SphereGeometry(0.18, 16, 14);
        earGeo.scale(1, 1, 0.55);

        earGroupLeft.position.set(-0.42, 0.42, 0);
        earGroupLeft.rotation.z = 0.4;
        earGroupLeft.add(new THREE.Mesh(earGeo, matEar));

        earGroupRight.position.set(0.42, 0.42, 0);
        earGroupRight.rotation.z = -0.4;
        earGroupRight.add(new THREE.Mesh(earGeo, matEar));
      }

      headGroup.add(earGroupLeft);
      headGroup.add(earGroupRight);
      this.parts.earL = earGroupLeft;
      this.parts.earR = earGroupRight;
      this.parts.head = headGroup;
      this.characterGroup.add(headGroup);

      // 3. 팔 (오른손은 활기찬 인사 담당, 왼손은 편안한 자세)
      const armGeo = new THREE.SphereGeometry(0.16, 16, 14);
      armGeo.scale(0.85, 1.8, 0.85);

      // 오른팔 (손인사 파트)
      const rightArmGroup = new THREE.Group();
      rightArmGroup.position.set(0.55, 0.15, 0);
      const armRMesh = new THREE.Mesh(armGeo, matHoodie);
      armRMesh.position.set(0, -0.22, 0);
      const pawR = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), matBody);
      pawR.position.set(0, -0.42, 0);
      rightArmGroup.add(armRMesh);
      rightArmGroup.add(pawR);
      this.parts.armR = rightArmGroup;
      bodyGroup.add(rightArmGroup);

      // 왼팔
      const leftArmGroup = new THREE.Group();
      leftArmGroup.position.set(-0.55, 0.15, 0);
      const armLMesh = new THREE.Mesh(armGeo, matHoodie);
      armLMesh.position.set(0, -0.22, 0);
      const pawL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), matBody);
      pawL.position.set(0, -0.42, 0);
      leftArmGroup.add(armLMesh);
      leftArmGroup.add(pawL);
      leftArmGroup.rotation.z = 0.25;
      this.parts.armL = leftArmGroup;
      bodyGroup.add(leftArmGroup);

      // 4. 다리 & 신발
      const makeLeg = (x) => {
        const legGroup = new THREE.Group();
        legGroup.position.set(x, -0.58, 0);
        const legGeo = new THREE.CylinderGeometry(0.12, 0.13, 0.32, 14);
        const legMesh = new THREE.Mesh(legGeo, matHoodie);
        legGroup.add(legMesh);

        const shoeGeo = new THREE.SphereGeometry(0.16, 14, 12);
        shoeGeo.scale(1, 0.7, 1.4);
        const shoe = new THREE.Mesh(shoeGeo, matShoe);
        shoe.position.set(0, -0.16, 0.08);
        legGroup.add(shoe);
        return legGroup;
      };
      const legL = makeLeg(-0.25);
      const legR = makeLeg(0.25);
      this.parts.legL = legL;
      this.parts.legR = legR;
      bodyGroup.add(legL);
      bodyGroup.add(legR);

      this.scene.add(this.characterGroup);
      if (this.canvas) {
        this.canvas.setAttribute('aria-label', `3D 움직이는 AI 친구 ${theme.name}`);
      }
    }

    // 캐릭터 변경
    setCharacter(id) {
      if (!THEMES[id]) return;
      this.buildCharacter(id);
      this.triggerGreeting();
    }

    // 인사 애니메이션 시작 (2.8초간 통통 튀며 손인사)
    triggerGreeting() {
      this.animState = 'greeting';
      this.animStartTime = this.clock ? this.clock.getElapsedTime() : 0;
      if (window.VoiceManager && typeof window.VoiceManager.playChime === 'function') {
        window.VoiceManager.playChime('click');
      }
    }

    // 메인 애니메이션 루프
    animate() {
      this.reqId = requestAnimationFrame(this.animate);
      if (!this.renderer || !this.scene || !this.camera || !this.isVisible) return;

      const elapsed = this.clock.getElapsedTime();
      const timeSinceGreeting = elapsed - this.animStartTime;

      if (this.animState === 'greeting' && timeSinceGreeting > this.greetingDuration) {
        this.animState = 'idle';
      }

      const { body, head, armR, armL, earL, earR, tail } = this.parts;

      if (this.animState === 'greeting') {
        // [인사 모션] 활기찬 점프 + 큰 손인사 + 머리 갸우뚱
        const bounce = Math.sin(timeSinceGreeting * 8) * 0.18;
        const wave = Math.sin(timeSinceGreeting * 12) * 0.65;
        const headTilt = Math.sin(timeSinceGreeting * 6) * 0.14;

        if (this.characterGroup) {
          this.characterGroup.position.y = Math.max(0, bounce);
          this.characterGroup.rotation.y = Math.sin(timeSinceGreeting * 3) * 0.1;
        }
        if (head) {
          head.rotation.z = headTilt;
          head.rotation.x = Math.sin(timeSinceGreeting * 8) * 0.05;
        }
        if (armR) {
          armR.rotation.z = -1.7 + wave * 0.5;
          armR.rotation.x = Math.sin(timeSinceGreeting * 10) * 0.35;
        }
        if (armL) {
          armL.rotation.z = 0.3 + Math.sin(timeSinceGreeting * 8) * 0.1;
        }
        if (earL && earR) {
          earL.rotation.z = 0.35 + Math.sin(timeSinceGreeting * 8) * 0.12;
          earR.rotation.z = -0.35 - Math.sin(timeSinceGreeting * 8) * 0.12;
        }
        if (tail) {
          tail.rotation.y = Math.sin(timeSinceGreeting * 14) * 0.45;
        }
      } else {
        // [아이들 모션] 시니어가 편안하게 느끼는 부드러운 숨쉬기
        const breathe = Math.sin(elapsed * 1.8) * 0.025;
        const floatY = Math.sin(elapsed * 1.5) * 0.04;
        const subtleTilt = Math.sin(elapsed * 1.2) * 0.035;

        if (this.characterGroup) {
          this.characterGroup.position.y = floatY;
          this.characterGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.05;
        }
        if (body) {
          body.scale.set(1 + breathe * 0.5, 1 + breathe, 1 + breathe * 0.5);
        }
        if (head) {
          head.rotation.z = subtleTilt;
          head.rotation.x = Math.sin(elapsed * 1.8) * 0.02;
        }
        if (armR) {
          armR.rotation.z = -0.28 + Math.sin(elapsed * 1.8) * 0.05;
          armR.rotation.x = 0;
        }
        if (armL) {
          armL.rotation.z = 0.28 - Math.sin(elapsed * 1.8) * 0.05;
        }
        if (earL && earR) {
          earL.rotation.z = 0.35 + Math.sin(elapsed * 1.5) * 0.03;
          earR.rotation.z = -0.35 - Math.sin(elapsed * 1.5) * 0.03;
        }
        if (tail) {
          tail.rotation.y = Math.sin(elapsed * 2.2) * 0.18;
        }
      }

      this.renderer.render(this.scene, this.camera);
    }

    startLoop() {
      if (!this.reqId) {
        this.animate();
      }
    }

    stopLoop() {
      if (this.reqId) {
        cancelAnimationFrame(this.reqId);
        this.reqId = null;
      }
    }

    bindEvents() {
      if (this.canvas) {
        this.canvas.addEventListener('click', this.onClick);
        this.canvas.addEventListener('touchstart', (e) => {
          this.onClick(e);
        }, { passive: true });
      }
      window.addEventListener('resize', this.onResize);

      // 화면에서 벗어났을 때 CPU/배터리 절약을 위한 IntersectionObserver
      if ('IntersectionObserver' in window && this.container) {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            this.isVisible = entry.isIntersecting;
          });
        }, { threshold: 0.1 });
        this.observer.observe(this.container);
      }
    }

    onClick(e) {
      if (e) e.preventDefault();
      this.triggerGreeting();
    }

    onResize() {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth || 320;
      const height = this.container.clientHeight || 320;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }

    showFallback() {
      if (this.fallbackImg) {
        this.fallbackImg.style.display = 'block';
      }
      if (this.container) {
        this.container.style.display = 'none';
      }
    }

    hideFallback() {
      if (this.fallbackImg) {
        this.fallbackImg.style.display = 'none';
      }
      if (this.container) {
        this.container.style.display = 'block';
      }
    }

    destroy() {
      this.stopLoop();
      window.removeEventListener('resize', this.onResize);
      if (this.observer) this.observer.disconnect();
      if (this.renderer) {
        this.renderer.dispose();
      }
    }
  }

  // 글로벌 싱글톤 인스턴스 등록
  window.Character3DRenderer = new Character3DRenderer();
})();
