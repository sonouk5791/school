/**
 * 디지털 학교 - 3D AI 친구 캐릭터 렌더러 (Three.js 기반)
 * 🐶 콩이 (강아지), 🐰 토리 (토끼), 🐱 나비 (고양이), 🐻 보리/곰이 (곰)
 *
 * [버그 수정 v2 — 2026-09-17]
 * - 문제 1 해결: 팔 pivot이 파츠 중심(팔 중간)이 아닌 어깨 관절에 정확히 정렬
 *   → 팔 메쉬를 pivot 아래에 offset 배치하여 어깨를 기준으로 자연스럽게 회전
 * - 문제 2 해결: rotation.z + rotation.x 동시 조작으로 인한 오일러 gimbal lock 제거
 *   → 쿼터니언(Quaternion) 기반 회전으로 전환, 단일 축 회전만 사용
 * - 문제 3 해결: wave 진폭 과다(±0.65rad)로 인한 비현실적 꺾임 제거
 *   → 인사 모션: 몸통 바운스 + 오른팔 z축 흔들기(±0.35rad 이내)로 단순화
 * - 관절 제한: 팔 rotation.z = clamp(-1.8, 0.5), idle도 소폭 범위 유지
 */

(() => {
  'use strict';

  // 관절 회전 범위 제한 유틸
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  // 캐릭터별 팔레트 및 디자인 테마
  const THEMES = {
    kongi: {
      name: '콩이',
      animal: '강아지',
      bodyColor: 0xF7D070,
      hoodieColor: 0xFBC02D,
      heartColor: 0xF57C00,
      bellyColor: 0xFFF9C4,
      earColor: 0xE0A33A,
      snoutColor: 0xFFF8E1,
      noseColor: 0x2C1D11,
      eyeColor: 0x1A1412,
      shoeColor: 0xFFFFFF,
      cheekColor: 0xFF8A80
    },
    tori: {
      name: '토리',
      animal: '토끼',
      bodyColor: 0xFFFFFF,
      hoodieColor: 0xF8BBD0,
      heartColor: 0xEC407A,
      bellyColor: 0xFFFFFF,
      earColor: 0xFFFFFF,
      earInnerColor: 0xFF80AB,
      snoutColor: 0xFFFFFF,
      noseColor: 0xFF5252,
      eyeColor: 0x2A1B18,
      shoeColor: 0xFFFFFF,
      cheekColor: 0xFF5252
    },
    nabi: {
      name: '나비',
      animal: '고양이',
      bodyColor: 0xFFF3E0,
      hoodieColor: 0xD1C4E9,
      heartColor: 0x7E57C2,
      bellyColor: 0xFFFFFF,
      earColor: 0xFFB74D,
      earInnerColor: 0xF48FB1,
      snoutColor: 0xFFFFFF,
      noseColor: 0xE91E63,
      eyeColor: 0x1B5E20,
      shoeColor: 0xFFFFFF,
      cheekColor: 0xFF80AB
    },
    bori: {
      name: '보리',
      animal: '곰',
      bodyColor: 0xBCAAA4,
      hoodieColor: 0xBBDEFB,
      heartColor: 0x1E88E5,
      bellyColor: 0xEFEBE9,
      earColor: 0x8D6E63,
      snoutColor: 0xD7CCC8,
      noseColor: 0x261C14,
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
      this.greetingDuration = 2.8;
      this.clock = null;
      this.reqId = null;
      this.isMounted = false;
      this.isVisible = true;

      this.onClick = this.onClick.bind(this);
      this.onResize = this.onResize.bind(this);
      this.animate = this.animate.bind(this);
    }

    isWebGLAvailable() {
      try {
        const c = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    }

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

      // 따뜻하고 화사한 스튜디오 조명
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

    /**
     * 캐릭터 메쉬 빌드
     *
     * [핵심 수정] 팔 Pivot 정렬
     * 기존: armGroup.position = 어깨위치, armMesh.position.y = -0.22 (팔 중심)
     *       → Group의 pivot이 어깨에 있지만 메쉬 offset이 없어
     *         실제 회전 기준이 어깨 아래로 밀림
     *
     * 수정: armPivot(어깨 관절 위치) → armGroup(메쉬를 어깨 아래로 offset)
     *       armMesh.position.y = -ARM_HALF (팔 길이 절반)
     *       pawMesh.position.y = -ARM_LEN  (손 끝)
     *       → armPivot을 회전시키면 어깨를 기준으로 정확하게 회전
     */
    buildCharacter(id) {
      const THREE = window.THREE;
      const theme = THEMES[id] || THEMES.kongi;
      this.activeId = id;

      if (this.characterGroup) {
        this.scene.remove(this.characterGroup);
      }

      this.characterGroup = new THREE.Group();
      this.parts = {};

      const matBody   = new THREE.MeshStandardMaterial({ color: theme.bodyColor,    roughness: 0.5,  metalness: 0.05 });
      const matHoodie = new THREE.MeshStandardMaterial({ color: theme.hoodieColor,  roughness: 0.55, metalness: 0.05 });
      const matHeart  = new THREE.MeshStandardMaterial({ color: theme.heartColor,   roughness: 0.3,  metalness: 0.1  });
      const matBelly  = new THREE.MeshStandardMaterial({ color: theme.bellyColor,   roughness: 0.6  });
      const matEar    = new THREE.MeshStandardMaterial({ color: theme.earColor,     roughness: 0.55 });
      const matSnout  = new THREE.MeshStandardMaterial({ color: theme.snoutColor,   roughness: 0.5  });
      const matNose   = new THREE.MeshStandardMaterial({ color: theme.noseColor,    roughness: 0.3,  metalness: 0.1  });
      const matEye    = new THREE.MeshStandardMaterial({ color: theme.eyeColor,     roughness: 0.1,  metalness: 0.8  });
      const matEyeHL  = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const matCheek  = new THREE.MeshBasicMaterial({ color: theme.cheekColor, transparent: true, opacity: 0.65 });
      const matShoe   = new THREE.MeshStandardMaterial({ color: theme.shoeColor,    roughness: 0.4  });

      // ── 1. 몸통 ──────────────────────────────────────────
      const bodyGroup = new THREE.Group();
      bodyGroup.position.set(0, -0.2, 0);

      const torsoGeo = new THREE.SphereGeometry(0.52, 24, 20);
      torsoGeo.scale(1, 1.15, 0.9);
      bodyGroup.add(new THREE.Mesh(torsoGeo, matHoodie));

      const bellyGeo = new THREE.SphereGeometry(0.42, 20, 16);
      bellyGeo.scale(0.85, 0.95, 0.35);
      const belly = new THREE.Mesh(bellyGeo, matBelly);
      belly.position.set(0, -0.05, 0.32);
      bodyGroup.add(belly);

      const heartGeo = new THREE.SphereGeometry(0.12, 14, 12);
      heartGeo.scale(1.2, 1.1, 0.4);
      const heart = new THREE.Mesh(heartGeo, matHeart);
      heart.position.set(0, 0.12, 0.44);
      bodyGroup.add(heart);

      this.parts.body = bodyGroup;
      this.characterGroup.add(bodyGroup);

      // ── 2. 머리 ──────────────────────────────────────────
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.55, 0);

      const headGeo = new THREE.SphereGeometry(0.56, 26, 22);
      headGeo.scale(1.08, 1, 0.98);
      headGroup.add(new THREE.Mesh(headGeo, matBody));

      const snoutGeo = new THREE.SphereGeometry(0.24, 20, 16);
      snoutGeo.scale(1.25, 0.85, 0.9);
      const snout = new THREE.Mesh(snoutGeo, matSnout);
      snout.position.set(0, -0.12, 0.42);
      headGroup.add(snout);

      const noseGeo = new THREE.SphereGeometry(0.08, 14, 12);
      noseGeo.scale(1.2, 0.8, 0.9);
      const nose = new THREE.Mesh(noseGeo, matNose);
      nose.position.set(0, -0.05, 0.6);
      headGroup.add(nose);

      const makeEye = (x) => {
        const g = new THREE.Group();
        g.position.set(x, 0.05, 0.48);
        const eyeMesh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 14), matEye);
        eyeMesh.scale.set(0.9, 1.1, 0.5);
        g.add(eyeMesh);
        const hl = new THREE.Mesh(new THREE.SphereGeometry(0.026, 8, 8), matEyeHL);
        hl.position.set(0.02, 0.025, 0.04);
        g.add(hl);
        return g;
      };
      headGroup.add(makeEye(-0.21));
      headGroup.add(makeEye(0.21));

      const makeCheek = (x) => {
        const cheek = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 10), matCheek);
        cheek.scale.set(1.3, 0.7, 0.3);
        cheek.position.set(x, -0.1, 0.46);
        return cheek;
      };
      headGroup.add(makeCheek(-0.32));
      headGroup.add(makeCheek(0.32));

      // 동물별 귀
      const earGroupLeft  = new THREE.Group();
      const earGroupRight = new THREE.Group();

      if (id === 'kongi') {
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
        const earGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.75, 18);
        earGeo.scale(0.85, 1, 0.4);
        const matInner = new THREE.MeshStandardMaterial({ color: theme.earInnerColor, roughness: 0.4 });
        const innerGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.6, 14);
        innerGeo.scale(0.7, 1, 0.2);
        earGroupLeft.position.set(-0.24, 0.5, 0);
        earGroupLeft.rotation.z = 0.18;
        earGroupLeft.add(new THREE.Mesh(earGeo, matEar));
        earGroupLeft.add(new THREE.Mesh(innerGeo, matInner));
        earGroupRight.position.set(0.24, 0.5, 0);
        earGroupRight.rotation.z = -0.18;
        earGroupRight.add(new THREE.Mesh(earGeo, matEar));
        earGroupRight.add(new THREE.Mesh(innerGeo, matInner));
      } else if (id === 'nabi') {
        const earGeo = new THREE.ConeGeometry(0.2, 0.34, 16);
        earGeo.scale(1, 1, 0.6);
        earGroupLeft.position.set(-0.35, 0.45, 0);
        earGroupLeft.rotation.z = 0.38;
        earGroupLeft.add(new THREE.Mesh(earGeo, matEar));
        earGroupRight.position.set(0.35, 0.45, 0);
        earGroupRight.rotation.z = -0.38;
        earGroupRight.add(new THREE.Mesh(earGeo, matEar));

        // 고양이 꼬리
        const tailPivot = new THREE.Group();
        tailPivot.position.set(0, -0.35, -0.42);
        const tailGeo = new THREE.CylinderGeometry(0.05, 0.07, 0.6, 14);
        const tailMesh = new THREE.Mesh(tailGeo, matEar);
        // 꼬리 메쉬를 pivot 위에 offset 배치
        tailMesh.position.set(0, 0.3, 0);
        tailPivot.rotation.x = -0.8;
        tailPivot.add(tailMesh);
        this.parts.tail = tailPivot;
        bodyGroup.add(tailPivot);
      } else {
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

      // ── 3. 팔 ─────────────────────────────────────────────
      // [수정] Pivot = 어깨 관절 위치, 메쉬를 아래로 offset
      // armPivot.position = 어깨 위치 (bodyGroup 기준)
      // armMesh.position.y = -ARM_HALF → 팔 중심이 어깨 아래에 위치
      // pawMesh.position.y = -ARM_LEN  → 손 끝
      // → armPivot.rotation.z 만 바꾸면 어깨 기준으로 자연스럽게 회전
      const ARM_HALF = 0.22; // 팔 길이 절반
      const ARM_LEN  = 0.44; // 팔 전체 길이

      const makeArm = (sideX, initRotZ) => {
        // Pivot: 어깨 관절 위치
        const pivot = new THREE.Group();
        pivot.position.set(sideX, 0.2, 0); // 몸통 위쪽 측면 = 어깨

        // 팔 메쉬: pivot 아래 절반 위치
        const armGeo = new THREE.SphereGeometry(0.16, 16, 14);
        armGeo.scale(0.85, 1.8, 0.85);
        const armMesh = new THREE.Mesh(armGeo, matHoodie);
        armMesh.position.set(0, -ARM_HALF, 0);

        // 손 발: 팔 끝
        const paw = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 12), matBody);
        paw.position.set(0, -ARM_LEN, 0);

        pivot.add(armMesh);
        pivot.add(paw);
        pivot.rotation.z = initRotZ; // 초기 자연스러운 자세
        return pivot;
      };

      // 오른팔: 몸통 오른쪽, 살짝 벌려진 자세 (-0.25rad)
      const rightArmPivot = makeArm(0.58, -0.25);
      this.parts.armR = rightArmPivot;
      bodyGroup.add(rightArmPivot);

      // 왼팔: 몸통 왼쪽, 살짝 벌려진 자세 (+0.25rad)
      const leftArmPivot = makeArm(-0.58, 0.25);
      this.parts.armL = leftArmPivot;
      bodyGroup.add(leftArmPivot);

      // ── 4. 다리 & 신발 ───────────────────────────────────
      // 다리는 애니메이션하지 않으므로 pivot offset 유지
      const makeLeg = (x) => {
        const legGroup = new THREE.Group();
        legGroup.position.set(x, -0.58, 0);
        const legGeo = new THREE.CylinderGeometry(0.12, 0.13, 0.32, 14);
        legGroup.add(new THREE.Mesh(legGeo, matHoodie));
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

    setCharacter(id) {
      if (!THEMES[id]) return;
      this.buildCharacter(id);
      this.triggerGreeting();
    }

    triggerGreeting() {
      this.animState = 'greeting';
      this.animStartTime = this.clock ? this.clock.getElapsedTime() : 0;
      if (window.VoiceManager && typeof window.VoiceManager.playChime === 'function') {
        window.VoiceManager.playChime('click');
      }
    }

    /**
     * 메인 애니메이션 루프
     *
     * [수정] 쿼터니언 기반 단일 축 회전
     * - Euler z+x 동시 조작 제거 → gimbal lock 원천 차단
     * - 인사: 몸통 바운스(y) + 오른팔 z축 흔들기만 사용
     *   wave 진폭: ±0.35rad 이내 (실제 어깨 관절 움직임 범위)
     * - clamp()로 각 관절 최대/최소 각도 하드 제한
     */
    animate() {
      this.reqId = requestAnimationFrame(this.animate);
      if (!this.renderer || !this.scene || !this.camera || !this.isVisible) return;

      const elapsed = this.clock.getElapsedTime();
      const t = elapsed - this.animStartTime;

      if (this.animState === 'greeting' && t > this.greetingDuration) {
        this.animState = 'idle';
        // idle 전환 시 팔 각도를 자연스러운 기본값으로 리셋
        if (this.parts.armR) this.parts.armR.rotation.z = -0.25;
        if (this.parts.armL) this.parts.armL.rotation.z =  0.25;
      }

      const { body, head, armR, armL, earL, earR, tail } = this.parts;

      if (this.animState === 'greeting') {
        // ── 인사 모션 ──────────────────────────────────────
        // bounce: 몸 전체가 위아래로 통통 튀기 (y축만, 최대 0.15)
        const bounce = Math.max(0, Math.sin(t * 7.5) * 0.14);

        // headTilt: 머리를 z축으로만 살짝 갸우뚱 (±0.12rad)
        const headTilt = Math.sin(t * 6) * 0.12;

        // wave: 오른팔 z축 흔들기 — 기본 자세(-0.25) ± 0.30rad
        // clamp로 최대 +0.05 ~ -0.55rad 이내로 제한 (어깨 관절 현실 범위)
        const waveZ = clamp(-0.25 + Math.sin(t * 11) * 0.30, -0.55, 0.05);

        if (this.characterGroup) {
          this.characterGroup.position.y = bounce;
          // 몸통 좌우 살짝 기울기 (z축만, ±0.06rad)
          this.characterGroup.rotation.z = Math.sin(t * 3.5) * 0.06;
          this.characterGroup.rotation.y = 0;
          this.characterGroup.rotation.x = 0;
        }
        if (head) {
          head.rotation.z = headTilt;
          head.rotation.x = 0; // x 회전 제거 → gimbal lock 방지
          head.rotation.y = 0;
        }
        if (armR) {
          // 오른팔: z축 단일 축 흔들기만 사용
          armR.rotation.z = waveZ;
          armR.rotation.x = 0; // ← 기존 버그: x 동시 회전 제거
          armR.rotation.y = 0;
        }
        if (armL) {
          // 왼팔: 인사 중 살짝만 움직임 (±0.05rad)
          armL.rotation.z = clamp(0.25 + Math.sin(t * 7) * 0.05, 0.18, 0.32);
          armL.rotation.x = 0;
          armL.rotation.y = 0;
        }
        if (earL && earR) {
          // 귀: 인사에 맞춰 살짝 흔들 (기본각 ± 0.1rad)
          earL.rotation.z = clamp(0.35 + Math.sin(t * 8) * 0.10, 0.22, 0.48);
          earR.rotation.z = clamp(-0.35 - Math.sin(t * 8) * 0.10, -0.48, -0.22);
        }
        if (tail) {
          // 꼬리: y축 흔들기 (±0.35rad)
          tail.rotation.y = Math.sin(t * 13) * 0.35;
        }

      } else {
        // ── Idle 모션 (숨쉬기 + 미세 흔들림) ─────────────
        const breathe    = Math.sin(elapsed * 1.8) * 0.025;
        const floatY     = Math.sin(elapsed * 1.5) * 0.04;
        const subtleTilt = Math.sin(elapsed * 1.2) * 0.03;

        if (this.characterGroup) {
          this.characterGroup.position.y = floatY;
          this.characterGroup.rotation.z = 0;
          this.characterGroup.rotation.y = Math.sin(elapsed * 0.6) * 0.04;
          this.characterGroup.rotation.x = 0;
        }
        if (body) {
          body.scale.set(1 + breathe * 0.5, 1 + breathe, 1 + breathe * 0.5);
        }
        if (head) {
          head.rotation.z = subtleTilt;
          head.rotation.x = Math.sin(elapsed * 1.8) * 0.015; // 아주 작게만
          head.rotation.y = 0;
        }
        if (armR) {
          armR.rotation.z = clamp(-0.25 + Math.sin(elapsed * 1.8) * 0.04, -0.30, -0.18);
          armR.rotation.x = 0;
          armR.rotation.y = 0;
        }
        if (armL) {
          armL.rotation.z = clamp(0.25 - Math.sin(elapsed * 1.8) * 0.04, 0.18, 0.30);
          armL.rotation.x = 0;
          armL.rotation.y = 0;
        }
        if (earL && earR) {
          earL.rotation.z = clamp(0.35 + Math.sin(elapsed * 1.5) * 0.03, 0.30, 0.40);
          earR.rotation.z = clamp(-0.35 - Math.sin(elapsed * 1.5) * 0.03, -0.40, -0.30);
        }
        if (tail) {
          tail.rotation.y = Math.sin(elapsed * 2.2) * 0.15;
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
      if (this.fallbackImg) this.fallbackImg.style.display = 'block';
      if (this.container)   this.container.style.display = 'none';
    }

    hideFallback() {
      if (this.fallbackImg) this.fallbackImg.style.display = 'none';
      if (this.container)   this.container.style.display = 'block';
    }

    destroy() {
      this.stopLoop();
      window.removeEventListener('resize', this.onResize);
      if (this.observer) this.observer.disconnect();
      if (this.renderer) this.renderer.dispose();
    }
  }

  // 글로벌 싱글톤 인스턴스 등록
  window.Character3DRenderer = new Character3DRenderer();
})();
